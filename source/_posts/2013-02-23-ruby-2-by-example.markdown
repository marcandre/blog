---
layout: post
title: "Ruby 2.0.0 by example"
date: 2013-02-23 07:40
comments: true
alias: http://blog.marc-andre.ca/2013/02/23/ruby-2-dot-0-0-by-example
categories:
---
There's a [Portugese translation](http://rrmartins.github.com/blog/2013/02/26/traducao-ruby-2-dot-0-por-exemplos/)  by Rodrigo Martins if you prefer.

A quick summary of some of the new features of Ruby 2.0.0:

# Language Changes

## Keyword arguments

``` ruby
# Ruby 1.9:
  # (From action_view/helpers/text_helper.rb)
def cycle(first_value, *values)
  options = values.extract_options!
  name = options.fetch(:name, 'default')
  # ...
end

# Ruby 2.0:
def cycle(first_value, *values, name: 'default')
  # ...
end

# CAUTION: Not exactly identical, as keywords are enforced:
cycle('odd', 'even', nme: 'foo')
# => ArgumentError: unknown keyword: nme

# To get exact same result:
def cycle(first_value, *values, name: 'default', **ignore_extra)
  # ...
end
```

This makes method definitions very flexible. In summary:
```
def name({required_arguments, ...}
         {optional_arguments, ...}
         {*rest || additional_required_arguments...} # Did you know?
         {keyword_arguments: "with_defaults"...}
         {**rest_of_keyword_arguments}
         {&block_capture})
```

