import React from 'react';
import DrawerToggleButton from './DrawerToggleButton';
import './Toolbar.css';
import Home from './home';

const toolbar = props => (
  <header className='toolbar'>
    <nav className='toolbar-navigation'>
      <div className='toolbar-toggle-button'>
          <DrawerToggleButton click={props.drawerClickHandler}/>
      </div>
      <div className='toolbar-logo'>
        <a href="/">BADGEBOOK</a>
      </div>
      <div className="spacer"></div>
      <div className='toolbar-navigation-items'>
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
      </div>
    </nav>
  </header>
);

export default toolbar;