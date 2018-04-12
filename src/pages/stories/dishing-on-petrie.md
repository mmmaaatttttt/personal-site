---
title: "Dishing on Petrie"
date: "2018-04-30"
featured_image: "dishing_on_petrie.jpg"
caption: "ADD CAPTION"
featured_image_caption: "ADD IMAGE CAPTION"
---

Many things are rotten in the state of tech. From Susan Fowler's [essay](https://www.susanjfowler.com/blog/2017/2/19/reflecting-on-one-very-strange-year-at-uber) last year on the toxic culture at Uber, to more general reports that [60% of women in tech](https://www.elephantinthevalley.com/) have reported unwanted sexual advances, it's clear that these workplaces aren't quite the bastions of equality and meritocracy that their marketing departments would have us believe.

Course-correcting these issues has recently become big business. An article published in _The Atlantic_ last year, titled ["Why Is Silicon Valley So Awful to Women?"](https://www.theatlantic.com/magazine/archive/2017/04/why-is-silicon-valley-so-awful-to-women/517788/), gives us some sense of exactly how big:

> In January 2015, in a keynote speech at the International Consumer Electronics Show, in Las Vegas, Brian Krzanich, the CEO of Intel, announced that his company would devote $300 million to diversity efforts over the next five years. Two months later, Apple pledged $50 million to partner with nonprofits that work to improve the pipeline of women and minorities going into tech, and that spring Google announced that it would increase its annual budget for promoting diversity from $115 million to $150 million.

Unfortunately, to date these investments haven't substantially moved the needle when it comes to who gets hired at big companies like Apple, Google, or Facebook. At least, not yet.

Rather than get on a soap box and propose solutions (whose merits, as a cis-gendered white dude, I feel fairly unqualified to judge), I'd like to take an opportunity to try to dig into some of the problems. More specifically, I'd like to talk about some models of interaction that can yield stark differences in the amount of harassment received by different groups. At the center of it all is a concept called the _Petrie multiplier_, coined in a viral 2013 [blog post](http://blog.ian.gent/2013/10/the-petrie-multiplier-why-attack-on.html) by Ian Gent, and named after computer scientist Karen Petrie.

In what follows, I'd like to discuss the original model, offer up a few different spins on it, and then frame some common efforts by big companies to tackle harassment in terms of these models.

### A Model of Harassment

As discussed in Gent's post, the Petrie multiplier argues that when one group outnumbers another, the underrepresented group will receive a disproportionate share of harassment in the community, even if everyone in the group is _equally likely_ to harass another person.

In fact, the argument gets even more quantitative. To abstract things a bit, let's imagine that an organization consists only of people with blue eyes and people with green eyes. Let's further suppose that green-eyed people outnumber blue-eyed people by, say, a 2:1 ratio. In this case, Petrie argues that blue-eyed people will experience _four_ times as much harassment as green-eyed people, assuming that both groups harass one another at equal rates. If the greens outnumber the blues by a 3:1 ratio, blues will experience _nine_ times as much harassment. More generally, if there are _m_ times as many greens, blues should experience _m_ &times; _m_ times as much harassment.

The reason for this is relatively straightforward. Over time, since there are _m_ times as many greens, we should expect the blues to receive _m_ times as much harassment _in total_. But this means they should receive _m_ &times; _m_ times as much harassment as the greens _on average_, since again the greens outnumber the blues by a factor of _m_.

Gent's post simulates the scenario over time: people are selected at random to harass, and they then randomly go harass someone who is not a part of that group.

### Less Overt Aggressions

There are a couple of common critiques of Gent's post. One is that the model described there has a fixed amount of harassment (say, 70 statements) that then get distributed among the population.

Another critique is that the harassment in this model is always super overt. Person A goes to person B, says something awful, and then retreats. While this type of harassment certainly exists, the model isn't quite able to capture the kinds of "locker room talk" that happens between members of one group at the expense of members of another group. When people with green eyes get together and talk about people with blue eyes, sometimes those conversations stay private, but not always. (CEOs of giant tech companies have a [history](https://www.recode.net/2017/6/8/15765514/2013-miami-letter-uber-ceo-kalanick-employees-sex-rules-company-celebration) of their [dirty laundry](https://www.newyorker.com/magazine/2010/09/20/the-face-of-facebook) getting [aired publicly](https://techcrunch.com/2014/05/28/confirmed-snapchats-evan-spiegel-is-kind-of-an-ass/) eventually.)

To that end, I cooked up a simulation that tries to address some of these concerns.

Here's how it works. As before, imagine you have a population with two groups of people: the green eyes and the blue eyes. When the simulation starts, each person will move through the space, colliding at random with other people in the space. You can think of each collision as representing an interaction between the two people.

<Sidebar>Since the motion is random, this may not make the most realistic model of an office space, where people are more likely to move in similar patterns day-to-day. The model may make more sense in the context of something like an exhibitor's hall at a tech conference.</Sidebar>

When two people interact, there's some small probability that one of them will say something offensive about the group that they're not a part of. It could be overtly offensive, or unintentionally offensive. And, most importantly, the remark may not be directed at someone from the opposite group: for instance, if two greens collide, it's possible that one of them will say something harmful about blues during the exchange, even though no blue-eyed people were part of the collision.

However, in this model, as in real life, sound travels. If someone from the other group here's an offensive remark, that remark will be tallied. Over time, the simulation records how many offensive remarks about a group are heard by members of that group.

Let's explore. The simulation starts with 20 green-eyed people and 10 blue-eyed people, but you can adjust those parameters as you like. Once you're satisfied, start the simulation and watch the population evolve.

<HarassmentSimulation idx={0}/>

If you pressed for time, let me give you an idea of what will happen. I kept the population at 20 green and 10 blue and ran the simulation for five minutes. At the end of that time, blue-eyed people had observed 175 incidents of harassment, compared to only 97 for green-eyed people. It's not quite the 2:1 ratio that the Petrie multiplier predicts, but even in this scenario, the under-represented group receives a highly disproportionate share of the harassment.

Note that in the original argument for the Petrie multiplier, we pass from a 2:1 ratio to a 4:1 ratio by dividing the total amount of harassment each group received by the size of the group. However, such an approach doesn't make as much sense here, because in our case, it's possible for one offensive remark to be heard by _multiple_ people. This wasn't the case in the original article posed by Gent, and so it doesn't make sense to consider a similar average here.

Put more succinctly, while the Petrie effect still holds in this simulation, the multiplier is not quite as strong.

### A Dose of Reality

However, the whole thought experiment rests on a premise that seems a little hard to believe: that both groups are equally likely to say offensive things. What seems more likely is that the smaller group would be less likely to say offensive things, if for no other reason than the fact that there's safety in numbers.

If you're part of a 90% majority and harass a member of the other 10%, what's the likelihood that you'll face consequences? Unless the harassment is particularly egregious, probably not much: the other members of the group may not even view the incident as a big deal. But if you're a member of the 10% and harass a member of the 90%, the majority group is much more likely to take offense, followed by action.

Current tech culture bears this hypothesis out. According to [The Elephant in the Valley](https://www.elephantinthevalley.com/), a survey of over 200+ women in tech with at least 10 years of experience, **90%** reported witnessing "sexist behavior at company offsites and/or industry conferences." I can't imagine that 90% of men would say the same way about their female colleagues' behavior.

So, let's change up the model a bit. It's unlikely that both groups have the same likelihood of harassment. And even within a group, you're probably not as likely to make an off-color remark to everyone you interact with: green-eyed people may feel more comfortable doing so when they interact with another green-eyed person, for instance, and may have the self-awareness to try to keep themselves more in check when interacting with a blue-eyed person.

* solutions? more women, better training, better self policing

* looking at number of times the harassment is only heard in one group

- adjusting parameters

  * multiplier decreases if anyone can say anything to anyone else, but is still large
  * multiplier decreases again if we count people affected rather than incidents

- count incidents heard by ppl in power vs ppl out

https://www.theatlantic.com/magazine/archive/2017/04/why-is-silicon-valley-so-awful-to-women/517788/
http://iangent.blogspot.com/2013/10/the-petrie-multiplier-why-attack-on.html
http://www.davidchart.com/2013/10/20/the-petrie-multiplier/
https://en.wikipedia.org/wiki/Petrie_multiplier

* inclusion = reducing probability
* diversity = increasing numbers
