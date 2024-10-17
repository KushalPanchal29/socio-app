import React from "react";
import userImage from "../images/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg";

function SearchResults({ results, closeForms, userInfo }) {
    return (
        <div className="search-results">
            <button className="close-btn" onClick={closeForms}>X</button>
            <h1>Search Results</h1>
            <ul>
                {results.map((result, index) => (
                    <button
                        key={index}
                        className="other-profile-btn"
                        onClick={() => userInfo(result.USER_NAME, result.USER_ID)}
                    >
                        <li>
                            <img width="40px" src={userImage} alt="User Profile" className="user-image-search" />
                            @{result.USER_NAME}
                        </li>
                    </button>
                ))}
            </ul>
        </div>
    );
}

export default SearchResults;
