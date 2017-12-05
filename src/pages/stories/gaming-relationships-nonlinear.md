---
title: "Gaming Relationships: Nonlinear Approaches"
date: "2017-12-10"
featured_image: "jane_the_virgin.jpg"
caption: "Love, chaos, and a three body problem."
---

Relationships can be complicated, unpredictable, and dramatic. While this makes for great tabloid fodder or binge-worthy television, it also complicates mathematical modeling. After all, where's the dramatic tension if we can predict how someone's feelings will change at any point in the future?

We attempted just this kind of modeling exercise in our [last story](/stories/gaming-relationships-linear). Equipped with a handful of different models, we explored relationships between two people over time. And while those models grew in complexity, they all shared one common feature: they were _linear_.

What does this mean? A rigorous explanation gets a little technical, but loosely speaking, there's a limit to how complex the solutions to our linear equations can be. You may have experienced some of these limitations yourself: out of our three models, only one yielded examples of relationships that evolved and stabilized to non-zero values. And even those relationships tended to follow a predictable pattern, with each individual's feelings gradually stabilizing along a smooth, relatively drama-free curve.

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

For example, this model assumes that each person has relatively simple response behavior to their partner's feelings: they either respond positively or negatively to those feelings, no matter what. But this an oversimplification.

What seems more likely is that your response to your partner's feelings may depend on the intensity of those feelings. Many people enjoy being loved and appreciated, and would respond positively to such feelings from their partner. If those feelings become too intense, though, especially early in a relationship, then they may well backfire.

Let's take a look at a model that takes a more nuanced approach to how each person responds to the feelings of their partner. Below are a couple of graphs. The first one is the same one from the previous story, whose equations are given above. The second one is a modified version in which each person's response to their partner will flip if the partner's feelings become too intense. (For more on this model, check out _Dynamical Models of Love_, a paper by J. C. Sprott. There's a link at the end of this story.)

<GamingNonlinearRelationships idx={0} caption="On the left, our linear model from before; on the right, a new and nonlinear model."/>

As you explore these models, it's pretty clear that the latter one allows for a larger family of relationships. For example, the second model allows for relationships that stabilize but still have some variation.

So how is the second model different? Well, here are the equations used:

<Latex displayMode={true} str={`
  \\begin{aligned}
  A\\prime (t) &= a \\times B(t) ( 1 - \\left|B(t)\\right| ) + c \\times A(t), \\\\
  B\\prime (t) &= b \\times A(t) ( 1 - \\left|A(t)\\right| ) + d \\times B(t),
  \\end{aligned}
`}/>

We'll talk more about the notation in just a bit. These equations certainly look a little complicated. But what does it mean for them to be _nonlinear_?

* * *

### Linear vs. Nonlinear

All of the equations in our last story, including the ones for the first model above, are _linear_. This is because in both of them, the expressions on the right hand side of the equals sign consist only of **constant multiples of the functions we're trying to model** (_A(t)_ and _B(t)_), along with optionally any additional _constant_ terms.

In particular, these equations don't involve any more complex expressions involving _A(t)_ and _B(t)_, such as _A(t)_ &times; _B(t)_, _A(t)_ &times; _A(t)_, or more complex expressions, such as _A(t)_ &times; (1 - |_A(t)_|).

<Sidebar>If you've gotten far enough in my book, you'll see that I talk about this nonlinear example at length. Unfortunately, I let a pretty egregious error slip through: the figures are correct, but the functions aren't! In the book I replaced the absolute value function by a different function accidentally. One thousand apologies!</Sidebar>

(In case you need a refresher, the notation |_x_| denotes the absolute value of _x_, which measures the magnitude of _x_ and ignores its sign. So, for example, |5| = 5, but |-5| = 5 too.)

The linear models we've seen so far are examples of a family of equations that are well-understood by mathematicians. (For more on that family, click [here](https://en.wikipedia.org/wiki/Matrix_differential_equation).) However, nonlinear models are much trickier in general. One reason for this is that with a system of linear differential equations, you can combine solutions you've already found in order to generate new solutions. However, this is not possible in general with nonlinear systems, which makes solving them much more challenging. In fact, one of the Clay Mathematics Institute [Millenium Problems](http://www.claymath.org/millennium-problems) revolves around the [Navier-Stokes](https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations) equations, a famious system of nonlinear differential equations. A solution to this problem will bring you a million dollars and an unlimited supply of mathematical street cred.

Because the real world is endlessly complex, it should come as no surprise that it's also full of nonlinear systems of differential equations. These systems are used to model a wide variety of phenomena, from [predator/prey relationships](https://en.wikipedia.org/wiki/Lotka%E2%80%93Volterra_equations), to the [weather](https://en.wikipedia.org/wiki/Primitive_equations), to [superconductivity](https://en.wikipedia.org/wiki/Ginzburg%E2%80%93Landau_theory). And yes, they're even used to model love.

* * *

### The Three Body Problem


<GamingNonlinearRelationships idx={1} caption="tbd"/>


https://en.wikipedia.org/wiki/Nonlinear_system#Nonlinear_differential_equations

- [Dynamical Models of Love](http://sprott.physics.wisc.edu/pubs/paper277.pdf), by J. C. Sprott