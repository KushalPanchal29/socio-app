import React, { useState, useEffect } from "react";
import "../styles/header.css";
import axios from "axios";
import SearchResults from "./searchResults"; 

function Header({ isLoggedIn, toggleLogin, toggleSignup, toggleProfile, handleUserInfo, toggleChats }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState();
    const [posts, setPosts] = useState([]);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const arr = [userName, userId, posts, showUserProfile];
    arr.push(1)

    const closeForms = () => {
        setShowSearch(false);
        setSearchValue('');
    };

    const getUserPosts = async (userId) => {
        const url = `http://localhost:8080/api/users/otheruserposts?userId=${userId}`;
        try {
            const response = await axios.get(url);
            setPosts(response.data.posts);
            return response.data.posts; // Return the posts
        } catch (error) {
            console.error("There was an error fetching the posts:", error);
            return []; // Return an empty array in case of error
        }
    };
    

    const handleProfileClick = (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            toggleProfile();
        } else {
            setShowDropdown(!showDropdown);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-menu") && !event.target.closest(".profile")) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const showUserInfo = async (userName, userId) => {
        setUserName(userName);
        setUserId(userId);
        setShowSearch(false);
        setShowUserProfile(true);
        setSearchValue('');
        const fetchedPosts = await getUserPosts(userId);
    
        handleUserInfo(userName, fetchedPosts);
    };
    

    const handleSearch = async (value) => {
        try {
            const results = await axios.get("http://localhost:8080/api/users/searchResults", {
                params: { search: value }
            });
            setSearchResults(results.data);
            setShowSearch(true);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleToggleLogin = () => {
        toggleLogin();
        setShowDropdown(false);
    };
    const handleToggleSignup = () => {
        toggleSignup();
        setShowDropdown(false);
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        if (value !== '') {
            handleSearch(value);
        } else {
            setShowSearch(false);
        }
    };

    return (
        <div className="Header">
            <a className="home-btn" href="../" onClick={() => window.location.reload()}>
                <h1>socio.</h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat-right-quote-fill" viewBox="0 0 16 16">
                    <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM7.194 4.766q.13.188.227.401c.428.948.393 2.377-.942 3.706a.446.446 0 0 1-.612.01.405.405 0 0 1-.011-.59c.419-.416.672-.831.809-1.22-.269.165-.588.26-.93.26C4.775 7.333 4 6.587 4 5.667S4.776 4 5.734 4c.271 0 .528.06.756.166l.008.004c.169.07.327.182.469.324q.128.125.227.272M11 7.073c-.269.165-.588.26-.93.26-.958 0-1.735-.746-1.735-1.666S9.112 4 10.069 4c.271 0 .528.06.756.166l.008.004c.17.07.327.182.469.324q.128.125.227.272.131.188.228.401c.428.948.392 2.377-.942 3.706a.446.446 0 0 1-.613.01.405.405 0 0 1-.011-.59c.42-.416.672-.831.81-1.22z" />
                </svg>
            </a>
            <div className="search-bar-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="search..."
                        value={searchValue}
                        onChange={handleInputChange}
                        id="search-input"
                    />
                </div>
                <button className="search-btn" onClick={() => handleSearch(searchValue)}>Search</button>
            </div>
            <div className={`main-content`}>
                <div className="nav-links">
                    <button className="chats" onClick={toggleChats}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        </svg>
                    </button>
                    {!isLoggedIn && (
                        <button className="profile" onClick={handleProfileClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
                                <path d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"/>
                                <path d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                            </svg>
                        </button>
                    )}
                    {isLoggedIn && (
                        <button className="new-user" onClick={handleProfileClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                            </svg>  
                        </button>
                    )}
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button onClick={handleToggleLogin}>Login</button>
                            <button onClick={handleToggleSignup}>Sign Up</button>
                        </div>
                    )}
                </div>
                {searchResults.length > 0 && showSearch ? (
                    <SearchResults closeForms={closeForms} results={searchResults} userInfo={showUserInfo} />
                ) : (
                    <div className="no-results">
                        
                    </div>
                )}
            </div>
        </div>
    );


}

export default Header;
