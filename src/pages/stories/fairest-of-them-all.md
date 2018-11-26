---
title: "The Fairest of Them All"
date: "2018-12-31"
featured_image: "mind_the_gerrymandered_gap.jpg"
caption: "A mathematical exploration of fairness."
featured_image_caption: "A map of the United States. Image credit: John-Mark Smith on Unsplash."
---

From the playground to the capitol, debates over 

...

In this story, we'll explore a few different meanings of fairness, some more
mathematical than others. By surveying the landscape, our goal is to develop a
helpful framework for thinking about mathematical fairness in general.

The concept of fairness can get complicated depending on the context. But in
some cases, it should be relatively straightforward to define and measure. Let's
start simple and begin with some scenarios where fairness shouldn't be too
difficult to pin down: games of chance.

### Fairness and Probability

Let's begin with some scenarios where fairness is essentially self-evident.
Take, for instance, a simple coin flipping game. Heads, I win; tails, I lose.
Is this game fair?

Well, that probably depends on the coin. If the coin is equally likely to land
on either side, then neither player is advantaged. In this case, we can conclude
that the game is fair. If, on the other hand, the coin is weighed in some way,
so that one side is more likely to land than the other, most would agree that
the game is unfair.

It's unfair for a couple of reasons. First, one player is advantaged over the
other without any real reason (it's not as though this is a game of skill). But
second, if the coin is biased, it's likely that the disadvantaged player won't
know about the deception. Otherwise, why agree to play the game?

In this case, it seems like fairness is fairly straightforward in principle: the
game is fair if the coin is just as likely to land on one side as it is on the
other. But in practice, how can we determine whether or not the game is fair?
After all, a slight bias in the coin may be hard to detect. As with many other
examples we'll discuss, it's easier to agree on the ideals than on the details.
Fairness may make sense in the abstract, but how can we ensure that the coin we
use actually adheres to our sense of fairness?

If you don't know whether or not the coin is biased, there are a few different
ways to avoid getting roped into an unfair game. One way involves a
**frequentist** approach to probability: we flip a coin many times and use the
proportion of flips that land on heads to gain insight into whether or not the
coin might be biased.

For example, flipping the coin once tells you nothing about whether or not the
game is fair. Flipping it twice doesn't tell you much either: even if the coin
is fair, it will land on the same side both times 50% of the time. But what if
you flip the coin 100 times? or 10,000? Or --- wait for it --- one *billion*
times? With more data you can begin to tease out the effects of any bias
inherent in the system. 

As the number of flips grows, the proportion of flips that land on any one side
begins to follow a **normal distribution**, or bell curve,  more and more
closely. This means that we can estimate the likelihood of certain outcomes by
calculating the area under normal curve. For example, after 100 flips, there's a
roughly 95% chance that heads should have appeared between 40 and 60 times.
Similarly, there's a roughly 99% chance that it should have appeared between 37
and 63 times. Depending on your tolerance for unlikely events, a head tally
outside of one of these two ranges should give you pause.

Here's a demonstration of what we're getting at. Below, you can adjust the true
probability that a coin lands on heads, and then model how many times you'd like
to flip a coin. The histogram will adjust accordingly, and show you how likely
it is for the number of times that heads appears to fall within different ranges.

