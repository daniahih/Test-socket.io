// src/components/Chat.js
import  { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL to match your server

function Chat() {
    const [userId, setUserId] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Event listener for receiving private messages
        const privateMessageListener = ({ content, from }) => {
            setMessages(prevMessages => [...prevMessages, { content, from }]);
        };

        socket.on('private message', privateMessageListener);

        // Register the user with the socket server
        socket.emit('register', userId);

        // Cleanup function to remove event listener
        return () => {
            socket.off('private message', privateMessageListener);
        };
    }, [userId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message && recipientId) {
            socket.emit('private message', {
                content: message,
                to: recipientId,
            });
            setMessage('');
        }
    };

    return (
        <div>
            <input 
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Your ID"
                required
            />
            <input 
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Recipient ID"
                required
            />
            <ul id="messages">
                {messages.map((msg, index) => (
                    <li key={index}>{msg.from}: {msg.content}</li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input 
                    type="text"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter your message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chat;
