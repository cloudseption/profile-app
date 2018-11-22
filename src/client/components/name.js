import React, { Component } from "react";

class Name extends Component {

  render() {
    return <div dangerouslySetInnerHTML={{__html: this.props.value}}></div>;
  }
}

export default Name;
