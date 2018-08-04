import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

class EfficiencyGapTable extends Component {
  render() {
    const { districts } = this.props;
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

function mapStateToProps(state) {
  return {
    districts: state["mind-the-gerrymandered-gap"].districts
  };
}

export default connect(mapStateToProps)(EfficiencyGapTable);
