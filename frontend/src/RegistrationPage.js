import React, { useEffect, useState } from 'react';
import './RegistrationPage.css'

const RegistrationPage = () => {

  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [adresa, setAdresa] = useState('');
  const [grad, setGrad] = useState('');
  const [drzava, setDrzava] = useState('');
  const [brojtelefona, setBrojTel] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  
  useEffect (() => {
    setErrorMessage('');
    
    }, [])
  

  const handleRequest = (event) => {
    
    event.preventDefault();
    
    fetch('http://localhost:5000/registracija', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ime, prezime, adresa, grad, drzava, brojtelefona, email, lozinka}), 
    })
    .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem('user_email', JSON.stringify(data.email));
          //localStorage.setItem('logged', JSON.stringify(true))
          setErrorMessage('');
          window.location.href = '/userhome'
        } else {
          setErrorMessage(data.message);
          
        }
      }) 
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='registration-container' >
      <h1 className='registration-title' >Registracija novog korisnika</h1>
      <form onSubmit = {handleRequest} className='registration-form' >
      <div>
      <label className='ime' >Ime:
      <input className='addinput' type="text" value={ime} onChange={(e) => setIme(e.target.value)} />
      </label>
      </div>
      <div>
      <label className='prezime' >Prezime:
      <input className='addinput' type="text" value={prezime} onChange={(e) => setPrezime(e.target.value)} />
      </label>
      </div>
      <div>
      <label className='adresa' >Adresa:
      <input className='addinput' type="text" value={adresa} onChange={(e) => setAdresa(e.target.value)} />
      </label>
      </div>
      <div>
      <label className='adresa'>Grad:
      <input className='addinput' type="text"  value={grad} onChange={(e) => setGrad(e.target.value)} /> 
      </label>
      </div>
      <div>
      <label className='drzava'>Država:
      <input type="text" className='addinput' value={drzava} onChange={(e) => setDrzava(e.target.value)} />
      </label>
      </div>
      <div>
      <label className='brojtelefona' >Broj telefona:
      <input type="text" className='addinput' value={brojtelefona} onChange={(e) => setBrojTel(e.target.value)} />
      </label>
      </div>
      <div>
      <label className='email' >Email:
      <input type="text" className='addinput' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      </div>
      <div>
      <label className='lozinka' >Lozinka:
      <input type="password" className='addinput' value={lozinka} onChange={(e) => setLozinka(e.target.value)} />
      </label>
      </div>
      <button type="submit" className='registration-button' >Registruj se</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
  </div>   
  );
};

export default RegistrationPage;