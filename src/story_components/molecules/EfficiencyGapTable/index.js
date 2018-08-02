import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class EfficiencyGapTable extends Component {
  state = {
    districts: null
  };

  componentDidMount() {
    window.addEventListener("storage", this.handleStorageChange);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
  }

  handleStorageChange = () => {
    console.log("hi");
    this.setState({
      districts: JSON.parse(sessionStorage.getItem("districts"))
    });
  };

  render() {
    const { districts } = this.state;
    let tableArea = (
      <p>
        To see a sample calculation of the efficiency gap, please finish drawing
        your districts above.
      </p>
    );
    if (districts) {
      tableArea = (
        <div>
          <h1>Here is a table.</h1>
        </div>
      );
    }
    return tableArea;
  }
}

export default EfficiencyGapTable;
