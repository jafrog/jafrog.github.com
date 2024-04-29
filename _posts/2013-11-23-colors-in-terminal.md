---
layout: post
summary: A guide to making text in terminal more fun
highlighter: rouge
---
If you use terminal on a daily basis I bet you played with some color settings at least once. Colorizing `ls` output, shell prompt, `git` logs - those are very common tasks. And it's not surprising as color helps us parse information faster, pay attention to important parts and generally makes things prettier. Everybody loves pretty things, especially the ones you have to look at every day.

This post is an attempt to gather in one place and structure things I know about colors in terminal.

### Escape sequences

You've probably seen things like `\e[32m` or `\x1b[1;31m`. These are [ANSI escape codes](http://en.wikipedia.org/wiki/ANSI_escape_code) used for defining a color. All ANSI escape sequences start with, well, `ESC`. There're several ways of encoding an `ESC`:

<div class="width-full flex justify-center">
    <table class="table-auto my-5">
        <tbody>
            <tr>
                <td class="font-semibold py-3">Shell</td>
                <td class="pl-5"><code>\e</code></td>
            </tr>
            <tr>
                <td class="font-semibold py-3">ASCII Hex</td>
                <td class="pl-5"><code>\0x1B</code></td>
            </tr>
            <tr>
                <td class="font-semibold py-3">ASCII Oct</td>
                <td class="pl-5"><code>\033</code></td>
            </tr>
        </tbody>
    </table>
</div>

So `\x1b[31;4m`, `\e[31;4m` and `\033[31;4m` are different ways to write the same sequence. Let's look at the structure of this sequence.

<div class="w-full flex justify-center py-5">
    <svg xmlns="http://www.w3.org/2000/svg" width="350px" height="200px">
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
</div>

`\x1b[` is a **Control Sequence Introducer** that consists of hexadecimal ASCII `ESC` character code and a `[`.

`31;4` is a list of instructions separated by `;`. Usually this list is formatted as follows:

```bash
[<PREFIX>];[<COLOR>];[<TEXT DECORATION>]
```

For example `31;4` means "no prefix, color - red, underline". `<PREFIX>` is used for 256 color mode. More on color modes later.

Finally `m` indicates the end of control sequence so terminal would know not to interpret text after `m` as a color code.

The following command should print "hello" in red underscore text:

```bash
> echo "\x1b[31;4mHello\x1b[0m"
```

`\x1b[0m` means "reset all attributes".

### Color codes

