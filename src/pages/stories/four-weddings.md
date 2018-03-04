---
title: "Four (Hundred and Thirty-Two) Weddings"
date: "2018-02-28"
featured_image: "four_weddings.jpg"
caption: "ADD A CAPTION"
featured_image_caption: "ADD AN IMAGE CAPTION."
---

When my wife and I first got engaged, we spent a fair amount of time doing what any newly engaged American couple does: watching a lot of wedding-themed reality television. I'm not ashamed to admit that I've seen more than my fair share of [_Say Yes to the Dress_](https://en.wikipedia.org/wiki/Say_Yes_to_the_Dress). There were other shows that made it into the rotation too. However, the one I remember most fondly was a little gem called [_Four Weddings_](https://en.wikipedia.org/wiki/Four_Weddings), which aired on the TLC Network.

This show had everything. It featured couples from all over the country, with a wide variety of wedding themes, budgets, and eccentricities. There was just the right blend of community and competition. And for a math nerd like myself, there were enough numbers flying across the screen to keep my interest.

If you've never seen the show, here's a quick overview. In each episode, four strangers go to each other's weddings, and then rate the weddings on a few different scales. The bride with the highest-scoring wedding receives an all-expenses paid honeymoon (at least, in [most cases](http://www.thelist.com/25422/untold-truth-behind-four-weddings/)). As the show progresses, you get to see not only how everyone rated the weddings, but you also get some basic demographic information about the brides. This includes things like their age, location, wedding size, and wedding budget.

When I first discovered _Four Weddings_, I thought it might be fun to compile the statistics and see what sorts of trends emerged. But alas, this was in the stone age of 2011, before streaming television had taken off to the extent that it has now. In order to collect data, I had to wait for an episode to air, record it on our DVR, and then speed through it as best I could to record any relevant data. This was a slow process, and after a while I threw in the towel.

Recently, however, I discovered that Four Weddings is [making a comeback](https://www.usmagazine.com/entertainment/news/four-weddings-returns-to-tlc-for-seventh-season-is-casting-now-w495299/). And whether out of pure coincidence, or to help market this reboot, it's now possible to find almost all of these episodes available for streaming on the [TLC website](https://www.tlc.com/tv-shows/four-weddings/). When I made this discovery, I knew what I had to do: make a pot of coffee, and watch a lot of women get married. Four hundred and thirty-two, to be precise, spread out over 108 episodes.

In what follows, I'd like to share with you what I learned.

### "I Do" Demographics

Before we get into the competition aspect of the show, I'd like to start with some basic demographic information regarding the couples and their weddings. First, here's a heat map highlighting where each of those 432 weddings took place. You can also adjust the map to display the average budget per wedding by state.

 <FourWeddingsVisualization visType="map" caption="Figure 1: Geographic wedding demographics. Hover over a state to learn more." />

As you can see, brides in most states were not represented in the show. Of the states that made an appearance, New York and Florida are by far the most frequent destinations; these two states alone account for nearly 42% of the weddings in the data set. On the other end of the spectrum, Ohio and New Hampshire are only represented by a single wedding each.

In terms of average budget, New York and New Jersey take the cake; weddings in these states on the show cost nearly $40,000, on average.

For more detailed budget information, here's a histogram with budget information for every wedding on the show. You can also look at breakdowns of the number of guests at the wedding, budget per guest, bride's age, spouse's age, and the age gap between the two people getting married.

 <FourWeddingsVisualization visType="histogram" caption="Figure 2: Basic information for the brides and their weddings."/>

The chart should speak for itself, but here are some additional highlights:

* Overall, weddings on the show had an average budget of **$31,058**. They had a median budget of **$25,000**.
* The average guest count was nearly **154**. The median guest count was **145**.
* The average bride age was **29.2**. The average age of the spouse was **31.6**.
* The average gap between the age of the spouse and the age of the bride was **2.4** years.
* **52.5%** of the time, the gap between the age of the bride and the age of the spouse was 3 years or less. **6.7%** of the time, the bride was more than 3 years older than the spouse. **40.7%** of the time, the spouse was at least 3 years older than the bride.
* Not all spouses are husbands! There were a handful of same-sex weddings featured on the show.

This demographic information is nice to know, but doesn't really address the question that first piqued my curiosity: _given the data about each wedding, can we predict which wedding will win?_

### Ratings and Rankings

Before digging deeper into the data, we'll need to know a bit more about how the winner is determined. First, each bride gives the other three weddings an _overall experience_ score. This is a rating on a ten-point scale that reflects one's overall feelings about the wedding.

This isn't the entire story, of course. If it were, it's easy to imagine that the scoring system would quickly devolve into a race to the bottom, where each woman scores the other weddings poorly in the hopes that somehow her own wedding will be able to eke out a win.

To keep this from happening, brides also assess three other categories: the food, the venue, and the wedding dress. Unlike the overall experience score, however, brides simply rank the weddings in these categories as first, second, or third place. Each ranking has a corresponding point value:

| Rank | Point Value |
| ---- | ----------- |
| 1st  | 10          |
| 2nd  | 6           |
| 3rd  | 3           |

In this way, it's harder to game the system, since each bride is forced to dole out a perfect 10 once in each category.

This means that the maximum possible score a wedding can receive is 120 points: 30 points in each category. On the other hand, the minimum possible score is 27 (9 points in each of the ranked categories, and 0 for overall experience).

In the event that there's a tie in total score, the winner is the person with the higher overall experience score. There are tie-breaking rules in the event tha the overall experience scores are the same too, but we won't go into them here, because this was a rare occurrence and the rules changed over the course of the show.

### Winning Weddings

Now that we know a bit more about how the game is played, let's explore some statistics that might predict the winning wedding.

One natural hypothesis is that wedding budget should have some predictive power. After all, more money likely means a fancier dress, better food, a more elaborate venue, or all of the above!

How can we look at the effect of wedding budget on the final outcome? One way to do it is to group the winners by whether they had the highest, second highest, third highest, or lowest budget among their foursome. If budget has little impact, you'd expect brides with the lowest budget to win about as often as brides with the highest budget. In other words, you'd expect each group to win roughly 25% of the time.

However, that's not what happens. As the chart below shows, weddings with the highest budget in their group won 45% of the time. On the other end of the spectrum, weddings with the lowest budget in their group won only 11% of the time. Perhaps unsurprisingly, people who spend more on weddings tend to have the weddings that people enjoy the most.

<FourWeddingsVisualization visType="pie" caption="Figure 3: Share of winning weddings by rankings in different categories. First place rankings are blue, second place rankings are green, then orange, then red."/>

There are a few other stats you can play around with in the pie chart. Initially I'd thought that budget per guest might be a strong predictor of success as well, but it turns out to be weaker than the budget on its own (32.4% vs. 45%).

The other predictors you can explore don't have to do with budget, and instead involve the experience points ratings that the brides give and receive. First, note that the number of overall experience points a bride gives out doesn't seem to have an effect on the likelihood of her winning. This isn't so surprising; there's no real incentive for altruism on the show.

On the other hand, getting the highest overall experience score is an even stronger predictor for winning than budget: 60.6% of winners had the highest experience score in the group. Again, this shouldn't be so surprising: if people rate your wedding high in overall experience, it's probable that they also ranked your food, dress, or venue highly as well. In addition, as mentioned before, overall experience score is used as a tie-breaker in the event that multiple people tie for highest total.

Here's where things take an interesting turn. The last category you can examine is what I call the _overall experience gap_, that is, the difference between how many overall experience points a bride _received_, and how many overall experience points a bride _gave_. As you can see, this gap is the second best predictor for success among winners: over half of all winning brides also had the largest overall experience gap!

Of course, this doesn't necessarily mean that brides with popular weddings are sabotaging their competitors by giving them poor experience scores. In fact, since winning is strongly associated with high experience scores, it could be that the gap is larger for women who win simply because the overall experience scores they received were so high.

### Plotting All The Things

* Predictors

* scatterplot (bunch of stuff vs total points: cost, cost per person, wife's age, number of people, exp points given)
* general histograms

  * wedding size
  * total spend
  * cost per person
  * experience points given
  * total points received
  * age gap between ppl
  * wife's age

* diff between 1st and second place?

NLP for predicting winner
