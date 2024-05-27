import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <h1>CoDingDong</h1>
            <p>The free, fun, and effective way to learn Python</p>
            <div className="auth-links">
                <a href="/login">Log in</a>
                <a href="/signup">Sign up</a>
            </div>
        </div>
    );
};

export default Home;
