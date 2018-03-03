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

 <FourWeddingsVisualization visType="histogramOne" caption="Figure 2: Basic information for the brides and their weddings."/>

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

### Winning Weddings

Now that we know a bit more about

  <FourWeddingsVisualization visType="pie" caption="Figure 3: ADD A CAPTION."/>

* circle chart (% of winners who spent most, 2nd most, 3rd most, 4th most, also toggleable to cost per person. also see rankings based on exp points received, or exp points gained)

- Predictors

 <FourWeddingsVisualization visType="histogramTwo" caption="Figure 4: ADD A CAPTION"/>

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
