import React, { Component } from "react";
import "./badge.css";

class Badge extends Component {

  render() {
    return <li className="badge_list_element">
        <a className="badge_link" href={this.props.appUrl}>
            <img className="badge_image" src={this.props.iconUrl} alt=""></img>
            <span>{this.props.text}</span>
        </a>
    </li>;
  }
}

export default Badge;
