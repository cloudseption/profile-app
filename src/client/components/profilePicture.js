import React, { Component } from "react";
import './profilePicture.css';

class ProfilePicture extends Component {

  render() {
    console.log("PictureProps", this.props)
    return <img className="profile_picture img-fluid" src={this.props.url} alt=""></img>;
  }
}

export default ProfilePicture;
