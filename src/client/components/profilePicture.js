import React, { Component } from "react";
import './profilePicture.css';

const DEFAULT_PICTURE_URL = 'https://s3-us-west-2.amazonaws.com/cloudception-bucket/public/images/user1.png';

class ProfilePicture extends Component {
  state = {
    displayUploadForm: false
  };

  render() {
    // console.log("PictureProps", this.props, this.state)
    const imageUploadEndpoint = `${document.location.origin}/api/users/${this.props.profileUser}/image`

    return (
      <div className="image-wrapper-div">
        <img className="profile_picture img-fluid"
            onClick={this.handleImageClick.bind(this)}
            src={this.props.picture ? this.props.picture : DEFAULT_PICTURE_URL}
            alt="">
        </img>

        { this.isCurrentUsersProfile() && (
          <div className='edit-icon' onClick={this.handleImageClick.bind(this)}></div>
        )}

        { (
            <form ref='uploadForm' 
              id='uploadForm' 
              action={imageUploadEndpoint}
              method='post' 
              encType="multipart/form-data">
                <div className='image-upload-form-wrapper align-middle'>
                  <div className="custom-file">
                    <input type="file" className="custom-file-input" id="profileImage" name="profileImage" />
                    <label className="custom-file-label" htmlFor="profileImage">Choose file</label>
                  </div>
                  <input className="btn btn-primary" type='submit' value='Upload' />
                  <input className="btn btn-secondary" type='button' value='Cancel' onClick={this.hideUploadDisplay.bind(this)}/>
                </div>
            </form>
        )}

      </div>
    );
  }

  handleImageClick() {
    if (this.isCurrentUsersProfile()) {
      this.setState({ displayUploadForm: true });
    }
  }

  hideUploadDisplay() {
    this.setState({ displayUploadForm: false });
  }

  isCurrentUsersProfile() {
    let profileUser = this.props.profileUser;
    let currentUser = window.localStorage.getItem('userId');
    return profileUser.match(currentUser) && profileUser.length == currentUser.length;
  };
}

export default ProfilePicture;
