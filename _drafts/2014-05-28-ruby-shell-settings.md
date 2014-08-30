---
layout: post
summary: You can set up some handy variables in special dotfile for your Ruby shell.
---

Every application related to text editing has at least some ways of making this process faster, easier & less frustrating. Nobody loves typing the same thing many times over, so here's autocomplete. Nobody likes holding Backspace for too long so in most text processors if you hit <kbd>Alt</kbd>+<kbd>Backspace</kbd> it will delete the whole previous word.

Shells like zsh or bash and Ruby shells are not exceptions. They have lots of tools for making workflow more efficient. For example <kbd>Ctrl</kbd>+<kbd>a</kbd> for moving to the beginning of a string and <kbd>Ctrl</kbd>+<kbd>e</kbd> for moving to an end are likely to work the same way in all mentioned shells.

Although the behaviour is similar different shells use different libraries for translating keystrokes to meaningfull actions.

zsh uses it's own library - [ZLE](http://bolyai.cs.elte.hu/zsh-manual/zsh_14.html#SEC45). bash, irb and pry use whatever the library they were compiled with. One of the most common is [GNU Readline](http://cnswww.cns.cwru.edu/php/chet/readline/rluserman.html#SEC14).

It's worth metioning that OS X comes with it's own library [libedit](http://thrysoee.dk/editline/), similar to Readline. Hovewer if you install Ruby on OS X using [rbenv](https://github.com/sstephenson/rbenv) or [chruby](https://github.com/postmodern/chruby) it will probably compile with Readline library from Homebrew.

### Readline keybindings

[Readline page](http://cnswww.cns.cwru.edu/php/chet/readline/rluserman.html#SEC14) has a very comprehensive list of possible keybindings and commands

C-f, C-b, C-a, C-e

M-f, M-b

Shift-R for history (super-handy)

## .inputrc

vi editing mode

command bindings

Also, .editrc for libedit
