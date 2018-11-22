import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import CKEditor from '@ckeditor/ckeditor5-react';
import axios from "axios";
import React, { Component } from "react";
import BadgeFrame from "./badgeFrame";
import Biography from "./biography";
import Name from "./name";
import ProfilePicture from "./profilePicture";

class PublicProfile extends Component {
  // Hardcoded badgedata for now
  state = {
    badgeData: [],
    profile: {},
    userId: null,
    currUser: false
  };

  componentDidMount() {
    const {handle} = this.props.match.params;
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
  

  saveUser() {
    let data = [
      { propName: "name", value: this.state.profile.name },
      { propName: "description", value: this.state.profile.description },
      { propName: "picture", value: this.state.profile.picture }
    ];
    axios
      .patch(`http://localhost:8080/users/${this.state.userId}`,
        data
      );
  }

  render() {
    return <React.Fragment>
      <div className="card m-2">
        <div className="card-header container banner_frame">
          <div className="row">
            <div className="col-12">
              {!this.state.currUser ? (
                <Name value={this.state.profile.name} />) : (
                  <CKEditor
                    editor={InlineEditor}
                    data={this.state.profile.name}
                    onInit={editor => {
                      // You can store the "editor" and use when it is needed.
                      console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      let prof = this.state.profile;
                      prof.name = data;
                      this.setState({ profile: prof })
                    }}
                  />)}
            </div>

          </div>
          <div className="row">
            <div className="col-4 col-sm-5 col-md-7 col-lg-8 col-xl-9">
              <ProfilePicture picture={this.state.profile.picture} />
            </div>
            <div className="col-8 col-sm-7 col-md-5 col-lg-4 col-xl-3 description_frame">
              <BadgeFrame badgeData={this.state.badgeData} />
            </div>
          </div>
        </div>
        <div className="card-body">
          {!this.state.currUser ? (
            <Biography text={this.state.profile.description} />) : (
              <CKEditor
                editor={InlineEditor}
                data={this.state.profile.description}
                onInit={editor => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  let prof = this.state.profile;
                  prof.description = data;
                  this.setState({ profile: prof })
                }}
              />)}
        </div>
      </div>
      {this.state.currUser &&
        <div className="col-sm-9">
          <button onClick={this.saveUser.bind(this)}>Save</button>
        </div>}
    </React.Fragment>;
  }
}

export default PublicProfile;
