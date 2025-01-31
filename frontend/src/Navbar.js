import { Link } from "react-router-dom";
import './Navbar.css'
import React from 'react';

const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="links">
        
        <Link to="/registracija" className="nav-link">Registracija</Link>
        
        <Link to="/Login" className="nav-link">Log in</Link>
       
        <Link to="/Logout" className="nav-link">Log out</Link>
        </div>
      </nav>
    );
  }

  export default Navbar;