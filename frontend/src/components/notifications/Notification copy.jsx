

import "./notification.css";
import Navbar from "../../components/navbar/Navbar.jsx";
import SearchIcon from '@material-ui/icons/Search';
import Button from "react-bootstrap/Button";
import Friend from "../../components/friend/Friend.jsx";
import React,{useState,useEffect}  from "react";
import Zero from "./zero.jsx";


export default function Notifications()
{


    const k=0;
    


    return(
        <>
        <Navbar/>

        

        <div className="friends">
            <div className="left"></div>
            <div className="middle">
            <h2>Notifications</h2>
                <div className="friendswrapper">
                     <div className="top">
                       
                      <h4>Friend Requests  (9+)</h4>  
                        
                    </div> 

                    {(k===0)?<Zero/>:(
                        <div className="bottom">

                    <Friend type="friendrequestreceived"/>
                    <Friend type="friendrequestreceived"/>
                     <Friend type="friendrequestreceived"/>
                    <Friend type="friendrequestreceived"/>
                    <Friend type="friendrequestreceived"/>
                    <Friend type="friendrequestreceived"/>
                    <Friend type="friends"/>
                    <Friend type="empty"/>
                    
                    

                    


                    </div>

                    )}

                    
                </div>
            </div>
            <div className="right"></div>
        </div>
        </>
    )
   
}