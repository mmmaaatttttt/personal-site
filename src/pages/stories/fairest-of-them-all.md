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

<!-- insert coin flip demo here! -->

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

### A Frequentist Approach

If you don't know whether or not the coin is biased, there are a few different
ways to avoid getting roped into an unfair game. One way involves a
**frequentist** approach to probability: we flip a coin many times and use the
proportion of flips that land on heads to gain insight into whether or not the
coin might be biased.

For example, flipping the coin once tells you nothing about whether or not the
game is fair. Flipping it twice doesn't tell you much either: even if the coin
is fair, it will land on the same side both times 50% of the time. But what if
you flip the coin 100 times? or 10,000? Or --- wait for it --- one _billion_
times? With more data you can begin to tease out the effects of any bias
inherent in the system.

As the number of flips grows, the proportion of flips that land on any one side
begins to follow a **normal distribution**, or bell curve, more and more
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

<CoinFlipHistogram caption="Figure 1: An interactive probability distribution
for flipping coins."/>

Note that as the number of coin flips increases, the probability distribution
begins to center around the true probability of getting heads. For example,
after 100 flips, there's a roughly 95% chance that heads should have appeared
between 40 and 60 times, and a roughly 99% chance that it should have appeared
between 37 and 63 times. Depending on your tolerance for unlikely events, a head
tally outside of one of these two ranges should give you pause.

### A Bayesian Approach

The frequentist approach is a perfectly valid way to try to assess whether or
not a coin is fair. But there's another school of thought worth examining as
well: the **Bayesian** approach. The biggest difference with the Bayesian model
is that we assume the true likelihood of our coin landing on heads is always
unknown. The best we can do, then, is try to come up with a probability
distribution for our coin, which changes every time we flip the coin and gather
new information.

In order to implement this approach, we also need a _prior distribution_. In
other words, absent any data, what do we expect the probability distribution to
look like? In what follows, we'll offer up two different priors. In the first,
we'll assume that any heads probability is equally likely: maybe the coin is
fair, maybe it's much more likely to land on heads, maybe it's much more likely
to land on tails.

For the second prior, we'll assume that the coin is much more likely to be fair
than not. If you expect that the coin hasn't been doctored in any way, this
seems like a reasonable hypothesis.

Note that the prior you choose has a significant impact on how the model
evolves. If you assume any outcome is equally likely, a string of consecutive
heads will strongly suggest bias. But if start by assuming the coin is likely to
be fair, it takes more evidence to significantly move the probability distribution.

In the interactive below, you can start with either prior, and then mimick as
many coin flips as you want. A nice bell shape around 50% represents a coin
that's likely to be fair, while a curve that's biased towards either side
suggests that the coin isn't balanced. This reflects the intuitive sense that if
we flip the coin 100 times and it comes up heads 50 times, the evidence suggests
that the coin is unbiased. But if it comes up heads 90 times, the evidence
suggests bias. How much bias it suggests depends on your starting assumption.

<CoinFlipBayesianModel />

Both approaches---frequentist and Bayesian---have their tradeoffs. If you're
interested in learning more about these approaches, there's a nice article
available on the MIT [open courseware
website](https://ocw.mit.edu/courses/mathematics/18-05-introduction-to-probability-and-statistics-spring-2014/readings/MIT18_05S14_Reading20.pdf).

(As a mathematical aside, the standard Bayesian model for trying to estimate the
probability of a coin landing on heads involves the Beta function. You can read more about the derivation of the above model [here](https://ocw.mit.edu/courses/sloan-school-of-management/15-097-prediction-machine-learning-and-statistics-spring-2012/lecture-notes/MIT15_097S12_lec15.pdf).)

Sources:

- [Comparison of frequentist and Bayesian inference](https://ocw.mit.edu/courses/mathematics/18-05-introduction-to-probability-and-statistics-spring-2014/readings/MIT18_05S14_Reading20.pdf), by Jeremy Orloff and Jonathan Bloom.
