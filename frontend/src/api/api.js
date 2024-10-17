import axios from 'axios';

export const getPosts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/users/posts', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error);
        throw error;
    }
};

export const getUserPosts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/users/userposts', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error);
        throw error;
    }
};


