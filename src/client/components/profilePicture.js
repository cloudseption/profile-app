import React, { Component } from "react";
import './profilePicture.css';

class ProfilePicture extends Component {

  render() {
    console.log("PictureProps", this.props)
    return <img className="profile_picture img-fluid" src={this.props.picture} alt=""></img>;
  }
}


// ProfilePicture.defaultProps = {
//   picture: 'http://pointe3.com/wp-content/uploads/2015/08/default-no-profile-pic.jpg'
// }

export default ProfilePicture;
