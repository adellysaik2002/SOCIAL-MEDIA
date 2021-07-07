import React,{useState} from "react";
import Signup from "./signup.jsx";
import Login from "./login.jsx";
import "./entry.css";



function Landing(props){
    const[ismember,setMember]=useState(false);

    function changeState()
    {
         setMember(!ismember);
    }
    return (
      <div className="Entry">
  
      {ismember?<Signup change={changeState}/>:<Login is_logged_in={props.is_logged_in} change={changeState} attemptLogin={props.attemptLogin}/>}
       </div>
  
    );
}

export default Landing;