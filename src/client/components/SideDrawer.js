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
            <a href="/search">Search</a>
          </li>
          <li>
            <a href="/home">Landing Page</a>
          </li>
          <li>
            <a href="/auth/login.html">Login</a>
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </nav>);
};

export default sideDrawer;