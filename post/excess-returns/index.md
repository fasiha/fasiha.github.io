---
banner: 'The_Monitor_and_Merrimac.jpg'
date: '2020-11-08T03:01:01.368Z'
title: "A look at S&P 500's real excess return over Treasuries"
description: "Conventional wisdom assures us to buy low-cost diversified mutual funds for retirement savings. Let's take a look at what that meant over the last century and more."
tags: [finance]
---

> **2021 Feb 10 Update** Earlier versions of this essay were, as many thought, plagued with a [bug](https://github.com/fasiha/shiller-heat/commit/b9b49b4fb14edf41303b27dabd63c9eef640d8b8) that severely underestimated long-term returns. A thousand apologies! The rest of this essay has been compressed to summarize the updated (and hopefully correct) findings.

Imagine. It's 1871. A promising young American has just entered the workforce and makes it a point to buy $100 of the S&P 500 index every month, with dividends reinvested, over a forty year career. It's now 1911. Our American, about to retire, stops these monthly purchases and asks, "What is the real return I achieved in excess of risk-free Treasuries over my forty-year investing horizon?" ***Answer: 3.6%.***

Imagine now that every year after 1871, we can find one such promising young American to join the work force and to do the same thing: monthly-dollar-cost average into the S&P 500 index for forty years.

And similarly, for not just forty years, but for other time horizons.

The plot below shows the real excess return of the S&P 500 over risk-free Treasuries for a few time horizons, from ten to a hundred years. Thanks to Plotly, it's interactive so you can click, tap, zoom, pan, pinch, etc. You can turn off a line you don't want to see by clicking or tapping it in the legend.

<div id="excess-all"></div>

Now, for each line above, you can imagine plotting a *histogram* of returns, showing the distribution of excess real returns you can expect over 10 year, 20 year, etc. horizons.

<div id="histogram"></div>

Finally we can convert each histogram above to a *cumulative histogram* below. This lets us answer questions like,
- how often does the S&P500 yield negative excess real returns over a ten year horizon? Answer: 20% of the time.
- What's the 80-percentile real excess return for a ten year horizon? Answer: almost 10% annualized! In other words, if you plan to buy the S&P500 every month for ten years, 20% of the time you'll lose money (to inflation compared to short-term Treasuries), but 20% of the time you'll get 10% annualized or better!
- Are there any twenty-year periods where the S&P500's real excess returns are <0%? Answer: yes, 10% of them.
- Are there any forty-year periods where it returned <0%?? Answer: no! All four-decade periods see the S&P500 returning positive real excess returns!

<div id="histogram-cumulative"></div>

> Some nerdy details: Robert Shiller's [online dataset](http://www.econ.yale.edu/~shiller/data.htm) contains monthly numbers for the S&P 500 index's price (dollars per share), dividends (dollars per month), and 10-year Treasury yields, all starting in 1871. I assume you invested $1 at the beginning of each month, reinvesting the dividends that accrued over the previous month. After 480 such buying sessions (for forty year horizons), I calculate the internal rate of return (XIRR) by assuming the entire portfolio was liquidated, which is just an accounting choice to answer the question, "what real return did the S&P 500 yield over this forty year horizon after monthly dollar cost averaging".
>
> I then do a similar exercise with Treasuries: every month I assume you put that $1 into a savings account-like vehicle that pays interest monthly at the same rate as the 10-year T-note's. XIRR again computes the internal rate of return, over the same time horizon. *Excess* return is just the S&P's real return minus the Treasuries' real return, and is expressed in a percentage just like any rate of return. Because inflation aflicts stocks and bonds equally, *excess* return is also the ***real*** *excess return*. (You can inspect the TypeScript [code](https://github.com/fasiha/shiller-heat/blob/3e46bdc6d268f9fb6290328373d1a2942f2a2e7e/shiller.ts#L120-L124).)

> **Nota bene** To those seeking to apply [Dr Damodaran](http://pages.stern.nyu.edu/~adamodar/)'s [Historic Returns](http://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html) dataset to check this analysis, please note that the annual returns on thirty-year Treasury bonds appear to be on the price of the bond itself, rather than the bond's yield over that year. For example, T-bonds in 2013 are shown to have -9.1% return but we see from [DGS30 Fed time series](https://fred.stlouisfed.org/series/DGS30) that during 2013, the constant maturity rate for thirty-year bonds was between 2.8% and 3.9%. (Damodaran's annual returns for the three-month T-bills seems to jibe well with the [Fed's DGS3MO](https://fred.stlouisfed.org/series/DGS3MO) numbers though, and might be an acceptable proxy for the ten-year T-note yields in [Shiller](http://www.econ.yale.edu/~shiller/data.htm)'s dataset.)

(Banner: a crop from "The Monitor and Merrimac: The First Fight Between Ironclads", chromolithograph by Louis Prang & Co., 1886. [Wikimedia](https://commons.wikimedia.org/wiki/File:The_Monitor_and_Merrimac.jpg))

<script src="plotly-basic-1.57.1.min.js" charset="utf-8"></script>
<script src="index.js" charset="utf-8"></script>

