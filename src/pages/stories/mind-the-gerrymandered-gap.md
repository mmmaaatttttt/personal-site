---
title: "Mind the Gerrymandered Gap"
date: "2018-10-31"
featured_image: "mind_the_gerrymandered_gap.jpg"
caption: "An interactive introduction to gerrymandering."
featured_image_caption: "A map of the United States. Image credit: John-Mark Smith on Unsplash."
---

2018 has been a big year for raising awareness on how states draw congressional districts. The Supreme Court [heard two cases](https://www.washingtonpost.com/politics/courts_law/supreme-court-sidesteps-decision-on-partisan-gerrymandering/2018/06/18/c909bf26-7303-11e8-805c-4b67019fcfe4_story.html) arguing that the way states delineate these districts is, in certain cases, unconstitutional. Pennsylvania's state supreme court said that its congressional lines were in violation of the state constitution, and then [assigned a new map](https://www.washingtonpost.com/news/wonk/wp/2018/02/19/pennsylvania-supreme-court-draws-a-much-more-competitive-district-map-to-overturn-republican-gerrymander/) when the state legislature couldn't come up with one on its own. And voters in Michigan, Missouri, Utah, and Colorado can expect to vote on redistricting measures [this fall](https://www.nytimes.com/2018/07/23/us/gerrymandering-states.html).

So what's wrong with these district lines, and why are things coming to a head now? In this story, we'll outline the problem, explore some strategies for trying to detect when partisan gerrymandering has occurred, and examine some potential fixes. 

### A Brief Introduction to Gerrymandering

Creating districts isn't a new problem in America: it's something we do every decade, after each new census. Every state is awarded a certain number of representatives, in rough proportion to the state population, and then the state must decide how to assign regions to each representative. The state has control over how it decides to draw district lines: some do it through the legislature, some do it through independent commissions, and so on.

There are some basic redistricting rules that states must abide by, such as ensuring that each district is of approximately the same population. The Voting Rights Act prohibits states from creating districts that discriminate on the basis of race. States are free to add their own rules for redistricting (some common ones can be found [here](http://www.ncsl.org/research/redistricting/redistricting-criteria.aspx)), but in general the guidelines are fairly minimal.

Unfortunately, this means that the process of drawing congressional lines is ripe for manipulation. And in many cases, when one party is in power, it's possible for them to draw congressional boundaries in a way that preserves or enhances their power, by exploiting geography to bolster their representation in Congress. This process, as you may well know, is called **gerrymandering**. The name comes from an 1812 political cartoon which draws attention to a wonky looking state senate district. The name itself is a portmanteau of the name of the Governor at the time, Elbridge Gerry, and the word _salamander_.

<CaptionedImage caption="In a cruel twist of fate, Gerry pronounced his last name with a hard 'G.' (Source: Wikipedia)" width="60%" src="first_gerrymander.png" />

Gerry caught flak for the shape of this district because it was believed that the district was drawn this way to help his party in an upcoming election.

### Gerrymandering for Fun and Profit! (But Mostly for Fun)

It turns out that it's not too hard to gerrymander districts. Let's take a look at a simplified example. Imagine a region with 54 citizens, evenly divided among two parties: the blue party and the red party. You are part of a committee tasked with dividing this region into six contiguous districts of the same size: nine citizens each. Each district will have a representative in the government that is elected by members from that district.

How would you draw congressional lines to divide this region into six districts?

<SampleGerrymander/>

Typically gerrymandering is achieved by combining two strategies: **packing** and **cracking**. Packing refers to consolidating large numbers of one party into a small number of districts. Cracking is the opposite: diluting the voting power of a large bloc of voters in one party by splitting them up so that they form minorities in multiple districts.

Maybe you were magnanimous and tried to give equal representation to all citizens. Or maybe you have a strong preference between red and blue, and tried to dilute the vote for one party. If you're in the latter camp, take another look at the district map you created above. Which districts are packed with voters from one party? Which districts crack up voters in one party to dilute their voting power, by making them a minority of voters across several districts?

In this simplified example, gerrymandering isn't hard to do. It's also not that hard to detect; since the distribution of voters is evenly split, if the districts heavily favor one party over another, it's a clue that some shenanigans could be going on.

### Detecting Gerrymandering: A Brief History

Historically, gerrymandering has been treated like pornography: you know it when you see it. If a district had an extremely strange looking shape, it was immediately held up for suspicion.

Because of this, some of the first attempts to measure and detect gerrymandering focused on the geometry of a given district. More specifically, they often focused on the idea of _compactness_, the idea being that districts drawn in good faith should have a relatively compact, non-controversial-looking shape.

But while compactness has a precise [mathematical definition](https://blogs.scientificamerican.com/roots-of-unity/what-does-compactness-really-mean/), in congressional drawing circles the term is more of a loose idea. Some have tried to make the idea of compactness more mathematically precise by framing it terms of areas and perimeters. This idea stems from an interesting mathematical fact: given a fixed length of string, the largest area you can enclose with that string will form a circle. (If you want to get fancy, this is known as the [isoperimetric inequality](https://en.wikipedia.org/wiki/Isoperimetric_inequality).)

SOME TYPE OF INTERACTIVE HERE.

What does this have to do with compactness? Well, if you have a district of a certain area, you can calculate the length of its boundary, and then ask what the area of a circle with that same boundary length would be. By the isoperimetric inequality, the circle will necessarily have a larger area, unless the district too is in the shape of a perfect circle.

Once you have these two shapes - the district and the circle - you can calculate the ratio of the district's area to the circle's area. The thinking here is that if the ratio is close to 1, then the district will be relatively compact. But if the ratio is very small, or close to 0, this indicates that the district is essentially making poor use of its boundary. Since there's a long boundary enclosing a relatively small area, this might suggest an excessively gerrymandered district.

The Washington Post did an analysis of all of the congressional districts in 2014 using this measure of compactness; you can find all the measurements [here](http://www.washingtonpost.com/wp-srv/special/politics/gerrymandering/?noredirect=on). For example, they found that the fourth congressional district in Illinois had a ratio of district area to comparable circle area of only 0.1596. This value, being much closer to 0, suggests maybe there's some gerrymandering shenanigans going on. 

But don't just blindly believe the numbers. Take a look at the district and judge for yourself:

<CaptionedImage caption="The fourth congressional district in Illinois (Source: Wikipedia)" width="100%" src="il-04.png" />

### Concerns with Compactness

Removed from context, the fourth district of Illinois looks highly suspicious. Its meandering shape through Chicago and out into the 'burbs suggests that there could be some packing going on. And indeed there is, but the reasoning behind it is different than you might expect.

Put simply, the district's shape is a consequence of the Voting Rights Act. The district combines two majority-Hispanic populations into one congressional district. The federal government mandated the creation of such a district in an attempt to remedy previous violations of the Voting Rights Act, and the constitutionality of this district has been upheld by the Supreme Court ([here's](https://www.senate.mn/departments/scr/REDIST/Redsum/ilsum.htm) a reference with more detail if you're interested).

In other words, if you're concerned about the aggressive use of gerrymandering to enhance the power of the already powerful, you need to be a bit careful about using shape alone as your metric. 

Let's look at another example. Historically, there have been a few long and skinny districts that would fail most tests for compactness. From 2003 to 2013, for instance, California's 23rd district covered hundreds of miles of Pacific coastline, but barely any land farther inland: 

<CaptionedImage caption="The fourth congressional district in Illinois (Source: Wikipedia)" width="100%" src="ca-23.png" />

Ohio's 9th district currently has a similar shape; it hugs the southern edge of Lake Erie.

<CaptionedImage caption="The fourth congressional district in Illinois (Source: Wikipedia)" width="100%" src="oh-09.png" />

So, are these districts further examples of partisan gerrymandering? Or, were they created because coastal residents in these states are likely to have more similar needs from their representatives compared to folks who live farther away from the water? Looking at the shapes of these districts in isolation, either possibility seems plausible.

For these reasons, compactness arguments haven't really held up in court battles fighting gerrymandering. It's simply too difficult to look at one district in isolation and prove that it was intentionally gerrymandered to favor one party over another.

Therefore, recent advances in detecting gerrymandering have focused not on single districts, but on states as a whole. Forget about compactness; forget about the shape of the district entirely. If you can prove that there's a pattern of bias across many districts in favor of one party over another, there's your smoking gun.

Plenty of people have worked on developing objective mathematical measures that can assess whether or not a state has been too extensively gerrymandered. A few different ideas have been explored, but one of the most popular new techniques is also relatively simple, and requires little more than basic arithmetic.

### Quantifying Gerrymandering: The Efficiency Gap

Voting is inherently an inefficient mechanism for electing officials who represent the interests of a large group of people. This is because in most cases, the winner is determined by **winner take all**.

In this system, if your candidate loses, it's easy to think of your vote as being wasted, in that the official who won and now represents you likely doesn't actually represent you. But people who vote for losing candidates aren't the only ones whose votes can be wasted. Even votes for winners can be considered wasted, if they're in excess of the simple majority needed to squeeze out a win. In other words, if your candidate won by 10,000 votes, one could consider 9,999 of those votes "wasted," since the candidate still would've one even if the margin had been that much smaller.

The **efficiency gap** is a gerrymandering metric that takes these observations into account. Essentially it calculates the number of wasted votes for each party, and determines whether there's a _systemic bias_ towards wasted votes in one party compared to another.

This gap is calculated by calculating the difference between the number votes each party has wasted, and dividing that tally by the total number of votes cast.

<EfficiencyGapTable/>

As you can see, this calculation has nothing to do with the shape of the districts, and everything to do with the resulting election outcome. When a collection of districts yield a high efficiency gap, does this mean that something sinister is going on with redistricting? In order to answer this question more fully, we need to take a look at how this metric fares against actual election data.

### The Efficiency Gap in the Wild

Let's take a look at historical data on congressional elections in the United States.

In the map below, states in this are colored according to the size of the efficiency gap. Darker red indicates an efficiency gap favoring Republicans; darker blue indicates an efficiency gap favoring Democrats.

Note that it's impossible to gerrymander a state with only one representative, so those states are greyed out. Also, only vote tallies for Democrat and Republican candidates are considered. In the event that a district did not have both a Republican and a Democrat on the ballot, that district has been ignored. (TO DO: better estimate the gap in these scenarios, and include historical data so you can see how the efficiency gap changes across time in different states.)

<GerrymanderHistoricalMap />

some wrapper over USMap
addGeometryProperties={this.addGeometryProperties}
colors={[COLORS.DARK_BLUE, COLORS.WHITE, COLORS.RED]}
domain={[-0.5, 0, 0.5]}
data={voteData}
fillAccessor={this.fillAccessor}
getTooltipTitle={d => d.name}
getTooltipBody={this.getTooltipBody}

- if data doesn't exist for district, base on:

  - average of district results within that decade (i.e. same district lines)
    if that data doesn't exist, base on presidential results for that decade in that district -
    https://web.archive.org/web/20111230051047/http://swingstateproject.com/diary/4161
    https://www.dailykos.com/stories/2012/11/19/1163009/-Daily-Kos-Elections-presidential-results-by-congressional-district-for-the-2012-2008-elections
  - if no votes for either party, find average of adjacent elections (either pres or non-pres)
  - also look to nearby districts for data
  - easier data to scrape: http://clerk.house.gov/member_info/electionInfo/1994/94Stat.htm

- problems with the EG
- talk about how increased partisanship and technology are making things worse
- partisanship vs avg efficiency gaps across states?
- has gerrymandering gotten worse over time?
- scatterplot for presidential vote difference vs efficiency gap over time


Sources:

- [Efforts to limit partisan gerrymandering falter at Supreme Court](https://www.washingtonpost.com/politics/courts_law/supreme-court-sidesteps-decision-on-partisan-gerrymandering/2018/06/18/c909bf26-7303-11e8-805c-4b67019fcfe4_story.html)
- [Pennsylvania Supreme Court draws 'much more competitive' district map to overturn Republican gerrymander](https://www.washingtonpost.com/news/wonk/wp/2018/02/19/pennsylvania-supreme-court-draws-a-much-more-competitive-district-map-to-overturn-republican-gerrymander/)
- [Drive Against Gerrymandering Finds New Life in Ballot Initiatives](https://www.nytimes.com/2018/07/23/us/gerrymandering-states.html)
- [Extreme Maps](https://www.politico.com/f/?id=0000015c-11a2-d46a-a3ff-9da240e10002)
- [What Does Compactness Really Mean?](https://blogs.scientificamerican.com/roots-of-unity/what-does-compactness-really-mean/)
- [America's Most Gerrymandered Congressional Districts](https://www.washingtonpost.com/news/wonk/wp/2014/05/15/americas-most-gerrymandered-congressional-districts/)
- CHECK THIS AGAINST FIRST STORY