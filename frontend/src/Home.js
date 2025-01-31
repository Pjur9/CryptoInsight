import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'

const HomePage = () => {
  return (
    <div className="container mt-5">
      <h1><i className="bi bi-house"></i> Pocetna stranica</h1>
      <h5>Podrzane akcije:</h5>
      <Link to="/registration" className='linkbtn' >Registracija novog korisnika</Link>
      <br />
      <br />
      <Link to="/login" className='linkbtn' >Logovanje postojeceg korisnika</Link>
      <br />
      <br />
    </div>
  );
};

export default HomePage;

