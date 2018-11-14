import React, { Component } from "react";
import Badge from "./badge";
import "./badge.css";

class BadgeFrame extends Component {
  render() {
    let badgeItems = this.props.badgeData.map(badgeData => 
      <Badge appUrl={badgeData.appUrl} iconUrl={badgeData.iconUrl} text={badgeData.text} />
    );

    return <div className="badge_frame container">
        <ul className="badge_list">{badgeItems}</ul>
    </div>;
  }
}

BadgeFrame.defaultProps = {
  badgeData: [
    {
      appUrl: `http://www.google.ca`,
      iconUrl: `https://static.thenounproject.com/png/2576-200.png`,
      text: `lorem ipsum boogie 5%`
    },
    {
      appUrl: `http://www.google.ca`,
      iconUrl: `https://static.thenounproject.com/png/2576-200.png`,
      text: `6% more awesome than our prof`
    },
    {
      appUrl: `http://www.google.ca`,
      iconUrl: `https://static.thenounproject.com/png/2576-200.png`,
      text: `iggie wigge whatever`
    }
  ]
}

export default BadgeFrame;
