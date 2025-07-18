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
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const joinChat = () => {
    if (username.trim()) {
      socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to server:', socketRef.current.id);
        socketRef.current.emit('join', username.trim());
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Connection error:', err.message);
      });

      socketRef.current.on('users', (userList) => {
        setUsers(userList);
      });

      socketRef.current.on('message', (msg) => {
        // Change system message wording here if username === 'System'
        if (msg.username === 'System') {
          // Change text like "neha has joined the chat" to "neha entered the room"
          const enteredText = msg.message.replace('has joined the chat', 'entered the room').replace('is online', 'is now online');
          setMessages((prev) => [...prev, { ...msg, message: enteredText }]);
        } else {
          setMessages((prev) => [...prev, msg]);
        }
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
    setShowUsersDropdown(false);
  };

  if (!joined) {
    return (
      <div className="login-container">
        <h1 className="logo">ChatConnect 💬</h1>
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinChat}>Join Chat</button>
      </div>
    );
  }

  return (
    <div className="chatconnect-app">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="logo">ChatConnect 💬</div>

        <div className="user-info">👋 Hello, {username}!</div>

        <button
          className="users-toggle-btn"
          onClick={() => setShowUsersDropdown((prev) => !prev)}
          aria-label="Toggle online users list"
        >
          Active Now ({users.length})
        </button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </nav>

      {/* Users Dropdown */}
      {showUsersDropdown && (
        <div className="users-dropdown">
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat area */}
      <main className="chat-area">
        <div className="message-list">
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
              <div className="message-meta">
                <span className="msg-user">{msg.username}</span>
              </div>
              <div className="msg-text">{msg.message}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed message input at bottom */}
      <div className="message-input">
        <input
          type="text"
          placeholder="Start typing here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
