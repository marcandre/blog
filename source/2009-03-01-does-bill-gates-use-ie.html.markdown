---
layout: post
title: "Does Bill Gates use IE?"
alias: 2009/03/does-bill-gates-use-ie.html
---

Anyone who knows me personally is bound to know that I despise Windows (and Internet Explorer among other Microsoft products). I'm the first to admit that my hatred borders on irrationality. The fact that I'm a complete newbie on Windows probably doesn't help either. I can count on my fingers the number of hours I spent playing/cursing on windows. That being said, every single time I have to use windows, I always wonder: does Bill Gates uses it? What's his reaction to all those things that pop-up? Does he browse on Internet Explorer? Does he ever wonder if he just clicked properly and something is happening, or if the computer is just waiting for another click?

<!-- more -->

Couple of weeks ago, I was staying with my best friend's family in the middle of the French Alps. They had internet through the owner's extremely paranoid device that not only requires a password to join the network but also needed a physical acknowledgment to allow the MAC address. I didn't insist to have my trusty PowerBook blessed and instead accessed my mail with their Dell on Windows XP.

First task: browse. This was a machine owned by a reasonably technical person; Firefox was installed and the little keyboard gizmo was already there, giving me a quick way to switch from the french AZERTY keyboard to the US QWERTY. Side note: If anyone knows of a single reasonable motivation for changing the base layout for any latin language, please enlighten me!<a href="#dvorak"><sup>1</sup></a> Anyways, that's not Microsoft's fault and I'm glad I could switch easily. Well, most of the time. Sometimes I'd switch and the 'FR' just wouldn't budge. Repeat, still no change. Again... still no change. After 5 or 6 attempts, woo-hoo, it changes. Another time it would change visually (the gizmo says 'EN') but the layout used when I entered text was still wrong. The menu disappeared altogether once. What am I supposed to do then?

Note that even if it worked more than half of the time, I'd still rant about the design lunacy of having this setting be <span style="font-style: italic;">per application</span>. Why didn't they make the only reasonable choice of a <span style="font-style: italic;">per session</span> setting? Beats me. Luckily for me, I didn't have to really use any other application besides Firefox.

Of course, I gave up entirely on typing any accents in my emails since I don't know the dozen of 3-digit codes I'd need. Did you know that on any mac you can type all special symbols with easily remembered keys, like `alt-c` for ç and ``alt-` `` + `a,e,u` for à,è,ù... ? That holding the shift key will yield the uppercase version, like `alt-shift-c` for Ç, and ``alt-` `` + `A` for À, ... ? That Apple introduced this... 25 years ago? Before Windows even existed? Bonus point if you know the alt-code for É!

OK. Second task: Testing my luck, I thought uploading photos to Facebook would be fun. Alas when copying the photos from the USB keys, the machine would freeze about one time out of three. Better than my old compact flash adapter that would make any PC reboot when the card was 4 GB or bigger, but still! The reboot time was really long; actually most everything took forever. My five-year old powerbook was da-bomb compared to it. It took ages to copy everything to the Dell and I was finally able to upload stuff to Facebook.

After a couple of days, my website on Amazon EC2 froze and I then really wanted to have internet on my machine. We found an ethernet cable (note to self: always pack one) and enabled the internet sharing on the Dell. I would not have been able to find it myself, mind you. My friend Pascal showed me the intricate way<a href="#windows_internet_sharing"><sup>2</sup></a>. I'm still glad it was there at all! Like the keyboard switching, it would work a bit less than half the time. When it didn't work, I had to go back in the settings, turn if off, click OK, wait for the window to close (~10 seconds), click 'Advanced' again, turn it on, click OK, wait some more (~ 1 minute!), and that would do the trick (most of the time, otherwise goto 10).

So back to my original thought: does Bill Gates use his computer at all? Presumably, he doesn't change the keyboard layout a lot, type in french much, need to share an internet connection, or about anything worthwhile? Or else wouldn't he see it doesn't work properly? He must have the power to fix anything he wants, no? Even if he had to pay from his own pocket to have it fixed, what would it represent for him? He can buy 10 condos like mine, everyday, for the rest of his life without running out of money. If you had this money and power, wouldn't you say "ok, I'll just get that fixed"? Forget about making profits, forget about making things better for the planet. "Just fix it for me, yesterday, thank you very much".

Note: I'll try not to make more than one (or two?) rants against Microsoft per year!

<div class="footnote">

<a name="dvorak">1</a> Introduction of new letters (é, ß, ...) justify changes to the overall layout but I'm wondering why the common 26 letters couldn't stay put. Geeks could still curse because the needed symbols [} and such would be placed differently, but for normal needs, there would be a common ground. Let's thus focus on changes to letters only. One of the changes between the AZERTY and the QWERTY is a swap between the W and Z. These two letters are the two least frequently used in french. Ergo this is <b>the</b> swap, among all 325 possible swaps (ignoring the zillions longer permutations), that will yield the least noticeable gain in efficiency! I leave the trivial proof as an exercise to the reader :-)

If the most popular keyboard layout was <a href="http://en.wikipedia.org/wiki/Dvorak_Simplified_Keyboard">Dvorak</a>, I could see how a reasonable way to keep the layout optimized would yield different layouts depending on the language. The fact is, QWERTY is quite far from being optimized in any rational way. It's reputed to have been designed to insure that successive letters wouldn't jam a typewriter. I call BS. The most frequent pairs of letters in english are th, he, an, re, er, in, on, at, nd, st, es, en, of, te, ed, or, ti, hi, as, to (<a href="http://www.sxlist.com/techref/method/compress/etxtfreq.htm">source</a>). You'll notice that almost half of these are more or less adjacent (`th, re, er, in, es, te, ed, as`) while Dvorak has only `th, st` and `hi` that are (and the latter still fits Dvorak's goals.) So not only is the "official" optimization practically obsolete, it's not even footing the bill. Anyways, all that to say:

<ul><li>QWERTY is a terrible layout in english</li><li>it's not clear if it is worse in french or other latin languages, but small changes won't lead to any noticeable gain and will confuse any globetrotter</li></ul>Why, oh why, are we stuck in a world where not only do we use a bad layout, but we can't stick with that bad layout for most latin languages that use A-Z?


<a name="windows_internet_sharing">2</a> On XP, it is:

Control Panels -> Network Connections -> Local Area Connection -> Properties -> Advanced -> click on 'Allow area other network's users to connect through this computers' internet connection' -> OK

Compare that to OS X:

System Preferences -> Sharing -> click on 'Internet Sharing'

Not only will you notice that the number of operations is more than double on XP, but the choices to make are more difficult. On the mac, the only non trivial choice is between 'Network' and 'Sharing'. On Windows, your first choice is between 'Network Connections' vs 'Internet Options' (and hesitation with 'Network Setup Wizard' and 'Wireless Network Setup Wizard'). Since control panels are not grouped like on the mac, you have to consider all of them, if you don't know what the answer is. On the mac, there are only 2 other possibilities under 'Internet &amp; Network' besides 'Network' and 'Sharing'.

Then you have to select the currently active internet connection. It is the most probable choice but it's not obvious which connection is the currently active one! Finally, you have to think of looking in the 'advanced' tab.

Undoubtably, the most important difference is that on the mac... it works.

</div>

Thanks to Pascal for his comments on my first draft.

