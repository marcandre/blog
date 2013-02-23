---
layout: post
title: "method_missing, politely"
alias: 2010/11/methodmissing-politely.html
---
In their <a href="politeprogrammer.com/blog.html">Polite Programmer</a> talk at Rubyconf, Jim Weirich and Chris Nelson pointed out that merely adding some behavior with `method_missing` wasn't quite polite, as shown below:

``` ruby
class StereoPlayer
  def method_missing(method, *args, &block)
    if method.to_s =~ /play_(\w+)/
      puts "Here's #{$1}"
    else
      super
    end
  end
end

p = StereoPlayer.new
# ok:
p.play_some_Beethoven # => "Here's some_Beethoven"
# not very polite:
p.respond_to? :play_some_Beethoven # => false
```

In order for `respond_to?` to return `true`, one can specialize it, as follows:

``` ruby
class StereoPlayer
  # def method_missing ...
  #   ...
  # end

  def respond_to?(method, *)
    method.to_s =~ /play_(\w+)/ || super
  end
end
p.respond_to? :play_some_Beethoven # => true
```

This is better, but it still doesn't make `play_some_Beethoven` behave exactly like a method. Indeed:

``` ruby
p.method :play_some_Beethoven
# => NameError: undefined method `play_some_Beethoven'
#               for class `StereoPlayer'
```

Ruby 1.9.2 introduces `respond_to_missing?` that provides for a clean solution to the problem. Instead of specializing `respond_to?` one specializes `respond_to_missing?`. Here's a full example:

``` ruby
class StereoPlayer
  # def method_missing ...
  #   ...
  # end

  def respond_to_missing?(method, *)
    method =~ /play_(\w+)/ || super
  end
end

p = StereoPlayer.new
p.play_some_Beethoven # => "Here's some_Beethoven"
p.respond_to? :play_some_Beethoven # => true
m = p.method(:play_some_Beethoven) # => #<Method: StereoPlayer#play_some_Beethoven>
# m acts like any other method:
m.call # => "Here's some_Beethoven"
m == p.method(:play_some_Beethoven) # => true
m.name # => :play_some_Beethoven
StereoPlayer.send :define_method, :ludwig, m
p.ludwig # => "Here's some_Beethoven"
```
