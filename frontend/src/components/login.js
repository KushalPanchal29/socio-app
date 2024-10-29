import React, { useState } from 'react';
import '../styles/login.css';
import axios from 'axios';

const LoginPage = ({ handleLogin, closeForms }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });
            if (response.status === 200) {
                handleLogin(response.data.token);
            } else {
                alert('Error logging in');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Error logging in');
        }
    };

    return (
        <div className="login-page">
            <button className="close-btn" onClick={closeForms}>X</button>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className='submit'>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
