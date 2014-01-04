---
layout: post
summary: A guide to making text in terminal more fun
---

If you use terminal on a daily basis I bet you played with some color settings at least once. Colorizing `ls` output, shell prompt, `git` logs - those are very common tasks. And it's not surprising as color helps us parse information faster, pay attention to important parts and generally makes things prettier. Everybody loves pretty things, especially the ones you have to look at every day.

This post is an attempt to gather in one place and structure things I know about colors in terminal.

### Escape sequences

You've probably seen things like `\e[32m` or `\x1b[1;31m`. These are [ANSI escape codes](http://en.wikipedia.org/wiki/ANSI_escape_code) used for defining a color. All ANSI escape sequences start with, well, `ESC`. There're several ways of encoding an `ESC`:

<div class="row">
  <div class="center-block" style="width: 50%; background-color: white;">
    <table class="table table-bordered">
      <tr>
	<th>Shell</th>
	<td><code>\e</code></td>
      </tr>
      <tr>
	<th>ASCII Hex</th>
	<td><code>\0x1B</code></td>
      </tr>
      <tr>
	<th>ASCII Oct</th>
	<td><code>\033</code></td>
      </tr>
    </table>
  </div>
</div>

So `\x1b[31;4m`, `\e[31;4m` and `\033[31;4m` are different ways to write the same sequence. Let's look at the structure of this sequence.

