---
title: "ADD A TITLE HERE"
date: "2018-01-01"
featured_image: "monopoly_man.jpg"
caption: "ADD A CAPTION HERE."
featured_image_caption: "Monopoly man sitting in on a Senate hearing in the wake of the Equifax data breach during the fall of 2017. Image credit: Aaron P. Bernstein/Reuters."
---

It's a well-established fact that in the United States, [income inequality is increasing](https://en.wikipedia.org/wiki/Income_inequality_in_the_United_States). According to a 2011 [report](https://www.cbo.gov/publication/42729?index=12485) from the Congressional Budget Office, between 1979 and 2011 income for the top 1% of households grew by 275%. Meanwhile, for the bottom 20%, income grew by only 18%.

Looking at different income groups' share of total income tells a similar story. In 1979, the top 1% of earners accounted for 9.6% of total household income in the United States. The top 20% of earners accounted for just under 45.7% of total household income, while the bottom 20% accounted for around 7.7%.

By 2007, this gap had significantly widened. The top 20% of earners increased their share of the pie by almost ten points, to 55%. This increase is almost entirely explained by huge gains by the top 1%, who saw their income share nearly **double** to 18.6%. Meanwhile, the bottom 20% of earners saw their share decrease two points, to 5.7%. And given current trends over the past decade, it's hard to imagine the picture has gotten much rosier for most Americans.

<CaptionedImage caption="Shares of Income After Transfers and Federal Taxes, 1979 and 2007 (Source: CBO)" width="80%" src="cbo_income_graph.png" />

As the income gap grows, so too does the _wealth_ gap, which measures a family's total assets. According to a [2016 CBO report](https://www.cbo.gov/publication/51846), the top 10% of families held 76% of the overall wealth in the United States in 2013, up from 67% in 1989. In contrast, the bottom 50% of families held only 1% of the total wealth in 2013, down from 3% in 1989.

When it comes to income and wealth inequality in America, we're moving in the wrong direction. And I'm not an economist or a policy maker; I have no idea what steps we could take to begin reversing the trend that has emerged over the past 40 years.

I am a mathematician, though, so instead I'd like you to consider a thought experiment.

---

### Starting from Scratch

Let's imagine that we could blow away all of the complexities in our economy, and create a society where everyone starts out with an equal amount of wealth. The economy is strictly based on bartering: whenever two people meet, they can decide to trade goods between them. This exchange will, of course, have an affect on each individual's wealth.

When two people successfully barter, presumably they both feel good about the exchange, otherwise they wouldn't go through with it. But it's unlikely that the trade is entirely equal. It's much more likely that after the exchange, one person will have gained some wealth, while the other person will have lost some.

However, to keep things from getting out of hand, there's no concept of debt in our society. When two people meet to barter, the value that they're bartering can never exceed the poorer individual's wealth.

We can summarize the rules of this society as follows:

1. Everyone starts out with the same amount of wealth.
2. The distribution of wealth evolves through a sequence of trades between randomly selected pairs of citizens.
3. The amount of the trade is also random, but can never exceed the wealth of the person who has less.

I was first introduced to this idea by mathematician Brian Hayes in his book, [_Group Theory in the Bedroom, and Other Mathematical Diversions_](https://www.amazon.com/Group-Theory-Bedroom-Mathematical-Diversions/dp/0809052172). What first interested me in this hypothetical society is how fair it sounds. Everyone starts out on exactly the same footing, and the rules of the game seem about as fair as can be. Everyone trades in good faith, and nobody can run up a debt by doing so.

If you take a moment to think about how this society is likely to evolve, you might convince yourself that people in the society should behave like gas particles, randomly colliding with one another and exchanging energy. Except instead of energy, these people are exchanging their wealth. Here's what such a simulation might look like:

<EconomySimulation idx={0} caption="Here's how you might expect our model society to evolve."/>

In the above simulation, each person's wealth is visualized both by his or her speed and by his or her color. Faster circles correspond to wealthier individuals and have a red color, while slower circles correspond to less wealthy individuals and take on more of a blue hue.

If you take a look at the bar graph while time passes, you should see a relatively smooth distribution of wealth, from the poorest on the left to the wealthiest on the right. The distribution certainly highlights inequality, but not necessarily an unfair degree of it. After all, we probably want a certain degree of inequality, as long as upwards mobility is still within our citizens' grasp. And indeed, this society is highly mobile: with enough people, the poorest person is rarely the poorest for very long, and similarly for the richest person.

Unfortunately, this isn't how our model society actually evolves.

---

### Trickle-Up Economics

Here's what actually happens to society based on our simple bartering rules:

Unlike gas particles bumbling around together, this time one citizen gradually leeches the wealth away from everyone else. Eventually, almost everyone lives in extreme poverty, with one lucky individually accumulating all of the wealth in the society.

This result is initially surprising for many people (myself included), in large part because the rules seem entirely reasonable and fair. But even for relatively simple systems like this hypothetical society, **fair rules do not necessarily yield desirable outcomes.** Even if we all agree that the rules of this society seem fair, I don't think any of us would want to live in a society governed by these rules.

How is it that a system with such a fair set of rules can lead to such extreme inequality? One simple way to understand it is with a small society of only two people. In this scenario, there's no randomness in who will be doing the trading.

Consider what happens when these people meet for the first time to trade. In this case, they begin with an equal amount of wealth. And it's possible that the value of the trade will be small, but it's also quite likely that the value will be relatively large. More precisely, since both parties have the same amount of wealth, there's a 50% chance that someone will walk away from the trade with at least half of their wealth depleted.

To keep things simple, let's say each person has 100 units of wealth, and the value of the trade winds up being 50. After the trade, one person will walk away with 150 units of wealth, and the other will wind up with 50.

But the next time the two meet to trade, there's a problem. The maximum value of the trade is now much lower: 50 units of wealth instead of 100. Our rule about capping the value of the trade, which seems entirely reasonable at the outset, winds up restricting everyone's ability to regain wealth they've lost. For this second trade, one person could potentially lose almost everything, while the other person will lose at most one third of their wealth.

Taken to the extreme, you can see how it's almost impossible to regain a significant amount of wealth after it's been depleted. If one party has 199 units of wealth and the other party has only 1, it's practically impossible for the second person to climb out of poverty.

---

### Maybe Robin Hood was Right

It's worth pointing out that the first simulation, the one that yields a fairer distribution of wealth, stems from rules that at the outset seem _less_ fair. The rules are quite similar to the ones mentioned above, but with an important change to the last rule:

<Sidebar>It's an interesting exercise to show that standard laws of physics (i.e. the conservation of energy and momentum) yield these three rules when you have a collection of colliding bodies, as in the first simulation. Also, it's worth mentioning that while the amount of the trade is random in the first simulation, it's not uniformly random: trade values in the middle are more likely than trade values at either extreme.</Sidebar>

1. Everyone starts out with the same amount of wealth.
2. The distribution of wealth evolves through a sequence of trades between randomly selected pairs of citizens.
3. The amount of the trade is also random, but can never exceed the wealth of the person who ~~has less~~ _loses wealth in the trade_.

Let's see how this plays out in our previous example, with a two-person society. If the first trade has a value of 50, then one person will walk away with 150 units of wealth, and the second will have only 50 remaining. However, unli

3. here's the data.

4. what kind of model makes sense?

* closed system
* less mobility

Sources

* https://www.cbo.gov/publication/42729
* https://www.cbo.gov/publication/51846
* https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional
