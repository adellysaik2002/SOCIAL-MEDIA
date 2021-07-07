import React,{useState} from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Success from "./success.jsx";
import Error from "./errornotification.js";
import "./entry.css";



function SignUp(props) {

  const[ifirstname,setFirstName]=useState("");
  const[ilastname,setlastName]=useState("");
  const[iemail,setEmail]=useState("");
  const[ipassword,setPassword]=useState("");
  const[showSuccess,setSuccess]=useState(false);
  const [error_messages_arr, set_error_messages_arr] = useState([]);



  const doSomething= async(event)=>
  {
    event.preventDefault();
    let tmp_error_arr = [];
    const newUser={
      firstName:ifirstname,
      lastName: ilastname,
      email:iemail,
      password:ipassword
    }
    console.log(newUser);
    try{
      

      const response =await axios.post("http://localhost:5000/users",newUser);
      console.log("Axios response is",response);
      setSuccess(true);

    } catch (error) {
      
      console.log("Error obj is ", error);
      if (error.response) {
        
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

    }

    set_error_messages_arr(tmp_error_arr);
  //When the error occurs we add a descriptive error message to the errorMessage state. At the same time we start a timer, that will set the errorMessage state to null after five seconds.
  setTimeout(() => {
    set_error_messages_arr([])
  }, 5000);
  }

  
   
  //   .then(response=>{
  //     console.log("succesfully registered")
  //     
  // });
    
  


  
  return(

    showSuccess?<Success name={ifirstname} change={props.change}/>:
    
    
    <div className="container1">
    <h1 className="heading">     Sign Up   </h1>

    <Form onSubmit={doSomething}>

    <Form.Group className="formSize" controlId="formBasicfirstName"  >
      <Form.Label><h5 className="subHeading">First Name</h5></Form.Label>
      <Form.Control className="formSize"type="text" placeholder="First Name" value={ifirstname} onChange={(event)=>{setFirstName(event.target.value)}}/>

    </Form.Group>

    <Form.Group className="formSize" controlId="formBasiclastName" >
      <Form.Label><h5 className="subHeading">Last Name</h5></Form.Label>
      <Form.Control className="formSize" type="text" placeholder="Last Name" value={ilastname}  onChange={(event)=>{setlastName(event.target.value)}}/>

    </Form.Group>


      <Form.Group className="formSize" controlId="formBasicEmail"  >
        <Form.Label><h5 className="subHeading">Email address</h5></Form.Label>
        <Form.Control className="formSize" type="email" placeholder="Enter email" value={iemail} onChange={(event)=>{setEmail(event.target.value)}} />

      </Form.Group>


      <Form.Group className="formSize" controlId="formBasicPassword" >
        <Form.Label><h5 className="subHeading">Password</h5></Form.Label>
        <Form.Control className="formSize" type="password" placeholder="Password" value={ipassword} onChange={(event)=>{setPassword(event.target.value)}} />
      </Form.Group>

      {error_messages_arr.map((e,i) => (<Error key={i} message={e} />))}

      <Button style={{fontSize:"3vh"}} variant="primary" type="submit" block >
        Submit
      </Button>

      
      
    </Form>

    <div className="xy"> <span>already a member?</span>
    <Button className="entryButton"variant="link" style={{fontSize:"2.2vh"}} onClick={props.change} size="sm">Login</Button>
    </div>

    </div>
      
      

    

   
    


   );
}

export default SignUp;