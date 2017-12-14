---
title: "Gaming Relationships: Nonlinear Approaches"
date: "2017-12-10"
featured_image: "jane_the_virgin.jpg"
caption: "Love, chaos, and a three body problem."
featured_image_caption: "Jane's relationships may be chaotic, in a mathematically precise sense. Image credit: Jane the Virgin (The CW)."
---

_(Note: this is a follow-up to my [previous story](/stories/gaming-relationships-linear). If you haven't read that one, you should! This story assumes you've checked out the earlier one._)

Relationships can be complicated, unpredictable, and dramatic. While this makes for great tabloid fodder or binge-worthy television, it also complicates mathematical modeling. After all, where's the dramatic tension if we can predict how someone's feelings will change at any point in the future?

We attempted just this kind of modeling exercise in our last story. Equipped with a handful of different models, we explored relationships between two people over time. And while those models grew in complexity, they all shared one common feature: they were _linear_.

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
  A^{\\prime} (t) &= a \\times B(t) ( 1 - \\left|B(t)\\right| ) + c \\times A(t), \\\\
  B^{\\prime} (t) &= b \\times A(t) ( 1 - \\left|A(t)\\right| ) + d \\times B(t),
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

### Love and Chaos

But even though the model above is non-linear, there's still a problem: it's highly predictable. If you use a computer to generate solutions to those equations, you can plug in any time value you want and figure out, with a high degree of precision, how each person will feel about the other. Of course, this assumes that you can measure all of the parameters that go into the equations, which is another huge assumption. But for now, let's focus on predictability.

There are some mathematical models that don't give you perfect predictive power, even when you have good information. Models of the weather are a classic example of this. Even our best mathematical models of the weather can't provide accurate forecasts more than a couple of weeks out. You could ask for a better model, but more refined models would almost certainly suffer a similar fate. The reason for this has to do with another mathematical buzzword: _chaos_.

There are a few hallmarks of chaos, but the one we'll concern ourselves with here is also the one that's the most well known. The technical term for it is _sensitivity to initial conditions_, but it's more commonly known as the [_butterfly effect_](https://www.youtube.com/watch?v=B8_dgqfPXFg).

Sensitivity to initial conditions means that if we make small changes to the input values to the system, the system may evolve in an entirely different way. Rather than small perturbations remaining small over time, instead they produce an entirely different trajectory for the system. Or, in the [words](http://mpe2013.org/2013/03/17/chaos-in-an-atmosphere-hanging-on-a-wall/) of mathematician Edward Lorenz, "Chaos: When the present determines the future, but the approximate present does not approximately determine the future."

It should be noted that sensitivity to initial conditions doesn't automatically make a system chaotic. But every chaotic system must have this property. And while linear systems like the ones we've seen so far can never be chaotic, nonlinear systems frequently are.

<Sidebar direction="right">Technically, linear systems of differential equations can be chaotic, but only if they are infinitely dimensional. But that's a rabbit hole for another day.</Sidebar>

* * *

### The Three Body Problem

While nonlinear systems can be chaotic, the one we looked at earlier in this story isn't. However, we can bring chaos into the relationship in a way that perhaps isn't so surprising: by adding a third party.

Imagine now that Person B is secretly trysting with two people, Person A and Person C. A and C don't know about one another, and so their feelings depend only on their response to B's feelings, and on their response to their own feelings. B's feelings, on the other hand, are a bit more complicated. Person B responds not only to their own feelings, but also to the combined feelings of Person A and Person C. For simplicity, we'll assume that Person A and Person C have equal effect on Person B's feelings, though you could drop this assumption in a slightly more complicated model.

In this scenario, we can think of Person B's feelings in two parts: feelings towards Person A, and feelings towards Person C. However, these two relationships are not independent. As you can see by adjusting the values, altering a parameter in Person A's personality affects both relationships, and similarly for Person C. Even though Person B may want to keep A and C in the dark, the relationships themselves cannot lie.

To see chaos in action, try adjusting one of the parameters just a little bit. For example, if you adjust A's feelings upwards just a couple of ticks, these relationships go absolutely bonkers. If you adjust A's initial feelings down a couple of ticks, things are relatively stable, but there's no rhyme or reason to how the peaks and valleys in each graph change based on this slight adjustment to initial conditions. (Note that I've extended the x-axis out so that the timeline is twice as long as in the other visualizations, so that we can see even more chaotic behavior.)

<GamingNonlinearRelationships idx={1} caption="Chaotic relationship dynamics between three people."/>

This is sensitivity to initial conditions in action. What this means is that even if you were able to accurately measure each of the parameters in the model, the slightest measurement error would destroy the predictive power of the model. While this seems like a bug, maybe it's actually a feature: after all, it doesn't seem reasonable that a mathematical model could predict _any_ future relationship state between a group of people.

In case you're curious, here are the equations used by the model:

<Latex displayMode={true} str={`
  \\begin{aligned}
  A^{\\prime} (t) &= a \\times B_{A}(t) ( 1 - \\left|B_{A}(t)\\right| ) + d \\times A(t), \\\\
  B_{A}^{\\prime} (t) &= b \\times (A(t) - C(t)) ( 1 - \\left|A(t) - C(t)\\right| ) + e \\times B_{A}(t), \\\\
  C^{\\prime} (t) &= c \\times B_{C}(t) ( 1 - \\left|B_{C}(t)\\right| ) + f \\times C(t), \\\\
  B_{C}^{\\prime} (t) &= b \\times (C(t) - A(t)) ( 1 - \\left|C(t) - A(t)\\right| ) + e \\times B_{C}(t), \\\\
  \\end{aligned}
`}/>

As you can see, compared to the first model in our previous story, things have gotten quite complicated. But the upside is that we have a much more robust model, which is able to capture a wider range of relationship behavior. And indeed, this is often a trade-off when it comes to mathematical modeling: more complexity can often yield richer behavior, but complexity also makes the models more difficult to understand and can make the results of the model less widely applicable.

While we could continue to add complexity to our model, let's stop here. I hope I've convinced you that the cold, logical realm of mathematics can have something interesting to say about human relationships, even if the more interesting models require more sophisticated mathematical machinery. If nothing else, I hope you'll be sympathetic when one of your friends complains that their love life is utter chaos: they may very well be offering an admission as heartbreaking as it is mathematically precise.

Sources:
- [Power Up: Unlocking the Hidden Mathematics in Video Games](https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518/), by me!
- [Dynamical Models of Love](http://sprott.physics.wisc.edu/pubs/paper277.pdf), by J. C. Sprott
