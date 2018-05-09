import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ColumnLayout,
  FlexContainer,
  FruitContainer,
  Spinner
} from "story_components";
import COLORS from "utils/styles";

class OrchardGame extends Component {
  state = {
    counts: [4, 4, 4, 4, 5],
    fruitBasketEnabled: false
  };

  updateCounts = idx => {
    this.setState(prevState => {
      if (idx === prevState.counts.length) return { fruitBasketEnabled: true };
      const newCounts = [...prevState.counts];
      newCounts[idx] = Math.max(newCounts[idx] - 1, 0);
      return { counts: newCounts, fruitBasketEnabled: false };
    });
  };

  render() {
    const { spinnerColors } = this.props;
    const { counts, fruitBasketEnabled } = this.state;
    return (
      <ColumnLayout>
        <Spinner colors={spinnerColors} handleSpinEnd={this.updateCounts} />
        <FlexContainer wrap>
          {spinnerColors.slice(0, counts.length).map((color, i) => {
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
    );
  }
}

OrchardGame.defaultProps = {
  spinnerColors: [
    COLORS.RED,
    COLORS.DARK_GREEN,
    COLORS.DARK_BLUE,
    COLORS.YELLOW,
    COLORS.BLACK,
    COLORS.WHITE
  ]
};

export default OrchardGame;
