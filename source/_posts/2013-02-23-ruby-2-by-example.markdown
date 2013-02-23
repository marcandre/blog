---
layout: post
title: "Ruby 2.0.0 by example"
date: 2013-02-23 07:40
comments: true
categories:
---
Ruby 2.0.0 introduces many cool features.

Here are some examples (which I hope to improve over this week end):

# Language Changes

## Keyword arguments

``` ruby
# Ruby 1.9:
def foo(a, b=2, *args)
  options = args.extra_options!
  foo = options.delete(:foo) || 'default'
  bar = options.delete(:bar) || 'default'
  # ...
end

# Ruby 2.0:
def foo(a, b=2, *args, foo: 'default', bar: 42, **options)
  # ...
end
```

## Symbol list creation

``` ruby
# Ruby 1.9
KEYS = [:foo, :bar, :baz]

# Ruby 2.0
KEYS = %i[foo bar baz]
```

## Default encoding is UTF-8

``` ruby
# Ruby 1.9
# encoding: utf-8
puts "Marc-André"

# Ruby 2.0
puts "Marc-André"
```

## Unused variables can be anything starting with _

```
# With -w option:
ruby -w -e "
  def hi
    hello, world = 'hello, world'.split(',')
    hello
  end"
# => warning: assigned but unused variable - world


# Ruby 1.9
ruby -w -e "
  def hi
    hello, _ = 'hello, world'.split(',')
    hello
  end"
# => no warning

# Ruby 2.0
ruby -w -e "
  def hi
    hello, _world = 'hello, world'.split(',')
    hello
  end"
# => no warning
```

# Core classes changes

## Prepend

``` ruby
# Ruby 1.9:
class Range
  # From active_support/core_ext/range/include_range.rb
  # Extends the default Range#include? to support range comparisons.
  def include_with_range?(value)
    if value.is_a?(::Range)
      # 1...10 includes 1..9 but it does not include 1..10.
      operator = exclude_end? && !value.exclude_end? ? :< : :<=
      include_without_range?(value.first) && value.last.send(operator, last)
    else
      include_without_range?(value)
    end
  end

  alias_method_chain :include?, :range
end

Range.ancestors # => [Range, Enumerable, Object, Kernel, BasicObject]

# Ruby 2.0
module IncludeRangeExt
  # Extends the default Range#include? to support range comparisons.
  def include?(value)
    if value.is_a?(::Range)
      # 1...10 includes 1..9 but it does not include 1..10.
      operator = exclude_end? && !value.exclude_end? ? :< : :<=
      super(value.first) && value.last.send(operator, last)
    else
      super(value)
    end
  end
end

class Range
  prepend IncludeRangeExt
end

Range.ancestors # => [IncludeRangeExt, Range, Enumerable, Object, Kernel, BasicObject]
```

## Refinements [experimental]

In Ruby 1.9, either you `alias_method_chain` a method, or you don't. In Ruby 2.0.0, you can have this kind of change very localized:

``` ruby
# Ruby 2.0
def test(r)
  r.include?(2..3)
end

module IncludeRangeExt
  refine Range do
    # Extends the default Range#include? to support range comparisons.
    def include?(value)
      if value.is_a?(::Range)
        # 1...10 includes 1..9 but it does not include 1..10.
        operator = exclude_end? && !value.exclude_end? ? :< : :<=
        super(value.first) && value.last.send(operator, last)
      else
        super(value)
      end
    end
  end
end

(1..4).include?(2..3) # => false (default behavior)
using IncludeRangeExt
(1..4).include?(2..3) # => true  (refined behavior)
test(1..4) # => false (not affected, so default behavior)

def test_again
  (1..4).include?(2..3)
end
test_again # => true (defined after using, so refined behavior)
```

## Lazy enumerators

``` ruby
# Ruby 2.0:
lines = File.foreach('a_very_large_file')
            .lazy # so we only read the necessary parts!
            .select {|line| line.length < 10 }
            .map {|line| line.chomp!; line }
            .each_slice(3)
            .map {|lines| lines.join(';').downcase }
            .take_while {|line| line.length > 20 }
```

## Lazy size
``` ruby
# Ruby 2.0:
(1..100).to_a.permutation(4).size # => 94109400
loop.size # => Float::INFINITY
(1..100).drop_while.size # => nil
```

## bsearch
``` ruby
ary = [0, 4, 7, 10, 12]
ary.bsearch {|x| x >=   6 } #=> 7
ary.bsearch {|x| x >= 100 } #=> nil

# Also on ranges, including ranges of floats:
(Math::PI * 6 .. Math::PI * 6.5).bsearch{|f| Math.cos <= 0.5}
# => Math::PI * (6+1/3.0)
```

## to_h
``` ruby
# Ruby 2.0:
Car = Struct.new(:make, :model, :year) do
  def build
    #...
  end
end
car = Car.new('Toyota', 'Prius', 2014)
car.to_h # => {:make=>"Toyota", :model=>"Prius", :year=>2014}
nil.to_h # => {}
```

Note that there is no `Array#to_h`:
``` ruby
{hello: 'world'}.map{|k, v| [k.to_s, v.upcase]}
                .to_h # => NoMethodError:
# undefined method `to_h' for [["hello", "WORLD"]]:Array
```

If you think this would be a useful feature, contribute to this issue: http://bugs.ruby-lang.org/issues/7292

## Optimizations

It's difficult to show most optimizations by code. One interesting optimization was to make many floats immediates:
``` ruby
# Ruby 1.9
4.2.object_id == 4.2.object_id # => false

# Ruby 2.0
4.2.object_id == 4.2.object_id # => true (4.2 is immediate)
4.2e100.object_id == 4.2e100.object_id # => false (4.2e100 isn't)
```

