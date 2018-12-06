---
layout: post
alias: 2009/04/zombies-hashes-archaisms-of-ruby-core.html
---

I just <b>love</b> hashes. So much so, I named my blog after them. I also like that the hash sign is used for comments, in Ruby, or the way <i>hash</i> resembles <i>hatch</i>, thus the messy graphic theme and all. But I really like hashes. They are like mini-objects (object hatchlings?) and I tend to use them to store all sorts of information or instead of many conditions with `case x; when :a ...; when :b ...`.

So I was quite surprised to note that in Ruby, either it's really easy and natural to create a hash (with the super nice `{:key => value, ...}` syntax) or<!-- more -->, when you need to generate a hash programatically, you're basically stuck with

``` ruby
h = {}
foo.each do |key|
  h[key] = bar(key)
end
```

Well, that's not quite true, there's the `Hash[key, value, key, value, ...]` one can use. Do you use that one? So I decided to propose something. Now I don't want to risk disturbing people. Especially important people. Except on my blog, of course; it's your damn fault if you've read so far! I still have a bonus for you coming up for all your effort.

So I thought about this, researched it a bit and came up with the very best I could think of. I was quite nervous and excited when clicking on "Create"! My very first ruby posting was born: <a href="http://redmine.ruby-lang.org/issues/show/666">Feature #666: Enumerable::to_hash</a>.

I didn't quite know what to think of the strange omen of ID 666, though. In any event, I must admit that the excitement died down after waiting for anything to happen. It took a month for it to be assigned to Matz. Another two weeks for it to have the target set to "1.9.x". Complete silence after that.

I must confess I was not registered to the ruby-core mailing list, so I would not have know of anyone writing directly to the list and not through the issue tracker. I believe no one did though. At least according to google because... there is no search on ruby-core's archives! It's quite an archaic system actually. The web front end is <a href="http://blade.nagaokaut.ac.jp/ruby/ruby-core/index.shtml">horrendous</a>, the user interface is arcane (if not outright <a href="http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/23207?help-en">buggy</a>). Don't except a web link to confirm your registration, you have to send a mail back with a specific body. Short of registering, everything is done by email, actually. There might be a search command you send via email? Argh!

The fact that the search on the issue tracker itself (an otherwise fine product) doesn't appear to work makes it next to impossible to check previous discussions for something. Like why has Ruby not moved to git yet? I guess I shouldn't complain since others moved to <b>svn</b> a <a href="http://bsd.slashdot.org/bsd/08/06/04/1749233.shtml">couple of months ago</a>! Or like why is the ruby C code indented using 4 spaces, then 1 tab, then 1 tab + 4 spaces, etc... How do you even indent like that using TextMate? I'm 37, I'm used to feel old-generation and to find like things are moving quite fast, but damn, how come it's quite the contrary here?

I pointed out <a href="http://redmine.ruby-lang.org/issues/show/1165">a simple bug</a> two months ago, even provided a patch the small change in the C code. New releases of ruby 1.8.6 and .7 were made today, and still no update on my bug report. I presume that the whole ruby-core team has a lot on their plate, but it's hard not to be discouraged from contributing with that kind of (non-)feedback. Even <a href="http://redmine.ruby-lang.org/issues/show/1389">clueless tourists</a> seem to get more attention.

All this to say that 6 months after my feature request, still nothing. That's when I discovered a cool new way to create hashes out of key-value pairs that is undocumented. This time, I made my best so that it wouldn't go unnoticed. I conjured demons, invoked strange incantations, made dubious attempts at being humorous and documented the whole thing (zombies will be next!). <a href="http://redmine.ruby-lang.org/issues/show/1385">Here it is</a>. So that's my bonus to you. Matz coded it, I'm letting you know about it! ;-)

That at least got my original issue noticed... and shot down. Some musterer the courage to <a href="http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/23253">speak their mind</a>, we'll see if this goes anywhere.

(Updated after Matz <a href="http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/23259">explained</a> better his reason)

<b>2011 update</b>: For those interested, a proposal similar to my original one can be seen in <a href="http://blade.nagaokaut.ac.jp/cgi-bin/vframe.rb/ruby/ruby-core/33683?33586-35564">this ruby-core thread</a>.

