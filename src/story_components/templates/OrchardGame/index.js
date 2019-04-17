import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  FlexContainer,
  FruitContainer,
  NarrowContainer,
  RelativeContainer,
  ScreenOverlay,
  Spinner
} from "story_components";
import { withCaption } from "providers";
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
    let message = "";
    if (gameState !== "playing") message = "&nbsp;";
    if (fruitBasketEnabled) message = "Click on a square to remove a fruit.";
    let overlays = {
      start: {
        title: "Orchard Game",
        buttonText: "Play",
        backgroundColor: COLORS.GRAY
      },
      win: {
        title: "You won!",
        buttonText: "Play Again",
        backgroundColor: COLORS.GREEN
      },
      loss: {
        title: "You lost.",
        buttonText: "Play Again",
        backgroundColor: COLORS.RED
      }
    };
    return (
      <NarrowContainer width="70%" fullWidthAt="small">
        <RelativeContainer>
          {gameState === "playing" ? null : (
            <ScreenOverlay
              backgroundColor={overlays[gameState].backgroundColor}
            >
              <h1>{overlays[gameState].title}</h1>
              <p>Games won: {gamesWon}</p>
              <p>Games played: {gamesPlayed}</p>
              <Button large color={COLORS.GREEN} onClick={this.startGame}>
                {overlays[gameState].buttonText}
              </Button>
              <Button large onClick={this.clearData}>
                Clear Game Data
              </Button>
            </ScreenOverlay>
          )}
          <FlexContainer column>
            <NarrowContainer width="60%">
              <Spinner
                colors={spinnerColors}
                handleSpinEnd={this.updateCounts}
                message={message}
              />
            </NarrowContainer>
            <FlexContainer>
              {spinnerColors.slice(0, -1).map((color, i) => {
                const isLastColor = i === counts.length - 1;
                const clickable =
                  counts[i] > 0 && !isLastColor && fruitBasketEnabled;
                const title = isLastColor ? "Raven" : "Fruit";
                const faded = isLastColor && fruitBasketEnabled;
                return (
                  <FruitContainer
                    key={color}
                    color={color}
                    count={counts[i]}
                    clickable={clickable}
                    updateCounts={this.updateCounts.bind(this, i)}
                    title={title}
                    faded={faded}
                  />
                );
              })}
            </FlexContainer>
          </FlexContainer>
        </RelativeContainer>
      </NarrowContainer>
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

export { OrchardGame };
