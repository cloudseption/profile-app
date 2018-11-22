import React, { Component } from "react";
import './profilePicture.css';

const DEFAULT_PICTURE_URL = 'https://s3-us-west-2.amazonaws.com/cloudception-bucket/public/images/user1.png';

class ProfilePicture extends Component {

  render() {
    console.log("PictureProps", this.props)
    return <img className="profile_picture img-fluid" src={
      this.props.picture ? this.props.picture : DEFAULT_PICTURE_URL
    } alt=""></img>;
  }
}

export default ProfilePicture;
