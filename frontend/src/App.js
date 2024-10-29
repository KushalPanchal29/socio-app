import React, { useState, useEffect } from 'react';
import Header from './components/header';
import Main from './components/main';
import SideBar from './components/sideBar';
import Profile from './components/profile';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import MainProfile from './components/mainProfile';
import UserProfile from './components/userProfile';
import axios from 'axios';
import './App.css';
import { getPosts } from './api/api';
import Chats from './components/chats';

function App() {
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showMainProfile, setShowMainProfile] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showChatList, setShowChatList] = useState(false);
    const [searchedUserName, setSearchedUserName] = useState("");
    const [searchedUserPosts, setSearchedUserPosts] = useState([]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users/home', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setUser(response.data.user);
            setIsLoggedIn(true);
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        getPosts();
    }, []);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const toggleMainProfile = () => {
        setShowMainProfile(true);
        setShowProfile(!showProfile);
        if(searchedUserName !== ''){
            setSearchedUserName('')
        }
        setShowChatList(false)
    };

    const handleFormSubmit = (data) => {
        setPosts([...posts, data]);
        getPosts();
    };

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setShowLogin(false);
        setShowSignup(false);
        fetchUserData();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        setShowProfile(false);
        setShowMainProfile(false);
    };

    const toggleLogin = () => {
        setShowLogin(true);
        setShowSignup(false);
    };

    const toggleSignup = () => {
        setShowLogin(false);
        setShowSignup(true);
    };

    const closeForms = () => {
        setShowLogin(false);
        setShowSignup(false);
    };

    const closeUserInfo = () => {
        setSearchedUserName('')
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    const closeProfile = () => {
        setShowProfile(false);
    };

    const handleUserInfo = (userName, posts) => {
        if(userName === user.USER_NAME){
            setShowMainProfile(true)
        }
        setSearchedUserName(userName);
        setSearchedUserPosts(posts);
    };

    const closeMainProfile = () => {
        setShowMainProfile(false);
    }

    const toggleShowChatList = () => {
        setShowChatList(!showChatList);
    }

    return (
        <div className="App">
            <Header 
                isLoggedIn={isLoggedIn} 
                handleLogout={handleLogout} 
                toggleLogin={toggleLogin} 
                toggleSignup={toggleSignup} 
                toggleProfile={toggleProfile} 
                toggleSearch={toggleSearch}
                handleUserInfo={handleUserInfo}
                toggleChats={toggleShowChatList}
            />
            {showLogin && <LoginPage handleLogin={handleLogin} closeForms={closeForms} />}
            {showSignup && <SignupPage handleSignup={handleLogin} closeForms={closeForms} />}
            {showProfile && <Profile user={user} onLogout={handleLogout} profileClick={toggleMainProfile} closeForms={closeProfile}/>}
            {showChatList ? <Chats user={user} /> :
            searchedUserName !=='' && searchedUserName !== user.USER_NAME ? <UserProfile userName={searchedUserName} posts={searchedUserPosts} closeUserInfo={closeUserInfo} />:
            
            showMainProfile ? <MainProfile user={user} closeUserInfo={closeMainProfile}/> : 
                isLoggedIn ? (
                    <div className='main-body'>
                        <div className='side-bar'>
                            <SideBar onSubmit={handleFormSubmit}/>
                        </div>
                        <div className='main-scroll-bar'>
                            <Main posts={posts} postFunction={getPosts} />
                        </div>
                        <div className='games-bar'>
                            {/* Content for games bar */}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Content when not logged in */}
                    </div>
                )
            }
            
            {/* Render the user profile when userName and posts are available */}
            {}
        </div>
    );
}

export default App;
