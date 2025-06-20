import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { useAuth } from './shared/hooks/authHook';
import SignIn from './components/authentication/SignIn';
import SignUp from './components/authentication/SignUp';
import Home from './components/content/home/Home';
import Header from './components/content/Header';
import Profile from './components/content/profile/Profile';
import ChangePassword from './components/content/profile/ChangePassword';
import './App.css'

function App() {
  const {login} = useAuth();

  return (
    <Router>
      {login && <Header />}
      <Routes>
        <Route path="/" element={login ? <Home /> : <SignIn />} />
        { login && <>
            <Route path="/profile" element={<Profile /> } />
            <Route path="/change-password" element={<ChangePassword /> } />
          </> }
        <Route path="/signup" element={<SignUp />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  )
}

export default App;
