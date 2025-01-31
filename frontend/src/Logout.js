import React, { useState, useEffect } from 'react';


const Logout = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
  
    useEffect (() => {
      const session = localStorage.getItem('user_email')
      
      fetch('http://localhost:5000/Logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({session}), 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem('user_email', JSON.stringify(''));
            window.location.href = '/Login'
          } else {
            setError(true);
            console.log(data.message)
            window.location.href = '/Login'
          }
        }) 
        .catch((error) => {
          console.log(error);
        });
    }, []); 
  
    return (
      <div>
        
      </div>
    );
  };
  
  export default Logout;
  