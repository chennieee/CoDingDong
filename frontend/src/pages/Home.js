import React from 'react';
import '../App.css';
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
            <p>The free, fun, and effective way to learn Python</p>
            <div className="auth-links">
                <button onClick={() => navigateToLogin()}>Log in</button>
                <button onClick={() => navigateToSignup()}>Sign up</button>
            </div>
        </div>
    );
};

export default Home;
