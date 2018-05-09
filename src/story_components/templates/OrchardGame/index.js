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
    counts: [4, 4, 4, 4, 5]
  };

  updateCounts = idx => {
    this.setState(prevState => {
      const newCounts = [...prevState.counts];
      newCounts[idx] = Math.max(newCounts[idx] - 1, 0);
      return { counts: newCounts };
    });
  };

  render() {
    const { spinnerColors } = this.props;
    const { counts } = this.state;
    return (
      <ColumnLayout>
        <Spinner colors={spinnerColors} handleSpinEnd={this.updateCounts} />
        <FlexContainer wrap>
          {spinnerColors
            .slice(0, 5)
            .map((color, i) => (
              <FruitContainer key={color} color={color} count={counts[i]} />
            ))}
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
