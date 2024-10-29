import React, {  useState } from "react";
import "../styles/sideBar.css";
import axios from "axios";

function SideBar({ onSubmit, loadPosts }) {
    const [isDivVisible, setIsDivVisible] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });
    const [errors, setErrors] = useState([]);

    const handleButtonClick = () => {
        setIsDivVisible(!isDivVisible);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/post', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 201) {
                onSubmit(response.data);
                window.location.reload()
            } else {
                alert('Error creating post');
            }
        } catch (err) {
            console.error('Error creating post:', err.response ? err.response.data : err);
            if (err.response) {
                setErrors([{ msg: err.response.data.message || 'Error creating post' }]);
            } else {
                alert('Error creating post');
            }
        }

        setIsDivVisible(false);
        setFormData({
            title: "",
            description: ""
        });
    };

    return (
        <div className="sb">
            <div className="sb-btn-container">
                <button className="create-new-post-btn" onClick={handleButtonClick}>
                    {isDivVisible ? 'X' : 'create +'}
                </button>
            </div>
            {isDivVisible && (
                <form onSubmit={handleSubmit}>
                    <div className="new-post-container">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            className="title-input"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Post Description"
                            className="description-textarea"
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                        <input className="submit-btn" type="submit" value="Post"/>
                    </div>
                </form>
            )}
            {errors.length > 0 && (
                <div className="error-messages">
                    {errors.map((error, index) => (
                        <p key={index}>{error.msg}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SideBar;
