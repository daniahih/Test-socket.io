// src/Chat.js
import  { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css'; // Make sure to create this CSS file

const socket = io('http://localhost:3000'); // Adjust this to match your server's address and port

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="chat-input"
          placeholder="Type a message..."
          autoComplete="off"
        />
        <button type="submit" className="chat-send">Send</button>
      </form>
    </div>
  );
}

export default Chat;
