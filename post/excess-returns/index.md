---
banner: 'The_Monitor_and_Merrimac.jpg'
date: '2020-11-08T03:01:01.368Z'
title: "A look at S&P 500's real excess return over Treasuries"
description: "Conventional wisdom assures us to buy low-cost diversified mutual funds for retirement savings. Let's take a look at what that meant over the last century and more."
tags: [finance]
---

Imagine. It's 1871. A promising young American has just entered the workforce and makes it a point to buy $100 of the S&P 500 index every month, with dividends reinvested, over a forty year career. It's now 1911. Our American, about to retire, stops these monthly purchases and asks, "What is the real return I achieved in excess of risk-free Treasuries over my forty-year investing horizon?"

***Answer: 3.8%.***

> You want details, I got details. You can read the [code](https://github.com/fasiha/shiller-heat/blob/8cac0574702320ffc41302c8392b4929855ed321/shiller.ts#L121-L125) or the [spreadsheet](https://drive.google.com/file/d/1jzBiJ4OAIDo35Nom0U6a655TJAnqeoMf/view?usp=sharing) (start at cell W5), but I use Robert Shiller's [online dataset](http://www.econ.yale.edu/~shiller/data.htm). It contains monthly numbers for the S&P 500 index's price (dollars per share), dividends (dollars per month), CPI (consumer price index, to discount inflation), and 10-year Treasury yields, all starting in 1871. I assume you invested $1 at the beginning of each month at the real CPI-adjusted price of the stock index, reinvesting the dividends that accrued over the previous month. After 480 such buying sessions, I calculate the internal rate of return (XIRR) by assuming the entire portfolio was liquidated, which is just an accounting choice to answer the question, "what real return did the S&P 500 yield over this forty year horizon after monthly dollar cost averaging".
>
> I then do a similar exercise with Treasuries: every month I assume you put that real $1 into a savings account-like vehicle that pays interest monthly at the same rate as the 10-year T-note's (CPI-adjusted). XIRR again computes the internal rate of return, over the same time horizon. *Excess* return is just the S&P's real return minus the Treasuries' real return, and is expressed in a percentage just like any rate of return.

Imagine now that every year after 1871, we can find one such promising young American to join the work force and to do the same thing: monthly-dollar-cost average into the S&P 500 index for forty years.

Seven years later, the investor who began dollar-cost averaging in 1878 and asks in 1918 what their real excess rate of return was, gets a shocking number.

***0.3%.***

This investor retiring in 1918; the next one retiring in 1919, and 1920, and on, up to 1924: each of these see an excess real rate of return between ***-1.3%*** and ***0.3%***. In 1925, the retiree who began in 1885, sees a ***0.8%*** excess real return, and only after them does each successive year's retiree see a nice positive excess real return.

The graph below plots this time series: the excess real return each year's retiree saw, from 1911 to 2020. Thanks to Plotly, it's interactive so you can click, tap, zoom, pan, pinch, etc. You can see it starts out at the 3.8% mentioned above, drops to -1.3% in the early 1920s, and wanders between -2.4% and 6.6%, as each year's retiree does a bit better or worse than the previous year's. The *median* excess real return for all our retirees: 1.6%.

<div id="excess-20"></div>

From 1925 to 1981, each retiree saw a positive real excess return.

Then, from 1981 to 2013, thirty-one retirees during this thirty-three year interval saw negative excess real returns over forty years of monthly dollar-cost averaging. (There was a brief blip into positive territory during 1999 and 2000, i.e., the Tech Bubble.) That's a whole generation: a parent and their child could both have seen zero real excess return, over a career's worth of investing.

As I'm writing this, in late 2020, I see this year's retiree is looking back on 3.1% real excess return of the S&P 500 over Treasuries, over forty years of monthly dollar-cost averaging. I'm about fifteen years into my career. You might be thirty-five years into yours, or just three years. We don't yet know what the graph will look like for us when we retire, in five, twenty-five, and thirty-seven years hence—but seeing this graph, with its plateaus and gyrations, and imagining at each point a retiree looking back on *a lifetime* of following solid retirement advice, gives me pause: so many of them were *unrewarded* for investing in stocks—they could have just bought Treasuries and relaxed.

I'm caricaturing retirement conventional wisdom a little bit—although its simplest tenet is to buy and hold a diversified basket of equities and reap its risk premium over the long-term, we haven't simulated a glide path to bonds, or explored any alternatives. Nevertheless, for me personally, answering this simple question about equities' excess real returns following this commonly-recommended strategy was very illuminating, because it makes me feel that retirement savings is less of a solved topic than I thought.

**Postscript** A friend recently asked me, "What should I invest in for my newborn's college fund?" Although the universe of assets worth considering is much larger than just S&P 500 ETF vs a money market fund, the above analysis can apply: what is the excess real return of the S&P 500 over Treasuries over all *twenty* year horizons of monthly dollar-cost averaging, with dividends reinvested?

That's the graph below (along with several other horizons). 

<div id="excess-all"></div>

Answer: it ranges from between 10.4% to -10% annualized rate of return, with a *median* of 2.4%. If we imagine an annual series of parent–investors adopting this strategy, the first's child turning twenty in 1891, this median means that half of them saw excess returns greater than 2.4% and half of them less. Do these returns justify putting your child's college fund in the S&P 500? I would feel sufficiently uneasy about this and seek to explore other options.

> **Footnote** Earlier versions of this post were circulated in February 2019, and again in March 2020 which led to finding and fixing a bug in the calculation. The [Google Sheets version](https://drive.google.com/file/d/1jzBiJ4OAIDo35Nom0U6a655TJAnqeoMf/view?usp=sharing) of Shiller's dataset includes calculations for a single data point. I also sought some feedback from the readers of [Personal Finance Stack Exchange](https://money.stackexchange.com/q/121010).

(Banner: a crop from "The Monitor and Merrimac: The First Fight Between Ironclads", chromolithograph by Louis Prang & Co., 1886. [Wikimedia](https://commons.wikimedia.org/wiki/File:The_Monitor_and_Merrimac.jpg))

<script src="plotly-basic-1.57.1.min.js" charset="utf-8"></script>
<script src="index.js" charset="utf-8"></script>

