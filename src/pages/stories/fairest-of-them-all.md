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

### Changing the Game

Regardless of your philosophy (frequentist or Bayesian), these examples show
that there's a way for you to assess whether or not the implementation of this
game is fair. It's not perfect, but the more data you collect, the more certain
you can be of the assessment.

But if you're worried about the possibility of a biased coin and don't have the
opportunity to collect data, there's another solution: change the rules of the
game. In fact, there's a way to create a fair game even out of a biased coin.

Consider the following variation on the coin-flipping game, described in a 1951
[paper](https://mcnp.lanl.gov/pdf_files/nbs_vonneumann.pdf) by mathematician
John von Neumann. We have a coin, but we have no idea whether it's fair or not.
You inspect the coin and see that the two sides of it are different, so the
probability that it lands on heads is not 0 or 1.

In this case, here are the rules. We flip the coin twice. If it comes up on the
same side both times, the game continues. If it comes up heads and then tails, I
win. If it comes up tails and then heads, you win.

So, what are each of our chances of winning? Well, in any given round there are
four possible outcomes. If we let **H** represent the coin landing on heads, and
**T** represent the coin landing on tails, these outcomes are HH, HT, TH, and
TT. In two of these scenarios (HH and TT), the game proceeds to a new round.

But since we know the probability of landing on heads isn't 0 or 1, we also know
that *eventually* we'll get either the HT or TH outcome. And because the coin
flips are independent---that is, because the outcome of the second flip doesn't
depend on the outcome of the first---the probabilities of these two events are
the same!

<CoinFlipTable caption="Figure 3: Examining the likelihood of TH and HT outcomes for different probabilities." />

All of these approaches highlight some important features of fairness. First,
while fairness is easiest to reason about in the abstract, it's not difficult
for the implementation of a fair game to be unfair. If I choose to deceive you
and offer up a coin that has a 75% chance of landing on heads, this game is
demonstrably unfair, even if we agree on what the rules of a fair game are.

In order to ensure agreement between the abstract rules and the specific
implementation, we've seen two possible approaches. The first is *data*-driven:
we flip the coin many times and use that data to make judgments about whether or
not the coin is biased. The second is *system*-driven: we change the rules of
the game to eliminate potential sources of bias. This can be helpful if the data
we need is unavailable or prohibitively expensive to acquire.

### Fairness and Expected Value

It might be tempting to say that a game is fair if each player is equally likely
to win, both in theory and in practice. But this viewpoint is a little too
narrow. After all, there are many games where players aren't equally likely to
win, but both sides would still consider the game fair.

For example, suppose we agree to roll a fair die; if the value of the roll is 1,
you win, but otherwise I win. Clearly this game is unfair. My chances of winning
are 5/6, or roughly 83%, but your chances are only 1/6. If all we're playing
for is bragging rights, you're better off walking away.

But what if we're playing for keeps? In this case, fairness depends not only on
the odds for the game, but also the payouts. Suppose that if I win the game, you
have to pay me $1, but if you win, I have to pay you $5. If we play this game
many times, on average you'll win 1 game out of every six, but you'll earn $5
for each of those wins. On the other hand, you'll lose, on average, 5 games out
of every six, but you'll only have to pay me $1 for each loss. In more
mathematical terms, we'd say that the *expected value* of the game is zero.

<DiceRollExpectedValue />

An expected value of zero tells us that neither party is favored to profit from
the game over time. In this sense, the game is fair even though the win
probabilities differ. Of course, just as before, implementation matters: if the
die used for the game is biased, then the game can no longer be considered fair.
We can even begin to quantify the degree of unfairness in the language of
expected value. For instance, if the probability of rolling a 1 is really 1/7
instead of 1/6, the expected value of the game for you is really -1/7.
Not great, but better than -1 or -100.

It's worth pointing out that while expected value is commonly framed in terms of
money, this needn't always be the case. We can talk about the expected happiness
you'll receive by playing a game, for example, or the expected regret you'll
feel if you decide not to play. 

Consider gambling, for example. Most people know that casino games are, from a
mathematical perspective, unfair. And yet, there are still plenty of people who
gamble, even knowing they should expect to lose money. The language of expected
value still has a place here, though looking at games from a strictly economic
perspective is limiting. Instead, it can help to try to quantify other things.

For instance, there are psychological factors at play when it comes to gambling;
modeling some of these factors can sometimes make the decision to gamble seem
more rational (I've written about this
[elsewhere](https://scholarworks.umt.edu/cgi/viewcontent.cgi?article=1332&context=tme)).
But modeling things in this way doesn't resolve questions of fairness. For
example, if you really love to play a game even though the odds are against you,
and I know how much you love the game and exploit this fact for my own benefit,
is this fair?

### Fuzzier Fairness

Imagine you sign a lease for an apartment with two friends. Each of you will
have your own bedroom, but the bedrooms are all different, with their own sets
of advantages and disadvantages. In order to preserve roommate harmony, it's
important not only to agree on who gets which room, but also how much each
person pays. If one room is clearly better than the others, should the person
who gets that room pay more? If so, how much?

Here's an example of a real-world situation in which fairness becomes even
fuzzier. After all, people prioritize different things: one of you may really
want the room with the best view, while another person wants the dark room in
the back. To complicate things even further, you may have conflicting desires
which make it difficult to even rank your room preferences. In cases like these,
how can we determine a fair way to assign rooms and split rent so that everyone
is content with the outcome?

<RentDivision />

It turns out that there's an answer to this question. The solution involves an application of a geometric result known as Sperner's lemma; the connection between the lemma and our present dilemma was first discussed in \cite{su}.

\begin{figure}
%TODO
\label{fig:sperner_diagram}
\caption{TODO.}
\end{figure}

The setup might seem like a total non-sequitur, but bear with me. Sperner's lemma is a generalization of the scenario depicted in Figure \ref{fig:sperner_diagram}. In that scenario, we are presented with a triangle that has been decomposed into many smaller triangles. Each vertex of each triangle is given one of three colors (red, yellow, or blue). Moreover, the coloring of the vertices is subject to the following restrictions:

\begin{enumerate}
\item Each vertex of the main triangle is colored differently. In other words, red, yellow, and blue are used precisely one time each to color the vertices of the main triangle. Let's call these vertices the main vertices of the triangle.
\item Along the three main sides triangle, any vertex must match the color of the main vertex to its left or two its right. For example, in Figure \ref{fig:sperner_diagram}, all vertices on the left side of the triangle are either red or yellow, but are never blue. (There's no such restriction for vertices inside the triangle.)
\end{enumerate}

Whenever the above restrictions are satisfied, there will be a smaller triangle inside of the main triangle whose vertices are all colored differently. In fact, you're guaranteed to have an odd number of such triangles!

So why is this true, and what does any of this have to do with paying rent? Let's focus on the second question; we'll touch on an answer to the first question as we go. In order to apply Sperner's lemma to our rent problem, we need to make a few assumptions on the roommates:

\begin{enumerate}
\item There's no way to divide the rent so that someone will reject every room. In other words, no matter how the rent is split, each person is willing to live in at least one of the rooms.
\item We don't know the details of everyone's preferences, but we assume that people will prefer to live in a free room than in a room that costs money.
\end{enumerate}

There's a third assumption will need as well, but it's a bit more technical, so we'll save it until it's clear why we need it.

To help make things concrete, let's assume the monthly rent is \$2,400. To find a fair price, we start with a triangle (see Figure \ref{fig:sperner_rent_example1}). Each vertex of the triangle represents a different decomposition of the rent. We'll let the top vertex correspond to the following prices for the three bedrooms: \$1,200, \$0, \$0. Similarly, we'll let the bottom-left vertex correspond to (\$0, \$1,200, \$0), and we'll let the bottom-right vertex correspond to (\$0, \$0, \$1,200). Let's suppose the three roommates are Andrea, Beatrice, and Charlize, and let's label each vertex with a unique letter corresponding to one of the roommates. We'll consider the roommate labeled at a vertex the ``owner'' of that vertex.

\begin{figure}
%TODO
\label{fig:sperner_rent_example1}
\caption{TODO. -- initial triangle}
\end{figure}

Next, for each vertex we ask the owner of that vertex one question: at these prices, which room would you choose? When we first start off, by our first assumption we know that each roommate will choose a room, and by our second assumption we know that each roommate will choose one of the free rooms. However, it's unlikely that the roommates will agree to any these pricing schemes, since in all of them one roommate is simply freeloading off of the other two.

But now we can subdivide this triangle into smaller triangles, called a mesh. A relatively coarse mesh is shown in Figure \ref{fig:sperner_rent_example2}. Once we've drawn these smaller triangles, we need to determine the room prices and the owner for each new vertex.

We'll set the price breakdown at a vertex based on the price breakdown at the neighboring vertices. For instance, if a new vertex is halfway between to vertices where the prices are known, then the prices at the new vertex should be halfway between the prices at either vertex. If it's two-thirds of the way between one vertex and another, then prices at the new vertex should be 2/3 of prices at the closer vertex, plus 1/3 of prices at the farther vertex. And so on.

\begin{figure}
%TODO
\label{fig:sperner_rent_example2}
\caption{TODO. -- triangle with mesh}
\end{figure}

As for who owns the vertex, this is not so important. The only restriction we'll impose is that for every small triangle in our mesh, each vertex is owned by a different roommate.

Once we've assigned ownership and determined prices, we'll ask the owner of each vertex the following question: ``At these prices, which room would you pick?'' We now relabel the triangle with the roommate's choice at each vertex. Here's the kicker: Sperner's lemma guarantees the existence of a triangle where every roommate selects a different room! (In fact, it guarantees an odd number of such triangles.)

But how does Sperner's lemma apply? After all, we don't know which room each person will pick at the vertices of the original triangle. Since two of the rooms are free at each corner, we only know that the owner of that corner will pick one of the free rooms. What's more, along the sides of the outer triangle, only one room will be free, so we know by our second assumption that this is the room that will be chosen for each vertex along a side (see Figure \ref{sperner_rent_example3}).

\begin{figure}
%TODO
\label{fig:sperner_rent_example3}
\caption{TODO. -- hypothetical ownership along sides of triangle}
\end{figure}

This is sort of an inversion of the assumptions of Sperner's lemma. In the original formulation of the lemma, the color at each corner vertex is determined, and the vertices along each side are restricted in color based on the corners they sit between. But in our present scenario, we have the opposite setup: the room selected at each vertex along the outer side is determined, and the three vertices in the corners are restricted based on the sides they sit between.

There are two ways we can try to solve this problem. One way is to construct a new diagram, called a \textit{dual} to the original, for which the original conditions of Sperner's lemma are satisfied (see \cite{vick} for details on this approach).

But we can also prove the desired result directly, using an argument very similar to the proof of Sperner's lemma. The key idea in the proof is to think of the large triangle as a building in which every small triangle is a room. To get from one room to the next, we can move through a sequence of doors.

So what's a door? Well, we can define a door in a number of ways. The key feature of a door is that it should connect a vertices representing different rooms. As in Figure \ref{fig:sperner_rent_example4}, let's define a door to be any edge connecting a choice of room 1 to a choice of room 2. We could have just as easily picked a different pair of rooms, as long as the rooms are different.

\begin{figure}
%TODO
\label{fig:sperner_rent_example4}
\caption{TODO. -- doors}
\end{figure}

This may seem like a contrived analogy, but thinking of the triangles in terms of rooms and doors is a clever way to prove the existence of a triangle where each room gets chosen. Notice that, as evidenced by Figure \ref{sperner_rent_example3}, there must be exactly one door on the boundary of the main triangle; in particular, one of the edges of the door lies on the bottom-right corner of the triangle.

Imagine that you ``enter'' the triangle through this door. You'll now be in a room which either has another door (if the third vertex corresponds to room 1 or room 2), or has a complete labeling of the vertices. If it's the latter, great! We've found our triangle. If it's the former, we can step through the second door into a new room. But now we're in the same scenario: either this room will have a complete labeling, or it will have a second door! And since no room has more than two doors, it's impossible to double-back and visit a room you've already seen. Since the number of rooms is finite, and since there's only one door from the outside of the diagram, this process must eventually terminate with you finding a fully labeled triangle!

This proves the existence of \textit{one} triangle, but why must there be an odd number? Well, it's possible that there may be doors in the interior of our triangle which aren't accessible from the door to the outside. In this case, these interior doors must necessarily connect pairs of fully-labeled triangles, since there's no way to escape the diagram via a door to the outside (see Figure \ref{fig:sperner_rent_example5}. Therefore, the total number of triangles for which every roommate selects a different room must be odd.

\begin{figure}
%TODO
\label{fig:sperner_rent_example5}
\caption{TODO. -- doors linking }
\end{figure}

If the roommates select different rooms but still find the difference in prices to be unfair, then we can always subdivide our original triangle into a finer mesh and run through the same process again. By taking finer and finer meshes, the triangles will eventually converge to a single point. And here's where we need our last assumption: if a roommate prefers a given room for a set of prices which converge to some limiting price, then the roommate will still prefer the given room at that limiting price.

Intuitively, this arrangement seems fair: the process doesn't appear to favor one roommate over another, and everyone winds up with a room at a price they find acceptable. In game theoretic terms, this arrangement even has a specific name: it is called \textit{envy-free}, since no roommate would prefer to trade rooms with anyone else.

And while we've only discussed this problem in the context of three roommates, this application of Sperner's lemma applies equally well to any number of roommates. The geometry becomes a little harder to visualize, but the ideas generalize in a natural way. See \cite{su} for more details.

Even without a probability model, then, it's sometimes possible to determine what \textit{feel} like fair divisions of resources. In this sense, then, mathematical fairness (whatever this means) seems to have relatively general applicability.\footnote{For more on the application of Sperner's lemma to fair division of rent, see \cite{sun}.}

\section{Considering Fairness from the Veil of Ignorance}

In the previous section, we saw how mathematics could be applied to questions of fair division. However, when it comes to roommates dividing rent, there's an implicit fairness assumption that doesn't always hold: namely, that each roommate has an equal say in the decision-making. While this may be a reasonable assumption when it comes to friends living together, it's not necessarily true in other contexts. Imagine a group of people who are creating a political system for a new society, for instance, or who are setting policy for an existing one. It's not necessarily true that every voice at the table is equally strong. Nor can it be assumed that everyone negotiation is free of bias, either for the group they represent or against groups that they do not. In cases like this, what does fairness mean, and how can we try to ensure it?

Rather than drawing from mathematical literature, let's address this question from the perspective of political philosophy. One classic thought experiment that attempts to address this question comes from John Rawls, a philosopher who taught at Harvard University for almost 40 years, until his death in 2002. Rawls made many contributions to the fields of moral and political philosophy during his career. The one we'll focus on is called the \textit{veil of ignorance}.

Before we examine the veil of ignorance, let's connect it to the question of fairness. Rawls was very much concerned with fairness as well, so much so that he developed a conception of justice called `justice as fairness'' (\cite{rawls}). As indicated by the name, this conception of justice is intimately tied to ideas of fairness. Early on, Rawls writes,`The most fundamental idea idea in this conception of justice is the idea of society as a \textit{fair} system of social cooperation over time from one generation to the next'' (p. 5, emphasis added).

So what does fairness mean in this context? Later on, Rawls defines fair terms of cooperation as follows: ``These are terms each participant may reasonably accept, and sometimes should accept, provided that everyone else likewise accepts them'' (p. 6). Just as we've uncovered in our mathematical examples, fairness in Rawls' writing connotes a sense of reciprocity: if an agreement can't be accepted by all parties, this may be because it isn't fair.

But still, the question remains: what can we do to ensure that an agreement has been entered into under fair circumstances? Rawls recognized this issue, writing that the circumstances must ``situate free and equal persons fairly and must not permit some to have unfair bargaining advantages over others. Further, threats of force and coercion, deception and fraud, and so on must be ruled out'' (p. 15). This seems all well and good. In practice, however, ensuring that fair agreements are entered into fairly can be quite challenging.

The solution Rawls proposes is the \textit{veil of ignorance}. Here's how he introduces the concept:

\begin{quote}
[T]he parties are not allowed to know the social positions or the particular comprehensive doctrines of the persons they represent. They also do not know persons' race and ethnic group, sex, or various native endowments such as strength and intelligence, all within the normal range. We express these limits on information figuratively by saying the parties are behind a veil of ignorance. (p. 15)
\end{quote}

The idea here is to situate negotiators in such a way that they don't know specifics about the community they are representing. To take an extreme case, the veil of ignorance should prohibit the creation of a society that condones slavery, because advocates for slavery may themselves wind up being slaves. The goal is for the lack of information in the veil of ignorance to remove, or at least temper, arguments based on self-interest when trying to forge an agreement.

Rawls discusses the veil of ignorance as it pertains to the creation of society, but the same ideas can be applied to scenarios that are not as grand in scope. Even in the context of our coin-flipping game, the veil of ignorance can be used to help ensure the game is played fairly. When laying out the ground rules, players who argue from the veil of ignorance don't know beforehand who will bringing the coin, who flips the coin, who wins if the coin lands on heads, and so on. This lack of information makes rules aimed at ensuring fairness less controversial. If neither party knows who's responsible for bringing the coin, both parties should be willing to agree to rules against biased coins.

While we can certainly apply the veil of ignorance to scenarios that can be modeled with probability, what makes the idea powerful is that it can be applied even when probabilistic models fails. In fact, the veil of ignorance may be even more helpful in these scenarios. Rawls notes that

\begin{quote}
The veil of ignorance implies that the parties have no basis for knowing or estimating whether the persons they represent affirm a majority or a minority religious or other doctrine. The point is that the parties cannot take risks by permitting a lesser liberty of conscience for minority religions, say, on the chance that the person each represents belongs to a majority or dominant religion and may, in that event, have an even greater liberty than that secured by equal liberty of conscience.

Were the parties to gamble in this way, they would show that they did not take seriously the religious, philosophical, and moral convictions of the persons they represent. Indeed, they would show that they did not understand the nature of religious belief, or philosophical or moral conviction. (pp. 104-105)
\end{quote}

In other words, the veil of ignorance is not mutually exclusive of mathematical modeling. However, thinking about a scenario from the veil of ignorance before jumping in to mathematical modeling can help in the development of checks and balances to ensure that an agreement is designed to be fair, regardless of an underlying probability distribution (which may or may not be straightforward to implement).

\section{So what is fairness?}

We've highlighted a few examples of fairness from a mathematical perspective, but these are by no means exhaustive. Fairness also arises in other mathematical contexts. For example, in \cite{lan2010} the authors formulate an axiomatic theory of fairness in the context of network allocation. Indeed, the study of fairness arises quite naturally in network engineering, the goal being to analyze whether or not system resources are being allocated fairly to all users of the network. For more on this, see \cite{jain}.

For our purposes, we'll think of a system as \textit{fair}, provided the following three conditions are met:

\begin{itemize}
\item At the outset, all parties consider the system from behind a veil of ignorance in order to agree on the system's goals and rules. They then come to an agreement that everyone agrees is fair.
\item Parties then observe and interact with the system in accordance with the fair agreement.
\item There is a period of assessment and recalibration based on the system's behavior. Fair agreements don't necessarily imply fair outcomes.
\end{itemize}

The last point is worth emphasizing. As we saw with the coin-flipping example, just because people enter into an agreement, this doesn't necessarily mean the game itself is fair. And just because the game isn't fair, this doesn't necessarily mean either party was intentionally trying to secure an advantage. Perhaps the coin you agree to use is subtly biased in a way that neither player knew about. This is why collecting data on the coin can be useful, if the game isn't set up in a way that neutralizes the effect of an unfair coin.

This need for feedback and responsiveness is also emphasized in \cite{oneil}. When talking about statistical systems in particular, i.e. those that feed on large datasets in order to function, author Cathy O'Neil writes that ``statistical systems require feedback--something to tell them when they're off track.... Without feedback, however, a statistical engine can continue spinning out faulty and damaging analysis while never learning from its mistakes'' (pp. 6-7). In other words, not only can a lack of feedback and assessment be unfair, it can also break the system in a fundamental way.

Finally, it's important to note that fair in these contexts may involve notions of expected value, but this isn't necessary. The purpose here is to have a useful and consistent framework for talking about fairness, not to lay a rigorous mathematical foundation.

\section{Why fairness?}

As we've seen, fairness involves a certain degree of symmetry: in a fair agreement, equal parties should have equal bargaining power. This isn't to say that fair agreements must necessarily produce fair outcomes; after all, it's not unfair if a football team is bested by a more prepared opponent. But it may be unfair if the rules are applied differently to two equally-matched teams in order to produce a winner.

Through all of this discussion, though, a question lingers: does fairness even matter? After all, in practice, life often seems quite unfair. Instead of trying to increase fairness, why not focus on something like utility, or something even more concrete, like wealth?

There are at least two responses to this question, one moral, one practical. The moral argument is that increasing fairness aligns with the idea of people being created equal, which isn't necessarily true of the other metrics mentioned above. Note that fairness does not imply everyone be granted the same amount of resources. But it does imply a certain fairness in opportunity and in treatment by the institutions of justice. Whether you are born into wealth or abject poverty, a society in which everyone has equal opportunity for upward mobility is one in with greater equality than one in which wealth inequality persists across generations.

The practical argument is that it turns out humans care about fairness. This fact has been borne out in a number of economics experiments, which are summarized in \cite{fehr}. Two illustrative examples come in the form of games: the `ultimatum game'' and the`dictator game.''

Both games involve two people a division of money; for simplicity, let's say the amount of money is \$100. In the ultimatum game, one person proposes a division, which the other person is allowed to accept or reject. If the second person accepts, the pot is split according to the agreement. But if the other person rejects, both people get nothing.

A reasonable division seems like a fifty-fifty split. After all, neither party really has to do much in this game. However, since the second person can't propose a counter-offer, and should only accept or reject, the rational thing would be for the first person to offer the smallest amount of money possible to the second person. If you propose we split the pot so that you get \$99.99 and I get \$0.01, we both walk away with more money if I accept, even though the split is so lopsided.

However, in practice, this sort of extreme rationality is rarely observed. Instead, experimental data shows that a majority of people who propose the offer offer between \$40 and \$50. Similarly, offers of less than \$20 are rejected somewhere between 40\% and 60\% of the time. As to why these offers tend to be rejected, in \cite{fehr} the authors write, `In general, the motive indicated for the rejection of positive, yet`low'', offers is that subjects view them as unfair'' (p. 622).

For people on the receiving end of the offer, then, fairness seems to be a significant factor in their decision. But what about for the folks who are making the offer? Is fairness a factor for them as well, or are they merely offering more than what their rational self-interest would prefer in order to increase the likelihood that the offer is accepted?

One way to answer this question is to consider an alternative to the ultimatum game called the `dictator game.'' This game also involves splitting a sum of money between two parties, but unlike in the ultimatum game, the person who proposes a division can't have their offer rejected. Because the risk of rejection is eliminated, the rational thing to do is for the person proposing the division to simply take all of the money. However, once again, according to \cite{fehr},`In experiments, proposers typically dictate allocations that assign the Recipient on average between 10 and 25 percent of the surplus, with modal allocations at 50 percent and zero. These allocations are much less than proposers’ offers in ultimatum games, although most players do offer something'' (p. 622). While these offers can't be attributed directly to an ingrained sense of fairness, altruism does appear to play a role in how people divide the pot even when they have complete power.

But if rational self-interest isn't our primary motivator, why do so many models assume otherwise? One reason is that competition tends to breed competitive markets, and when competition is the driving factor, incentives for fair play tend to be diminished. In other words, when it comes to competitive markets, \cite{fehr} writes the following:

\begin{blockquote}
[R]ational individuals will not express their other-regarding preferences in these markets because the market makes the achievement of other-regarding goals impossible or infinitely costly. However, a large amount of economic activity takes place outside competitive markets – in markets with a small number of traders, in markets with informational frictions, in firms and organizations, and under contracts which are neither completely specified nor enforceable. Models based on the self-interest assumption frequently make very misleading predictions in these environments, while models of other-regarding preferences predict much better'' (p. 618).
\end{blockquote}

In other words, the failure of fairness to rear its head in many economic models is because the systems being modeled don't concern themselves with being fair! But running a business is not the same as nurturing a society, and while healthy competition can be helpful, it's also important for citizens to feel they are being treated fairly.

As we'll see, if fairness isn't being prioritized or even accounted for, this typically means that the system is simply not fair. If for no other reason, our humanity should cause us to question the validity of these types of positions.

https://www.nytimes.com/interactive/2014/science/rent-division-calculator.html
https://en.wikipedia.org/wiki/Sperner%27s_lemma

Sources:

- [Comparison of frequentist and Bayesian inference](https://ocw.mit.edu/courses/mathematics/18-05-introduction-to-probability-and-statistics-spring-2014/readings/MIT18_05S14_Reading20.pdf), by Jeremy Orloff and Jonathan Bloom.

- [Probabilistic Modeling and Bayesian Analysis
  ](https://ocw.mit.edu/courses/sloan-school-of-management/15-097-prediction-machine-learning-and-statistics-spring-2012/lecture-notes/MIT15_097S12_lec15.pdf), by Ben Letham and Cynthia Rudin.

- [Rental Harmony: Sperner's Lemma in Fair Division](https://www.math.hmc.edu/~su/papers.dir/rent.pdf), by Francis Edward Su.

- [Various Techniques Used in Connection With
  Random Digits](https://mcnp.lanl.gov/pdf_files/nbs_vonneumann.pdf), by John von Neumann.

- [Worth the Risk? Modeling Irrational Gambling Behavior](https://scholarworks.umt.edu/cgi/viewcontent.cgi?article=1332&context=tme), by yours truly.