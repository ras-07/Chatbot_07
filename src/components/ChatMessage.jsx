import { useState,useEffect } from "react";
import RobotProfile from "../assets/robot.png"
import UserProfile from  "../assets/user.png"

function ChatMessage(props){
        const {msg,sender}=props;
          return(
          <div className={
            sender=== "user" ? 
            'msg_user'
            : 'msg_bot'
          }>
            
            {sender === "bot" && (
              
                <img src={RobotProfile} 
                className="chat_msg_profile"/>
            )}
            <p>{msg}</p>
              
            {sender === "user" && (
               <img src={UserProfile}
               className="chat_msg_profile"
               />
               
            )}         
          </div>
        );
      }

export default ChatMessage;
