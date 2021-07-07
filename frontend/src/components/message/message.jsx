import React from "react";
import "./message.css";
import {format} from "timeago.js";


export default function  Message({own,message,ownerImage,friendImage}) {

    
    return(
        <div className={own? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src={own?ownerImage:friendImage} alt=""/>
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
    
}