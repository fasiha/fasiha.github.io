---
banner: "durer-melencolia-1.jpg"
date: "2024-03-09T03:37:32.843Z"
title: "“What do you dislike about programming?”"
description: "Someone asked: as someone who programs for work and as a hobby, what do you dislike about programming?"
tags: [code]
---

Someone recently asked me, “You’re someone who enjoys programming a lot, you do it for work and on the side. What do you _dislike_ about programming?”

I think about this quite a lot. Here are two things I _know_ we are doing wrong.

## §1 psychology

There are deep _psychological_ differences between programmers—even those working in the same niche—and not understanding these leads to a lot of waste and frustration.

In 2021 Jan 30, [Dan Luu](https://mastodon.social/@danluu) shared a thread by [Brian Marick](https://mstdn.social/@marick) a few days earlier that radicalized me into this position. Marick wrote:

> ‘I’d really really like to sit side by side with someone fluent in repl-based development and compare it to what I do. It _seems_ to me that what I’m doing is comparable to using the repl, except more structured. Which is useful to me because of my bad memory. [After watching the video…] Interesting. My main conclusion is that you’re a better programmer than I am: you can hold a lot more, um, “nested goals” in your head than I can, and are less reliant on names to counteract a short goal stack and bad short-term memory. For example, I would have needed to break out the two anonymous functions in `next-state` into named functions, just to keep my intentions clear.’

Dan reflects,

> ‘I find this thread [above] interesting because it’s one of the few times I’ve seen a public discussion of programming style drill down to differences in skills or aptitudes. When I’ve compared notes with friends, it often comes down to these. … People with all of:
>
> 1. large working memory
> 2. fast typing
> 3. fast bulk editing (e.g., via emacs macros)
>
> often don’t mind high-boilerplate languages and often don’t find “I could write that in 100 LOC in language X” compelling. They’ll just write 500 LOC.’ (Original on, ugh, [Twitter](https://twitter.com/danluu/status/1355316226730287105))

(Translations for the civilians: “REPL” is “read-eval-print loop” ([Real Python](https://realpython.com/python-repl/) has a nice explanation); “emacs” is a powerful text editor; “LOC” is “lines of code”.)

This crystallized something I’d noticed repeatedly but didn’t have words to describe:

1. there are things I _need_ to be a productive coder which _others_ absolutely don’t need, and those people amaze–frighten me. And vice versa,
2. _others_ can ask me for things I don’t think matter but they absolutely need to be productive.

Viz., I programmed for years in dynamic-typed languages like plain JavaScript, pre-`typing` Python, Clojure, etc., and, reader, I genuinely have no idea how I managed. These days, if my little throwaway `.js` script gets a little too long, I get heartburn—a digestive warning of upcoming stress. I _have_ to have static types even to do relatively simple tasks—to write relatively simple functions—because I seem to have such limited working memory. That is, I *need* to offload a ton of cognitive bookkeeping to the compiler, in ways that other developers just don’t. Marick’s marveling above at people who can “hold a lot more, um, nested goals” in their heads is something I feel repeatedly (especially in interviews! I insist on doing interviews—where I want a job—in TypeScript).

But also viz., I’ve worked with developers who absolutely need code style and lint rules to be rigorously enforced—who are stressed out and less productive by semantically-equivalent-but-different syntactic convention (TypeScript example: `Array<string>` vs `string[]`). To me, encumbering a codebase with strict formatters and linters is a burden, until I realize that this is equivalent to my teammates with large working memories who are in turn encumbered by me needing static types (TypeScript, `typing` in Python, etc.).

It’s painfully obvious that we need more studies to elucidate the various dimensions along which programmers’ psychologies vary—we treat these differences as quirks or failures, to our detriment. Until then, indulge your teams’ requests, even when you personally wouldn’t benefit. Build a psychologically-safe environment where you and your teammates can ask for what they need without fearing ridicule or suspicion.

## §2 difficulty

Internet sage Patrick McKenzie was a guest on Bloomberg’s _Odd Lots_ podcast with Tracy Alloway and Joe Weisenthal, [“Why Corporate America Still
Runs on Ancient Software That Breaks”](https://www.bloomberg.com/news/articles/2023-01-26/odd-lots-podcast-how-software-explains-the-southwest-airlines-outage) (2023 Jan 26) and, in the inevitable internet banter that followed, said something that has stuck with me:

> “We have not written the first basis point of all software yet.” ([Twitter](https://twitter.com/patio11/status/1618572775932985346))

<details>
<summary>Full excerpt</summary>

> A potentially controversial observation: despite the news cycle vis tech layoffs, and acknowledging individuals suffered during them, the job market over the next 5 years will be ~almost best ever for software. ([Twitter](https://twitter.com/patio11/status/1618572445803507712#m))
>
> This is directly downstream of the ongoing refactoring of society, including at large organizations as we mostly talked about, to organize how people collaborate together over a software substrate.
>
> We have not written the first basis point of all software yet. ([Twitter](https://twitter.com/patio11/status/1618572775932985346))

</details>

A basis point is one percent of one percent (0.0001).

This is a controversial opinion. Plenty of thoughtful people I’ve asked about this disagree with McKenzie, some holding that the *majority* of software that humanity will ever write has already been written.

But though I can’t convince anyone of it, I’m with McKenzie. When I look at how badly most software works, how much better it could work, and how many iterations it takes to get to that better place, it’s easy to convince myself at least that humanity has need of a lot more code than has been written.

*And this terrifies me*, because code is *too damn hard to write*.

This isn’t a profound statement about software correctness or complexity or whatever that a wiser person would invoke. Just. In my day-to-day work as a software maker (in Joseph Gentle’s [“three tribes”](https://josephg.com/blog/3-tribes/) notion), I spend so much time on stuff that’s needlessly difficult, confusing, or verbose it makes me despair that anyone less steeped in that world could manage it.

So I find myself thinking, if it’s this hard to write it, how are we ever going to get to the oodles more we urgently need?

I have no doubt that there are much better ways to write code and build systems that remain to be discovered. Experiments like [Eve](http://witheve.com) and [Darklang Classic](https://darklang.com/classic), tools like structured editing, physical interfaces like AR glasses (which my friend [Laura Langdon](https://hachyderm.io/@LauraLangdon/110880090438291077) put me onto and which I use extensively while coding), … all these fire me up because odds are one of these will be the 10× factor we don’t even realize we need.

Because, this finding is controversial: a lot of people I talk to think our tools are just fine, or need just quantitative improvement and not qualitative revolution. If it wasn’t for some precious naysayers, I’d doubt myself but:
- Bret Victor: “When I want to create something in software, there’s this initial layer of disgust that I have to push through. … There’s a pretty strong conviction that that’s the wrong way of doing things.” ([The Atlantic](https://www.theatlantic.com/technology/archive/2017/09/saving-the-world-from-code/540393/), worth reading! Includes research by Eve author Chris Granger)
- Alan Kay has this memorable conversation in an Ask Me Anything: 
  - Someone: ‘Do we “really” need more programming languages?’
  - Kay: ‘We could use a few “good ones” (meaning ones that really are about the realities, needs and scales of the 21st century).’
  - Someone: ‘Could you list top 3 good ones as per your opinion?’
  - Kay: ‘I meant, we could “use three good ones”, not that I knew of three…’ ([Hacker News](https://news.ycombinator.com/item?id=11940015), 2016 Jun 20)

And this dislike isn’t even about *teaching* programming, which we will *not* be getting into today—though Alexis King has a [wonderful thread](https://gist.github.com/fasiha/64ce82e1dd109430dad70285c6b81693) about that. Teaser: “Real languages are industrial-strength tools designed to be used by skilled hobbyists and professionals. They are informed by real-world requirements and constraints and include pragmatic compromises rife with subtleties. They do not belong in any introductory course.”

---

That’s two things that I—someone who loves to program and haven’t been able to stop doing it for more than a few days for twenty+ years—dislike about it.

§1: We have no idea what all we need to be able do this task.

And §2: it’s too damn hard to do it.

Now, for the good news. I haven’t mentioned “LLM” or “AI” yet, and I won’t after this, but to me the rise of these tools is a stirring reminder that the above situation is *impermanent*.

So other than the exhortation above—to be kind to yourself and to each other, to observe yourself and ask for what you need—I would ask that you stay open to the possibility of these difficulties ameliorating. Here’s to better times to come!


(Banner: crop from Albrecht Dürer’s *Melencolia I*, 1514, [Wikicommons](https://commons.wikimedia.org/wiki/File:Albrecht_Dürer_-_Melencolia_I_-_Google_Art_Project_(_AGDdr3EHmNGyA).jpg). The National Gallery of Victoria writes, “Dürer’s representation was based upon the belief current in Renaissance humanist circles that melancholy was associated not so much with depression and madness as with exceptional creativity” [Google Arts and Culture](https://artsandculture.google.com/asset/melencolia-i/YgF7QxaxiYRojg). [Wikipedia](https://en.wikipedia.org/wiki/Melencolia_I) provides a detailed iconography of the full print.)