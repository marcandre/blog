---
layout: post
alias: 2009/04/whats-point-of-ruby-187.html
---

Can you guess how many built-in methods were introduced or modified when Ruby 1.8.5 came out? How about Ruby 1.8.6? Or the most recent 1.8.7?

<div class="toggle_show with_border"><div class="normal long"><table><tr><th>Ruby&nbsp;</th><th>Changes</th></tr><tr><td>1.8.5</td><td><i>Roll over</i></td></tr><tr><td>1.8.6</td><td><i>for the</i></td></tr><tr><td>1.8.7</td><td><i>answers!</i></td></tr></table></div><div class="over"><table><tr><th>Ruby&nbsp;</th><th>Changes</th></tr><tr><td>1.8.5</td><td>2</td></tr><tr><td>1.8.6</td><td>3</td></tr><tr><td>1.8.7</td><td><b>137</b></td></tr></table></div></div>

I'd love to check that the number of changes was minimal for earlier 1.8.x releases, but I can't find a good list of changes (other than going through the full changelogs) Anyone has that info?

Are you writing code that targets 1.8.7? I know I'm not. The code I'm releasing on <a href="http://github.com/marcandre">github</a> is aimed at Ruby 1.8 and Ruby 1.9. The thing is, code that runs on 1.8.7 doesn't necessarily run on 1.9, and even less likely to run on 1.8.6 or earlier. At least if you're <a href="../02/please-write-ruby-in-ruby.html">writing Ruby in Ruby</a> and using the new `Enumerable` features, among others. So you have to test all three?

The fact is, Ruby 1.8.7 has a different API than the rest of the 1.8.x line, but still different from Ruby 1.9. So not only is it already difficult to know if some code is compatible with Ruby 1.9 (e.g. <a href="http://isitruby19.com">isitruby19.com</a>), there are many more possibilities: some gems can be compatible with Ruby 1.8.7 only, for example. Or 1.8.7 and 1.9.1 but not 1.8.6 and before. It's actually possible to be compatible just with 1.8.7! Try `[:red_pill, :blue_pill].choice`.

The solution should have been clear, though. Don't change the API. Instead, use forward compatibility, and that's easy to do in ruby. I've written my own collection of <a href="http://github.com/marcandre/backports">backports</a> after looking in vain for one. I'm still wondering why change the API instead of releasing a standard forward compatibility gem which would work for all Ruby 1.8.x. I mean, all those OS X users with their default 1.8.6 installation... I'm supposed to tell them to upgrade to 1.8.7 because I want to use `map(&:to_s)`? In any case, I hope that a single `require "backports"` will enable 1.8.7 specific code to run on earlier versions of Ruby.

PS: I know python has forward compatibility with their cute `from __future__ import *`. Anyone knows about Smalltalk, Scala, Lua, IO?

