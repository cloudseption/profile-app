import React, { Component } from "react";
import "./badge.css";

class Badge extends Component {

  render() {
    console.log("PictureProps", this.props)
    return <li className="badge_list_element">
        <a className="badge_link" href={this.props.appUrl}>
            <img className="badge_image" src={this.props.iconUrl} alt=""></img>
            <span>{this.props.text}</span>
        </a>
    </li>;
  }
}

Badge.defaultProps = {
    appUrl: `http://www.google.ca`,
    iconUrl: `https://static.thenounproject.com/png/2576-200.png`,
    text: `lorem ipsum boogie 5%`
}

export default Badge;
