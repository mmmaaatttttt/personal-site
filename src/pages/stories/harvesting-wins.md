---
title: "Harvesting Wins"
date: "2018-06-01"
featured_image: "orchard_child.jpg"
caption: "Modeling the likelihood of board-game victory."
featured_image_caption: "Adorable child eating fruit. Image credit: Alexas_Fotos on Pixabay."
---

A few months back, my son began to show an interest in board games. He was only two years old at the time, so we couldn't play anything too complicated (sorry, [Catan](https://en.wikipedia.org/wiki/Catan) lovers), but even for very young children, there's a surprising amount of board-game variety.

One of the games we play regularly is called _First Orchard_. In this game, players cooperate to harvest fruit from an orchard before it gets discovered by a raven. If all of the fruit is removed before the raven appears, everyone wins; if the raven makes it to the orchard before all of the fruit has been harvested, everyone loses.

<CaptionedImage caption="Box Art for First Orchard (Source: HABA USA)" width="70%" src="first_orchard.jpg" />

The rules of the game are relatively straightforward. The orchard has sixteen fruits, divided into four fruits of four different colors. On your turn, you roll a six-sided die. If the color on the die matches one of the fruit colors, you are allowed to move a fruit of that color into a fruit basket. For example, if you roll red and there are three red apples left, you can remove one. If there are no red apples left, you lose your turn.

What about the other two sides of the die? One of them represents the dastardly raven: if you roll black, then the raven advances one space closer to the orchard. If the raven comes up five times before the orchard is clear, you lose.

Thus far, there's no strategy to the game: you simply roll the die and do what the rules tell you to do. The final twist comes in the last face of the die, which depicts a fruit basket. The fruit basket acts as a sort of wild card: if it comes up, you're free to remove one fruit from anywhere in the orchard, regardless of color. Here's where a simple strategy begins to emerge.

But reading about the rules is way less fun than playing the game. So here's a stripped down version of it. The rules are the same as in the actual game, but I've swapped out a spinner for a die, and unfortunately my raven-drawing skills leave much to be desired. In spite of this, I hope you'll find this provides you with a decent understanding of the game's mechanics.

The tiles on the bottom keep track of how many fruits in each color are remaining. Similarly, the value in the black tile at the bottom right represents the number of paces until the raven reaches the orchard.

<OrchardGame caption="Figure 1: An online orchard game."/>

### Don't Feed the Birds

After playing this game a few times with my son, I developed a strategy that made sense to me. To understand the strategy it's helpful to think of an extreme example. Suppose you have one red fruit and two green fruits remaining when you roll a wild card. If you decide to put the red fruit in your basket, you'll have two green fruits left. On any subsequent roll, you'll then have a 1 / 6 chance of advancing the raven, and a 2 / 6 chance of removing a green fruit (since you can roll either green or the wild card to remove a fruit).

If, on the other hand, you decide to put the green fruit in the basket, you'll still have two fruits left: one red, and one green. Similarly, your chances of advancing the raven on your next roll will still be 1 / 6. Unlike before, however, your chances of removing a fruit on your next roll will improve to 3 / 6, since you can roll red, green, or a wild card in order to remove a fruit.

The strategy of using your wild card to remove the fruit that's the most plentiful makes intuitive sense, to me anyway. But of course, it's not the only wild-card strategy one could use. Here's a list of different strategies that come to mind:

1.  **Remove the most plentiful.** This is the strategy we've just discussed, in which you remove the fruit that's the most plentiful in the orchard. If multiple fruit colors meet this condition, just pick one.

    _Example_: If your orchard has 4 red, 3 green, 2 blue, and 1 yellow, remove a red.

2.  **Remove the least plentiful.** This is the opposite of the previous strategy. Here we remove the rarest fruit from the orchard. Again, if multiple fruit colors meet this condition, just pick one.

    _Example_: If your orchard has 4 red, 3 green, 2 blue, and 1 yellow, remove a yellow.

3.  **Remove at random.** This is the no-strategy strategy: if you roll a wild card, just randomly select a fruit to put into the basket.

    _Example_: If your orchard has 4 red, 3 green, 2 blue, and 1 yellow, select red with a 25% probability, green with a 25% probability, blue with a 25% probability, and yellow with a 25% probability.

4.  **Remove your favorite color.** I'm reasonably confident that this is the strategy my two-year-old prefers. In this scenario, you remove the fruits based on how much you like the colors of the fruits.

    _Example_: If your favorite color is red, then you'll remove all red fruits. Once there are no more red fruits, you'll move on to your second-favorite color, and so on.

So which of these strategies is the best? You could answer that question by formulating a rigorous theoretical proof, or by playing the game hundreds and gathering a boatload of experimental data.

Or, you could let a computer do the heavy lifting for you. For brevity's sake, let's take this approach and see where it leads us.

### That's So Raven

When you click "Play" in the simulation below, your computer will begin playing _First Orchard_ at the rate of 200 games per second. Those 200 games will be evenly split across the four strategies outlined above: 50 games per second for the most plentiful strategy, 50 games per second for the least plentiful strategy, and so on.

I'd encourage you to write down guesses for how often each of these strategies will result in a win. When you're ready, watch the simulation go! (You can hover over any of the bars for more information on wins and losses.)

<OrchardGameSimulation caption="Figure 2: Simulating multiple playthroughs of First Orchard."/>

The specific numbers you see will vary, of course, but will even out the longer you let the simulation run. Because I'm a little impatient, I increased the speed of the simulation on my own machine and let it play 100,000,000 games with each strategy. By that point, the percentages are quite stable. Here's the breakdown:

| Strategy        | Probability of Success |
| --------------- | ---------------------- |
| Most Plentiful  | 63.1%                  |
| Least Plentiful | 55.5%                  |
| Random          | 59.7%                  |
| Favorite Color  | 58.3%                  |

To summarize, even the worst strategy here (Least Plentiful) gives you a better than 50% chance of a win. The gap between best and worst strategy is less than 8 points. And unfortunately, my son's preferred strategy (Favorite Color) performs worse than selecting randomly, though it's not the worst strategy around.

### After _First Orchard_

If you don't live with a two-year old, there's probably not much reason to play this game. But if you've got older children in the house, it's possible they'll enjoy a very similar game, developed by the same company but targeting children age 3-6. This game is simply called _Orchard Game_.

The rules of this game are nearly the same as for _First Orchard_, but there are some slight variations:

1.  There are 10 fruits of each color to pick, not just 4.
2.  You need to roll the raven 9 times to lose, not 5.
3.  When you roll the fruit basket, you can select _two_ fruits to remove, not just one.

<OrchardGameSimulation caption="Figure 2: Simulating multiple playthroughs of Orchard." fruitCounts={[10,10,10,10]} ravenCount={9} wildCardCount={2}/>

100,000,000 games:
10, 10, 10, 10, 9, 2: 68.4 / 53.2 / 63.2 / 56.8

### Quoth the Raven: So Many Orchards!

variables:

* number of fruit colors
* number of fruits per color
* number of raven steps
* number of fruits to put away with wild card
