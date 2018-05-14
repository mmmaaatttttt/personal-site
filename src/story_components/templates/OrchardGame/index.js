import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  Button,
  ColumnLayout,
  FlexContainer,
  FruitContainer,
  RelativeContainer,
  ScreenOverlay,
  Spinner
} from "story_components";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";

class OrchardGame extends Component {
  state = {
    counts: this.props.initialCounts,
    fruitBasketEnabled: false,
    gamesPlayed: 0,
    gamesWon: 0,
    gameState: "start"
  };

  componentDidMount() {
    const gamesWon = +localStorage.getItem("harvestingWins:gamesWon") || 0;
    const gamesPlayed =
      +localStorage.getItem("harvestingWins:gamesPlayed") || 0;
    this.setState({ gamesWon, gamesPlayed });
  }

  startGame = () => {
    this.setState(
      prevState => ({
        counts: this.props.initialCounts,
        gameState: "playing",
        gamesPlayed: prevState.gamesPlayed + 1
      }),
      () =>
        localStorage.setItem(
          "harvestingWins:gamesPlayed",
          this.state.gamesPlayed
        )
    );
  };

  clearData = () => {
    localStorage.clear();
    this.setState({ gamesPlayed: 0, gamesWon: 0 });
  };

  updateCounts = idx => {
    this.setState(prevState => {
      if (idx === prevState.counts.length) return { fruitBasketEnabled: true };
      const newCounts = [...prevState.counts];
      let { gamesPlayed, gamesWon } = prevState;
      newCounts[idx] = Math.max(newCounts[idx] - 1, 0);
      let gameState = "playing";
      // all counts 0 except raven
      if (newCounts.slice(0, -1).every(count => count === 0)) {
        gameState = "win";
        gamesWon++;
        localStorage.setItem("harvestingWins:gamesWon", gamesWon);
      }
      // raven count is 0
      if (newCounts[newCounts.length - 1] === 0) {
        gameState = "loss";
      }
      return {
        counts: newCounts,
        fruitBasketEnabled: false,
        gameState,
        gamesPlayed,
        gamesWon
      };
    });
  };

  render() {
    const { spinnerColors } = this.props;
    const {
      counts,
      fruitBasketEnabled,
      gamesPlayed,
      gamesWon,
      gameState
    } = this.state;
    const message = fruitBasketEnabled
      ? "Please click on a colored square to remove a fruit and resume play."
      : "";
    let overlays = {
      start: (
        <ScreenOverlay>
          <h1>Orchard Game</h1>
          <p>Games won: {gamesWon}</p>
          <p>Games played: {gamesPlayed}</p>
          <Button color={COLORS.GREEN} onClick={this.startGame}>
            Play
          </Button>
          <Button onClick={this.clearData}>Clear Game Data</Button>
        </ScreenOverlay>
      ),
      win: (
        <ScreenOverlay backgroundColor={COLORS.GREEN}>
          <h1>You won!</h1>
          <p>Games won: {gamesWon}</p>
          <p>Games played: {gamesPlayed}</p>
          <Button color={COLORS.GREEN} onClick={this.startGame}>
            Play Again
          </Button>
        </ScreenOverlay>
      ),
      loss: (
        <ScreenOverlay backgroundColor={COLORS.RED}>
          <h1>You lost.</h1>
          <p>Games won: {gamesWon}</p>
          <p>Games played: {gamesPlayed}</p>
          <Button color={COLORS.GREEN} onClick={this.startGame}>
            Play Again
          </Button>
        </ScreenOverlay>
      )
    };
    return (
      <RelativeContainer>
        {overlays[gameState]}
        <ColumnLayout break="small">
          <Spinner
            colors={spinnerColors}
            handleSpinEnd={this.updateCounts}
            message={message}
          />
          <FlexContainer wrap>
            {spinnerColors.slice(0, -1).map((color, i) => {
              const clickable =
                counts[i] > 0 && i !== counts.length - 1 && fruitBasketEnabled;
              return (
                <FruitContainer
                  key={color}
                  color={color}
                  count={counts[i]}
                  clickable={clickable}
                  updateCounts={this.updateCounts.bind(this, i)}
                />
              );
            })}
          </FlexContainer>
        </ColumnLayout>
      </RelativeContainer>
    );
  }
}

OrchardGame.propTypes = {
  initialCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  spinnerColors: PropTypes.arrayOf(PropTypes.string).isRequired
};

OrchardGame.defaultProps = {
  initialCounts: [4, 4, 4, 4, 5],
  spinnerColors: [
    COLORS.RED,
    COLORS.DARK_GREEN,
    COLORS.DARK_BLUE,
    COLORS.YELLOW,
    COLORS.BLACK,
    COLORS.WHITE
  ]
};

export default withCaption(OrchardGame);
