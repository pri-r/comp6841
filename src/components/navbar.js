import React from 'react';
import './navbar.css'; // Import the CSS file

const Navbar = ({ onSignInClick }) => {
  return (
    <nav className="navbar">
      <h1>The Something Awesome Quiz.</h1>
      <ul className="navList">
        <li><a href="/">Home</a></li>
        <li><a href="/"> </a></li>
        <li><a href="#" onClick={onSignInClick}>Sign In</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
