import "./friend.css"
import React,{useEffect, useState} from "react";

import Button from "react-bootstrap/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";


export default function Friend(props)
{

    const [currentUser,setUser]=useState(null)
    useEffect(()=>{
        async function firstTime(){
            
            const res=await axios.post("http://localhost:5000/othersDetails",{email:props.email});
           
           
            setUser(res.data);
        }

        firstTime();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const [type,setType]=useState(props.type)


    async function unfriend(email){

        try{
         await axios.post("http://localhost:5000/removefriend", {
           sender: props.user,
           receiver: email
        })
        

        try{
            await axios.post("http://localhost:5000/conversations/delete",{ sender: props.user,
        receiver: email})  
        
        }catch(err){
              alert("remove failed,Try again 1")
        }
        

       
          
        setType("users");
     }
  
      catch(error){
         alert("remove failed,Try again");
      }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////



    async function remove(email){

        try{
        const response = await axios.post("http://localhost:5000/deleterequest", {
           sender: props.user,
           receiver: email

         
        })
        
        console.log(response);
  
        
        setType("none");   
     }
  
      catch(error){
         alert("remove failed,Try again");
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
  
    async function accept(email){
  
        
     try{
     const response = await axios.post("http://localhost:5000/confirmrequest", {
        sender: props.user,
        receiver: email
     })

    

     if(response.status===200)
     {
        const response2=await axios.post("http://localhost:5000/conversations",{sender:props.user,receiver:email})
    console.log(response2);
     }
    

     
     

     setType("friends");

  }
  
   catch(error){
      alert("confirmation  failed,Try again");
   }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  async function addfriend(email)
  {
    try{
      const response = await axios.post("http://localhost:5000/sendrequest", {
         sender: props.user,
         receiver: email
      })

      console.log(response);
 
      setType("friendrequestsent");

   }
   
    catch(error){
       alert("confirmation  failed,Try again");
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  async function unsend(email)
  {
    try{
      const response = await axios.post("http://localhost:5000/deleterequest", {
         sender: email,
         receiver: props.user
      })
      console.log(response);
      setType("users");
   
   }
   
    catch(error){
       alert("confirmation  failed,Try again");
    }
  }

    if(type==="friends")
    {
        return(
            <div className="friend">
                <div className="friendContent">
                    <img className="friendimage" src={currentUser?.image} alt=""/>
                    <p className="friendName">{currentUser?.firstName}</p>

                    <div  className="icon">
                    <Button className="addFriendButton" variant="danger" onClick={()=>unfriend(props.email)}>
                     
                      Unfriend
                     </Button>
                   
                    </div>
                
                </div>
                </div>

                
            
        )
    }

    if(type==="users")
    {
        return(
            <div className="friend">
                <div className="friendContent">
                    <img className="friendimage" src={currentUser?.image} alt=""/>
                    <p className="friendName">{currentUser?.firstName}</p>
                    <div  className="icon">

                     <Button className="addFriendButton" variant="light" onClick={()=>addfriend(props.email)}>
                     <i className="fas fa-user-plus iiclass"></i>
                      Add friend
                     </Button>
                     </div>

                </div>
    
               
            </div>
        )
    }

    if(type==="friendrequestsent")
    {
        return(
            <div className="friend">
                <div className="friendContent">
                    <img className="friendimage" src={currentUser?.image} alt=""/>
                    <p className="friendName">{currentUser?.firstName}</p>
                    <div  className="icon">

                <Button className="addFriendButton" variant="light" onClick={()=>unsend(props.email)}>
                <i className="fas fa-user-times iiclass"></i>
                Undo request
                </Button>
                </div>
                </div>
    
                
    
            </div>
        )
    }


    if(type==="friendrequestreceived")
    {
        return(
            <div className="friend">
                <div className="friendContent">
                    <img className="friendimage" src={currentUser?.image} alt=""/>
                    <p className="friendName">{currentUser?.firstName}</p>
                    <div  className="icon">

                <Button className="addFriendButton" variant="primary" onClick={() => {accept(props.email)}}>
                <i className="fas fa-user-check iiiclass"></i>
                Confirm
                </Button>

                <DeleteIcon  onClick={()=>remove(props.email)} style={{marginLeft:"1.25vh",fontSize:"3vh"}}/>
                </div>
                </div>
    
                
    
            </div>
        )
    }

    if(type==="none")
    {
        return(
            <div></div>
        )
    }

    
}




