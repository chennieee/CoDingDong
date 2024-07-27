import React from 'react';
import '../App.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useSignup } from '../hooks/useSignup';

const Home = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { setIsLoading: setLoginLoading, setError: setLoginError } = useLogin();
    const { setIsLoading: setSignupLoading, setError: setSignupError } = useSignup();

    function navigateToLogin() {
        setLoginLoading(false); //reset login loading state
        setLoginError(null); //reset login error state
        navigate('/login');
    }

    function navigateToSignup() {
        setSignupLoading(false); //reset signup loading state
        setSignupError(null); //reset signup error state
        navigate('/signup');
    }

    return (
        <div className="home">
            <p>The free, fun, and effective way to learn Python</p>
            {!user && (
                <div className="auth-links">
                    <button onClick={() => navigateToLogin()}>Log in</button>
                    <button onClick={() => navigateToSignup()}>Sign up</button>
                </div>
            )}
        </div>
    );
};

export default Home;