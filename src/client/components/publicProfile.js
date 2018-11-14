import React, { Component } from "react";
import Name from "./name";
import ProfilePicture from "./profilePicture";
import BadgeFrame from "./badgeFrame";
import Badge from "./badge";
import Biography from "./biography";

class PublicProfile extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="card m-2">
               
          <div className="card-header container banner_frame">
            <div className="row">
              <div className="col-12">
                <Name value={this.props.username} />
              </div>
            </div>
            
            <div className="row">
              <div className="col-4 col-sm-5 col-md-7 col-lg-8 col-xl-9">
                <ProfilePicture url={this.props.imgUrl} />
              </div>
              <div className="col-8 col-sm-7 col-md-5 col-lg-4 col-xl-3 description_frame">
                <BadgeFrame badgeData={this.props.badgeData}/>
              </div>
            </div>

          </div>
          <div className="card-body">
            <Biography text={this.props.text} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PublicProfile;
