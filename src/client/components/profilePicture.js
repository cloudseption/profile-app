import React, { Component } from "react";
import axios from 'axios';
import './profilePicture.css';

const DEFAULT_PICTURE_URL = 'https://s3-us-west-2.amazonaws.com/cloudception-bucket/public/images/user1.png';

class ProfilePicture extends Component {
  state = {
    displayUploadForm: false,
    imageToUpload: [],
    loading: false,
    fadePicture: false,
    picture: ''
  };

  componentWillReceiveProps() {
    if (this.props.picture !== this.state.picture) {
      this.setState({ picture: this.props.picture ? this.props.picture : DEFAULT_PICTURE_URL });
    }
  }

  render() {
    const imageUploadEndpoint = `${document.location.origin}/api/users/${this.props.profileUser}/image`;
    console.log("PictureProps", this.props)

    const imgStyle = {
      opacity: 0
    };
    // if ((!this.state.loading) && this.state.picture) {
    //   imgStyle.opacity = '0';
    // }

    const wrapperStyle = {
      backgroundImage: `url(${this.state.picture})`,
    }

    return (
      <div className={`image-wrapper-div`} style={wrapperStyle}>
        <div className={`picture-screen ${ this.props.isEdit && 'fade-picture' }`}></div>
        <img className={`profile-picture img-fluid`}
            style={imgStyle}
            src={DEFAULT_PICTURE_URL}
            alt="">
        </img>

        { this.state.loading && (
          <table className='loading-wrapper'>
            <tbody>
              <tr>
                <td className='align-middle text-center'>
                  <div className="lds-dual-ring"></div>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        { this.props.isEdit && (
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
                          onChange={this.handleUploadImage.bind(this)}
                          />
                    <label className="custom-file-label" htmlFor="profileImage">Choose file</label>
                  </div>
                </div>
            </form>
        )}

      </div>
    );
  }

  handleUploadImage(event) {
    this.setState({
      displayUploadForm: false,
      fadePicture: true
    });

    const file    = event.target.files[0];
    const url     = `${document.location.origin}/api/users/${this.props.profileUser}/image`;
    const config  = { headers: { 'Content-Type': 'multipart/form-data' } };
    const data    = new FormData();
    data.append('profileImage', file );

    this.setState({
      loading: true
    })

    axios.post(url, data, config)
    .then(result => {
      this.props.onPictureChange(result.data.picture);
      this.setState({
        picture: result.data.picture,
        loading: false,
        fadePicture: false
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({
        loading: false,
        fadePicture: false
      });
    })
};

  isCurrentUsersProfile() {
    let profileUser = this.props.profileUser;
    let currentUser = window.localStorage.getItem('userId');
    return profileUser.match(currentUser) && profileUser.length == currentUser.length;
  };
}

export default ProfilePicture;
