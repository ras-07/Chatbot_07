import { useState, useEffect } from 'react'
import './App.css'
import ChatInput from './components/ChatInput.jsx';
import ChatMsgCmpnt from './components/ChatMsgCmpnt.jsx';
import Login from './Login.jsx'; // Import your Login component
import Left from "../src/assets/left-panel-dark.svg"
import Right from "../src/assets/right-panel-dark.svg"
import { auth } from './firebase'; // Import auth from firebase.js
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [chtMsgs, setChtMsgs] = useState([]);
  const [user, setUser] = useState(null); // State to track logged-in user
  const [loading, setLoading] = useState(true); // State to handle initial firebase check

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => alert("Logged out!"));
  };

  function Welcome({ messages }) {
    if (messages.length === 0) {
      return (
        <p className='w1'>ChatBot</p>
      );
    }
    return null;
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className='Overall-container'>
      <div className='side-image left'>
        <img src={Left} alt="left-decoration" />
      </div>

      <div className='app'>
        {!user ? (
          // If no user, show Login
          <Login />
        ) : (
          // If user exists, show Chat UI
          <>
            <Welcome messages={chtMsgs} />
            <ChatMsgCmpnt 
              chtMsgs={chtMsgs} 
              setChtMsgs={setChtMsgs} 
            />
            
            <ChatInput 
              chtMsgs={chtMsgs} 
              setChtMsgs={setChtMsgs} 
            />
            <button onClick={handleLogout} className="logout-btn">Log Out</button>
          </>
        )}
      </div>

      <div className='side-image right'>
        <img src={Right} alt="right-decoration" />
      </div>
    </div>
  );
}

export default App;