
import React,{useState,useEffect}  from "react";
import "./search.css";
import Navbar from "../navbar/Navbar.jsx";
import SearchIcon from '@material-ui/icons/Search';

import Friend from "../friend/Friend.jsx"
import axios from "axios";


export default function Search(props)
{

    
    const [search,setsearch]=useState("");
    const [Users,setUsers]=useState([]);
    let userMap = new Map();
    
   
    const arr=[];

    
    console.log("initial users=",Users);

 
    function logMapElements(value, key, map){

        arr.push({
            email:key,
            type:value.type,
            firstName:value.firstName
        });
        console.log("logging map", arr);
        console.log(`m[${key}]=${value.firstName}`)
     }

     
    useEffect(()=>{

        async function firstTime(){

       try{
           
       const response= await axios.get("http://localhost:5000/getallusers");
        
        const currentUser =  await axios.post("http://localhost:5000/getprofile", {
     
            email: props.email_id,  
        })
        
       let users = response.data;
       users = users.filter((x) => x.email!==props.email_id);
       console.log("Inside useEffect of search",users);


        users.map((x) => {
            
             userMap.set(x.email, {type:"users",firstName:x.firstName});
             return 0;
        })
        
        

        const requestsReceived = currentUser.data.requestsReceived;
        const friends = currentUser.data.friends;
        const requestsSent = currentUser.data.requestsSent;

        requestsReceived.map((x) => {
            userMap.set(x, {type:"friendrequestreceived",firstName:userMap.get(x).firstName})
            return 0;
        })
        


        requestsSent.map((x) => {
            userMap.set(x, {type: "friendrequestsent",firstName:userMap.get(x).firstName})
            return 0;
        })
        

        friends.map((x) => {
            userMap.set(x, {type: "friends",firstName:userMap.get(x).firstName})
            return 0;
        })
        
        
        userMap.forEach(logMapElements);
        setUsers(arr);

    }

      catch(err){
         console.log("err = ", err.message);
      } 
       
     
    } firstTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    
    console.log("setusers array",Users);

    return(
        <>
        <Navbar
              email={props.email_id}
            //   firstName={props.firstName}
              attemptLogout={props.attemptLogout}
        />


        <div className="allUsers">
            <div className="allUsersLeft"></div>
            <div className="allUsersMiddle">
            <h2 className="allUsersHeading">All Users</h2>
                <div className="allUsersWrapper">
                    <div className="allUsersTop">
                       
                        <div className="allUsersSearchbar">
                        <SearchIcon className="allUsersSearchIcon"/>
                        
                            <input type="text" className="allUsersInputclass" value={search} onChange={(e)=>setsearch(e.target.value)}  placeholder="Search"></input>
                        </div>

                        
                    </div>
                    <hr className="searchHr"></hr>
                    <div className="bottom">

                    
                   {Users.map((e,i) =>{
                   if(e.firstName.toLowerCase().includes(search.toLowerCase()))
                   {
                    return (<Friend type={e.type} key={i} user={props.email_id} email={e.email} firstName={e.firstName}  />);
                   }

                   else
                   {
                       return <div></div>;
                   }
              
                  })
                 }
                    </div>
                </div>
            </div>
            <div className="allUsersRight"></div>
        </div>
        </>
    )
   
}