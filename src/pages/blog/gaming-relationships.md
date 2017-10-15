---
title: Gaming Relationships
date: "2017-08-21"
---

In my book, _[Power Up: Unlocking the Hidden Mathematics in Video Games](https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518/),_ I write about mathematical models of relationships inspired by games like _The Sims_ and _Skyrim_. I find the models really fun to explore, but there's only so much you can do on the printed page. Here I'd like to provide an overview of what I discuss in the book, along with some more interactive explorations of the models that come up.

The idea of modeling relationships mathematically certainly didn't originate with games. Relationship dynamics have been part of academic research for some time. They've entered popular culture through other mediums, too. One of my favorite examples is this clip from [Flight of the Conchords](https://en.wikipedia.org/wiki/Flight_of_the_Conchords), in which one of the characters, Murray, uses axes to describe his model of friendship. 

<iframe width="560" height="420" src="https://www.youtube.com/embed/Vg-zC1xXK3E" frameBorder="0" allowFullScreen key="vid1"></iframe>

As you can see, Murray's model of friendship is one that consists of a few different states, such as friends, work mates, and enemies. During the course of the episode, he updates his friendship graph in response to the actions of the show's main characters, Brett and Jemaine.

This is very similar to the way the friendship model works in games like _The Sims_. In _The Sims 4_, for example, there are three positive levels of friendship: acquaintance, friend, and good friend. Each one corresponds to a different range of values for their friendship score. You can build the score by interacting positively with other characters in the game.

Mathematically, though, these models don't do a whole lot for me. There's not much here beyond simple arithmetic. Positive interactions add a certain number of points, negative interactions subtract a certain number of points.

### Relationship Dynamics: First Model 

Things get more interesting when you start to think about one person's feelings changing in response to another person's feelings. Steven Strogatz wrote a [one-page treatment](http://ai.stanford.edu/~rajatr/articles/SS_love_dEq.pdf) of this idea in 1988. He begins by imagining two people whose feelings for one another depend entirely on the other person's feelings. In other words, the speed with which person A's feelings for person B are changing at any given point in time depend entirely on how person B is feeling, and vice versa for person A's feelings.

Think about this conceptually for a bit. Suppose that person A's feelings change in opposition to person B: when person B's feelings grow too string, person A begins to push away. But when person B begins to retreat, person A shows more interest. On the other hand, suppose that person B's feelings change in parallel with person A: when person A's feelings are strong, so are person B's, and when they're not, neither is person B's. In this case, if person B has feelings for person A, person A will react by pushing person B away. This, in turn, will cause person B to drift away, which will cause person A to to feel more strongly. This will cause person B to feel more strongly too, which will push person A away again, and the cycle repeats.

<GamingRelationships idx={0}/>

For those of you who prefer equations to visualizations, here's what we're visualizing. If _A(t)_ denotes person A's feelings at time _t_, and _B(t)_ denotes person B's feelings at time _t_, then these graphs are determined by:
 
<Latex displayMode={true} str={`
  \\begin{aligned}
  A\\prime (t) &= a \\times B(t), \\\\
  B\\prime (t) &= b \\times A(t),
  \\end{aligned}
`}/>

where _a_ measures the strength of A's response to B's feelings, and similarly for _b_. If you're not familiar with this notation, don't sweat it: _A′(t)_ is the calculus-y way of talking about the _speed_ with which A's feelings change. The higher it's value, the more quickly A's feelings are changing.

If you play around with this visualization a bit, you may reach a somewhat unsettling conclusion: none of the relationships captured by the model seem particularly healthy. By adjusting the sliders, here are some of the relationships you can model:

1. One in which each person's feelings oscillate between poisitive and negative, with the two parties never really in sync with one another.
2. One in which the relationship spirals out of control, with one person's feelings getting increasingly positive, and the other person's getting increasingly negative.
3. One in which the feelings stabilize, but only at 0, meaning that each person grows indifferent to the other over time.

Put simply, this model of relationships isn't very optimistic.

### Relationship Dynamics: Second Model 

If we want to be able to model a larger class of relationships, we'll need to add more complexity to the model. In the paper I mentioned above, Strogatz offers one possible way to add complexity. Rather than having each person's feelings depend only on the other person's, we should allow them to be a bit more self reflective. In other words, we should allow peoples' feelings to change based on the strength of _their_ current feelings, not just the feelings of their partner.

This requires a few more parameters, since we can now adjust three parameters for each person: their initial feelings, the strength with which they respond to their partner's feelings, and the strength with which they respond to their own feelings. Here's a modified visualization for you to play around with:

### Relationship Dynamics: Third Model

### The Three-Body Problem

