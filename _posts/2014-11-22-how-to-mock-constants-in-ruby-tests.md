---
layout: post
summary: Relatively painless way to mock constants in Ruby tests
---

Annoyingly large amount of time was spent by me trying to figure out a way to mock constants / classes in tests for our Rails project. The trick is not only in defining the correct constant in the correct namespace, but also in removing it afterwards so the rest of the tests in the suite still use the original one.

So here's trivial but nevertheless useful snippet to do just that.

{% highlight ruby %}
describe ModuleName::ClassName do
  unless ModuleName.const_defined?(:ClassToMock)
    before do
      ModuleName.send(:const_set, "ClassToMock", Struct.new(:foo, :bar))
    end

    after do
      ModuleName.send(:remove_const, "ClassToMock")
    end
  end
  ...
end
{% endhighlight %}

Here I used `MiniTest`, but the same could be done with `RSpec` or `Test::Unit`'s `setup` and `teardown` methods.

What exactly is it useful for? If the test runs in isolation it contains everything it needs because all dependencies for `ModuleName::ClassName` you don't care about are mocked. Very useful when developing a feature as you don't have to load any extra code and the test runs very fast.

As soon as you're done and the test becomes a part of the suite, `ClassToMock` should no longer be mocked as the whole app's code is loaded anyway when running all tests together. So when `ClassToMock` is defined `before` and `after` blocks are omitted. Nice and tidy.
