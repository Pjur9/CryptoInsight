import React, {useState, useEffect}from 'react'
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import HomePage from './Home';
import RegistrationPage from './RegistrationPage'; 
import LoginPage from './LoginPage'; 
import Navbar from './Navbar';
import HomeUserPage from './HomeUserPage';
import AddTransaction from './AddTransaction'
import Logout from './Logout'
function App() {
  return (
      <Router>
        <div className="App">
        <Navbar/>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/registracija" element={<RegistrationPage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Logout" element={<Logout/>} />
            <Route path="/userhome" element={<HomeUserPage />} />
            <Route path="/addTransaction" element={<AddTransaction />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;