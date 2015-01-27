---
layout: post
title: The perils of Rails constant lookup
summary: The war story about how Rails failed to find one little class
---

**Update: As [@yves_senn](https://twitter.com/yves_senn) and [@fxn](https://twitter.com/fxn) pointed out there's a [Rails Guide](http://edgeguides.rubyonrails.org/autoloading_and_reloading_constants.html#autoloading-within-singleton-classes) now on the subject of autloading and constants reloading. Kudos to [@fxn](https://twitter.com/fxn)!**

It all started with one innocent refactoring. We had two classes defined in the same file. Say `Foo` and `Foo::Bar`. Naturally, as `Foo` lives in `app/models/foo.rb` the place for `Foo::Bar` is to be `app/models/foo/bar.rb`. As `app/models/` is listed among `autoload_paths` I thought nothing could go wrong. As soon as `Bar` is referenced from inside the `Foo` its path will be resolved and it would be loaded from `app/models/foo/bar.rb`.

The change was tested and successfully deployed to production. The hit came from an unexpected side - Rake task using this code failed with `Uninitialized constant Bar`.

## Rails eager loading

The first question was "Why does it work in the UI but fails in the Rake task?" After some investigation I found out two facts:

- Rails redefines `const_missing` (more on that later);
- Rails `const_missing` can't locate its own ass let alone my poor `Foo::Bar` class.

Given that, the fact that the app still worked when accessed from the web interface could mean only one thing - resolving `Foo::Bar` never had to hit `const_missing` in the first place. All thanks to **eager loading**.

Rails's eager loading feature allows files (and constants defined in them) to be loaded on startup instead of loading "on demand" when a constant is first referenced. This means that when in production environment `Foo::Bar` constant is first encountered it's already loaded and doesn't need to be found with `const_missing`.

But if production Rake tasks run in the same production environment where eager loading is enabled then why it doesn't work for them? For Rails 3.2 the reason could be found in [`finisher.rb` file](https://github.com/rails/rails/blob/3-2-stable/railties/lib/rails/application/finisher.rb#L50-L55):

{% highlight ruby %}
initializer :eager_load! do
  if config.cache_classes && !(defined?($rails_rake_task) && $rails_rake_task)
    ActiveSupport.run_load_hooks(:before_eager_load, self)
    eager_load!
  end
end
{% endhighlight %}

Note the condition. Checking for `config.cache_classes` is fair enough - it probably doesn't make much sense to load everything on startup if you're going to reload it on every change. But it also checks for the global variable `$rails_rake_task` which if defined indicates that the code is run inside the Rake task!

Interestingly there are no such conditions in [Rails 4.2](https://github.com/rails/rails/blob/4-2-stable/railties/lib/rails/application/finisher.rb#L53-L58). Instead you explicitly say whether or not to eager load classes with `config.eager_load` option:

{% highlight ruby %}
initializer :eager_load! do
  if config.eager_load
    ActiveSupport.run_load_hooks(:before_eager_load, self)
    config.eager_load_namespaces.each(&:eager_load!)
  end
end
{% endhighlight %}

The solution I came up with was to require `bar.rb` in `foo.rb` to make sure `Foo::Bar` is already loaded when it's needed. I tested it in the development environment where eager loading was disabled and it seemed to work. Except it didn't.

As soon as I changed anything at all in the app and reloaded the page I got same old `Undefined constant Bar` exception. After thinking about it for a while I realized that it happened because of the combination of two factors:

- When Rails reloads classes it removes all constants first;
- `require` in Ruby requires files only **once**. If the file was already loaded it will not be loaded again.

So when I changed code in the app Rails removed all constants, but `require` on top of the `foo.rb` didn't do anything because files had already been loaded. One way to solve this is to use `load` in place of `require` which will load a file every time the code is run. But I decided to get to the core of the `const_missing` issue instead. Why can't it find `Bar` constant when it's referenced from inside the scope it was defined in?

## Rails `const_missing`

First, read [this brilliant piece](http://urbanautomaton.com/blog/2013/08/27/rails-autoloading-hell/) on Ruby and Rails constant lookup and autoloading. It explains everything you should know about Rails autoload process.

Now let's dig into `const_missing` as it's defined in [`ActiveSupport::Dependencies` module](https://github.com/rails/rails/blob/3-2-stable/activesupport/lib/active_support/dependencies.rb):

{% highlight ruby %}
def const_missing(const_name, nesting = nil)
  klass_name = name.presence || "Object"

  unless nesting
    # We'll assume that the nesting of Foo::Bar is ["Foo::Bar", "Foo"]
    # even though it might not be, such as in the case of
    # class Foo::Bar; Baz; end
    nesting = []
    klass_name.to_s.scan(/::|$/) { nesting.unshift $` }
  end

  # If there are multiple levels of nesting to search under, the top
  # level is the one we want to report as the lookup fail.
  error = nil

  nesting.each do |namespace|
    begin
      return Dependencies.load_missing_constant Inflector.constantize(namespace), const_name
    rescue NoMethodError then raise
    rescue NameError => e
      error ||= e
    end
  end

  # Raise the first error for this set. If this const_missing came from an
  # earlier const_missing, this will result in the real error bubbling
  # all the way up
  raise error
end
{% endhighlight %}

The method implementation is quite a bit different in Rails 4, but the process is essentially the same:

1. Get parent scope name.
2. Get nesting from the `nesting` parameter. I'm not sure how exactly this parameter is passed, if ever. So it's safe to assume that `nesting` is `nil`. Note that `nesting` is also a special method in pry which makes it a little tricky to inspect.
3. If `nesting` is `nil` try to derive nesting from the parent scope name - `klass_name`.
4. Construct constant "full name" from the `const_name` and nesting.
5. Try to find missing constant based on the constructed name.

Now here's the rough example of how the troublesome code looks:

{% highlight ruby %}
# app/models/foo.rb

module Foo
  class << self
    def foo
        Bar.new.bar
      end
    end
  end
end

# app/models/foo/bar.rb

module Foo
  class Bar
    def bar
      "bar"
    end
  end
end
{% endhighlight %}

What puzzled me is that `Bar` is referenced from inside the scope where it's defined, why `const_missing` can't detect that? And then it hit me. Look closer at `const_missing` first line: `klass_name = name.presence || "Object"`. What is `name`?

Turns out `name` is a built in Ruby method that

    Returns the name of the module... Returns nil for anonymous modules.

And if we inspect `self` at the point where `name` is called it will show us `#<Class:Foo::Bar>` which is a class object because `Baz` is referenced from inside `class << self` scope! And as class object is an anonymous module its name is `nil` and `const_missing` is trying to find top-level `Baz` constant instead of `Foo::Bar`. If instead of `class << self` the method was defined as `self.baz` the problem wouldn't occur.

## Conclusion

I don't know if there's a catchall solution to this kind of problems. Explicitly loading all dependencies seems to be to tedious for large Rails projects. Referencing constants by the full name all the time breaks encapsulation. IMO The best way to avoid constant lookup issues in all your environments is to

- understand how constant lookup works and what code at each point of your program;
- keep an eye on scopes where constant is referenced.

I hope this will save you some hair I had to pull off while trying to debug this issue.


**TL;DR: Look out for classes referenced from inside `class << self`.**
