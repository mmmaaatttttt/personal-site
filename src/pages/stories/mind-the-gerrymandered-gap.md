---
title: "Mind the Gerrymandered Gap"
date: "2018-08-31"
featured_image: "mind_the_gerrymandered_gap.jpg"
caption: "An interactive introduction to gerrymandering."
featured_image_caption: "A map of the United States. Image credit: John-Mark Smith on Unsplash."
---

2018 has been a big year for raising awareness on how states draw congressional districts. The Supreme Court [heard two cases](https://www.washingtonpost.com/politics/courts_law/supreme-court-sidesteps-decision-on-partisan-gerrymandering/2018/06/18/c909bf26-7303-11e8-805c-4b67019fcfe4_story.html) arguing that the way states delineate these districts is, in certain cases, unconstitutional. Pennsylvania's state supreme court said that its congressional lines were in violation of the state constitution, and then [assigned a new map](https://www.washingtonpost.com/news/wonk/wp/2018/02/19/pennsylvania-supreme-court-draws-a-much-more-competitive-district-map-to-overturn-republican-gerrymander/) when the state legislature couldn't come up with one on its own. And voters in Michigan, Missouri, Utah, and Colorado can expect to vote on redistricting measures [in the fall](https://www.nytimes.com/2018/07/23/us/gerrymandering-states.html).

So what's the problem with these district lines, and why are things coming to a head now? In this story, we'll ADD WORDZ HERE!!!!!!!!!, and explore some new strategies for trying to detect when partisan gerrymandering has occurred.

Creating districts isn't a new problem in America: it's something we do every decade, after each new census. Every state is awarded a certain number of representatives, in rough proportion to the state population, and then the state must decide how to assign regions to each representative. The state has control over how it decides to draw district lines: some do it through the legislature, some do it through independent commissions, and so on.

There are some basic redistricting rules that states must abide by, such as ensuring that each district is of approximately the same population. The Voting Rights Act prohibits states from creating districts that discriminate on the basis of race. States are free to add their own rules for redistricting (some common ones can be found [here](http://www.ncsl.org/research/redistricting/redistricting-criteria.aspx)), but in general the guidelines are fairly minimal.

Unfortunately, this means that the process of drawing congressional lines is ripe for manipulation. And in many cases, when one party is in power, it's possible for them to draw congressional boundaries in a way that preserves or enhances their power, by exploiting geography to bolster their representation in Congress. This process, as you may well know, is called **gerrymandering**. The name comes from an 1812 political cartoon which draws attention to a wonky looking state senate district. The name itself is a portmanteau of the name of the Governor at the time, Elbridge Gerry, and the word _salamander_.

<CaptionedImage caption="In a cruel twist of fate, Gerry pronounced his last name with a hard 'G.' (Source: Wikipedia)" width="60%" src="first_gerrymander.png" />

Gerry caught flak for the shape of this district because it was believed that the district was drawn this way to help his party in an upcoming election.

It turns out that it's not too hard to gerrymander districts. Let's take a look at a simplified example. Imagine a region with 30 citizens, evenly divided among two parties: the blue party and the red party. You are part of a committee tasked with dividing this region into six contiguous districts of the same size: 5 citizens each. Each district will have a representative in the government that is elected by members from that district.

How would you draw congressional lines to divide this region into six districts?

<SampleGerrymander >
  hello
  goodbye
  tight
</SampleGerrymander>

try this: https://stackoverflow.com/questions/43313372/how-to-listen-to-localstorage-in-react-js

Typically gerrymandering is achieved by combining two strategies: **packing** and **cracking**. Packing refers to consolidating large numbers of one party into a small number of districts. Cracking is the opposite: diluting the voting power of a large bloc of voters in one part by splitting them up so that they form minorities in multiple districts.

Long considered an esoteric political topic, gerrymandering has received a great deal of attention recently. In part this is due to some high profile Supreme Court cases, along with the advent of technologies that make gerrymandering easier to do.

But as gerrymandering has become more well-known, techniques for combating it have begun springing up as well. One of the most common new techniques is also relatively simple, and requires little more than basic arithmetic.

<EfficiencyGapTable/>

Sources:

- [Efforts to limit partisan gerrymandering falter at Supreme Court](https://www.washingtonpost.com/politics/courts_law/supreme-court-sidesteps-decision-on-partisan-gerrymandering/2018/06/18/c909bf26-7303-11e8-805c-4b67019fcfe4_story.html)
- [Pennsylvania Supreme Court draws 'much more competitive' district map to overturn Republican gerrymander](https://www.washingtonpost.com/news/wonk/wp/2018/02/19/pennsylvania-supreme-court-draws-a-much-more-competitive-district-map-to-overturn-republican-gerrymander/)
- [Drive Against Gerrymandering Finds New Life in Ballot Initiatives](https://www.nytimes.com/2018/07/23/us/gerrymandering-states.html)
