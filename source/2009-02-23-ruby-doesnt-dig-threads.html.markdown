---
layout: post
alias: 2009/02/ruby-doesnt-dig-threads.html
---

Either I'm missing something, or threads in both MRI and YARV just plain suck. My test program goes through a 10 MB file of random data, splits it in chunks (either 1K, 10K or 100K each). The results for MRI show the threaded version is much slower (~2x), in YARV performance is similar but usually slower for the threaded version. Mind you, I'm running this on 4 cores! rubinius looks like YARV on a valium overdose (20x slower...). Only in JRuby are things like what I expected, i.e. similar performance or faster for threads, with the difference being noticeable with more processing.

<!-- more -->

Code is <a href="http://pastie.org/397635">here</a> , detailed timings follow...

```
# Ruby 1.8.6:
process 0x 10kB, straight 1.150229
process 0x 10kB, threaded 1.343492
process 1x 10kB, straight 1.930851
process 1x 10kB, threaded 3.011537
process 2x 10kB, straight 3.014654
process 2x 10kB, threaded 4.519649
process 0x 100kB, straight 1.128152
process 0x 100kB, threaded 1.143609
process 1x 100kB, straight 1.948754
process 1x 100kB, threaded 2.245689
process 2x 100kB, straight 3.074676
process 2x 100kB, threaded 3.432552
process 0x 1000kB, straight 1.199003
process 0x 1000kB, threaded 3.646992
process 1x 1000kB, straight 2.606668
process 1x 1000kB, threaded 2.177998
process 2x 1000kB, straight 3.316180
process 2x 1000kB, threaded 3.706851

# Ruby 1.9.1:
process 0x 10kB, straight 1.343889
process 0x 10kB, threaded 1.490538
process 1x 10kB, straight 6.292696
process 1x 10kB, threaded 8.079034
process 2x 10kB, straight 11.767741
process 2x 10kB, threaded 15.155683
process 0x 100kB, straight 1.336428
process 0x 100kB, threaded 1.332375
process 1x 100kB, straight 6.467645
process 1x 100kB, threaded 6.359540
process 2x 100kB, straight 11.821027
process 2x 100kB, threaded 12.117181
process 0x 1000kB, straight 1.435732
process 0x 1000kB, threaded 1.784891
process 1x 1000kB, straight 6.212079
process 1x 1000kB, threaded 5.921470
process 2x 1000kB, straight 11.803677
process 2x 1000kB, threaded 11.386862

# JRuby
process 0x 10kB, straight 1.535674
process 0x 10kB, threaded 1.418075
process 1x 10kB, straight 2.900337
process 1x 10kB, threaded 3.036711
process 2x 10kB, straight 4.266761
process 2x 10kB, threaded 3.064340
process 0x 100kB, straight 1.555573
process 0x 100kB, threaded 1.365277
process 1x 100kB, straight 2.408831
process 1x 100kB, threaded 2.718737
process 2x 100kB, straight 3.930232
process 2x 100kB, threaded 2.891176
process 0x 1000kB, straight 3.688882
process 0x 1000kB, threaded 4.970055
process 1x 1000kB, straight 5.632520
process 1x 1000kB, threaded 3.801846
process 2x 1000kB, straight 6.860399
process 2x 1000kB, threaded 3.964439

# Rubinus
process 0x 10kB, straight 2.621673
process 0x 10kB, threaded 2.921372
process 1x 10kB, straight 85.343156
process 1x 10kB, threaded 84.173440
process 2x 10kB, straight 167.755588
process 2x 10kB, threaded 163.454284
process 0x 100kB, straight 2.838818
process 0x 100kB, threaded 2.764404
process 1x 100kB, straight 84.900132
process 1x 100kB, threaded ^C^C^CI'm bored
```

Note: it's understandable that 1.9 is much slower than 1.8 because I process strings and only 1.9 deals with encoding

