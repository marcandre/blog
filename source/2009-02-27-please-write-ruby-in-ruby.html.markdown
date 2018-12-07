---
layout: post
alias: 2009/02/please-write-ruby-in-ruby.html
---

I'm always surprised when I see bright people writing ruby code without using ruby's standard lib. Do I need to point out that it's less readable and more error prone?

I plead all rubyists to re-read the doc for Array, Hash and Enumerable/Enumerator. Refer back to it. Use it. Please!

I was quite amazed to see the following code (written by an ex rails-core programmer, nothing less!). Check out the three methods and ask yourself what they do and how they should be written (mouse-over the code for the answers).

<!-- more -->

<div class="toggle_show"><div class="normal long">

``` ruby
class Options < Hash
  #...
  def get_bar_settings
    bar_setting_keys.map do |bar_key|
      self[:bar][bar_key]
    end
  end

  def extract_is_cool!
    self[:is_cool] = options.has_key?(:is_cool) ?
                     options[:is_cool] : false
  end

  def check_validity(options)
    invalid_options = options.keys.select do |key|
      !VALID_OPTIONS.include?(key)
    end
    raise SomeError unless invalid_options.empty?
  end
  #...
end
```
</div><div class="over">

``` ruby
class Options < Hash
  #...
  def get_bar_settings

    self[:bar].values_at(*bar_setting_keys)

  end

  def extract_is_cool!
    self[:is_cool] = options[:is_cool]
    # or options.fetch(:is_cool, false)
  end

  def check_validity(options)

    invalid_options = options.keys - VALID_OPTIONS

    raise SomeError unless invalid_options.empty?
  end
  #...
end
```
</div></div>

The `extract_is_cool!` method was actually not even needed because there was a `merge!(options)` later on, just adding insult to injury...

