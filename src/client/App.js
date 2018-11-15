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
  
  handleGetProfile = userId => {
    console.log("Event handler called", userId);
    axios.get(`http://localhost:8080/users/${userId}`)
      .then(res => {
        const profile = res.data;
        this.setState({ profile })
      });
  }
}
