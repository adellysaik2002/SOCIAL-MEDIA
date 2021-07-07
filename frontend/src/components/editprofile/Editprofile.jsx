import React,{useState,useEffect} from "react";
import Form from "react-bootstrap/Form";

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from "../../components/navbar/Navbar.jsx";
import axios from "axios";

import Error from "./errornotification.js";
import "./editprofile.css";
import EditIcon from '@material-ui/icons/Edit';

import CancelIcon from '@material-ui/icons/Cancel';





export default function EditProfile(props)
{
  const [error_messages_arr, set_error_messages_arr] = useState([]);

  const[firstName,setFirstName]=useState("");
  const[lastName,setlastName]=useState("");
  const[password,setPassword]=useState("");
  const [bio,setBio]=useState("");
  const[file,setFile]=useState(null);
  const[image,setImage]=useState("")

          
 useEffect(()=>{
   async function firstTime(){
  const response= await axios.post("http://localhost:5000/getprofile", {
   
      email: props.email_id
    
  });
  console.log("Inside useEffect of update profile",response.data);
   setFirstName(response.data.firstName);
   setlastName(response.data.lastName);
   setPassword(response.data.password);
   setBio(response.data.bio);
   setImage(response.data.image);
   

 } 
 firstTime();
 // eslint-disable-next-line react-hooks/exhaustive-deps
},[]);

 const handleSubmit=async (event)=>{
  event.preventDefault();
  let tmp_error_arr = [];
  
  let form ={
    email: props.email_id,
    firstName: firstName,
    lastName: lastName,
    password: password,
    bio:bio,
    image:image
  }
  if(file)
  {
    const data=new FormData();
    const fileName=file.name;
    data.append("file",file);
    
    data.append("name",fileName);
    try{
       const Img= await axios.post("http://localhost:5000/file/upload",data);
       form.image=Img.data;
      
      
       
    }catch(err){
        console.log(err);
    }
  }


   try{


    const newDetails= await axios.post("http://localhost:5000/editprofile",form);
    console.log("details updated:",newDetails);
    alert("successfully updated");
    window.location.reload();

   }catch (error) {
    //   //https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
    console.log("Error obj is ", error);
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log("In catch block");
      if (error.response.data) {
        console.log(error.response.data.errors);
        error.response.data.errors.map((e) => {
          tmp_error_arr.push(e.msg);
          console.log("debug e is ", e);
          return e;
        });
      }
      else {
        tmp_error_arr.push("THERE SEEMS TO BE A NETWORK ERROR");
        console.log("There seems to have been a network error");
      }
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log(" request was made but no response was received");

      tmp_error_arr.push(error.message);

      console.log("2 error->", error.message);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log('e Error is ', error.message);
    }
    set_error_messages_arr(tmp_error_arr);
    setTimeout(() => {
      set_error_messages_arr([])
    }, 5000);

  }
 }



  
  const helper=async (e)=>{
   
    setFile(e.target.files[0]);
    console.log("Hii")
   
    
  }



    

    return(
        <div>
          <Navbar
              email={props.email_id}
              firstName={props.firstName}
              attemptLogout={props.attemptLogout}
          />

          <div className="edit">

         <div className="leftBox"></div>
         <div className="wrapper">
         <h2 className="editprofileHeading">Edit Profile </h2>
         <div className="editprofileform">

         <Form  onSubmit={handleSubmit} >
         <Form.Group className="centering" as={Row} controlId="formPlaintextimage">
    <Form.Label column sm="2">
     <h6 className="editProfilesubHeading"> Profile Picture</h6>
    </Form.Label>
    <Col sm="10" className="profilepic">
      <img className="editImage" src={image} style={{display:file?"none":""}} alt=""/>
      {
                file&&(
                    <div className="selectedImageContainer">
                        <img className="selectedImg" src={URL.createObjectURL(file)} alt=""/>
                        <CancelIcon className="selectedCancelImg" onClick={()=>setFile(null)}/>
                    </div>
                )
            }
      
      <label htmlFor="Image" className="editOption">
        <EditIcon style={{ fontSize:"5vh",color:"#91bff9"}}/>
        <input style={{display:"none"}}type="file" id="Image" accept=".png,.jpeg,.jpg" onChange={(e)=>helper(e)}/>
        {/* <span className="editText">Edit</span> */}
        </label>
      
    </Col>
  </Form.Group>

         <Form.Group className="centering" as={Row} controlId="formPlaintextEmail">
    <Form.Label column sm="2">
     <h6 className="editProfilesubHeading"> Email</h6>
    </Form.Label>
    <Col sm="10">
      <Form.Control plaintext readOnly defaultValue={props.email_id} className="defaultchange"/>
    </Col>
  </Form.Group>

  <Form.Group className="centering"as={Row} controlId="formPlaintextName1">
    <Form.Label  column sm="2">
     <h6 className="editProfilesubHeading"> First Name</h6>
    </Form.Label>
    <Col sm="10">
      <Form.Control type="text" name="firstName" value={firstName} onChange={(event)=>{setFirstName(event.target.value)}}  placeholder="FirstName" className="defaultchange"/>
    </Col>
  </Form.Group>

  <Form.Group className="centering" as={Row} controlId="formPlaintextName2">
    <Form.Label  column sm="2">
     <h6 className="editProfilesubHeading">Last Name</h6>
    </Form.Label>
    <Col sm="10">
      <Form.Control type="text" name="lastName" value={lastName} onChange={(event)=>{setlastName(event.target.value)}}placeholder="LastName" className="defaultchange" />
    </Col>
  </Form.Group>

  <Form.Group className="centering" as={Row}  controlId="formPlaintextPassword">
    <Form.Label  column sm="2">
      <h6 className="editProfilesubHeading">Password</h6>
    </Form.Label>
    <Col sm="10">
      <Form.Control type="text" name="password" value={password} onChange={(event)=>{setPassword(event.target.value)}} placeholder="Password" className="defaultchange" />
    </Col>
  </Form.Group>

  <Form.Group className="centering" as={Row} controlId="exampleForm.ControlTextarea1">
    <Form.Label  column sm="2"><h6 className="editProfilesubHeading">Add Bio</h6></Form.Label>
    <Col sm="10">
    <Form.Control as="textarea" className="bioText" rows={3}  value={bio} onChange={(event)=>{setBio(event.target.value)}} placeholder="write something about yourself....." />
    </Col>
    
  </Form.Group>


  {error_messages_arr.map((e,i) => (<Error key={i} message={e} />))}
  
  <div style={{width:"100%",display:"flex"}}>
  <button className="editProfileButton" type="submit">
  
    Update Profile
  
  </button>
  </div>
</Form>
</div>


 </div> 

<div className="rightBox"></div>
        </div>
        </div>
        

    )
}

