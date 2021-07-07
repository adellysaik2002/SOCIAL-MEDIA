import React,{useState} from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { Redirect } from 'react-router-dom';
import Error from "./errornotification.js";
import "./entry.css";







function Login(props_sent) {


  const[iemail, setEmail]=useState("");
  const[ipassword, setPassword]=useState("");
  const [error_messages_arr, set_error_messages_arr] = useState([]);
  // const [isChecked, setisChecked]=("false");

  let allow_further = true;
  if (!props_sent.is_logged_in) {
    //aready logged in
    allow_further = false;
  }
  if (allow_further) {
    return <Redirect to="/homepage" />;
  }



  const login_attempt = async credentials => {
    const baseUrl = 'http://localhost:5000/login';
    console.log("Client trying to login with input as follows: ", credentials);
    const response = await axios.post(baseUrl, credentials);
    console.log("Response to login attempt ", response);
    return response.data;
  }

  
  const handleLogin = async (event) => {
    event.preventDefault();
    let tmp_error_arr = [];
    // let tmp_suc_arr = [];

    try {

      const user = await login_attempt({
        email:iemail,password: ipassword,
      });
      console.log("User is ", user);
      
      props_sent.attemptLogin(user);
    }
    catch (error) {
      
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
      set_error_messages_arr(tmp_error_arr);
      setTimeout(() => {
        set_error_messages_arr([])
      }, 5000);

    }

  }



  
  
  
  return(
    
    
    <div className="container2">
    <h1 className="heading">     Login   </h1>

    <Form onSubmit={handleLogin} >

    

      <Form.Group className="formSize" controlId="formBasicEmail2" >
        <Form.Label><h5 className="subHeading">Email address</h5></Form.Label>
        <Form.Control  className="formSize" type="email" placeholder="Enter email"  value= {iemail} onChange={(event) => {setEmail(event.target.value)}} />

      </Form.Group>


      <Form.Group className="formSize" controlId="formBasicPassword2">
        <Form.Label><h5 className="subHeading">Password</h5></Form.Label>
        <Form.Control  className="formSize" type="password" placeholder="Password"  value={ipassword} onChange={(event) => {setPassword(event.target.value)}}/>
      </Form.Group>
      {error_messages_arr.map((e,i) => (<Error key={i} message={e} />))}

      
      <Button style={{fontSize:"3vh"}} variant="primary" type="submit" block >
        Submit
      </Button>

      
      
    </Form>

    <div className="xy"> <span>Do not have an account?</span>
    <Button variant="link" className="entryButton" style={{fontSize:"2.2vh"}} onClick={props_sent.change} size="sm">Sign up</Button>
    </div>
    


    </div>
  
   
    


);
}

export default Login;