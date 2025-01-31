import React, { useState, useEffect } from 'react';
import './LoginPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect (() => {
    setErrorMessage('');
    
    }, [])

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), 
    })
      .then((res) => res.json())
      .then((data) => {
        
        if (data.success) {
          localStorage.setItem('user_email', JSON.stringify(data.email));
          //localStorage.setItem('logged',JSON.stringify(true))
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
    <div>
      <h1 className='login-page'>Login Page</h1>
      
      <form className='login-form' onSubmit={handleSubmit}>
        <div>
            <label className='username'>Username:
            <input className='input-username' type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
        </div>
        <div>
            <label className='password'>Password:
            <input className='input-password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
        </div>
        <button className='login-btn' type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      
    </div>
  );
};

export default LoginPage;
