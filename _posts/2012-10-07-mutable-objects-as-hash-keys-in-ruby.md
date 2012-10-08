---
layout: post
summary: Arrays, hashes and even strings - all these objects are mutable in Ruby. And this may lead to some interesting and unexpected behavior when we try to use them as hash keys.
---

*Mutable object* is an object that could be changed 'in place'. Immutable, on the other hand means that you need to create another object if you want to change the value. Like this:

{% highlight ruby %}
# Arrays are mutable
a = [1, 2]
a.object_id
# => 2235386320
a << 3
# => [1, 2, 3]
a.object_id
# => 2235386320

# Integers are immutable
i = 10
i.object_id
# => 21
i = i + 1 # creating a new object and assigning it to i
# => 11
i.object_id
# => 23
{% endhighlight %}

One of the interesting consequences of *mutability* is a mutable object's behavior when used as hash key.

{% highlight ruby %}
# It was peaceful sunny day, we were creating usual hashes, using arrays as keys...
h = {}
a = [1, 2]
h[a] = true
h
# => {[1, 2] => true}

# ... when suddenly...
a << [3]
# => [1, 2, 3]
h[a]
# => nil
h
# => {[1, 2, 3] => true}

# Wow! How did that happen? But wait, that's not all
h[[1,2,3]] = false
# => {[1, 2, 3] => true, [1, 2, 3] => false}
{% endhighlight %}

To understand what happened here we need to clarify how hashes store and retrieve objects. First let's disambiguate the word *hash*. In Ruby `Hash` is a class representing a data structure called *dictionary* or *hash map*. The word *hash* in *hash map* implies that when we add a key-value pair to a dictionary, key's [hash](http://en.wikipedia.org/wiki/Hash_function) is stored along with the original pair. And when we search for a given key later, it's found by first comparing key's hashes and then, if hash was found, by keys themselves.

So when we used object `a` as a key to the hash `h`, `a.hash` was called. `Object.hash` is a method returning a hash of a given object (Department of Redundancy Department called - they want their sentence back).

{% highlight ruby %}
a = [1, 2]
a.hash
# => 11
{% endhighlight %}

Then we *mutated* object `a` by adding a new element to it. Let's check what happened with `a`'s hash.

{% highlight ruby %}
a = [1, 2, 3]
a.hash
# => 25
{% endhighlight %}

Predictably the hash of `a` has changed. But the old hash of `a` is already saved in `h`! And when we do `h[a]` interpreter compares `a.hash` with what is stored in `h` and doesn't find a match. This is also the reason why the hash `h` can have two seemingly similar keys - `{[1, 2, 3] => true, [1, 2, 3] => false}`.

But if the hash in `h` is the hash of `[1, 2]` then it should be possible to retrieve a value under `a = [1, 2, 3]` by the key `[1, 2]`.

{% highlight ruby %}
h[[1, 2]]
# => nil
{% endhighlight %}

This expression returned `nil` because interpreter compares not only hashes but also keys. When we try to get a value using mutated object as a key, Ruby fails to find matching hash. When we use `[1, 2]` - it fails to find matching key.

So to get `true` from `h` we need an object with hash like of array's `[1, 2]` and has a value like array `[1, 2, 3]`. To get that object we can rewrite `hash` method.

{% highlight ruby %}
h
# => {[1, 2, 3] => true, [1, 2, 3] => false}
# Remember the second [1, 2, 3] key's hash equals to [1, 2, 3].hash.
a = [1, 2, 3]

a.instance_eval do
  def hash
    [1,2].hash
  end
end

h[a]
# => true
{% endhighlight %}

And that's why it's bad to use mutable objects as hash keys.
