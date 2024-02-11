import React from 'react';
import MainLogo from "../assets/images/main-logo.png"
import "../App.css"

function Header() {
  return (
    <header className="d-flex align-items-center mainnavbar navbar navbar-expand-lg navbar-light ">
      <a className="navbar-brand shadow-sm w-100 m-auto" href="#">
          <img src={MainLogo} className='mx-4 m-auto' width="100" />
      </a>
    </header>
  );
}

export default Header;
