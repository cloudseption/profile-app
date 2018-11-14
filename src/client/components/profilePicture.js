import React, { Component } from "react";
import './profilePicture.css';

class ProfilePicture extends Component {

  render() {
    console.log("PictureProps", this.props)
    return <img className="profile_picture img-fluid" src={this.props.url} alt=""></img>;
  }
}

ProfilePicture.defaultProps = {
  url: 'https://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg'
}


export default ProfilePicture;
