---
layout: post
summary: Copy-paste code in Pry with just one weird trick!
---

The one thing that drives me crazy about Ruby shell is the pain of copy-pasting the code.

Let's say you run `pry` in iTerm2 and try to mess around some class code.

![Default Pry prompt]({{ site.url }}/assets/2013-10-11-copy-paste-in-pry/full_not_selected.png)

And suddenly you realize that you meant to return "foo" from `foo` method. Unfortunately, you can't just move the pointer after "bar", select three lines, copy and paste, as the prompt text will get into the selection too.

![Selecting in default Pry prompt]({{ site.url }}/assets/2013-10-11-copy-paste-in-pry/full_selected.png)

So here's a quick and dirty solution.

**Step 1.**

{% highlight ruby %}
[1] pry(main)> Pry::SIMPLE_PROMPT = [proc { "   " }, proc { "   " }]
{% endhighlight %}

**Step 2.**

{% highlight ruby %}
[1] pry(main)> simple-prompt
{% endhighlight %}

The result should look something like this:

![Final prompt]({{ site.url }}/assets/2013-10-11-copy-paste-in-pry/simple_with_changes.png)

And you're good to go!

![Final prompt selected]({{ site.url }}/assets/2013-10-11-copy-paste-in-pry/simple_with_changes_selected.png)

As a bonus, you can type `simple-prompt` again and return to the regular mode.
