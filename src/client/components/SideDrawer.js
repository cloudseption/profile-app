import React from 'react';
import './SideDrawer.css'

const sideDrawer = props => {

    let drawerClasses = 'side-drawer';

    if (props.show) {
        drawerClasses = 'side-drawer open';
    }

    return (
      <nav className={drawerClasses}>
        <ul>
          <li>
            <a href={'/profile/' + window.localStorage.getItem('userId')}>Profile</a>
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
      </nav>);
};

export default sideDrawer;