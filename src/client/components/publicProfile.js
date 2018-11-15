import React, { Component } from "react";
import Name from "./name";
import ProfilePicture from "./profilePicture";
import BadgeFrame from "./badgeFrame";
import Badge from "./badge";
import Biography from "./biography";

class PublicProfile extends Component {
  // Hardcoded badgedata for now
  state = {
    badgeData: [
      {
        id: `1`,
        appUrl: `http://www.google.ca`,
        iconUrl: `https://static.thenounproject.com/png/2576-200.png`,
        text: `lorem ipsum boogie 5%`
      },
      {
        id: `2`,
        appUrl: `http://www.google.ca`,
        iconUrl: `https://static.thenounproject.com/png/2576-200.png`,
        text: `6% more awesome than our prof`
      },
      {
        id: `3`,
        appUrl: `http://www.google.ca`,
        iconUrl: `https://static.thenounproject.com/png/2576-200.png`,
        text: `iggie wigge whatever`
      }
    ]
  };

  render() {
    console.log("PROPS", this.props.profile);
    return (
      <React.Fragment>
        <div className="card m-2">
          <div className="card-header container banner_frame">
            <div className="row">
              <div className="col-12">
                <Name value={this.props.profile.name} />
              </div>
            </div>
            <div className="row">
              <div className="col-4 col-sm-5 col-md-7 col-lg-8 col-xl-9">
                {/* <ProfilePicture url={this.state.profileUrl} /> */}
              </div>
              <div className="col-8 col-sm-7 col-md-5 col-lg-4 col-xl-3 description_frame">
                <BadgeFrame badgeData={this.state.badgeData} />
              </div>
            </div>
          </div>
          <div className="card-body">
            <Biography text={this.props.profile.description} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PublicProfile;
