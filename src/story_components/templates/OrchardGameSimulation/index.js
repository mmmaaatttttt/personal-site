import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  FlexContainer,
  HorizontalBar,
  NarrowContainer
} from "story_components";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import { camelCaseToTitle } from "utils/stringHelpers";

class OrchardGameSimulation extends Component {
  state = {
    playing: false,
    playData: this.props.strategies.map(() => ({
      gamesPlayed: 0,
      gamesWon: 0
    }))
  };

  resetSimulation = () => {
    this.setState({
      playing: false,
      playData: this.props.strategies.map(() => ({
        gamesPlayed: 0,
        gamesWon: 0
      }))
    });
  };

  togglePlaying = () => {
    this.setState(
      prevState => ({ playing: !prevState.playing }),
      () => {
        if (this.timerId) return this.clearTimer();
        const { strategies, wildCardCount } = this.props;
        this.timerId = setInterval(() => {
          strategies.forEach((strategy, i) => {
            this.setState(prevState => {
              const playData = [...prevState.playData];
              const isWin = +this.simulateGame(strategy, wildCardCount);
              playData[i] = {
                gamesPlayed: playData[i].gamesPlayed + 1,
                gamesWon: playData[i].gamesWon + isWin
              };
              return { playData };
            });
          });
        }, 20);
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

  simulateGame = (strategy, wildCardCount) => {
    let fruitCounts = [...this.props.fruitCounts];
    let { ravenCount } = this.props;
    while (true) {
      const idx = Math.floor((fruitCounts.length + 2) * Math.random());
      if (idx < fruitCounts.length)
        fruitCounts[idx] = Math.max(fruitCounts[idx] - 1, 0);
      else if (idx === fruitCounts.length) ravenCount--;
      else {
        for (var i = 0; i < wildCardCount; i++) {
          const strategicIdx = strategy(fruitCounts);
          fruitCounts[strategicIdx] = Math.max(
            fruitCounts[strategicIdx] - 1,
            0
          );
        }
      }
      if (this.gameWon(fruitCounts)) return true;
      if (this.gameLost(ravenCount)) return false;
    }
  };

  render() {
    const { playing, playData } = this.state;
    const { strategies } = this.props;
    return (
      <NarrowContainer width="80%" fullWidthAt="small">
        <FlexContainer main="center">
          <Button onClick={this.togglePlaying}>
            {playing ? "Pause" : "Play"}
          </Button>
          {!playing ? (
            <Button onClick={this.resetSimulation} color={COLORS.RED}>
              Reset Simulation
            </Button>
          ) : null}
        </FlexContainer>
        {playData.map((d, i) => {
          const percentage =
            (d.gamesWon / d.gamesPlayed * 100 || 0).toFixed(1) + "%";
          const data = [
            {
              size: d.gamesWon,
              color: COLORS.GREEN,
              tooltipText: `Games Won: ${d.gamesWon.toLocaleString()}`
            },
            {
              size: d.gamesPlayed - d.gamesWon,
              color: COLORS.RED,
              tooltipText: `Games Played: ${d.gamesPlayed.toLocaleString()}`
            },
            {
              size: 0,
              color: COLORS.GRAY,
              tooltipText: `Win Percentage: ${percentage}`
            }
          ];
          return (
            <HorizontalBar
              key={i}
              title={`${camelCaseToTitle(
                strategies[i].name
              )} Strategy: ${percentage}`}
              data={data}
            />
          );
        })}
      </NarrowContainer>
    );
  }
}

OrchardGameSimulation.propTypes = {
  fruitCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  ravenCount: PropTypes.number.isRequired,
  wildCardCount: PropTypes.number.isRequired,
  strategies: PropTypes.arrayOf(PropTypes.func).isRequired
};

OrchardGameSimulation.defaultProps = {
  fruitCounts: [4, 4, 4, 4],
  ravenCount: 5,
  wildCardCount: 1,
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
    function favoriteColor(fruitCounts) {
      return fruitCounts.findIndex(c => c > 0);
    }
  ]
};

export default withCaption(OrchardGameSimulation);
