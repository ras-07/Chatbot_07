// components/ChatInput.jsx
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const systemInstruction = `
  You are a concise AI assistant. The current year is 2026.
  - Accept and process queries regarding the year 2026 normally.
  - Never use placeholders like [Insert Actual Temp].
  - If you don't know real-time data (like current weather), just give a short general summary or say you don't have the live data.
  - Keep responses under 3 sentences unless specifically asked for a long explanation.
  - Be direct and apt.
`;
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: systemInstruction,
  generationConfig: { maxOutputTokens: 400 }
});

// 1. Destructure onLogGenerated to pass analytical metadata up to App.jsx
function ChatInput({ chtMsgs, setChtMsgs, onLogGenerated }) {
  const [ipTxt, setIptxt] = useState('');
  const [isLoading, setisLoad] = useState(false);
  const [analysisType, setAnalysisType] = useState('General'); // Meta feature

  function saveIptxt(event) {
    setIptxt(event.target.value);
  }

  async function sendMsg() {
    if (ipTxt.trim().length === 0) {
      alert("Please type a message first");
      return;
    }

    if (!isLoading) {
      setisLoad(true);
      const userMsg = {
        msg: ipTxt,
        sender: "user",
        id: crypto.randomUUID()
      };

      setChtMsgs([...chtMsgs, userMsg, { msg: "Thinking...", sender: "bot", id: "temp-loading" }]);
      
      const currentInput = ipTxt;
      setIptxt(''); 

      // Data Pipeline: Start stopwatch for latency metrics
      const startTime = performance.now();

      try {
        const result = await model.generateContent(currentInput);
        const response = await result.response;
        const text = response.text();

        // Data Pipeline: Calculate analytical performance metrics
        const endTime = performance.now();
        const latencyMs = Math.round(endTime - startTime);

        // Dispatches structural operational metadata to the dashboard state
        onLogGenerated({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          latency: latencyMs,
          promptLength: currentInput.length,
          responseLength: text.length,
          category: analysisType,
          status: "Success"
        });

        setChtMsgs(prev => [
          ...prev.slice(0, -1), 
          { msg: text, sender: "bot", id: crypto.randomUUID() }
        ]);
      } catch (error) {
        console.error("Gemini Error:", error);
        
        const endTime = performance.now();
        onLogGenerated({
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString(),
          latency: Math.round(endTime - startTime),
          promptLength: currentInput.length,
          responseLength: 0,
          category: analysisType,
          status: "Failed"
        });

        setChtMsgs(prev => [
          ...prev.slice(0, -1),
          { msg: "Error connecting to Gemini API.", sender: "bot", id: crypto.randomUUID() }
        ]);
      } finally {
        setisLoad(false);
      }
    } else {
      alert("Wait before sending another message");
    }
  }

  function enter(event) {
    if (event.key === "Enter") sendMsg();
    if (event.key === "Escape") setIptxt('');
  }

  return (
    <div className="input-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Preprocessing Input Selector (Demonstrates Intent Categorization) */}
      <div className="analytics-config" style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
        <label style={{ color: '#aaa' }}>Analysis Intent: </label>
        <select 
          value={analysisType} 
          onChange={(e) => setAnalysisType(e.target.value)}
          style={{ background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
        >
          <option value="General">General Query</option>
          <option value="Summarization">Text Summarization</option>
          <option value="Classification">Data Classification</option>
        </select>
      </div>

      <div className="input" style={{ display: 'flex', width: '100%' }}>
        <input
          type="text"
          placeholder="Ask Me anything..."
          onChange={saveIptxt}
          value={ipTxt}
          onKeyDown={enter}
          className="in"
          style={{ flexGrow: 1 }}
        />
        <button className="snd" onClick={sendMsg} disabled={isLoading}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;