In Ruby 2.0.0, keyword arguments must have defaults, or else must be captured by `**extra` at the end. Next version [will allow](https://bugs.ruby-lang.org/issues/7701) mandatory keyword arguments, e.g. `def hello(optional: 'default', required:)`, but there are [ways to do it now](http://stackoverflow.com/questions/13250447/can-i-have-required-named-parameters-in-ruby-2-x/15078852#15078852).

Defaults, for optional parameters or keyword arguments, can be mostly any expression, including method calls for the current object and can use previous parameters.

A complex example showing most of this:
```
class C
  def hi(needed, needed2,
         maybe1 = "42", maybe2 = maybe1.upcase,
         *args,
         named1: 'hello', named2: a_method(named1, needed2),
         **options,
         &block)
  end

  def a_method(a, b)
    # ...
  end
end

C.instance_method(:hi).parameters
# => [ [:req, :needed], [:req, :needed2],
#      [:opt, :maybe1], [:opt, :maybe2],
#      [:rest, :args],
#      [:key, :named1], [:key, :named2],
#      [:keyrest, :options],
#      [:block, :block] ]
```

[Known bug](http://bugs.ruby-lang.org/issues/7922): it's not currently possible to ignore extra options without naming the `**` argument.

## Symbol list creation

Easy way to create lists of symbols with `%i` and `%I` (where `i` is for [`intern`](http://ruby-doc.org/core-2.0/String.html#method-i-intern)):

``` ruby
# Ruby 1.9:
KEYS = [:foo, :bar, :baz]

# Ruby 2.0:
KEYS = %i[foo bar baz]
```

## Default encoding is UTF-8

No magic comment is needed in case the encoding is utf-8.

``` ruby
# Ruby 1.9:
# encoding: utf-8
# ^^^ previous line was needed!
puts "❤ Marc-André ❤"

# Ruby 2.0:
puts "❤ Marc-André ❤"
```

## Unused variables can start with _

Did you know that Ruby can warn you about unused variables?

```
# Any Ruby, with warning on:
ruby -w -e "
  def hi
    hello, world = 'hello, world'.split(', ')
    world
  end"
# => warning: assigned but unused variable - hello
```

The way to avoid the warning was to use `_`. Now we can use any variable name starting with an underscore:

```
# Ruby 1.9
ruby -w -e "
  def foo
    _, world = 'hello, world'.split(', ')
    world
  end"
# => no warning

# Ruby 2.0
ruby -w -e "
  def hi
    _hello, world = 'hello, world'.split(', ')
    world
  end"
# => no warning either
```

# Core classes changes

## Prepend

[`Module#prepend`](http://ruby-doc.org/core-2.0/String.html#method-i-prepend) inserts a module at the beginning of the call chain. It can nicely replace `alias_method_chain`:

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

Range.ancestors # => [Range, Enumerable, Object...]

# Ruby 2.0
module IncludeRangeExt
  # Extends the default Range#include? to support range comparisons.
  def include?(value)
    if value.is_a?(::Range)
      # 1...10 includes 1..9 but it does not include 1..10.
      operator = exclude_end? && !value.exclude_end? ? :< : :<=
      super(value.first) && value.last.send(operator, last)
    else
      super
    end
  end
end

class Range
  prepend IncludeRangeExt
end

Range.ancestors # => [IncludeRangeExt, Range, Enumerable, Object...]
```

## Refinements [experimental]

In Ruby 1.9, if you `alias_method_chain` a method, the new definition takes place everywhere. In Ruby 2.0.0, you can make this kind of change just for yourself using [`Module#refine`](http://ruby-doc.org/core-2.0/Module.html#method-i-refine):

``` ruby
# Ruby 2.0
module IncludeRangeExt
  refine Range do
    # Extends the default Range#include? to support range comparisons.
    def include?(value)
      if value.is_a?(::Range)
        # 1...10 includes 1..9 but it does not include 1..10.
        operator = exclude_end? && !value.exclude_end? ? :< : :<=
        super(value.first) && value.last.send(operator, last)
      else
        super
      end
    end
  end
end

def test_before(r)
  r.include?(2..3)
end
(1..4).include?(2..3) # => false (default behavior)

# Now turn on the refinement:
using IncludeRangeExt

(1..4).include?(2..3) # => true  (refined behavior)

def test_after(r)
  r.include?(2..3)
end
test_after(1..4) # => true (defined after using, so refined behavior)

3.times.all? do
  (1..4).include?(2..3)
end # => true  (refined behavior)

# But refined version happens only for calls defined after the using:
test_before(1..4) # => false (defined before, not affected)
require 'some_other_file' # => not affected, will use the default behavior

# Note:
(1..4).send :include?, 2..3 # => false (for now, send ignores refinements)
```

Full spec is [here](http://bugs.ruby-lang.org/projects/ruby-trunk/wiki/RefinementsSpec) and is subject to change in later versions. More in-depth discussion [here](http://benhoskin.gs/2013/02/24/ruby-2-0-by-example#refinements)

## Lazy enumerators

An `Enumerable` can be turned into a lazy one with the new [`Enumerable#lazy`](http://ruby-doc.org/core-2.0/Enumerable.html#method-i-lazy) method:

``` ruby
# Ruby 2.0:
lines = File.foreach('a_very_large_file')
            .lazy # so we only read the necessary parts!
            .select {|line| line.length < 10 }
            .map(&:chomp)
            .each_slice(3)
            .map {|lines| lines.join(';').downcase }
            .take_while {|line| line.length > 20 }
  # => Lazy enumerator, nothing executed yet
lines.first(3) # => Reads the file until it returns 3 elements
               # or until an element of length <= 20 is
               # returned (because of the take_while)

# To consume the enumerable:
lines.to_a # or...
lines.force # => Reads the file and returns an array
lines.each{|elem| puts elem } # => Reads the file and prints the resulting elements
```

Note that `lazy` will often be slower than a non lazy version. It should be used only when it really makes sense, not just to avoid building an intermediary array.

``` ruby
require 'fruity'
r = 1..100
compare do
  lazy   { r.lazy.map(&:to_s).each_cons(2).map(&:join).to_a }
  direct { r     .map(&:to_s).each_cons(2).map(&:join)      }
end
# => direct is faster than lazy by 2x ± 0.1
```

## Lazy size

[`Enumerator#size`](http://ruby-doc.org/core-2.0/Enumerator.html#method-i-size) can be called to get the size of the enumerator without consuming it (if available).

``` ruby
# Ruby 2.0:
(1..100).to_a.permutation(4).size # => 94109400
loop.size # => Float::INFINITY
(1..100).drop_while.size # => nil
```

When creating enumerators, either with `to_enum`, `Enumerator::New`, or `Enumerator::Lazy::New` it is possible to define a size too:

``` ruby
# Ruby 2.0:
fib = Enumerator.new(Float::INFINITY) do |y|
  a = b = 1
  loop do
    y << a
    a, b = b, b+a
  end
end

still_lazy = fib.lazy.take(1_000_000).drop(42)
still_lazy.size # => 1_000_000 - 42

class Enumerable
  def skip(every)
    unless block_given?
      return to_enum(:skip, every) { size && (size+every)/(every + 1) }
    end
    each_slice(every+1) do |first, *ignore|
      yield last
    end
  end
end

(1..10).skip(3).to_a # => [1, 5, 9]
(1..10).skip(3).size # => 3, without executing the loop
```

Additional details and examples in the doc of [`to_enum`](http://ruby-doc.org/core-2.0/Object.html#method-i-to_enum)

## \_\_dir\_\_

Although [`require_relative`](http://ruby-doc.org/core-2.0/Kernel.html#method-i-require_relative) makes the use of `File.dirname(__FILE__)` much less frequent, we can now use [`__dir__`](http://ruby-doc.org/core-2.0/Kernel.html#method-i-__dir__)

``` ruby
# Ruby 1.8:
require File.dirname(__FILE__) + "/lib"
File.read(File.dirname(__FILE__) + "/.Gemfile")

# Ruby 1.9:
require_relative 'lib'
File.read(File.dirname(__FILE__) + '/.config')

# Ruby 2.0
require_relative 'lib' # no need to use __dir__ for this!
File.read(__dir__ + '/.config')
```

## bsearch

Binary search is now available, using either [`Array#bsearch`](http://ruby-doc.org/core-2.0/Array.html#method-i-bsearch) or [`Range#bsearch`](http://ruby-doc.org/core-2.0/Range.html#method-i-bsearch):

``` ruby
# Ruby 2.0:
ary = [0, 4, 7, 10, 12]
ary.bsearch {|x| x >=   6 } #=> 7
ary.bsearch {|x| x >= 100 } #=> nil

# Also on ranges, including ranges of floats:
(Math::PI * 6 .. Math::PI * 6.5).bsearch{|f| Math.cos(f) <= 0.5}
# => Math::PI * (6+1/3.0)
```

## to_h

There is now an official way to convert a class to a Hash, using `to_h`:

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

This has been implemented for `nil`, `Struct` and `OpenStruct`, but not for `Enumerable`/`Array`:

``` ruby
{hello: 'world'}.map{|k, v| [k.to_s, v.upcase]}
                .to_h # => NoMethodError:
# undefined method `to_h' for [["hello", "WORLD"]]:Array
```

If you think this would be a useful feature, you should [try to convince Matz](http://bugs.ruby-lang.org/issues/7292).

## caller_locations

It used to be tricky to know which method just called. It wasn't very efficient either, since the whole backtrace had to be returned. Each frame was a string that needed to be first computed by Ruby and probably parsed afterwards.

Enters [`caller_locations`](http://ruby-doc.org/core-2.0/Kernel.html#method-i-caller_locations) that returns the information in an object fashion and with a better api that can limit the number of frames requested.

``` ruby
# Ruby 1.9:
def whoze_there_using_caller
  caller[0][/`([^']*)'/, 1]
end

# Ruby 2.0:
def whoze_there_using_locations
  caller_locations(1,1)[0].label
end
```

How much faster is it?
A [simple test](https://gist.github.com/marcandre/5041813) gives me 45x speedup for a short stacktrace, and 100x for a stacktrace of 100 entries!

The extra information like the file path, line number are still accessible; instead of asking for `label`, ask for `path` or `lineno`.

## Optimizations

It's difficult to show most optimizations by code, but some nice optimizations made it in Ruby 2.0.0. In particular, the GC was optimized, in particular to make forking much faster.

One optimization we can demonstrate was to make many floats immediates on 64-bit systems. This avoids creating new objects in many cases:
``` ruby
# Ruby 1.9
4.2.object_id == 4.2.object_id # => false

# Ruby 2.0
warn "Optimization only on 64 bit systems" unless 42.size * 8 == 64
4.2.object_id == 4.2.object_id # => true (4.2 is immediate)
4.2e100.object_id == 4.2e100.object_id # => false (4.2e100 isn't)
```

## What else?

An extensive list of changes is the [NEWS file](https://github.com/marcandre/ruby/blob/news/NEWS.rdoc).

## I want it!

Try it out today:

* install with rvm: `rvm get head && rvm install 2.0.0` (note that `rvm get stable` is not sufficient!)
* install with rbenv: `rbenv install 2.0.0-p0` (I think)
* other installation: See the [ruby-lang.org](http://www.ruby-lang.org/en/downloads/) instructions

For those who can't upgrade yet, you can still have some of the fun with my [`backports gem`](https://github.com/marcandre/backports). It makes  `lazy`, `bsearch` and a couple more available for any version of Ruby. The complete list is in the [`readme`](https://github.com/marcandre/backports#ruby-200).

Enjoy Ruby 2.0.0!
