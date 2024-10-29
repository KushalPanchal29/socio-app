import React, {useEffect} from "react";
import userImage from "../images/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg";
// import axios from "axios";

function UserProfile({ userName, posts, closeUserInfo }) {

    // const [profileImageUrl, setProfileImageUrl] = useState(null);

    useEffect(() => {
        
    }, []);
    
    // const fetchUserProfile = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/users/userProfile`, {
    //             params: {
    //                 userName: userName 
    //             }
    //         });
    //         const userData = response.data.results[0];
    
    //         if (userData.PROFILE_URL) {
    //             setProfileImageUrl(userData.PROFILE_URL);
    //         } else {
    //             setProfileImageUrl(userImage); 
    //         }
    //     } catch (error) {
    //         console.error('Error fetching user profile:', error);
    //     }
    // };
    

    // fetchUserProfile();

    return (
        <div className="main-profile">
            <button className="close-btn-user" onClick={closeUserInfo}>X</button>
            <div className="profile-information">
                <img width="200px" src={userImage} alt="user-photo" />
                <div className="info">
                    <h1 className="user-main-user-name">@{userName}</h1>
                </div>
            </div>
            <div className="user-posts">
                <h1 className="your-posts">Posts</h1>
                <div className="user-posts-container">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div className="user-posts-card" key={index}>
                                <h2>{post.TITLE}</h2>
                                <p>{post.DESCRIPTION}</p>
                                <div className="essentials">
                                    <p>{post.LIKES} Likes</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-posts">
                            <p>This user has no posts!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;