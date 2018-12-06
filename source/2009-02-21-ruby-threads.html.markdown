---
layout: post
alias: 2009/02/ruby-threads.html
---

I'm pondering a really neat scheme for my upcoming FLV editor. My editor can be thought of as a series of processors acting on tags; the first processor reads them, then others analyse/modify them and the last one writes them. The scheme would need some sort of disconnection in the processing, either with continuations (which appear to be implemented two different ways in ruby 1.8 and 1.9) or threads. Which leads to the questions:

<!-- more -->

What's the performance comparison of a program that sucessively reads and writes chunks of data, compared to one where one thread reads and the other one writes.

What about `many.times{ read; process; write}` vs `Thread { read }` + `Thread { process }` + `Thread {write}`. Or doubling the processing (and processing threads)?

Results soon.

