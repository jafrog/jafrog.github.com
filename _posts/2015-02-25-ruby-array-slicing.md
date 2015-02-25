---
layout: post
title: The edge cases of array slicing in Ruby
summary: How Array slice method works around the edges
---

Last Thursday at our monthly ScotRUG meetup we did [Ruby Koans](http://rubykoans.com). To my surprise it was very educational, probably because of Ruby being so <del>inconsistent and unpredictable</del> comprehensive and feature rich. [Ceri Shaw](https://twitter.com/CeriShaw) (who reads C code much better than I do) and I paired over some unexpected array slicing behaviour and found out how it's wired under the hood.

## Array slicing

We investigated the [slice](http://ruby-doc.org//core-2.2.0/Array.html#method-i-slice) method that takes two arguments: `start` and `length`.

{% highlight ruby %}
ar = [1,2,3]
ar[1,2]
# => [2,3]
{% endhighlight %}

Now let's take a look at edge cases. Namely at out of range slicing.

{% highlight ruby %}
ar = [1,2,3]

ar[2,100]
# => [3]

ar[3,1]
# => []

ar[4,1]
# => nil
{% endhighlight %}

Wait, what? The last index of `ar` is 2, so why `ar[3,1]` and `ar[4,1]` return different results if they both are out of range?

The logic behind this, as [James Bell](https://twitter.com/sarcainian) put it, is that slices start *between the elements*. For `ar[3,1]` slice starts right before the 3rd element (or after 2nd element) and takes 1 element. Because there are no elements after the index 2 it return an empty array. And `ar[4,1]` starts right after the 3rd element, which is out of range and therefore returns `nil`.

## Under the hood

Let's take a look on the implementation. Below is source code of the `slice` method.

{% highlight c %}
VALUE
rb_ary_aref(int argc, const VALUE *argv, VALUE ary)
{
    VALUE arc;
    long beg, len;

    if (argc == 2) {
	beg = NUM2LONG(argv[0]);
	len = NUM2LONG(argv[1]);
	if (beg < 0) {
	    beg += RARRAY_LEN(ary);
	}
	return rb_ary_subseq(ary, beg, len);
    }
    ...
}
{% endhighlight %}

If 2 arguments (starting index and the length) were passed it calls `rb_ary_subseq`:

{% highlight c %}
VALUE
rb_ary_subseq(VALUE ary, long beg, long len)
{
    VALUE klass;
    long alen = RARRAY_LEN(ary);

    if (beg > alen) return Qnil;
    if (beg < 0 || len < 0) return Qnil;

    if (alen < len || alen < beg + len) {
	len = alen - beg;
    }
    klass = rb_obj_class(ary);
    if (len == 0) return ary_new(klass, 0);

    return ary_make_partial(ary, klass, beg, len);
}
{% endhighlight %}

Let's break down what is going on there:

- If starting index is larger than array length return `nil`. This is the condition that executes for `ar[4,1]` as the length of `ar = [1,2,3]` is `3` and `4 > 3`.

- If either starting index or length are less than 0 return `nil`. The caller function `rb_ary_aref` takes care of negative starting indexes transforming them to indexes "from the end" with `beg += RARRAY_LEN(ary);`

- If the length of requested slice is larger than the length of the array or if the last element of the requested slice falls out of range take only the elements from the starting index to the end of the array;

- Finally if the length of the requested slice is `0` return an empty array. And from the previous line it's clear that for `ar[3,1]` when `ar = [1,2,3]` `len` would be equal to `0`.

So here it is, the logic and the implementation of Ruby array slicing.
