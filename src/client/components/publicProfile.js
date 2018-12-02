import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import CKEditor from '@ckeditor/ckeditor5-react';
import axios from "axios";
import React, { Component } from "react";
import BadgeFrame from "./badgeFrame";
import Biography from "./biography";
import Name from "./name";
import ProfilePicture from "./profilePicture";
import './publicProfile.css';
import iconEdit from '../icons/svg/pencil.svg';
import iconSave from "../icons/svg/check.svg";
import iconChat from "../icons/svg/chat.svg";


class PublicProfile extends Component {
  // Hardcoded badgedata for now
  state = {
    badgeData: [],
    profile: {},
    userId: null,
    currUser: false,
    isEdit: false
  };

  componentDidMount() {
    const { handle } = this.props.match.params;
    this.setState({ userId: window.localStorage.userId });
    // Get main profile page data
    axios
      .get(
        `${document.location.protocol}//${document.location.host}/api/users/${handle}`
      )
      .then(res => {
        try {
          const profile = res.data;
          if (profile) {
            let currUser = this.state.userId === profile.userId;
            this.setState({ profile, currUser });
          } else {
            this.setState({ profile: {} });
          }
        } catch (e) {
          console.log(e);
        }
      });

    // Get badge data
    const badgeUrl = `${document.location.protocol}//${document.location.host}/api/users/${handle}/badge-data`;
    axios.get(badgeUrl)
      .then(res => {
        if (res && res.data) {
          this.setState({ badgeData: res.data });
        }
      });
  }

  handleButton() {
    if (!this.state.isEdit) {
      this.editPage();
    } else {
      this.saveUser();
    }
  }

  editPage() {
    this.setState({ isEdit: true })
  }

  saveUser() {
    console.log('SAVING');
    let data = [
      { propName: "name", value: this.state.profile.name },
      { propName: "description", value: this.state.profile.description },
      { propName: "picture", value: this.state.profile.picture }
    ];
    axios
      .patch(`${window.location.origin}/api/users/${this.state.userId}`,
        data
      );
    this.setState({ isEdit: false });
  }

  handleNameChange(event) {
    let prof = this.state.profile;
    prof.name = event.target.value;
    this.setState({ profile: prof });
  }

  handlePictureChange(pictureUrl) {
    let profile = this.state.profile;
    profile.picture = pictureUrl;
    this.setState({ profile: profile });
  }

  render() {
    let profileId;
    try {
      profileId = this.props.match.params.handle;
    } catch (err) {
      console.log(err);
    }

    return <React.Fragment>
        <div className="card m-2 bg-dark">
          <div className="card-header banner_frame bg-dark text-white">
            <div className="row" align="center">
              <div className="col-12">
                <div align="right" className="col-sm-12">
                {!this.state.currUser &&
                  <a className="message-button" href={`http://cryptic-island-60821.herokuapp.com/?chat-with=${profileId}`}>
                    <img style={{ width: "20px" }}
                          src={iconChat}
                          alt="Message"
                        />
                  </a>
                }
                {this.state.currUser &&
                    <button className="profile-edit-button" onClick={this.handleButton.bind(this)}>
                      {this.state.isEdit ? (
                        <img
                          style={{ width: "20px" }}
                          src={iconSave}
                          alt="Save"
                        />
                      ) : (
                        <img
                          style={{ width: "20px" }}
                          src={iconEdit}
                          alt="Edit"
                        />
                      )}
                    </button>
                  }
                </div>
              </div>
            </div>
            <div className="row" align="center">
              <div className="col-12">
                <div className="col-4 col-sm-5 col-md-7 col-lg-7 col-xl-7">
                  <ProfilePicture picture={this.state.profile.picture} profileUser={this.props.match.params.handle} isEdit={this.state.isEdit} onPictureChange={this.handlePictureChange.bind(this)}/>
                </div>
              </div>
            </div>
            <div className="row" align="center" style={{ marginTop: "0.5rem" }}>
              <div className="col-12">
                {!this.state.isEdit ? <Name value={this.state.profile.name} /> : <h4>
                    <input type="text" value={this.state.profile.name} onChange={this.handleNameChange.bind(this)} />
                  </h4>}
              </div>
            </div>
          </div>
          <div className="card-body bg-secondary">
            {!this.state.isEdit ? <Biography text={this.state.profile.description} /> : <CKEditor editor={InlineEditor} data={this.state.profile.description} onInit={editor => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }} onChange={(event, editor) => {
                  const data = editor.getData();
                  let prof = this.state.profile;
                  prof.description = data;
                  this.setState({ profile: prof });
                }} />}
          </div>
          <div className="card-footer">
            <div className="row">
              <div className="col-8 col-sm-7 col-md-5 col-lg-5 col-xl-5 description_frame">
                <BadgeFrame badgeData={this.state.badgeData} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>;
  }
}

export default PublicProfile;
