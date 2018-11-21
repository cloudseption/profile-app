import React, { Component } from "react";
import Name from "./name";
import ProfilePicture from "./profilePicture";
import BadgeFrame from "./badgeFrame";
import Badge from "./badge";
import Biography from "./biography";
import axios from "axios";

class PublicProfile extends Component {
  // Hardcoded badgedata for now
  state = {
    badgeData: [],
    profile: {}
  };

  componentDidMount() {
    const {handle} = this.props.match.params;

    // Get main profile page data
    axios
      .get(
        `${document.location.protocol}//${document.location.host}/api/users/${handle}`
      )
      .then(res => {
        try {
          const profile = res.data;

          if (profile) {
            this.setState({ profile });
          } else {
            this.setState({ profile: {} });
          }
        } catch (e) {
          console.log(e);
        }
      });

    // Get badge data
    const badgeUrl = `${document.location.protocol}//${document.location.host}/api/users/${handle}/badge-data`;
    axios.get(badgeUrl)
      .then(res => {
        if (res && res.data) {
          this.setState({ badgeData: res.data });
        }
      });
    }
  

  render() {
    return <React.Fragment>
        <div className="card m-2">
          <div className="card-header container banner_frame">
            <div className="row">
              <div className="col-12">
                <Name value={this.state.profile.name} />
              </div>
            </div>
            <div className="row">
              <div className="col-4 col-sm-5 col-md-7 col-lg-8 col-xl-9">
                <ProfilePicture picture={this.state.profile.picture} />
              </div>
              <div className="col-8 col-sm-7 col-md-5 col-lg-4 col-xl-3 description_frame">
                <BadgeFrame badgeData={this.state.badgeData} />
              </div>
            </div>
          </div>
          <div className="card-body">
          <Biography text={this.state.profile.description} />
          </div>
        </div>
      </React.Fragment>;
  }
}

export default PublicProfile;
