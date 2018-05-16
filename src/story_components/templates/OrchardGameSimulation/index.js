import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "story_components";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";

class OrchardGameSimulation extends Component {
  state = {
    playing: false,
    playData: this.props.strategies.map(() => ({
      gamesPlayed: 0,
      gamesWon: 0
    }))
  };

  togglePlaying = () => {
    this.setState(
      prevState => ({ playing: !prevState.playing }),
      () => {
        if (this.timerId) return this.clearTimer();
        const { strategies } = this.props;
        this.timerId = setInterval(() => {
          strategies.forEach((strategy, i) => {
            this.setState(prevState => {
              const playData = [...prevState.playData];
              const isWin = +this.simulateGame(strategy);
              playData[i] = {
                gamesPlayed: playData[i].gamesPlayed + 1,
                gamesWon: playData[i].gamesWon + isWin
              };
              return { playData };
            });
          });
        }, 10);
      }
    );
  };

  clearTimer = () => {
    clearTimeout(this.timerId);
    this.timerId = null;
  };

  componentWillUnmount() {
    this.clearTimer();
  }

  gameWon = fruitCounts => fruitCounts.every(count => count === 0);

  gameLost = ravenCount => ravenCount === 0;

  simulateGame = strategy => {
    let fruitCounts = [4, 4, 4, 4];
    let ravenCount = 5;
    while (true) {
      const idx = Math.floor((fruitCounts.length + 2) * Math.random());
      if (idx < fruitCounts.length)
        fruitCounts[idx] = Math.max(fruitCounts[idx] - 1, 0);
      else if (idx === fruitCounts.length) ravenCount--;
      else {
        const strategicIdx = strategy(fruitCounts);
        fruitCounts[strategicIdx] = Math.max(fruitCounts[strategicIdx] - 1, 0);
      }
      if (this.gameWon(fruitCounts)) return true;
      if (this.gameLost(ravenCount)) return false;
    }
  };

  render() {
    const { playing, playData } = this.state;
    return (
      <div>
        <Button onClick={this.togglePlaying}>
          {playing ? "Pause" : "Play"}
        </Button>
        {playData.map((d, i) => (
          <h1 key={i}>
            {this.props.strategies[i].name}: {d.gamesWon} / {d.gamesPlayed} ≈{" "}
            {(d.gamesWon / d.gamesPlayed * 100).toFixed(2)}%
          </h1>
        ))}
      </div>
    );
  }
}

OrchardGameSimulation.defaultProps = {
  fruitCounts: [4, 4, 4, 4],
  ravenCount: 5,
  strategies: [
    function mostPlentiful(fruitCounts) {
      const maxCount = Math.max(...fruitCounts);
      return fruitCounts.findIndex(c => c === maxCount);
    },
    function leastPlentiful(fruitCounts) {
      const minCount = Math.min(...fruitCounts.filter(c => c > 0));
      return fruitCounts.findIndex(c => c === minCount);
    },
    function random(fruitCounts) {
      const validIndices = fruitCounts
        .map((count, idx) => ({ count, idx }))
        .filter(obj => obj.count > 0)
        .map(obj => obj.idx);
      const randomIndex = Math.floor(Math.random() * validIndices.length);
      return validIndices[randomIndex];
    },
    function favorite(fruitCounts) {
      return fruitCounts.findIndex(c => c > 0);
    }
  ]
};

export default withCaption(OrchardGameSimulation);
