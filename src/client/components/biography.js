import React, { Component } from "react";
import './biography.css';

class Biography extends Component {

  render() {
    return <div className="biography_frame" dangerouslySetInnerHTML={{__html: this.props.text}}></div>;
  }
}

Biography.defaultProps = {
    text: `Search for a user.`
}

export default Biography;
