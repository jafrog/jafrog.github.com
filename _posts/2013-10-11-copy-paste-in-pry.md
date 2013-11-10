---
layout: post
summary: Copy-paste code in Pry with just one weird trick!
---

The one thing that drives me crazy about Ruby shell is the pain of copy-pasting the code.

Let's say you run `pry` in iTerm2 and try to mess around some class code.

{% highlight ruby %}
[1] pry(main)> class Foo
[1] pry(main)>   def foo
[1] pry(main)>     p bar
[1] pry(main)>   end
[1] pry(main)> end
=> nil
{% endhighlight %}

And suddenly you realize that you meant to return "foo" from `foo` method. Unfortunately, you can't just move the pointer after "bar", select three lines, copy and paste, as the prompt text will get into the selection too.

So here's a quick and dirty solution.

{% highlight ruby %}
[1] pry(main)> Pry::SIMPLE_PROMPT = [proc { "   " }, proc { "   " }]
[1] pry(main)> simple-prompt
{% endhighlight %}

Then you should have a REPL with no prompt at all. Just a lonely coursor floating in a dark space of your terminal.

{% highlight ruby %}
    class Foo
      def foo
        "bar"
      end
    end
 => nil
{% endhighlight %}

But as creepy as it feels, at least you now can select-copy-paste as much as you want!

As a bonus, you can type `simple-prompt` again and return to the regular mode.
