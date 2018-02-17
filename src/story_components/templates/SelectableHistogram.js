import React, { Component } from "react";
import PropTypes from "prop-types";
import withCaption from "../../hocs/withCaption";

class SelectableHistogram extends Component {
  render() {
    debugger;
    return (
      <div>
        <h1>hi</h1>
        <p>{JSON.stringify(this.props.data, null, 4)}</p>
      </div>
    );
  }
}

SelectableHistogram.propTypes = {};

SelectableHistogram.defaultProps = {};

export default withCaption(SelectableHistogram);

export const query = graphql`
  query BoogersQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMMM YYYY")
            featured_image
            caption
          }
          fields {
            slug
          }
          timeToRead
        }
      }
    }
  }
`;
