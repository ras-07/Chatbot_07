import { useState,useEffect,useRef } from "react";
import ChatMessage from "./ChatMessage"

function ChatMsgCmpnt({chtMsgs,setChtMsgs})
  { 
    const chtMsgsRef=useRef(null);
    useEffect(()=>
    {
      const containerElem=chtMsgsRef.current;
      if(containerElem)
      {
        containerElem.scrollTop=containerElem.scrollHeight;
      }


    },[chtMsgs]
    );
    return(
      <div className="msg_comp" 
        ref={chtMsgsRef}>
        {chtMsgs.map((chatMsg)=>
        {
          return(
          <ChatMessage 
            msg={chatMsg.msg}
            sender={chatMsg.sender} 
            key={chatMsg.id} 
          />);
        })
        }
      </div >
    );
}

export default ChatMsgCmpnt;