import React, { useState } from 'react';
import '../styles/signup.css';
import axios from 'axios';

const SignupPage = ({ handleSignup, closeForms }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                username,
                email,
                password
            });
            if (response.status === 201) {
                handleSignup(response.data.token);
                alert(`User ${username} signed up successfully!`)
            } else {
                alert('Error signing up');
            }
        } catch (err) {
            console.error('Signup error:', err.response ? err.response.data : err);
            if (err.response) {
                if (err.response.data.message === 'Username or email already exists') {
                    setErrors([{ msg: 'Username or email already in use' }]); // Specific error message
                } else if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                } else {
                    alert('Error signing up hgkgkg');
                }
            } else {
                alert('Error signing up ksdhfkjsh');
            }
        }
    };

    return (
        <div className="signup-page">
            <button className="close-btn" onClick={closeForms}>X</button>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className='submit'>Sign Up</button>
            </form>
            {errors.length > 0 && (
                <div className="error-messages">
                    {errors.map((error, index) => (
                        <p key={index} className="error-message">{error.msg}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SignupPage;

