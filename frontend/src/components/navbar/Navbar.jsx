import React from "react";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';
import "./navbar.css";
import Col from 'react-bootstrap/Col';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import PeopleIcon from '@material-ui/icons/People';
import {useState,useEffect} from "react";
import axios from "axios";

// style={{backgroundColor: "#20232a"}}

 function NavBar(props){


  const [User,setUser]=useState(null)
  useEffect(()=>{
      async function firstTime(){
          
          const res=await axios.post("http://localhost:5000/othersDetails",{email:props.email});
         
         
          setUser(res.data);
      }

      firstTime();
       // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
    return(

        <Navbar className="navbar" expand="lg" bg="dark"  variant="dark" >


        
     <Col>
     <Navbar.Brand className="navbarBrand" href="/homepage">
      SocialiZe
    </Navbar.Brand>
     </Col>
    

    
    <Navbar.Toggle aria-controls="basic-navbar-nav" />

    <Navbar.Collapse id="basic-navbar-nav">

    <Col >
    <Nav  className="mr-auto">
        
        <Nav.Link href="/homepage/search">
        <div className="icons">
          <SearchIcon style={{fontSize:"3.125vh",marginRight:"3px"}}/>
          Search
        </div>
        </Nav.Link>
        <Nav.Link href="/homepage/friends">
        <div className="icons">
          <PeopleIcon style={{fontSize:"3.125vh",marginRight:"3px"}}/>
          Friends
          </div>
        </Nav.Link>
        <Nav.Link href="/homepage/notifications">
          <div className="icons">
           <NotificationsIcon style={{fontSize:"3vh",marginRight:"3px"}}/>
           Notifications
         </div>
        </Nav.Link>
        
        <Nav.Link href="/homepage/messenger">
          <div className="icons">
           <ChatIcon style={{fontSize:"3vh",marginRight:"3px"}}/>
            Chats
          </div>
         </Nav.Link>
        
      </Nav>
    </Col>
     

      
      <Nav>
      <Navbar.Brand>
      
      <div className="dropdown">
      <img className="navbarImage" src={User?.image} alt=""></img>
       {User?.firstName}
      <div className="dropdown-content">
      <a href="/homepage/editprofile">Edit Profile</a>
    <button  onClick={props.attemptLogout}>Logout</button>
    
  </div>
    </div>
   
    </Navbar.Brand>
       </Nav>
      
    </Navbar.Collapse>
  </Navbar>

    )

    


}

export default NavBar;




    