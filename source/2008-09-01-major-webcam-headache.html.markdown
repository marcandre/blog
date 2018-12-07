---
layout: post
title: "Major Webcam Headache"
alias: 2008/09/major-webcam-headache.html
---
I'm lost at sea. I've spent hours reading, installing, testing and I still can't see how I'll achieve my goal. It's quite simple, really. I want to build a website that will allow me to:

- record video using a webcam (flash)

- concatenate such videos (ideally with videos of other formats)

- be completely automated, using any combination of linux servers (on ec2) and commercial hosts if needed.

<!-- more -->

After a bit of research, I thought this would be pretty easy.

- red5 is a cross platform solution to enable video recording. Alternative solutions would be Wowza or a hosted solution like influxis.com/uvault/...

- ffmpeg is a cross platform tool that can deal with flv and other formats; there's also mencoder that could help.

I didn't find installation easy, but managed to have everything running both on my Mac and on Ubuntu. Where things fail miserably though:

<ol><li>I can't get a flv recorded with a fixed frame rate</li><li>I have problems concatenating flvs</li></ol>

<span style="font-size:180%;">Problem 1</span>

I <span style="font-weight: bold;">do</span> manage to record flvs. The beginning is always "jumpy" for some reason. If I play them back in Wimpy FLV Player, it plays alright, but the progress indicator doesn't move smoothly or in a regular fashion.

If it plays OK, why should I worry about the progress indicator? The problem is that I can't seem to transcode it to anything else using ffmpeg.

A naive "ffmpeg -i input.flv output.avi" will not work because the frame rate is wrong (1000.0). If I specify 15 fps explicitely by using "ffmeg -i input.flv -r 15 output.avi", the visual is not synchronized properly with the audio because of the beginning part.

I tried multiple other techniques of recording and always some kind of problem at the beginning of the flv:

<ul><li>a) Using red5 (v 0.6.3 and 0.7.0, both on OS X 10.5.4 and Ubuntu 8.04) and the publisher.html example it includes. Here's the <a href="http://www.marc-andre.ca/posts/blog/webcam/test-red5-publisher.flv">resulting flv</a>.</li><li>b) Still using red5, but publishing "live" and starting the recording after a couple of seconds. I used <a href="http://sziebert.net/posts/server-side-stream-recording-with-red5/">these example files</a>. Here's the <a href="http://www.marc-andre.ca/posts/blog/webcam/test-red5-live-sziebert.flv">resulting flv</a>. The indicator still jumps to the end very rapidly, no sound at all with this method...</li><li>c) Using Wowza Media Server Pro (v 1.5.3, on my mac). The progress indicator doesn't jump to the end, but it moves more quickly at the very beginning, so the visual is not synchronized properly with the audio because of the beginning part. Just to be sure I tried the <a href="http://www.marc-andre.ca/posts/blog/webcam/test-wowza.flv">video recorder that comes with it</a>, as well as <a href="http://www.marc-andre.ca/posts/blog/webcam/test-wowza-publisher.flv">red5's publisher</a> (with identical results).</li><li>d) Using Flash Media Server 3 via <a href="http://www.influxis.com/">www.influxis.com</a>. I get yet another progression pattern. The progress indicator jumps a bit a the beginning and then becomes regular. Here's <a href="http://www.marc-andre.ca/posts/blog/webcam/test-influxis.flv">an example</a>.</li></ul>I know it <span style="font-style: italic;">is</span> possible to record a "flawless" flv because facebook's video application do it (using red5?) Indeed, it's easy to look at the HTML source of facebook video and get the http URL to download the Flvs they produce. When played back in Wimpy, the progress indicator is smooth, and transcoding "ffmeg -i facebook.flv facebook.avi" produces a good avi. Here's <a href="http://www.marc-andre.ca/posts/blog/webcam/test-facebook.flv">an example</a>.

<span style="font-size:180%;">Problem 2</span>

OK, that should be easy enough, right? There's even a full code example in the <a href="http://ffmpeg.mplayerhq.hu/faq.html#SEC31">ffmpeg FAQ</a>.

Well, pipes seem to be giving me problems, so let's keep it simple and use normal files. Also, if I don't specify a rate of 15 fps, the visual part becomes <a href="http://www.marc-andre.ca/posts/blog/webcam/output-norate.flv">extremely fast</a>. Let's make it easier and simply try to concatenate the same 'input.flv' to itself instead of dealing with two different inputs. The example script thus becomes:

