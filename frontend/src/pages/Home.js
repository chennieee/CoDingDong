import React from 'react';
import Login from './Login';
import Signup from './Signup';
import './App.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    function navigateToLogin() {
        navigate('/login');
    }

    function navigateToSignup() {
        navigate('/signup');
    }

    return (
        <div className="home">
            <h1>CoDingDong</h1>
            <p>The free, fun, and effective way to learn Python</p>
            <div className="auth-links">
                <button onClick={() => navigateToLogin()}>Log in</button>
                <button onClick={() => navigateToSignup()}>Sign up</button>
            </div>
        </div>
    );
};

export default Home;
