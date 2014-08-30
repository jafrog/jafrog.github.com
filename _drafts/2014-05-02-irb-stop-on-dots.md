---
layout: post
title: Word delimiters for Ruby REPL
summary: How IRB and Pry interpret keybindings and how to customize REPL's edit behaviour.
---

### Ruby shell's edit capabilities

When you use REPL extensively it's nice to know what commands & shortcuts it has for line editing. To begin with, Ruby shells come with built-in support for Emacs-like key bindings. So does any serious shell, like zsh or bash. `C-f` for "forward-char", `M-f` for "forward-word" & `C-e` for "move to the end of the line" are just a few of available shortcuts. (TODO: insert link to the whole list) Also Ruby shell could be set up to use vi-mode editing, but more on that later.

Key bindings like `M-f`of `M-b` (backward-word) especially come in handy when you've just typed something like `User.acitve.premium.recent`, discovered that you've misspelled "active" and all <kbd>Alt-&#8592;</kbd> does is insert a weird symbol.

What would you like to do now is to hit `C-a` to get to the beginning of the line, hit `M-f` to get to the end of the word "User", press `M-d` to remove following word and retype it. Sounds like a lot of actions but it's really faster and much less annoying than just holding Backspace and retyping the rest of the line.

So far so good. The trouble starts when you're at the beginning of the line and `M-f` doesn't get you to the next word like this:

{% include posts/editline/m-f-good.html %}

but jumps to the end of the line instead:

{% include posts/editline/m-f-bad.html %}

Here I finally get to the point. IRB or Pry doesn't think of dots as word delimiters. Emacs does, zsh does, but Ruby shells don't. Why is that? How exactly do they decide what goes to word separators list and what doesn't?

### Why M-f & M-b behave like they do

When you type something into any interactive shell one of the special line edit libraries takes care of translating keypresses to something meaninful e.g. characters or coutsor movements. One of the most popular line editing libraries is [GNU Readline](http://cnswww.cns.cwru.edu/php/chet/readline/rltop.html) library.

### libedit for OSX, readline for Linux

GNU readline is for Linux, [libedit](http://thrysoee.dk/editline/) is for Mac OS. [ZLE](http://bolyai.cs.elte.hu/zsh-manual/zsh_14.html#SEC45) for zsh

Ruby compiles with OS lib - libedit on Mac OS

### `.editrc`

man editrc

`bind -e` for Emacs keybindings

`bind M-f vi-next-word` - binds `M-f` to `vi-next-word` function. Mostly the same as `em-next-word` (different behaviour when coursor is on a dot)
`bind M-b vi-prev-word`

### How to change what's counted as "word" in .editrc
