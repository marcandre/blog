---
layout: post
alias: 2009/05/lost-in-recursion.html
---

Last time I asked a simple (but quite hard) Ruby quiz:

``` ruby
# Without writing any method/block/lambda,
# can you find ways to obtain, in Ruby 1.8.7 or 1.9:
x == y   # ==> true
y == x   # ==> false
```

Before giving the answer, let me give you a bit of background...

In a blog post, <a href="http://ujihisa.blogspot.com/">Ujihisa</a> was discussing how to compare arrays in Ruby and I was curious about the implementation which deals with recursion.

So what's recursion you may ask? Just check:

``` ruby
x = []
x << x
# => [[...]]
```

`x` is an array containing a single element: `x` itself. At this point, the choice is yours. You can ask "why should I care?". I have no good answer and you might as well stop reading now. Or you can say "cool" and read on.

So recursion happens whenever part of an object refers to the object itself. If you're not careful about it,you can get infinite loops, for instance. For example, if you attempt to compare arrays naively by comparing their elements, you'll get into trouble:

``` ruby
x = [];  x << x
# => [[...]]
xx = []; xx << xx
# => [[...]]
x == xx
# => ???
```

Can you guess the answer?

Older ruby 1.8.6 raise a StackOverflowError because it uses the naive algorithm of comparing the elements (`x` and `xx`) over and over.

Current ruby 1.8.7 and 1.9 detect the recursion and say "woah, I don't want to deal with that, let's just say they're different", so it returns `false`.

How is that implemented exactly? Well, any call that can be recursive (like `x.==(xx)` in this case) goes through `rb_exec_recursive` which keeps track of the receiver (`x`) on which the method (`:==`) is called. Recursion is detected when an attempt to call the same method is made on the same object. The method `:==` returns `false` for recursive cases.

Note that `x == x` will return still `true`, because before the call to rb_exec_recursive, `:==` will check if the two objects being compared are the same.

What struck me immediately was the lack of symmetry. It didn't smell good and it didn't take long to find a problem.

Comparing `x` and `y = [x]` works fine, actually. `x` and `y` are not the same object, so `:==` calls `rb_exec_recursive`, which stores `x` in its 'deja-vu' list. The elements of `x` and `y` are examined, and since their are both the same object, `true` is returned. `y == x` also returns `true`. So far so good.

Now `x` and `z = [y]` are another matter. Again, `x` and `y` are not the same object, so rb_exec_recursive gets called. It pushes `x` on the 'deja-vu' list, and compares its elements (x and y). Comparison of `x` and `y` triggers is considered as recursion, because `x` is already on the list. So `x == z` returns `false`.

But what about `z == x`? `z` and `x` are not the same object, so `z` is put on the recursion-list and elements are compared. `y` and `x` are not the same, so a second call to rb_exec_recursive is made, but `y` is not on the list (only `z` is at this point) so their elements are compared. `x` and `x` are the same object and thus the comparison returns `true`. In summary:

``` ruby
x = [];  x << x
# => [[...]]
x == [[x]]
# => false
[[x]] == x
# => true
```

Fixing this inconsistency is not that difficult. Can you imagine how? Instead of pushing only `x` when calling `x.==(y)`, we need to push the pair `[x, y]`. Recursion will be triggered only if `x.==(y)` gets called again, but not for `x.==(z)`. I set out to make a patch in the C code. With the more strict criteria, we get that both `x == z` and `z == x` return `true`.

On the other hand, we still get `false` for identical recursive arrays that are built independently, like `x` and `xx`.

I then realized that if we detect a recursion when comparing `x` and `xx`, it simply means that there is no use in looking further down for differences, so we should return `true`, not `false`. Unless a difference is detected somewhere else, then `xx` and `xx` are equal! This made it possible to compare recursive arrays that have the same contents, even though they were constructed differently:

``` ruby
x = [];  x << x
# => [[...]]
step = []; stone = [step]; step << stone
# => [[[...]]]
x == step
# => true

tree = []; tree << tree << tree
# => [[...], [...]]
mixed = []; mixed << tree << mixed
# => [[[...], [...]], [...]]
tree == mixed
# => true
```

If there is a difference between the arrays (say `x[0][1][0] != y[0][1][0]`), then `xx == y` returns `false`. If no such 'path' exists, then `xx == y`.

I was quite happy when my patch was accepted a week ago, so the current head of Ruby 1.9 deals with recursion perfectly and it's no longer possible that `x == y` while `y != x`...

Details <a href="http://redmine.ruby-lang.org/issues/show/1448">on redmine</a>.

