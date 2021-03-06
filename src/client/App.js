import React, { Component } from 'react';
import './app.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import NavBar from './components/navbar';
import PublicProfile from './components/publicProfile';
import Home from './components/home';
import About from './components/about';

import cognitoConfig from './config/cognitoConfig';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import SearchContainer from './components/searchContainer';
import Toolbar from "./components/Toolbar";
import SideDrawer from "./components/SideDrawer";
import Backdrop from "./components/Backdrop";

const userPool = new CognitoUserPool(cognitoConfig);

export default class App extends Component {
  state = {
    currentUserToken: {},
    sideDrawerOpen: false
  }

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    })
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  }

  componentDidMount() {
    try {
      this.loadCognitoUserJwt();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    let backdrop;

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }

    return (
      <div className="App" style={{ height: '100%' }}>
        <Toolbar signOut={this.signOut} drawerClickHandler={this.drawerToggleClickHandler} />
        <SideDrawer signOut={this.signOut} show={this.state.sideDrawerOpen} />
        {backdrop}
        <main className="main">
          <Router>
            <Switch>
              <Route path="/profile/:handle" component={PublicProfile} />
              <Route path="/about" component={About} />
              <Route path="/home" component={Home} />
              <Route path="/search" component={SearchContainer} />
              <Route path="/" component={Home} />
            </Switch>
          </Router>
        </main>
      </div>
    );
  }

  /*
   * Retrieves the current user token and user ID from the current cognito
   * session (if any), and stores both of them. The cognitoToken JWT goes into
   * cookies, while userId goes in localStorage as well as this.state.
   * 
   * The cognitoToken is automatically sent with every request (because it's in
   * cookies), so that should take care of authentication.
   * 
   * To compare the current user to the current profile ID to determine
   * editability, compare the current user ID to window.localStorage.userId or 
   * to this.state.currentUserToken.payload.sub
   */
  loadCognitoUserJwt = () => {
    // console.log('loadCognitoUserJwt');
    let cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      // console.log('Found user');
      cognitoUser.getSession((err, session) => {
        let currentUserToken = session.idToken.jwtToken;
        let currentUserId    = session.idToken.payload.sub;
        
        let exDays  = 365;
        let d = new Date(); d.setTime(d.getTime() + (exDays*24*60*60*1000));
        
        document.cookie = `cognitoToken=${currentUserToken};expires=${d.toUTCString()};path=/`;
        window.localStorage.setItem('userId', currentUserId);
        this.setState({ currentUserId });
      });
    }
    else {
      // console.log('Did not find user');
      window.localStorage.removeItem('userId');
      document.cookie = `cognitoToken=${''};expires=${(new Date()).getTime()};path=/`;
    }
  }

  signOut = () => {
    userPool.getCurrentUser().signOut();
    this.loadCognitoUserJwt();
    window.location.href= "/auth/login.html";
  }

}
