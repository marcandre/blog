---
layout: post
title: A schizo Ruby puzzle
alias: 2009/05/schizo-ruby-puzzle.html
---

Quick quirky quiz (schizo version)

``` ruby
# Without writing any method/block/lambda,
# can you find ways to obtain, in Ruby 1.8.7 or 1.9:
x == y   # ==> true
y == x   # ==> false
```

Here's how I got to checkout Ruby's source and stumble upon that.

<!-- more -->

## Age of Innocence

This is all Mathieu's fault. He asked innocently if my <a href="http://github.com/marcandre/backports">backports gem</a> was compatible with Rails. I thought "duh! of course!". After all, it's meant to be compatible with any Ruby code.

Of course, he was right, there were bugs. Hundreds of tests were failing! Turned out to be two bugs. It dawned on me that my small bunch of unit tests were not even close to be enough. I really needed to test some more.

So I set out to test it on JRuby. I found a bug, but it was JRuby's this time. It was easy to circumvent though, so "JRuby compatibility: check".

How about rubinius? Well, that's were the story really begins...
Rubinius is a bit different because most of the builtin library is written in ruby
and that many methods use other core methods. That won't make a difference for you,
until you fiddle with core methods. For example I was redefining `String#upto`
by calling `Range#each`. Kosher in MRI, but rubinius' `Range#each` handles string
ranges by calling... `String#upto`!

There were other problems though, because rubinius was doing all sorts of stuff it wasn't really supposed to do. And because rubinius is mostly Ruby, it was easy for me to fix. Or should I say temping to fix? I have difficulty to resist that kind of temptation, so I submitted my first patch and eagerly awaited my commit access (granted to anyone who submits a patch)...

## Eye Opener

I discussed a bit with Evan Phoenix, the creator or rubinius, about 'backports' and told him I'd build it into rubinius, avoiding a bunch of alias_method_chain. I thought it would be dirt quick. That is, until I started.

See, to change things in rubinius, you first start by showing they're broken. And to do that, enters RubySpecs. It's a huge collection of tests that check if what you're running works as expected. Or as MRI runs it, should I say. You knew that Ruby has no official spec, right?

With the help Brian Ford, I started to modify my first RubySpecs. That's when I realized there were so many questions I never asked myself! Time for another quiz, this time with answers (just click on what you think is right!)


``` ruby
# Assume we have:
class MyArray &lt; Array ; end

foo = MyArray.new

# What is the class of:
```

<table class="quizz"><tr><th></td><th colspan=2></tr>
<tr><td>foo.to_ary             </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
<tr><td>foo.to_a               </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>Array.try_convert(foo) </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
<tr><td>foo.dup                </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
<tr><td>(foo+foo)              </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>(foo*2)                </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
<tr><td>foo.pop(2)             </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>foo.shift(2)           </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>foo[0..2]              </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
<tr><td>foo.slice(0,2)         </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
<tr><td>foo.slice!(0,2)        </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>foo.first(2)           </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>foo.sample(2)          </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>foo.flatten            </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
<tr><td>foo.product            </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>foo.combination(1).first   </td><td class="q x">MyArray</td><td class="q y">Array</td></tr>
<tr><td>foo.shuffle            </td><td class="q y">MyArray</td><td class="q x">Array</td></tr>
</table>

Some are intuitive, like `#shuffle`, some less so, like `#+`. I wonder how you're going to do, because I think I made worse than a monkey would by guessing randomly!

The complexity and amount of detail found in RubySpecs was a real eye opener. The fact is, often you won't care about that level of detail about the implementation. But inevitably some people will.

So far I've ported all 1.8.7 Array methods and I'm working on the rest. Writing the specs is usually a bit longer than the implementation and damn difficult to get right. Well, at least for me; luckily there's people like <a href="http://github.com/ujihisa">Ujihisa</a> that fix my specs minutes after I commit them.

It's because of a question he asked that I had to refer the Ruby C source and realized there was a potential problem like the `x == y` but `!(y == x)`.

That cost me a bunch of hours today, because fixing it was another of those challenges I can hardly refuse, even if I had to delve in the C code!

Next blog entry: update on that bug, along with the solution (unless someone posts them in the comments)!

<i>Thanks to Brian Ford and Evan Phoenix for their help and Ujihisa for pointing me to the complexity of the `<=>` operator he calls the spacecraft operator. And yeah, to Mathieu Houle for his damn question! ;-)</i>

