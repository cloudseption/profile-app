import React from 'react';
import DrawerToggleButton from './DrawerToggleButton';
import './Toolbar.css';

// if (window.localStorage.userId == "" || window.localStorage.userId == undefined) {
//   window.location = "/auth/login.html";
// }

const toolbar = props => (
  <header className="toolbar">
    <nav className="toolbar-navigation">
      <div className="toolbar-toggle-button">
        <DrawerToggleButton click={props.drawerClickHandler} />
      </div>
      <div className="toolbar-logo">
        <a href="/">BADGEBOOK</a>
      </div>
      <div className="spacer" />
      <div className="toolbar-navigation-items">
        <ul>
          <li>
            <a href={"/profile/" + window.localStorage.getItem("userId")}>
              Profile
            </a>
          </li>
          <li>
            <a href="/search">Search</a>
          </li>
          <li>
            <a href="/home">Landing Page</a>
          </li>
          {
            ( window.localStorage.userId == "" ||
              window.localStorage.userId == undefined ) ?
            <li><a href="/auth/login.html">Login</a></li> :
            <li><a onClick={props.signOut} href="#">Logout</a></li>
          }
        </ul>
      </div>
    </nav>
  </header>
);

export default toolbar;