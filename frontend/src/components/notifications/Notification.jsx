

import "./notification.css";
import Navbar from "../../components/navbar/Navbar.jsx";

import Friend from "../../components/friend/Friend.jsx";
import React,{useState,useEffect}  from "react";
import Zero from "./zero.jsx";
import axios from "axios";


export default function Notifications(props)
{


    const [requests,setrequests]=useState([]);
    // let UsersMap = new Map();
    // let requestsMap = new Map();
   
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
           
     
        
        const res =  await axios.post("http://localhost:5000/getprofile", {
     
            email: props.email_id,  
        })
        
       

      
    
        const requestsReceived = res.data.requestsReceived;
        
        
       
        
        
        
        setrequests(requestsReceived);

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
            <h2 className="allUsersHeading">Notifications</h2>
                <div className="friendswrapper">
                     <div className="top">

                    {requests.length<=9? <h4 style={{fontSize:"3vh"}}>Friend Requests  ({requests?.length})</h4> : <h4>Friend Requests  (9+)</h4>   }
                       
                      
                        
                    </div> 

                    {(requests.length===0)?<Zero/>:(
                        <div className="bottom">

                   {requests.map((e,i) =>{
                    return (<Friend type="friendrequestreceived" key={i} user={props.email_id} email={e}  />);
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