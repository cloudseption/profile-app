import React, { Component } from "react";
import axios from 'axios';
import './profilePicture.css';

const DEFAULT_PICTURE_URL = 'https://s3-us-west-2.amazonaws.com/cloudception-bucket/public/images/user1.png';

class ProfilePicture extends Component {
  state = {
    displayUploadForm: false,
    imageToUpload: []
  };

  componentWillReceiveProps() {
    if (this.props.picture !== this.state.picture) {
      this.setState({ picture: this.props.picture ? this.props.picture : DEFAULT_PICTURE_URL });
    }
  }

  render() {
    const imageUploadEndpoint = `${document.location.origin}/api/users/${this.props.profileUser}/image`;
    // console.log("PictureProps", this.props, this.state)

    return (
      <div className="image-wrapper-div">
        <img className="profile_picture img-fluid"
            onClick={this.handleImageClick.bind(this)}
            src={this.state.picture || DEFAULT_PICTURE_URL}
            alt="">
        </img>

        { this.state.displayUploadForm && (
            <form ref='uploadForm' 
              id='uploadForm' 
              action={imageUploadEndpoint}
              onSubmit={this.handleSubmit.bind(this)}
              method='post' 
              encType="multipart/form-data">
                <div className='image-upload-form-wrapper align-middle'>
                  <div className="custom-file">
                    <input type="file"
                          className="custom-file-input"
                          id="profileImage"
                          name="profileImage"
                          onChange={this.handleSelectImage.bind(this)}
                          />
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

  handleSelectImage(event) {
    this.setState({ imageToUpload: event.target.files[0] });
  }

  handleImageClick() {
    if (this.isCurrentUsersProfile()) {
      this.setState({ displayUploadForm: true });
    }
  }

  hideUploadDisplay() {
    this.setState({ displayUploadForm: false });
  }

  handleSubmit = ( event ) => {
    event.preventDefault(); //So the page does not refresh
    
    const url     = `${document.location.origin}/api/users/${this.props.profileUser}/image`;
    const config  = { headers: { 'Content-Type': 'multipart/form-data' } };
    const data    = new FormData();
    data.append('profileImage', this.state.imageToUpload );

    axios.post(url, data, config)
    .then(result => {
      console.log(result);
      this.setState({ picture: result.data.picture });
    })
    .catch(err => {
      console.log(err);
    })
};

  isCurrentUsersProfile() {
    let profileUser = this.props.profileUser;
    let currentUser = window.localStorage.getItem('userId');
    return profileUser.match(currentUser) && profileUser.length == currentUser.length;
  };
}

export default ProfilePicture;
