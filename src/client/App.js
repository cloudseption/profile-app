import React, { Component } from 'react';
import './app.css';
import NavBar from './components/navbar';
import PublicProfile from './components/publicProfile';
import axios from 'axios';

export default class App extends Component {
  state = {
    profile: {}
  }

  // Use this for when a user is first logged in - Phase 2
  // componentDidMount() {
  //   fetch('/api/getProfile:{currentUserId}')
  //     .then(res => res.json())
  //     .then(user => this.setState({ profile }));
  // }

  render() {
    return <div>
        <NavBar onGetProfile={this.handleGetProfile}/>
        <main className="container">
          <PublicProfile profile={this.state.profile} />
        </main>
      </div>;
  }


  
  handleGetProfile = searchParams => {
    console.log("Event handler called", searchParams);
    axios
      .get(
        `https://guarded-retreat-70427.herokuapp.com/api/search?input=${searchParams}`
      )
      .then(res => {
        try {
          const profile = res.data[0]; // Just display the first result for now.
          console.log("profile", profile);

          if (profile) {
            this.setState({ profile });
          } else {
            this.setState({ profile: {} });
          }
        } catch (e) {
          console.log(e);
        }
      });
  }
}
