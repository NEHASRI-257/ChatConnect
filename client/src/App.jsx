import { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';

function App() {
    const [joined, setJoined] = useState(false);
    const [username, setUsername] = useState('');
    const socketRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Cleanup listeners on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const joinChat = () => {
        if (username.trim()) {
            socketRef.current = io(import.meta.env.VITE_BACKEND_URL);

            // Join event
            socketRef.current.emit('join', username.trim());

            // Set up listeners once
            socketRef.current.on('users', (userList) => {
                setUsers(userList);
            });

            socketRef.current.on('message', (msg) => {
                setMessages((prev) => [...prev, msg]);
            });

            setJoined(true);
        }
    };

    const sendMessage = () => {
        if (message.trim() && socketRef.current) {
            socketRef.current.emit('message', {
                username: username,
                message: message.trim(),
            });
            setMessage('');
        }
    };

    const logout = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        socketRef.current = null;
        setJoined(false);
        setUsername('');
        setUsers([]);
        setMessages([]);
        setMessage('');
    };

    return (
        <div className='chatconnect-app'>
            {!joined ? (
                <div className='login-container'>
                    <h1 className="logo">ChatConnect 💬</h1>
                    <input
                        type='text'
                        placeholder='Enter your name...'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={joinChat}>Join Chat</button>
                </div>
            ) : (
                <div className='chat-ui'>
                    <aside className='sidebar'>
                        <h2>ChatConnect 💬</h2>
                        <p><strong>Welcome:</strong> {username}</p>
                        <h4>Online Users ({users.length})</h4>
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>{user.username}</li>
                            ))}
                        </ul>
                        <button onClick={logout}>Logout</button>
                    </aside>

                    <main className='chat-area'>
                        <div className='message-list'>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message-bubble ${
                                        msg.username === username
                                            ? 'own-message'
                                            : msg.username === 'System'
                                            ? 'system-message'
                                            : 'other-message'
                                    }`}
                                >
                                    <div className='message-meta'>
                                        <span className='msg-user'>{msg.username}</span>
                                    </div>
                                    <div className='msg-text'>{msg.message}</div>
                                </div>
                            ))}
                        </div>

                        <div className='message-input'>
                            <input
                                type='text'
                                placeholder='Type a message...'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
}

export default App;
