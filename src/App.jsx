// App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import ChatInput from './components/ChatInput.jsx';
import ChatMsgCmpnt from './components/ChatMsgCmpnt.jsx';
import Login from './Login.jsx'; 
import Left from "../src/assets/left-panel-dark.svg"
import Right from "../src/assets/right-panel-dark.svg"
import { auth } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [chtMsgs, setChtMsgs] = useState([]);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  
  // Client-Side Data Logs Storage
  const [analyticsLogs, setAnalyticsLogs] = useState([]);
  const [viewMode, setViewMode] = useState('chat'); // Toggle between 'chat' and 'analytics'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => alert("Logged out!"));
  };

  // Aggregates pipelines and metrics from incoming stream transfers
  const handleLogGenerated = (newLog) => {
    setAnalyticsLogs(prev => [...prev, newLog]);
  };

  // --- COMPUTE DATA METRICS (Analytical Problem Solving) ---
  const totalQueries = analyticsLogs.length;
  const avgLatency = totalQueries > 0 
    ? Math.round(analyticsLogs.reduce((acc, curr) => acc + curr.latency, 0) / totalQueries) 
    : 0;
  const totalTokensProcessed = analyticsLogs.reduce((acc, curr) => acc + curr.promptLength + curr.responseLength, 0);
  const successRate = totalQueries > 0 
    ? Math.round((analyticsLogs.filter(l => l.status === "Success").length / totalQueries) * 100) 
    : 0;

  function Welcome({ messages }) {
    if (messages.length === 0) {
      return <p className='w1'>AI Analytics Engine</p>;
    }
    return null;
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className='Overall-container'>
      <div className='side-image left'>
        <img src={Left} alt="left-decoration" />
      </div>

      <div className='app' style={{ maxWidth: '800px', width: '100%' }}>
        {!user ? (
          <Login />
        ) : (
          <>
            {/* View Mode Switching Navigation Bar */}
            <div className="nav-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => setViewMode('chat')} 
                style={{ padding: '8px 16px', background: viewMode === 'chat' ? '#007bff' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Chat Interface
              </button>
              <button 
                onClick={() => setViewMode('analytics')} 
                style={{ padding: '8px 16px', background: viewMode === 'analytics' ? '#007bff' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Operational Analytics ({totalQueries})
              </button>
            </div>

            {viewMode === 'chat' ? (
              // Regular Chat Window Mode
              <>
                <Welcome messages={chtMsgs} />
                <ChatMsgCmpnt chtMsgs={chtMsgs} setChtMsgs={setChtMsgs} />
                <ChatInput 
                  chtMsgs={chtMsgs} 
                  setChtMsgs={setChtMsgs} 
                  onLogGenerated={handleLogGenerated} 
                />
                <button onClick={handleLogout} className="logout-btn" style={{ marginTop: '15px' }}>Log Out</button>
              </>
            ) : (
              // System Dashboard Mode (Demonstrates Analytical Solution Architecture)
              <div className="analytics-dashboard" style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', color: '#fff', textAlign: 'left', overflowY: 'auto', maxHeight: '75vh' }}>
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>System Performance Metrics</h2>
                
                {/* Scorecards Row */}
                <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ background: '#2d2d2d', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>Total Queries</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00d2ff' }}>{totalQueries}</div>
                  </div>
                  <div style={{ background: '#2d2d2d', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>Avg Latency</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffb700' }}>{avgLatency}ms</div>
                  </div>
                  <div style={{ background: '#2d2d2d', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>Characters Parsed</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00ff66' }}>{totalTokensProcessed}</div>
                  </div>
                  <div style={{ background: '#2d2d2d', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>API Success Rate</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: successRate > 50 ? '#00ff66' : '#ff4d4d' }}>{successRate}%</div>
                  </div>
                </div>

                {/* Tabular Log Stream Overview */}
                <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#aaa' }}>Structured Data Stream Logs</h3>
                {analyticsLogs.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '13px' }}>No execution payloads captured yet. Send a query to populate logs.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #333', color: '#aaa' }}>
                          <th style={{ padding: '8px' }}>Timestamp</th>
                          <th style={{ padding: '8px' }}>Intent</th>
                          <th style={{ padding: '8px' }}>Latency</th>
                          <th style={{ padding: '8px' }}>Input Chars</th>
                          <th style={{ padding: '8px' }}>Output Chars</th>
                          <th style={{ padding: '8px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsLogs.map((log) => (
                          <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                            <td style={{ padding: '8px' }}>{log.timestamp}</td>
                            <td style={{ padding: '8px' }}><span style={{ background: '#444', padding: '2px 6px', borderRadius: '4px' }}>{log.category}</span></td>
                            <td style={{ padding: '8px', color: log.latency > 1500 ? '#ffb700' : '#00d2ff' }}>{log.latency}ms</td>
                            <td style={{ padding: '8px' }}>{log.promptLength}</td>
                            <td style={{ padding: '8px' }}>{log.responseLength}</td>
                            <td style={{ padding: '8px', color: log.status === "Success" ? '#00ff66' : '#ff4d4d' }}>{log.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <button onClick={() => setViewMode('chat')} style={{ marginTop: '20px', background: 'transparent', color: '#aaa', border: '1px solid #444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>← Back to Testing Window</button>
              </div>
            )}
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