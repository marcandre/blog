---
layout: post
---

Quick quirky quizz:

``` ruby
# What is the output of
p [40, 2].sum
p [2,3,7].product
# ?
```

Are you expecting a reference to the late Douglas Adams?

<b>Sum</b>

If you're running Rails, `sum` will indeed return 42. In straight Ruby, though, `sum` won't be defined.

Yes, not even in ruby 1.8.7 or 1.9. Many core extensions of rails were 'ported' to ruby.

`Symbol::to_proc` is probably the most notable one, but `Enumerable::group_by`,

`Float::round_with_precision`, `Integer::even?` and `Integer::odd?` come to mind also.

Why was `sum` not included? Probably because the new `inject` makes it
easier to sum enumerables (e.g `[40,2].inject(:+)`) and because Matz wants the methods of `Enumerable` to remain as generic as possible (and not assume that elements respond to `:+`, for instance). Still, I quite like the idea of `sum`.

<b>Product</b>

Now the irony is that `product` is not defined in rails, but it is in ruby 1.8.7+.

You might be a bit surprised though! Indeed:

`[2,3,7].product  # ==> [[2], [3], [7]] !`

Say what? Yeah, it turns out the `Array::product` produces the <a href="http://en.wikipedia.org/wiki/Cartesian_product">cartesian product</a>:

``` ruby
(1..13).to_a.product([:spades, :hearts, :diamonds, :clubs])
# produces a full card deck:
# => [[1, :spades], [1, :hearts], ..., [2, :spades],...]
```

Naming methods is quite a delicate task. My belief is that a more appropriate and descriptive name would have been `cartesian_product`, `cross_product` or `product_set`. `product` might be shorter I think it will run against the principle of least surprise for a lot of folks. The most frustrating part is that `product` used without any argument is pretty useless. If you really need that result, there are other ways to get it!

``` ruby
[2,3,7].product
[2,3,7].combination(1)
[2,3,5].each_slice(1).to_a
# => same result
```

So that's the hate part.

Now the love part. I had some fun backporting more features of Ruby 1.8.7/1.9 to older Ruby in my <a href="http://github.com/marcandre/backports">backports gem</a>. At some point I had ported enough that I decided I might as well port <b>everything</b>. As of version 1.6, that's done. This includes, of course, `Array#product`... which turned out to be the most interesting thing to backport! My first version used a recursive function, but I then thought about using enumerators. After 3 refactors, I got to a really nice version:

``` ruby
class Array
  def product(*arg)
    trivial_enum = Enumerator.new{|yielder| yielder.yield [] }
    [self, *arg].inject(trivial_enum) do |enum, array|
      Enumerator.new do |yielder|
        enum.each do |partial_product|
          array.each do |obj|
            yielder.yield partial_product + [obj]
          end
        end
      end
    end.to_a
  end unless method_defined? :product
end
```


I get an enumerator for all the combinations by building it up successively using `inject` and starting from a trivial enumerator. It would be easy to have `product` accept a block but the standard simply returns an array, so you'll find a simple call to `to_a` at the end. I love enumerators and... I love this implementation of `product`!

