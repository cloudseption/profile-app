import React, { Component } from "react";

class Name extends Component {

  render() {
    console.log("NameProps", this.props)
    return <div>{this.props.value}</div>;
  }
}

export default Name;
