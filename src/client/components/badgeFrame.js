import React, { Component } from "react";
import Badge from "./badge";
import "./badge.css";

class BadgeFrame extends Component {

  render() {
    let i = 0;
    let badgeItems = this.props.badgeData.map(badgeData => 
      <Badge key={i++} appUrl={badgeData.link} iconUrl={badgeData['icon-url']} text={badgeData.text} />
    );

    return <div className="badge_frame container">
        <ul className="badge_list">{badgeItems}</ul>
    </div>;
  }
}

export default BadgeFrame;
