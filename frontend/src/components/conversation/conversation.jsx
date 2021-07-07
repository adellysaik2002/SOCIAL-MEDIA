import axios from "axios";
import React, {useState, useEffect } from "react";
import "./conversation.css";



export default function Conversation(props) {

     const [user, setuser] =useState(null);

     useEffect(() => {
         const friendId = props.conversation.members.find((m) => m!==props.currentUser);
         console.log("freindID", friendId)
         const getUser = async() => {

            try{
             const res = await axios.post("http://localhost:5000/othersDetails", {email: friendId});
             console.log("friendData",res.data);
             setuser(res.data);
            }
            catch(err){
                console.log(err);
            }
         }

         getUser();
         // eslint-disable-next-line react-hooks/exhaustive-deps
     },[])

    if (user?.firstName.toLowerCase().includes(props.search.toLowerCase()))
    {
        return(

        
        
            <div className="conversation" onClick={()=>props.onClickDiv(props.conversation,user)}>
                <img className="conversationImg" src={user?.image} alt="hi" />
                 <span className ="conversationName" > {user?.firstName} </span>
            </div>
        )
    }

    else{
        return null;
    }

   
    
} 