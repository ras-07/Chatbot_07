import { useState } from "react";
// 1. Remove the old Chatbot import and add Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini (Replace with your actual API key)
const genAI = new GoogleGenerativeAI("AIzaSyDkkkK0n8mbOYo9g4T7loarFvikFwSS2dQ");
const systemInstruction = `
  You are a concise AI assistant. 
  - Never use placeholders like [Insert Actual Temp].
  - If you don't know real-time data (like current weather), just give a short general summary or say you don't have the live data.
  - Keep responses under 3 sentences unless specifically asked for a long explanation.
  - Be direct and apt.
`;
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" ,
  systemInstruction:systemInstruction,
  generationConfig:{
    maxOutputTokens:400,
  }}
);

function ChatInput({ chtMsgs, setChtMsgs }) {
  const [ipTxt, setIptxt] = useState('');
  const [isLoading, setisLoad] = useState(false);

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

      // Add user message and a placeholder for the bot
      setChtMsgs([...chtMsgs, userMsg, { msg: "Thinking...", sender: "bot", id: "temp-loading" }]);
      
      const currentInput = ipTxt; // Store input before clearing
      setIptxt(''); 

      try {
        // 2. Call Gemini API instead of Chatbot.getResponseAsync
        const result = await model.generateContent(currentInput);
        const response = await result.response;
        const text = response.text();

        // Update the message list, replacing the "Thinking..." item
        setChtMsgs(prev => [
          ...prev.slice(0, -1), 
          { msg: text, sender: "bot", id: crypto.randomUUID() }
        ]);
      } catch (error) {
        console.error("Gemini Error:", error);
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
    <div className="input">
      <input
        type="text"
        placeholder="Ask Me anything..."
        size="40"
        onChange={saveIptxt}
        value={ipTxt}
        onKeyDown={enter}
        className="in"
      />
      <button className="snd" onClick={sendMsg} disabled={isLoading}>
        {isLoading ? "..." : "Send"}
      </button>
      
    </div>
  );
}

export default ChatInput;