import { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';

function App() {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('😀');
  const [country, setCountry] = useState('🇮🇳');
  const [status, setStatus] = useState('');
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
        socketRef.current.emit('join', {
          username: username.trim(),
          avatar,
          country,
          status: status.trim(),
        });
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Connection error:', err.message);
      });

      socketRef.current.on('users', (userList) => {
        setUsers(userList);
      });

      socketRef.current.on('message', (msg) => {
        if (msg.username === 'System') {
          const enteredText = msg.message
            .replace('has joined the chat', 'entered the room')
            .replace('is online', 'is now online');
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
        username,
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
    setAvatar('😀');
    setCountry('🇮🇳');
    setStatus('');
    setUsers([]);
    setMessages([]);
    setMessage('');
    setShowUsersDropdown(false);
  };

  if (!joined) {
    return (
      <div className="login-container">
        <h1 className="logo">ChatConnect 💬</h1>

        <div className="form-group">
          <label>Enter your name:</label>
          <input
            type="text"
            placeholder="e.g. Aarav"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Choose an avatar (optional):</label>
          <select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
            <option>😀</option>
            <option>😎</option>
            <option>👻</option>
            <option>🤖</option>
            <option>🐱</option>
            <option>🦄</option>
          </select>
        </div>

        <div className="form-group">
          <label>Country (optional):</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="🇮🇳">🇮🇳 India</option>
            <option value="🇺🇸">🇺🇸 USA</option>
            <option value="🇬🇧">🇬🇧 UK</option>
            <option value="🇯🇵">🇯🇵 Japan</option>
            <option value="🇨🇦">🇨🇦 Canada</option>
            <option value="🌍">🌍 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status (optional):</label>
          <input
            type="text"
            placeholder="Chilling today..."
            maxLength="40"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        <button onClick={joinChat}>Join Chat</button>
      </div>
    );
  }

  return (
    <div className="chatconnect-app">
      <nav className="top-navbar">
        <div className="logo">ChatConnect 💬</div>
        <div className="user-info">
          {avatar} Hello, {username}! {country} <em>{status && `— ${status}`}</em>
        </div>
        <button
          className="users-toggle-btn"
          onClick={() => setShowUsersDropdown((prev) => !prev)}
        >
          Active Now ({users.length})
        </button>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </nav>

      {showUsersDropdown && (
        <div className="users-dropdown">
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
      )}

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
                <span className="msg-user">
                  {msg.avatar || ''} {msg.username}
                </span>
              </div>
              <div className="msg-text">{msg.message}</div>
            </div>
          ))}
        </div>
      </main>

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
