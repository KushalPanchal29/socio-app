import React, { useEffect, useState } from "react";
import "../styles/chats.css";
import axios from "axios";
import userImage from "../images/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg";

function Chats({ user }) {
  const [chatList, setChatList] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const getChats = async (userId, otherId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/getChat?userId=${userId}&otherId=${otherId}`);
      setChats(response.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  const getChatList = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/getChatList?userId=${user.USER_ID}`);
      setChatList(response.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChatList();
  }, [user]);

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    getChats(user.USER_ID, chat.USER_ID);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      await axios.post("http://localhost:8080/api/users/sendMessage", {
        senderId: user.USER_ID,
        receiverId: activeChat.USER_ID,
        message: newMessage
      });
      setNewMessage("");
      getChats(user.USER_ID, activeChat.USER_ID);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chats-container">
      <div className="chat-list">
        <h1 className="chats-header">Chats</h1>
        {chatList.length > 0 ? (
          chatList.map((chat) => (
            <div className="chats-div" key={chat.USER_ID}>
              <button 
                className="chat-button" 
                onClick={() => handleChatClick(chat)}>
                <img width="70px" src={userImage} alt="user-photo" />
                <span>@{chat.USER_NAME}</span>
              </button>
            </div>
          ))
        ) : (
          <div className="nothing-bro">
            <p>No chats found</p>
          </div>
        )}
      </div>
      <div className="chat-window">
        {activeChat && (
          <div className="my-chats-container">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div 
                  key={chat.MESSAGE_ID} 
                  className={`chat-message ${chat.SENDER_ID === user.USER_ID ? "sent" : "received"}`}>
                  <p>{chat.MESSAGE}</p>
                </div>
              ))
            ) : (
              <p>No messages found</p>
            )}
            <div className="message-input-container">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type a message" 
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
