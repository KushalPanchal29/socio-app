import React, { useState, useEffect } from "react";
import "../styles/main.css";
import axios from "axios";

function Main({ postFunction }) {
    const [posts, setPosts] = useState([]);
    const [liked, setLiked] = useState([]);
    const [commenting, setCommenting] = useState([]);
    const [commentTexts, setCommentTexts] = useState([]);
    const [fetchedComments, setFetchedComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsData = await postFunction();
                setPosts(postsData);
                setCommenting(postsData.map(() => false));
                setCommentTexts(postsData.map(() => ""));
                setFetchedComments(postsData.map(() => []));
                setCommentsLoading(postsData.map(() => false));
                const likesData = await getLikes();
                const temp = [];

                for (let i = 0; i < postsData.length; i++) {
                    for (let j = 0; j < likesData.length; j++) {
                        if (likesData[j].POST_ID === postsData[i].POST_ID && likesData[j].IS_LIKED === 1) {
                            temp.push(true);
                            break;
                        } else if (likesData[j].POST_ID === postsData[i].POST_ID && likesData[j].IS_LIKED === 0) {
                            temp.push(false);
                            break;
                        }
                    }
                    if (temp[i] === undefined) {
                        temp.push(false);
                    }
                }
                setLiked(temp);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [postFunction]);

    const getComments = async (posts, index) => {
        setCommentsLoading((prev) => {
            const newLoading = [...prev];
            newLoading[index] = true;
            return newLoading;
        });
        try {
            const postId = posts[index].POST_ID;
            const response = await axios.get(`http://localhost:8080/api/users/comment?postId=${postId}`);
            const newFetchedComments = [...fetchedComments];
            newFetchedComments[index] = response.data.comments;
            setFetchedComments(newFetchedComments);
            setCommentsLoading((prev) => {
                const newLoading = [...prev];
                newLoading[index] = false;
                return newLoading;
            });
        } catch (error) {
            console.error('Error fetching comments:', error.response ? error.response.data : error);
            setCommentsLoading((prev) => {
                const newLoading = [...prev];
                newLoading[index] = false;
                return newLoading;
            });
        }
        try {
            const response = await axios.get('http://localhost:8080/api/users/home', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data.user);
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const postComment = async (commentText, posts, index) => {
        try {
            await axios.post('http://localhost:8080/api/users/comments', {
                comments: commentText,
                postId: posts[index].POST_ID,
                userId: user.USER_ID
            });
            const newFetchedComments = [...fetchedComments];
            newFetchedComments[index] = [
                {
                    USER_NAME: user.USER_NAME,
                    COMMENT: commentText
                },
                ...newFetchedComments[index]
            ];
            setFetchedComments(newFetchedComments);
        } catch (error) {
            console.error('Error posting comment:', error.response ? error.response.data : error);
            throw error;
        }
    };

    const getLikes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users/likebool', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.likes;
        } catch (error) {
            console.error('Error fetching likes:', error.response ? error.response.data : error);
            throw error;
        }
    };

    const handleLikeClick = async (index) => {
        const newLiked = [...liked];
        newLiked[index] = !newLiked[index];
        setLiked(newLiked);

        try {
            if (newLiked[index]) {
                await axios.post('http://localhost:8080/api/users/likeplus', { postId: posts[index].POST_ID }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                await axios.post('http://localhost:8080/api/users/likeminus', { postId: posts[index].POST_ID }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            const postsData = await postFunction();
            setPosts(postsData);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentClick = (index) => {
        const newCommenting = [...commenting];
        newCommenting[index] = !newCommenting[index];
        setCommenting(newCommenting);
        getComments(posts, index);
    };

    const handleCommentChange = (e, index) => {
        const newCommentTexts = [...commentTexts];
        newCommentTexts[index] = e.target.value;
        setCommentTexts(newCommentTexts);
    };

    const handleCommentSubmit = (e, index) => {
        e.preventDefault();
        postComment(commentTexts[index], posts, index);
        const newCommentTexts = [...commentTexts];
        newCommentTexts[index] = "";
        setCommentTexts(newCommentTexts);
    };

    const closeComment = (index) => {
        const newCommenting = [...commenting];
        newCommenting[index] = false;
        setCommenting(newCommenting);
    };

    if (loading) {
        return (
            <div className="loader-body">
                <div className="loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-body-container">
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <div className="data-card" key={index}>
                        <div className="user-name">
                            <h3 id="name-tag">@{post.USER_NAME}</h3>
                        </div>
                        <h4>{post.TITLE}</h4>
                        <p>{post.DESCRIPTION}</p>
                        <div className="review-section">
                            <button
                                className={`like-btn ${liked[index] ? 'liked' : ''}`}
                                onClick={() => handleLikeClick(index)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className={`bi ${!liked[index] ? 'bi-star-filled' : 'bi-star'}`} viewBox="0 0 16 16">
                                    <path d={`${!liked[index] ? "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" : "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"}`}/>
                                </svg>
                            </button>
                            <p>{post.LIKES}</p>
                            <button className="comment-btn" onClick={() => handleCommentClick(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                                </svg>
                            </button>
                        </div>
                        {commenting[index] && (
                            <div>
                                {commentsLoading[index] ? (
                                    <div className="loader-body-2">
                                        <div className="loader">
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                            <div className="dot"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <form className="comment-form" onSubmit={(e) => handleCommentSubmit(e, index)}>
                                            <textarea
                                                className="comment-input"
                                                value={commentTexts[index]}
                                                onChange={(e) => handleCommentChange(e, index)}
                                                placeholder="Add a comment"
                                            ></textarea>
                                            <button className="submit-comment-btn" type="submit">Submit</button>
                                        </form>
                                        {fetchedComments[index] && fetchedComments[index].length > 0 ? (
                                            <div className="comment-container">
                                                <button className="close-btn-main" onClick={() => closeComment(index)}>x</button>
                                                <p className="comments-header">Comments</p>
                                                <div className="comment-scroller">
                                                    {fetchedComments[index].map((comment, commentIndex) => (
                                                        <div className="comment" key={commentIndex}>
                                                            <h3>@{comment.USER_NAME}</h3>
                                                            <p>{comment.COMMENT}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="close-btn-main" onClick={() => closeComment(index)}>x</button>
                                                <p className="no-comments">No comments</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>There is nothing to watch ;)</p>
            )}
        </div>
    );
}

export default Main;