Back in the old days terminals were different. Some of them could display only 16 colors and some of them went as far as 256. Now you probably work with a terminal emulator that runs on a machine that could display [more than 16 million colors](http://en.wikipedia.org/wiki/List_of_monochrome_and_RGB_palettes#24-bit_RGB). But as terminal applications emulate older terminals, they usually support far less colors. For example a terminal app could be set up with 16 colors support or 256 colors support. The exact values of those colors depend on a terminal's settings.

To list all available colors in 16-color mode run:

```bash
> for code in {30..37}; do \
echo -en "\e[${code}m"'\\e['"$code"'m'"\e[0m"; \
echo -en "  \e[$code;1m"'\\e['"$code"';1m'"\e[0m"; \
echo -en "  \e[$code;3m"'\\e['"$code"';3m'"\e[0m"; \
echo -en "  \e[$code;4m"'\\e['"$code"';4m'"\e[0m"; \
echo -e "  \e[$((code+60))m"'\\e['"$((code+60))"'m'"\e[0m"; \
done
```

You should see something like this:

<div class="w-full flex justify-center py-5">
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="300px">
  <rect height="300" fill="#fff" width="100%"/>
  <text font-family="Verdana" font-size="20" y="50" x="20">
    <tspan fill="black">\e[30m</tspan>
    <tspan fill="red" dy="30" x="20">\e[31m</tspan>
    <tspan fill="green" dy="30" x="20">\e[32m</tspan>
    <tspan fill="yellow" dy="30" x="20">\e[33m</tspan>
    <tspan fill="blue" dy="30" x="20">\e[34m</tspan>
    <tspan fill="magenta" dy="30" x="20">\e[35m</tspan>
    <tspan fill="cyan" dy="30" x="20">\e[36m</tspan>
    <tspan fill="white" dy="30" x="20">\e[37m</tspan>
  </text>

  <text font-family="Verdana" font-size="20" y="50" x="110">
    <tspan fill="black" stroke="black" x="110">\e[30;1m</tspan>
    <tspan fill="red" dy="30" x="110" stroke="red">\e[31;1m</tspan>
    <tspan fill="green" dy="30" x="110" stroke="green">\e[32;1m</tspan>
    <tspan fill="yellow" dy="30" x="110" stroke="yellow">\e[33;1m</tspan>
    <tspan fill="blue" dy="30" x="110" stroke="blue">\e[34;1m</tspan>
    <tspan fill="magenta" dy="30" x="110" stroke="magenta">\e[35;1m</tspan>
    <tspan fill="cyan" dy="30" x="110" stroke="cyan">\e[36;1m</tspan>
    <tspan fill="white" dy="30" x="110" stroke="white">\e[37;1m</tspan>
  </text>

  <rect x="215" y="30" height="30" width="110" fill="black" />
  <rect x="215" y="60" height="30" width="110" fill="red" />
  <rect x="215" y="90" height="30" width="110" fill="green" />
  <rect x="215" y="120" height="30" width="110" fill="yellow" />
  <rect x="215" y="150" height="30" width="110" fill="blue" />
  <rect x="215" y="180" height="30" width="110" fill="magenta" />
  <rect x="215" y="210" height="30" width="110" fill="cyan" />
  <rect x="215" y="240" height="30" width="110" fill="white" />
  <text font-family="Verdana" font-size="20" y="50" x="220" fill="#222">
    <tspan>\e[30;3m</tspan>
    <tspan dy="30" x="220">\e[31;3m</tspan>
    <tspan dy="30" x="220">\e[32;3m</tspan>
    <tspan dy="30" x="220">\e[33;3m</tspan>
    <tspan dy="30" x="220">\e[34;3m</tspan>
    <tspan dy="30" x="220">\e[35;3m</tspan>
    <tspan dy="30" x="220">\e[36;3m</tspan>
    <tspan dy="30" x="220">\e[37;3m</tspan>
  </text>

  <text font-family="Verdana" font-size="20" y="50" x="335">
    <tspan fill="black" style="text-decoration:underline;">\e[30;4m</tspan>
    <tspan fill="red" dy="30" x="335" style="text-decoration:underline;">\e[31;4m</tspan>
    <tspan fill="green" dy="30" x="335" style="text-decoration:underline;">\e[32;4m</tspan>
    <tspan fill="yellow" dy="30" x="335" style="text-decoration:underline;">\e[33;4m</tspan>
    <tspan fill="blue" dy="30" x="335" style="text-decoration:underline;">\e[34;4m</tspan>
    <tspan fill="magenta" dy="30" x="335" style="text-decoration:underline;">\e[35;4m</tspan>
    <tspan fill="cyan" dy="30" x="335" style="text-decoration:underline;">\e[36;4m</tspan>
    <tspan fill="white" dy="30" x="335" style="text-decoration:underline;">\e[37;4m</tspan>
  </text>

  <text font-family="Verdana" font-size="20" y="50" x="445">
    <tspan fill="7e7e7e">\e[30m</tspan>
    <tspan fill="#ff7e7e" dy="30" x="445">\e[91m</tspan>
    <tspan fill="#7eff43" dy="30" x="445">\e[92m</tspan>
    <tspan fill="#ffff7e" dy="30" x="445">\e[93m</tspan>
    <tspan fill="#7e7eff" dy="30" x="445">\e[94m</tspan>
    <tspan fill="#ff7eff" dy="30" x="445">\e[95m</tspan>
    <tspan fill="#7effff" dy="30" x="445">\e[96m</tspan>
    <tspan fill="#eee" dy="30" x="445">\e[97m</tspan>
  </text>
</svg>
</div>

Or, in fact, something completely different! You can set up red to look like blue but I wouldn't recommend such a deception as it probably mess up some color themes in `bash`, `zsh` or anything else that runs in a terminal.

As you can see from command's output there are several sets of color codes:

<div class="width-full flex justify-center my-5">
    <table class="table table-bordered">
      <tr>
        <td class="font-semibold py-3">Basic 8 colors</td>
        <td class="pl-5">30..37</td>
      </tr>
      <tr>
        <td class="font-semibold py-3">Basic "high contrast" colors</td>
        <td class="pl-5">90..97</td>
      </tr>
      <tr>
        <td class="font-semibold py-3">xterm-256 colors</td>
        <td class="pl-5">0..255</td>
      </tr>
    </table>
</div>

And a set of text decoration indicators that should be placed right after the color code:

<div class="width-full flex justify-center my-5">
    <table class="table table-bordered">
      <tr>
        <td class="font-semibold py-3">Bold</td>
        <td class="pl-5">1</td>
      </tr>
      <tr>
        <td class="font-semibold py-3">Underscore</td>
        <td class="pl-5">4</td>
      </tr>
      <tr>
        <td class="font-semibold py-3">Background</td>
        <td class="pl-5">3</td>
      </tr>
    </table>
</div>

If color code is prefixed by `38;5` it is interpreted as one of 256 colors. E.g. `\e[38;5;91m` will color following text purple, while `\e[91m` will indicate bright red.

There're several 256 color palettes out there. For example, a couple of the popular ones are [Web safe colors](http://en.wikipedia.org/wiki/Web_colors#Web-safe_colors) and [X11 colors](http://en.wikipedia.org/wiki/X11_color_names). And though they're both include 256 colors, they're two different palettes!

To enable 256 colors support, you have to set up your terminal as `xterm-256color` (in `iTerm2` go to **Preferences** > **Profiles** > **Terminal** > **Report Terminal Type** and put `xterm-256color` into the field). The set of colors you'll get is [xterm-256 pallete](http://en.wikipedia.org/wiki/File:Xterm_256color_chart.svg). In some places, like Mac OSX default color picker, this palette is called "emacs", though it doesn't have anything to do with Emacs.

To list all colors available in 256 color mode with their codes run

```bash
> for code in {0..255}
    do echo -e "\e[38;5;${code}m"'\\e[38;5;'"$code"m"\e[0m"
  done
```

**Bonus**: To list all colors available in `Emacs` run `M-x list-colors-display`.
