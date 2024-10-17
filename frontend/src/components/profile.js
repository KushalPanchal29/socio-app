import React from "react";
import "../styles/profile.css";
import userImage from "../images/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"

function Profile({ user, onLogout, profileClick, closeForms }) {
    if (!user) {
        return null; 
    }

    return (
        <div className="user-profile">
            <button className="close-btn" onClick={closeForms}>X</button>
            <div className="profile-info">
                <div className="profile-img">
                    <img src={userImage} alt="user-photo" />
                </div>
                <h2 className="username">@{user.USER_NAME}</h2>
                <p className="email">{user.EMAIL}</p>
            </div>
            <button className="view-profile-btn" onClick={profileClick}>
                View Profile
            </button>
            <button className="logout-btn" onClick={onLogout}>
                Log Out
            </button>
        </div>
    );
}

export default Profile;