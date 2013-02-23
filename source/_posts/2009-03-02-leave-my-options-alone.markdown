---
layout: post
---

Let me start by asking you a small quiz:

``` ruby
# Will there be any difference between the output of:

<% content_tag_for(:tr, Foo.new, :class => "css_class") do %>
...<% end %>
<% content_tag_for(:tr, Bar.new, :class => "css_class") do %>
...<% end %>

# and the output of:

<%- @style = {:class => "css_class"} -%>
<% content_tag_for(:tr, Foo.new, @style) do %>
...<% end %>
<% content_tag_for(:tr, Bar.new, @style) do %>
...<% end %>

# ?
```

If you answered "Nope", congratulations, you're a normal, sane human being. I like you. Anyone answering "Yup" is either slightly crazy, guessed that I wasn't asking a trivial question (or both?). Because indeed, the output is <i>different</i>. Why? Because the first `content_tag_for` modifies `@style[:class]` argument.

You're probably not expecting yet another apparently trivial question, but here goes: <i>is this a bug</i>?

If you had to bet about my opinion, your 5 bucks would be safe on "yeah, it's a bug". But I can't really say that it <i>is</i> a bug. I've never read anywhere that options won't be modified. It's (of course) not specified in the doc of `content_tag_for`. It's generally not stated what happens when you pass an unrecognized option, so forget about things like that. I'm not aware of any official general rule of rails. I doubt there is one, because I can find many places where options are modified (e.g. `error_message_on, truncate, highlight, excerpt, word_wrap`, ...). These other examples, though, won't modify the options in a harmful way. Indeed, writing:

`@options.reverse_merge!(:foo => "default_bar")`

will not cause a problem like the one I just showed (unless anything else relies on options[:foo] being left unspecified).

``` ruby
# If this works:

truncate("hello", {:length => 4})

# Shouldn't this work too?

truncate("hello", {:length => 4}.freeze)
```

They won't enable you to pass a frozen hash, though. Do you freeze your constants? I like freezing things. I freeze my constants, I freeze my settings, I freeze everything I can. And it upsets me when I can't pass a frozen options. <i>Is this a bug too</i>?

Unless I'm mistaken, the current stance is that options passed can be changed, tortured and abused as much as the implementation desires and god damn it, check the source if you care.

I believe rails should take a clear and reasonable stance on options. I can think of two:

1) options can be modified, but only in a way that is independent on any other arguments or internal state.

2) options will never be modified.

`truncate` would be considered buggy only if the second stance is taken, while `content_tag_for`, as in my example, would be buggy under either positions, since it depends on the class of the second argument.

My personal vote goes for the second stance: leave my options alone!