<svg xmlns="http://www.w3.org/2000/svg" class="center-block" width="50%" height="200px">
  <rect fill="white" stroke-width="2" />
  <text font-family="Verdana" font-size="14" y="40">
    <tspan fill="#4ECDC4" dx="75">Part of the CSI</tspan>
    <tspan fill="#FF6B6B" dx="40">Finishing symbol</tspan>
  </text>
  <polyline stroke="#4ECDC4" fill="none" stroke-width="3" points="105,60 105,50 135,50 135,60"/>
  <polyline stroke="#FF6B6B" fill="none" stroke-width="3" points="245,60 245,50 290,50 290,60"/>
  <text font-family="Verdana" font-size="45" y="100">
    <tspan fill="#556270">\x1b</tspan>
    <tspan fill="#4ECDC4" dx="-10">[</tspan>
    <tspan fill="#C7F464" dx="-10">31;4</tspan>
    <tspan fill="#FF6B6B" dx="-10">m</tspan>
  </text>
  <polyline stroke="#556270" fill="none" stroke-width="3" points="2,110 2,120 105,120 105,110"/>
  <polyline stroke="#C7F464" fill="none" stroke-width="3" points="135,110 135,120 245,120 245,110"/>
  <text font-family="Verdana" font-size="14" y="140">
    <tspan fill="#556270" dx="5">ESC character</tspan>
    <tspan fill="#556270" dx="-100" dy="20">in Hex ASCII</tspan>
    <tspan fill="#C7F464" dx="45" dy="-20">Color codes</tspan>
  </text>
</svg>

`\x1b[` is a **Control Sequence Introducer** that consists of hexadecimal ASCII `ESC` character code and a `[`.

`31;4` is a list of instructions separated by `;`. Usually this list is formatted as follows:

{% highlight bash %}
[<PREFIX>];[<COLOR>];[<TEXT DECORATION>]
{% endhighlight %}

For example `31;4` means "no prefix, color - red, underline". `<PREFIX>` is used for 256 color mode. More on color modes later.

Finally `m` indicates the end of control sequence so terminal would know not to interpret text after `m` as a color code.

The following command should print "hello" in red underscore text:

{% highlight bash %}
> echo "\x1b[31;4mHello\x1b[0m"
{% endhighlight %}

`\x1b[0m` means "reset all attributes".

### Color codes

Back in the old days terminals were different. Some of them could display only 16 colors and some of them went as far as 256. Now you probably work with a terminal emulator that runs on a machine that could display [more than 16 million colors](http://en.wikipedia.org/wiki/List_of_monochrome_and_RGB_palettes#24-bit_RGB). But as terminal applications emulate older terminals, they usually support far less colors. For example a terminal app could be set up with 16 colors support or 256 colors support. The exact values of those colors depend on a terminal's settings.

To list all available colors in 16-color mode run:

{% highlight bash %}
> for code in {30..37}; do \
echo -en "\e[${code}m"'\\e['"$code"'m'"\e[0m"; \
echo -en "  \e[$code;1m"'\\e['"$code"';1m'"\e[0m"; \
echo -en "  \e[$code;3m"'\\e['"$code"';3m'"\e[0m"; \
echo -en "  \e[$code;4m"'\\e['"$code"';4m'"\e[0m"; \
echo -e "  \e[$((code+60))m"'\\e['"$((code+60))"'m'"\e[0m"; \
done
{% endhighlight %}

You should see something like this:

<svg xmlns="http://www.w3.org/2000/svg" class="center-block" width="100%" height="220px">
  <rect height="220" fill="#333" width="100%"/>
  <text font-family="Verdana" font-size="14" y="30" x="20">
    <tspan fill="black">\e[30m</tspan>
    <tspan fill="red" dy="22" x="20">\e[31m</tspan>
    <tspan fill="green" dy="22" x="20">\e[32m</tspan>
    <tspan fill="yellow" dy="22" x="20">\e[33m</tspan>
    <tspan fill="blue" dy="22" x="20">\e[34m</tspan>
    <tspan fill="magenta" dy="22" x="20">\e[35m</tspan>
    <tspan fill="cyan" dy="22" x="20">\e[36m</tspan>
    <tspan fill="white" dy="22" x="20">\e[37m</tspan>
  </text>

  <text font-family="Verdana" font-size="14" y="30" x="95">
    <tspan fill="black" stroke="black">\e[30;1m</tspan>
    <tspan fill="red" dy="22" x="95" stroke="red">\e[31;1m</tspan>
    <tspan fill="green" dy="22" x="95" stroke="green">\e[32;1m</tspan>
    <tspan fill="yellow" dy="22" x="95" stroke="yellow">\e[33;1m</tspan>
    <tspan fill="blue" dy="22" x="95" stroke="blue">\e[34;1m</tspan>
    <tspan fill="magenta" dy="22" x="95" stroke="magenta">\e[35;1m</tspan>
    <tspan fill="cyan" dy="22" x="95" stroke="cyan">\e[36;1m</tspan>
    <tspan fill="white" dy="22" x="95" stroke="white">\e[37;1m</tspan>
  </text>

  <rect x="180" y="14" height="22" width="70" fill="black" />
  <rect x="180" y="36" height="22" width="70" fill="red" />
  <rect x="180" y="58" height="22" width="70" fill="green" />
  <rect x="180" y="80" height="22" width="70" fill="yellow" />
  <rect x="180" y="102" height="22" width="70" fill="blue" />
  <rect x="180" y="124" height="22" width="70" fill="magenta" />
  <rect x="180" y="146" height="22" width="70" fill="cyan" />
  <rect x="180" y="168" height="22" width="70" fill="white" />
  <text font-family="Verdana" font-size="14" y="30" x="180" fill="#222">
    <tspan>\e[30;3m</tspan>
    <tspan dy="22" x="180">\e[31;3m</tspan>
    <tspan dy="22" x="180">\e[32;3m</tspan>
    <tspan dy="22" x="180">\e[33;3m</tspan>
    <tspan dy="22" x="180">\e[34;3m</tspan>
    <tspan dy="22" x="180">\e[35;3m</tspan>
    <tspan dy="22" x="180">\e[36;3m</tspan>
    <tspan dy="22" x="180">\e[37;3m</tspan>
  </text>

  <text font-family="Verdana" font-size="14" y="30" x="275">
    <tspan fill="black" style="text-decoration:underline;">\e[30;4m</tspan>
    <tspan fill="red" dy="22" x="275" style="text-decoration:underline;">\e[31;4m</tspan>
    <tspan fill="green" dy="22" x="275" style="text-decoration:underline;">\e[32;4m</tspan>
    <tspan fill="yellow" dy="22" x="275" style="text-decoration:underline;">\e[33;4m</tspan>
    <tspan fill="blue" dy="22" x="275" style="text-decoration:underline;">\e[34;4m</tspan>
    <tspan fill="magenta" dy="22" x="275" style="text-decoration:underline;">\e[35;4m</tspan>
    <tspan fill="cyan" dy="22" x="275" style="text-decoration:underline;">\e[36;4m</tspan>
    <tspan fill="white" dy="22" x="275" style="text-decoration:underline;">\e[37;4m</tspan>
  </text>

  <text font-family="Verdana" font-size="14" y="30" x="365">
    <tspan fill="7e7e7e">\e[30m</tspan>
    <tspan fill="#ff7e7e" dy="22" x="365">\e[91m</tspan>
    <tspan fill="#7eff43" dy="22" x="365">\e[92m</tspan>
    <tspan fill="#ffff7e" dy="22" x="365">\e[93m</tspan>
    <tspan fill="#7e7eff" dy="22" x="365">\e[94m</tspan>
    <tspan fill="#ff7eff" dy="22" x="365">\e[95m</tspan>
    <tspan fill="#7effff" dy="22" x="365">\e[96m</tspan>
    <tspan fill="#eee" dy="22" x="365">\e[97m</tspan>
  </text>
</svg>

Or, in fact, something completely different! You can set up red to look like blue but I wouldn't recommend such a deception as it probably mess up some color themes in `bash`, `zsh` or anything else that runs in a terminal.

As you can see from command's output there're several sets of color codes:

<div class="row">
  <div class="center-block" style="width: 50%; background-color: white;">
    <table class="table table-bordered">
      <tr>
		<th>Basic 8 colors</th>
		<td>30..37</td>
      </tr>
      <tr>
		<th>Basic "high contrast" colors</th>
		<td>90..97</td>
      </tr>
      <tr>
		<th>xterm-256 colors</th>
		<td>0..255</td>
      </tr>
    </table>
  </div>
</div>

And a set of text decoration indicators that should be placed right after the color code:

<div class="row">
  <div class="center-block" style="width: 50%; background-color: white;">
    <table class="table table-bordered">
      <tr>
		<th>Bold</th>
		<td>1</td>
      </tr>
      <tr>
		<th>Underscore</th>
		<td>4</td>
      </tr>
      <tr>
		<th>Background</th>
		<td>3</td>
      </tr>
    </table>
  </div>
</div>

If color code is prefixed by `38;5` it is interpreted as one of 256 colors. E.g. `\e[38;5;91m` will color following text purple, while `\e[91m` will indicate bright red.

There're several 256 color palettes out there. For example, a couple of the popular ones are [Web safe colors](http://en.wikipedia.org/wiki/Web_colors#Web-safe_colors) and [X11 colors](http://en.wikipedia.org/wiki/X11_color_names). And though they're both include 256 colors, they're two different palettes!

To enable 256 colors support, you have to set up your terminal as `xterm-256color` (in `iTerm2` go to **Preferences** > **Profiles** > **Terminal** > **Report Terminal Type** and put `xterm-256color` into the field). The set of colors you'll get is [xterm-256 pallete](http://en.wikipedia.org/wiki/File:Xterm_256color_chart.svg). In some places, like Mac OSX default color picker, this palette is called "emacs", though it doesn't have anything to do with Emacs.

To list all colors available in 256 color mode with their codes run

{% highlight bash %}
> for code in {0..255}; do echo -e "\e[38;5;${code}m"'\\e[38;5;'"$code"m"\e[0m"; done
{% endhighlight %}

**Bonus**: To list all colors available in `Emacs` run `M-x list-colors-display`.
