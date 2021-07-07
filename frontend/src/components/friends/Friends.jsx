

import "./friends.css";
import Navbar from "../../components/navbar/Navbar.jsx";
import SearchIcon from '@material-ui/icons/Search';

import Friend from "../../components/friend/Friend.jsx";
import React,{useState,useEffect}  from "react";
import Zero from "./zero.jsx";
import axios from "axios";

import Nav from 'react-bootstrap/Nav'


export default function Friends(props){

    const [Friends,setfriends]=useState([]);
    // let fMap = new Map();
    // let friendsMap = new Map();
   
    // const arr=[];

 
    // function logMapElements(value, key, map){

    //     arr.push({
    //         email:key,
    //         type:value.type,
    //         firstName:value.firstName
    //     });
    
    //     console.log(`m[${key}]=${value.firstName}`)
    //  }

     
    useEffect(()=>{

        async function firstTime(){

       try{
           
       
        
        const currentUser =  await axios.post("http://localhost:5000/getprofile", {
     
            email: props.email_id,  
        })
        
        const friends = currentUser.data.friends;
    
        setfriends(friends);

    }

      catch(err){
         console.log("err = ", err.message);
      } 
       
     
    } firstTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    return(
        <>
        <Navbar
           email={props.email_id}
           firstName={props.firstName}
           attemptLogout={props.attemptLogout}
        />

        

        <div className="friends">
            <div className="left"></div>
            <div className="middle">
            <h2 className="allUsersHeading">Friends</h2>
                <div className="friendswrapper">
                    <div className="top">
                       
                        <div className="friendsSearchbar">
                        <SearchIcon className="allUsersSearchIcon"/>
                        
                            <input type="text" className="friendsInputclass" placeholder="Search"></input>
                        </div>

                        <div className="redirect">

                        
                        <Nav.Link href="/homepage/notifications" className="navlink">Friend requests</Nav.Link>
                        <Nav.Link href="/homepage/search" className="navlink">Find Friends</Nav.Link>

                        </div>
                    </div>

                    <hr className="searchHr"></hr>

                    {(Friends.length===0)?<Zero/>:(
                        <div className="bottom">

                 {Friends.map((e,i) =>{
                    return (<Friend type="friends" key={i} user={props.email_id} email={e}  />);
                  })
                 }
                    </div>

                    )}

                    
                </div>
            </div>
            <div className="right"></div>
        </div>
        </>
    )
   
}