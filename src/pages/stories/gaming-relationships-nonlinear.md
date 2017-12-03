---
title: "Gaming Relationships: Nonlinear Approaches"
date: "2017-12-10"
featured_image: "jane_the_virgin.jpg"
caption: "Love, chaos, and a three body problem."
---

Relationships can be complicated, unpredictable, and dramatic. While this makes for great tabloid fodder or binge-worthy television, it also complicates mathematical modeling. After all, what's so unpredictable about someone's feelings if we can predict how those feelings will change at any point in the future?

We attempted just this kind of modeling exercise in our [last story](/stories/gaming-relationships-linear). We used a handful of different models to explore relationships between two people over time. And while those models grew in complexity, they all shared one common feature: they were _linear_.

What does this mean? A rigorous explanation gets a little technical, but loosely speaking, there's a limit to how complex the solutions to our linear equations can be. You may have experienced some of these limitations yourself: out of our three models, only one yielded examples of relationships that evolved and stabilized to non-zero values. And even those relationships tended to follow a predictable pattern, with each individual's feelings gradually stabilizing along a smooth, drama-free curve.

Before talking more about what makes a set of (differential) equations nonlinear, let's take a look at an example.

* * *

### Nonlinear Relationship Dynamics: First Model

Let's revisit our second model from the previous story. The equations we were modeling were these:

<Latex displayMode={true} str={`
  \\begin{aligned}
  A\\prime (t) &= a \\times B(t) + c \\times A(t), \\\\
  B\\prime (t) &= b \\times A(t) + d \\times B(t),
  \\end{aligned}
`}/>

These were the models that gave us four archetypes for people in relationships: _eager beavers_, _narcissistic nerds_, _cautious lovers_, and _hermits_. 

This model gave us some cool pictures, but it also didn't seem to do a great job modeling healthy and realistic relationships. But maybe that's because the assumptions in the model aren't healthy or realistic, either.

For example, in our model we assumed that each person had relatively simple response behavior to their partner's feelings: they either responded positively or negatively to those feelings, no matter what. But, to put it mildly, this is likely an oversimplification.

What seems more likely is that how you respond to your partner's feelings may depend on their intensity. Many people enjoy being loved and appreciated, and would respond positively to such feelings from their partner. If those feelings become too intense, though, especially early in a relationship, then they may well backfire.

Let's take a look at a model that tries to take a more nuanced approach to how each person responds to the feelings of their partner. Here are a couple of graphs. The first one is the same one from the previous story, whose equations are given above. The second one is a modified version in which each person's response to their partner will flip if the partner's feelings become too intense.

<GamingNonlinearRelationships idx={0} caption="On the left, our linear model from before; on the right, a new and nonlinear model."/>

* * *

### Linear vs. Nonlinear

These equations (along with the other ones in the last story) are _linear_. This is because in both of them, the expressions on the right hand side of the equals sign consist only of constant multiples of the functions we're trying to model (_A(t)_ and _B(t)_), along with optionally any additional _constant_ terms.

In particular, these equations don't involve any more complex expressions involving (_A(t)_ and _B(t)_, such as _A(t)_)


* * *

### The Three Body Problem

Part 2 - Three Body Problem

<GamingNonlinearRelationships idx={1} caption="tbd"/>

https://en.wikipedia.org/wiki/Lotka%E2%80%93Volterra_equations

- [Dynamical Models of Love](http://sprott.physics.wisc.edu/pubs/paper277.pdf), by J. C. Sprott