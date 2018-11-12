import React, { Component } from 'react';
import './app.css';
import NavBar from './components/navbar';
import PublicProfile from './components/publicProfile';
export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return <div>
        <NavBar />
        <main className="container">
          <PublicProfile username={this.state.username}/>
        </main>
      </div>;
  }
}
