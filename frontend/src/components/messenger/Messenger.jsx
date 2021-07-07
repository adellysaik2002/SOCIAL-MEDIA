

import React,{useRef} from "react";
import "./messenger.css";
import Navbar from "../../components/navbar/Navbar.jsx";
import Conversation from "../../components/conversation/conversation.jsx";
import Message from "../../components/message/message.jsx";
import SearchIcon from '@material-ui/icons/Search';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {io} from "socket.io-client";
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';




export default function Messenger(props){
   const [search,setsearch]=useState("");
   const [conversations, setconversations]=useState([]);
   const [currentChat, setcurrentChat] = useState(null);
   const [messages, setmessages]= useState([]);
   const [newMessage,setnewMessage]=useState("");
   const [friend, setfriend] =useState(null);
   const [arrivalMessage,setArrivalMessage]=useState(null);
   const [onlineUsers,setOnlineUsers]=useState(null);
   const [user,setUser]=useState(null);
   const [selected,setSelected]=useState(true);


   const mediaHandler=()=>{
     setSelected(!selected);
   }

   const closeIconHandler=()=>{
     setcurrentChat(null);
      mediaHandler();

   }
   
   const socket =useRef();

   const scrollRef=useRef();

   useEffect(()=>{
      socket.current=io("ws://localhost:8900");
      socket.current.on("getMessage",data=>{
             setArrivalMessage({
               sender:data.senderId,
               text:data.text,
               createdAt:Date.now()
             })
      })
   },[])

   useEffect(()=>{
     arrivalMessage&&currentChat?.members.includes(arrivalMessage.sender)&&setmessages(prev=>[...prev,arrivalMessage])
    
   },[arrivalMessage,currentChat])


  useEffect(()=>{
    socket.current.emit("addUser",props.email_id);
    console.log("adduser of socket called from front end",props.email_id);
    socket.current.on("getUsers",users=>{
      console.log("users from socket:",users);
      setOnlineUsers(users);
    })
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])





   const onClickDiv=(c,value)=>
   {
     
         setfriend(value);
         setcurrentChat(c);
         mediaHandler();
   }


   useEffect(() => {
       const firstFunction = async () => {
        
        try{
         const res = await axios.get("http://localhost:5000/conversations/" + props.email_id);
         const res2=await axios.post("http://localhost:5000/othersDetails",{email:props.email_id})
         console.log("coversations",res.data);
         setconversations(res.data);
         setUser(res2.data);
        }
         catch(err){
             console.log(err);
         }
       }

    firstFunction();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[]);

   useEffect(() => {
       const getMessages = async () => {
           try{
           const res = await axios.get("http://localhost:5000/messages/" + currentChat._id);
           setmessages(res.data);
           }
           catch(err){
             console.log(err);
           }
       }
       getMessages();
          // eslint-disable-next-line react-hooks/exhaustive-deps
   },[currentChat])

    async function  handleSubmit(e){
       e.preventDefault();

       const message = {
           cid: currentChat._id,
           sender: props.email_id,
           text: newMessage,
       }

       socket.current.emit("sendMessage",{
         senderId:props.email_id,
         receiverId:currentChat.members.find(member=>member!==props.email_id),
         text:newMessage
       })
       
       try{
            const res = await axios.post("http://localhost:5000/messages", message);
            setmessages([...messages,res.data])
            setnewMessage("");
       }
       catch(err){
           console.log(err);
       }

    }
          console.log("friend info inside messenger:",friend)


          
     useEffect(()=>{
      scrollRef.current?.scrollIntoView({behavior:"smooth"});
     },[messages])


   

  
    return( 
        <div>
        <Navbar
              email={props.email_id}
              firstName={props.firstName}
              attemptLogout={props.attemptLogout}
        />

        
        <div className="messenger">
            <div className={selected?"chatMenu":"another"}>
                <div className="chatMenuWrapper">
                    <div className="chatMenuTop">
                    <div className="messengersearchbar">
                <SearchIcon className="messengersearchicon"/>
                    <input placeholder="Search for friends" className="chatMenuInput" value={search} onChange={(e)=>setsearch(e.target.value)}/>
                    </div>
                    </div>
                    <div className="conversations">
                    {conversations.map((c,index) => (<Conversation  key={index} currentUser={props.email_id} conversation={c} onClickDiv={onClickDiv} search={search}/> ))}
                    </div>
                   
                    
                 </div>
            </div>
            <div className={selected?"chatBox":"another2"}>
                <div className="chatBoxWrapper">
                {currentChat ? <> 
                    <div className="chatBoxTopper">

                      <img className="chatImage" src={friend?.image} alt=""/>
                      <div className="status">
                     <span>{friend?.firstName}</span>
                     {onlineUsers?.find(x=>(x.userId===currentChat?.members.find(m=>m!==props.email_id)))?<p>online</p>:<p></p>}
                     
                     </div>

                     <CloseIcon style={{marginLeft:"auto",marginRight:"1.25vh",cursor:"pointer",fontSize:"4vh"}} onClick={closeIconHandler} />
                     
                     
                    
                     
                  </div>
                    
                    <div className="chatBoxTop">
                        {messages.map((message,index) =><div ref={scrollRef}> <Message  key={index} own={message.sender===props.email_id} message={message} ownerImage={user?.image} friendImage={friend?.image}/></div>)}
                       
                    </div>
                    <div className="chatBoxBottom">
                        <textarea placeholder="Type a message" className="chatMessageInput" value={newMessage} onChange={(e) => setnewMessage(e.target.value)}></textarea>
                        {/* <p><span class="textarea" role="textbox" contenteditable></span></p> */}
                        {/* <div class="grow-wrap">
                          <textarea name="text" id="text" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
                          </div>

                        // <button className="chatSubmitButton" onClick={handleSubmit}>Send</button> */}
                        {/* <button className="chatSubmitButton" onClick={handleSubmit}>Send</button> */}

                        <div className="sendicon" onClick={handleSubmit}>
                        <SendIcon className="sendUiIcon"/>
                        </div>
                        

                        
                    </div>

                </> : <span className="notSelected">Open a conversation to start a chat.</span>}
                
                </div>
            </div>
          <div className="online">
            
          </div>

        </div>
        </div>
    )
}