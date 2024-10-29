import React, { useEffect, useState } from "react";
import "../styles/mainProfile.css";
import { getUserPosts } from "../api/api";
import userImage from "../images/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg";
import axios from "axios";

function MainProfile({ user, closeUserInfo }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await getUserPosts();
                setPosts(postsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleImageClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!selectedImage) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            const response = await axios.post("http://localhost:8080/api/users/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const imageUrl = response.data.imageUrl;
            setPreviewImage(imageUrl);
            setUploading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploading(false);
        }
    };

    const deletePost = async (index) => {
        try {
            await axios.delete("http://localhost:8080/api/users/delete", {
                data: { postId: posts[index].POST_ID },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const updatedPosts = await getUserPosts();
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error deleting post:', error.response ? error.response.data : error);
        }
    };

    if (!user) {
        return null; 
    }
    if (loading) {
        return <div className="loader-body">
        <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        </div>
        </div>
    }
    return (
        <div className="main-profile">
            <button className="close-btn-user" onClick={closeUserInfo}>X</button>
            <div className="profile-information">
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
                <img
                    width="200px"
                    src={userImage}
                    alt="user-photo"
                    onClick={handleImageClick}
                    style={{ cursor: "pointer" }}
                />
                <div className="info">
                    <h1 className="main-user-name">@{user.USER_NAME}</h1>
                    <h3 className="main-user-email">{user.EMAIL}</h3>
                </div>
            </div>
            {previewImage && !uploading && (
                <button className="upload-btn" onClick={uploadImage}>Upload</button>
            )}
            {uploading && <p>Uploading...</p>}
            <div className="user-posts">
                <h1 className="your-posts">Your Posts</h1>
                <div className="user-posts-container">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div className="user-posts-card" key={index}>
                                <h2>{post.TITLE}</h2>
                                <p>{post.DESCRIPTION}</p>
                                <div className="essentials">
                                    <p>{post.LIKES} Likes</p>
                                    <button className="delete-post" onClick={() => deletePost(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>There is nothing to watch ;)</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MainProfile;
