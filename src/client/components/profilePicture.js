import React, { Component } from "react";
import axios from 'axios';
import './profilePicture.css';

const DEFAULT_PICTURE_URL = 'https://s3-us-west-2.amazonaws.com/cloudception-bucket/public/images/user1.png';

class ProfilePicture extends Component {
  state = {
    displayUploadForm: false,
    imageToUpload: []
  };
  
  render() {
    const imageUploadEndpoint = `${document.location.origin}/api/users/${this.props.profileUser}/image`;
    // console.log("PictureProps", this.props, this.state)

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

        { this.state.displayUploadForm && (
            <form ref='uploadForm' 
              id='uploadForm' 
              action={imageUploadEndpoint}
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
    const fileReader    = new FileReader();
    const fileToUpload  = event.target.files[0];

    console.log('handleSelectImage');
    console.log(fileToUpload);

    fileReader.onload = ( upload ) => {
      let imageToUpload = [ upload.target.result ];
      this.setState({ imageToUpload: imageToUpload });
    };

    fileReader.readAsDataURL(fileToUpload);
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
    const imageUploadEndpoint = `${document.location.origin}/api/users/${this.props.profileUser}/image`;
    const { imageToUpload }   = this.state;

    axios({
      url: imageUploadEndpoint,
      method: "POST",
      data: {
        file: imageToUpload, //This is a data url version of the file
      }
    })
    .then(result => {
      console.log(result);
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