```shell
ffmpeg -i input.flv -vn -f u16le -acodec pcm_s16le -ac 2 -ar 44100 \

     - > temp.a < /dev/null ffmpeg -i input.flv -an -f yuv4mpegpipe - > temp.v < /dev/null cat temp.v temp.v > all.v

cat temp.a temp.a > all.a

ffmpeg -f u16le -acodec pcm_s16le -ac 2 -ar 44100 -i all.a \

    -f yuv4mpegpipe -i all.v \

    -sameq -y output.flv</blockquote>Well, using this will work for the audio, but I only get the video the first time around. This seems to be the case for any flv I throw as input.flv, including the clean facebook one.
```

a) Why doesn't the example script work as advertised, in particular why do I not get all the video I'm expecting?

b) Why do I have to specify a framerate while Wimpy player can play the flv at the right speed?

The only way I found to concatenate two flvs was to use mencoder. Problem is, mencoder doesn't seem to concat flvs:

```shell
mencoder input.flv input.flv -o output.flv -of lavf -oac copy \

   -ovc lavc -lavcopts vcodec=flv
```

I get a Floating point exception...

```shell
MEncoder 1.0rc2-4.0.1 (C) 2000-2007 MPlayer Team
CPU: Intel(R) Xeon(R) CPU            5150  @ 2.66GHz (Family: 6, Model: 15, Stepping: 6)
CPUflags: Type: 6 MMX: 1 MMX2: 1 3DNow: 0 3DNow2: 0 SSE: 1 SSE2: 1
Compiled for x86 CPU with extensions: MMX MMX2 SSE SSE2
success: format: 0  data: 0x0 - 0x45b2f
libavformat file format detected.
[flv @ 0x697160]Unsupported audio codec (6)
[flv @ 0x697160]Could not find codec parameters (Audio: 0x0006, 22050 Hz, mono)
[lavf] Video stream found, -vid 0
[lavf] Audio stream found, -aid 1
VIDEO:  [FLV1]  240x180  0bpp  1000.000 fps    0.0 kbps ( 0.0 kbyte/s)
[V] filefmt:44  fourcc:0x31564C46  size:240x180  fps:1000.00  ftime:=0.0010
** MUXER_LAVF *****************************************************************
REMEMBER: MEncoder's libavformat muxing is presently broken and can generate
INCORRECT files in the presence of B frames. Moreover, due to bugs MPlayer
will play these INCORRECT files as if nothing were wrong!
*******************************************************************************
OK, exit
Opening video filter: [expand osd=1]
Expand: -1 x -1, -1 ; -1, osd: 1, aspect: 0.000000, round: 1
==========================================================================
Opening video decoder: [ffmpeg] FFmpeg's libavcodec codec family
Selected video codec: [ffflv] vfm: ffmpeg (FFmpeg Flash video)
==========================================================================
audiocodec: framecopy (format=6 chans=1 rate=22050 bits=16 B/s=0 sample-0)
VDec: vo config request - 240 x 180 (preferred colorspace: Planar YV12)
VDec: using Planar YV12 as output csp (no 0)
Movie-Aspect is undefined - no prescaling applied.
videocodec: libavcodec (240x180 fourcc=31564c46 [FLV1])
VIDEO CODEC ID: 22
AUDIO CODEC ID: 10007, TAG: 0
Writing header...
[NULL @ 0x67d110]codec not compatible with flv
Floating point exception
```

c) Is there a way for mencoder to decode and encode flvs correctly?

So the only way I've found so far to concat flvs, is to use ffmpeg to go back and forth between flv and avi, and use mencoder to concat the avis:

```shell
ffmpeg -i input.flv -vcodec rawvideo -acodec pcm_s16le -r 15 file.avi
mencoder -o output.avi -oac copy -ovc copy -noskip file.avi file.avi
ffmpeg -i output.avi output.flv
```

d) There must be a better way to achieve this... Which one?

Because of the problem of the framerate, though, only "clean" flvs (like facebook's) will be converted correctly to avis.

Any help would be very appreciated.

<span style="font-weight:bold;">Update</span>

I came to the conclusion that there is no existing solution, so I rolled my own. I'll release flvedit soon, but if you need to join FLVs before 'soon', you can let me know!

