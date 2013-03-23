---
layout: post
alias: 2009/09/best-time-to-get-involved-in-ruby-core.html
---
Apart from enjoying the summer, I've spent time hacking on MRI, especially since I've been accepted as a committer. The feature freeze for Ruby 1.9.2 was planned for yesterday and this has been pushed back a couple of days before. Rejoice!

Why? <!-- more --> The reason <a href="http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/25707">stated</a> was that the next version of Ruby will, for the first time ever, pass the <a href="http://github.com/rubyspec/rubyspec">RubySpec</a>. This makes RubySpec the official meeting point for all Ruby implementations, not just Rubinius (the originator of RubySpec), JRuby and others. This should also give a bit more time to decide on a couple of <a href="http://redmine.ruby-lang.org/wiki/ruby/SomeCoreFeaturesFor192">new features</a> that might make it in 1.9.2.

Much work has been done to have the specs meet MRI 1.9.x and the language and core sections only have a couple of failures<sup>1</sup>. Most are due to cases for which the best decisions still have to be figured out. I'll remind you that it's easy to gain commit access to RubySpec: any accepted patch grants you your commit bit.

There is still quite a bit of work to be done spec'ing the libraries. Actually there's a lot of work to be done in the libraries themselves. Some are quite badly maintained, others don't even have an official maintainer. And that's all about to change, hopefully!

It was <a href="http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-core/25764">announced yesterday</a> that being a maintainer is no longer for life. Not doing anything about opened issues? Sorry, we'll get someone else to take care of it. <a href="http://redmine.ruby-lang.org/wiki/ruby/Unmaintained">Many libraries</a> currently have no maintainer and there should be many others that won't be claimed in the confirmation process.

Feeling competent to maintain a library? You talk using only sockets? You dream in yaml? Might as well apply to maintain your favorite lib...

I sincerely hope 1.9.2 kicks some serious ass. It's bound to be the version Ruby 1.9 that most people will use and target for the first time. More reason to get it right!

<hr/>

<sup>1</sup>Actually, the bulk of the work was spec'ing Ruby 1.8.6 under the supervision of <a href="http://github.com/brixen">Brian Ford</a>. I helped finish the specs for 1.8.7 and the mysterious and tireless <a href="http://github.com/runpaint">Run Paint Run Run</a> did most of the 1.9 specific specs. Spec'ing Ruby usually leads to finding bugs or asking clarifications. Indeed, Run Paint opened more issues on redmine than any other user!

