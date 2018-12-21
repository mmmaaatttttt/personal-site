import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "story_components";

class RadioButtonGroup extends Component {
  state = {
    groupVal: ""
  };

  handleRadioChange = e => {
    this.setState({ groupVal: e.target.value });
  };

  render() {
    const { labels, handleSelect } = this.props;
    const { groupVal } = this.state;
    const options = labels.map((label, i) => (
      <label>
        <input
          name="group"
          type="radio"
          value={label}
          checked={groupVal === label}
          onChange={this.handleRadioChange}
          key={label}
        />
        <span>{label}</span>
      </label>
    ));
    return (
      <div>
        {options}
        <Button onClick={() => handleSelect(groupVal)} disabled>Select</Button>
      </div>
    );
  }
}

RadioButtonGroup.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired
};

RadioButtonGroup.defaultProps = {
  handleSelect: label => console.log(label),
  labels: ["test1", "test2", "test3"]
};

export default RadioButtonGroup;
