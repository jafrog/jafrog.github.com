---
layout: post
summary: Interesting way to declare a class in Ruby
---

I've recently spotted a curious trend in blogposts about Ruby. It's the way people define classes in examples. It goes like this:

{% highlight ruby %}
class Foo < Struct(:bar)
  # some methods...
end
{% endhighlight %}

Why? Because it's shorter replacement for this:

{% highlight ruby %}
class Foo
  attr_accessor :bar
  
  def initialize(bar)
    @bar = bar
  end
end
{% endhighlight %}

The other way to save typing on attributes lookes like this:

{% highlight ruby %}
Foo = Struct(:bar) do
  # some methods...
end
{% endhighlight %}

It brought up an interesting discussion on twitter, when [@jeg2](http://twitter.com/jeg2) said he didn't like the practice. One important consequence of using it that was mentioned in this discussion is changing of ancestor chain.

When declaring class usual way:

{% highlight ruby %}
Foo.ancestors
=> [Foo, Object, Kernel, BasicObject]
{% endhighlight %}

When inheriting from ´Struct.new´:

{% highlight ruby %}
Foo.ancestors
=> [Foo, #<Class:0x00000001d41100>, Struct, Enumerable, Object, Kernel, BasicObject]
{% endhighlight %}

When creating a constant from ´Struct.new´:

{% highlight ruby %}
Foo.ancestors
=> [Foo, Struct, Enumerable, Object, Kernel, BasicObject]
{% endhighlight %}

Have you noticed ´Enumerable´ in two later cases? It means that suddenly instances of your class start to respond to ´each´ method and a bunch of other methods. So it's better be careful using ´Struct´ like this.