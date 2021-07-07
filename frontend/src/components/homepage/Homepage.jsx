import React from "react";
import "./homepage.css";
import Navbar from "../../components/navbar/Navbar.jsx";
import SideBar from "../../components/sidebar/Sidebar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import RightBar from "../../components/rightbar/Rightbar.jsx";


export default function Homepage(props){
    return(
        <>
        <Navbar
          email={props.email_id}
         
          attemptLogout={props.attemptLogout}
        />
       <div className="homeContainer">
        <SideBar/>
        <Feed email={props.email_id}/>
        <RightBar/>
       </div>
        </>
    )
}