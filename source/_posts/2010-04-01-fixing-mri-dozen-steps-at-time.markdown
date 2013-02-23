---
layout: post
title: "Fixing MRI, a dozen steps at a time"
---
Is there a term like bugfield? You know, when everytime you get to take a couple of steps in a code base you encounter a different bug, which leads to another one, ..., like a minefield of bugs?

Here was my last sequence in Ruby (MRI)...

Main goal: improve `Matrix#determinant` and `#rank` after a <a href="http://redmine.ruby-lang.org/issues/show/2772">suggestion of Yu Ichino</a>. The bulk of the work took me quite a while, as I had to check a bunch of things, understand the algorithm, do some performance testing, etc...

When modifying `Matrix#rank` to use this different approach, I take the opportunity to improve the styling. A variable name of `ii` is not as clear as `row`, and... it actually reveals that something is amiss because that loop goes up to the number of columns, not rows...

1) So I find a minimal test case to convince myself I'm not mistaken. Yup, a simple 3x2 matrix has the wrong rank. I add that to the spec and fix `Matrix#rank`. When cleaning up, I make sure that `Matrix#regular?` and `Matrix#singular?` are using the right determinant function and not a bad variant that's now deprecated.

Turns out they are checking the rank of the matrix, which is not as efficient but more importantly...

2) they both return false if the matrix is not square. This doesn't make much mathematical sense.

Since I'm now the happy maintainer of the lib and I am confident there is no other reasonable solution, I have them raise an error for rectangular matrices. This means specs are either wrong or incomplete in Rubyspec, though, so I check them out...

3) Turns out Rubyspec is incomplete for those, so <a href="http://github.com/rubyspec/rubyspec/commit/94108c8f8d29e9e46da4d000e4c6a8fa1f912361">I specify</a> what error should be returned in case of a rectangular matrix. Double check my change by running it gives me 0 assertions. Oups?

Turns out that the guard I wrote to signify this was a bug never passes. Ah, right, `ruby_bug "", "1.9"` means "this is a bug present in the whole 1.9 .x line", so it will not be executed until Ruby 2.0!

My bad, but the program to run the specs shouldn't allow that though, so...

4) Discussion with Brian Ford, the maintainer of RubySpec. Good thing he's always on IRC. Anyways, he might put in a max version to avoid such nonsense in the future. Meanwhile...

5) A quick search in RubySpec reveals about a half dozen of such bad guards, so I set about <a href="http://github.com/rubyspec/rubyspec/commit/370ebb2d217b35d177d3070909ad8b694b1eed28">fixing each one</a>, and...

6) One of the spec that was not guarded properly fails for the latest Ruby trunk. It's not clear it's a bug though. At least for me, as I've never tried to open the singleton class of a Bignum!

So I investigate, try a couple of things, and yeah, the more I dig, the more it looks like a bug, so <a href="http://redmine.ruby-lang.org/issues/show/3222">I open an issue</a> to confirm with ruby-core. There's one spec left...

7) The last spec shows clearly a small bug in `String#sub!` so <a href="http://github.com/ruby/ruby/commit/479fa407780ca01ce04dce1ef21342da4e148215">I fix that in MRI</a>... and I realize that the error message for the wrong number of parameters is misleading.

8) It takes about a microsecond to fix that error message. A quick find reveals other similar error messages in the MRI code. A quick review leads to... 18 issues of all sorts. Some more inaccuracies, some uninformative messages, some that don't follow the standard format and typos in the doc.

9) I <a href="http://github.com/ruby/ruby/commit/478c3e080b0d2782ae630f87c22d1a8e36756778">fix all of these too</a>. Ideally this should be refactored, but I'm getting tired. Yet I'm still awake enough to realize that one more method has the wrong doc...

10) From the code, I gather that the interface for `SignalException.new` is a bit more complex than advertised. I supplement the doc <a href="http://github.com/ruby/ruby/commit/4d3f87718014cf13189c35c4ed8a6cfd93a91406">as best as I can</a>.

Ouf, I'm done. Double check the commit... arghh, there's another method that accepts an undocumented extra parameter, so...

11) That extra param is a bit odd. Looks like you can build a regexp with a third parameter equal to "n" or "N" and the encoding switches to binary. Other values will get you a warning, and any letter after the "n" will be ignored. Smells like legacy.

`git blame` tracks back the changes years ago, giving me a reference to the ruby-dev list. Lucky me, it's not in Japanese and refers to `uri/common.rb`. A quick check refers to no Regexp.new with that third argument. Ah, there's a `Regexp.new(HEADER_PATTERN, 'N')` in uri/mailto. The 'N' doesn't mean binary, though, since it's in second place (so it means "case insensitive", as would `true`), which....

12) is a bug; the regexp is already case insensitive so that 'N' has no effect. I don't understand enough what an extra "N" really does to be sure if it can be removed (since it doesn't have any effect right now, ) or should put in third position.

I'm a bit dizzy. I should really go to sleep. Even though this is all pretty minor, I fire a <a href="http://redmine.ruby-lang.org/issues/show/3224">redmine issue</a> about the doc and <a href="http://redmine.ruby-lang.org/issues/show/3225">another one</a> about the lib and go to bed...

And I thought fixing `Matrix#regular?` would be trivial...

