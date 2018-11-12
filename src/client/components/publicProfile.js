import React, { Component } from "react";
import Name from "./name";

class PublicProfile extends Component {

  render() {
    return (
      <React.Fragment>
        <div className="card m-2">
          <div className="card-body">
            <Name value={this.props.username} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PublicProfile;
