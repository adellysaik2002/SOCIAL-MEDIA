import React,{useState,useEffect} from "react";
import Messenger from "./messenger/Messenger.jsx";
import Landing from "./entrypoint/landing.jsx";
import EditProfile from "./editprofile/Editprofile.jsx";
import Friends from "./friends/Friends.jsx";
import Search from "./search/search.jsx";
import Notifications from "./notifications/Notification.jsx";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Homepage from "./homepage/Homepage.jsx";





export default function App ()
{

  const [login_details, set_login_details] = useState({
    is_logged_in: false,
    user_email_id: null,
    firstName:null
    
  });

  const attemptLogin = (user_obj) => {
     
    window.localStorage.setItem(
    'cached_data', JSON.stringify(user_obj)
  );

  
  set_login_details({
    is_logged_in: true,
    user_email_id: user_obj.email,
    firstName:user_obj.firstName
    
  });
}


const logout = () => {
  console.log("logging out");
  //ensuring that token gets destroyed
  if (localStorage && localStorage.cached_data) {
    localStorage.removeItem("cached_data");
  }

  
  set_login_details({
    is_logged_in: false,
    user_type: null,
    token: null
  });
  return <Redirect to="/" />
}


useEffect(() => {
  console.log("in FIRST AFFECT of app.js");
  first_attempt();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

const first_attempt = () => {
  console.log("first attempt function called");


  const loggedUserJSON = window.localStorage.getItem('cached_data');
  console.log("OBJ extracted from key 'cached-data' of local storage is ", loggedUserJSON, "\n-------\n");


  if (loggedUserJSON && (login_details.is_logged_in === false)) {
    console.log("DEBUG: Found cached data pre-saved and hence, taking advantage");
    const user_suspected = JSON.parse(loggedUserJSON);
    attemptLogin(user_suspected);
  }
}

first_attempt();



  return(
    <div>

    <Router>
    

    <Switch>

    
      <Route exact path="/homepage">
        {login_details.is_logged_in ? <Homepage email_id={login_details.user_email_id} firstName={login_details.firstName}  attemptLogout={logout} /> : <Redirect to= "/"/>}
      </Route>

      <Route exact path="/homepage/editprofile">
      {login_details.is_logged_in ? <EditProfile email_id={login_details.user_email_id} firstName={login_details.firstName} attemptLogout={logout} /> : <Redirect to= "/"/>}
        
      </Route>

      <Route exact path="/homepage/friends">
      {login_details.is_logged_in ? <Friends email_id={login_details.user_email_id} firstName={login_details.firstName} attemptLogout={logout} /> : <Redirect to= "/"/>}
      </Route>
 
      <Route exact path="/" render={()=><Landing is_logged_in={login_details.is_logged_in } firstName={login_details.firstName}  attemptLogin={attemptLogin}/>} />


      <Route exact path="/homepage/notifications">
      {login_details.is_logged_in ? <Notifications email_id={login_details.user_email_id}  firstName={login_details.firstName} attemptLogout={logout} /> : <Redirect to= "/"/>}
      </Route>

      <Route exact path="/homepage/search">
      {login_details.is_logged_in ? <Search email_id={login_details.user_email_id}  firstName={login_details.firstName} attemptLogout={logout} /> : <Redirect to= "/"/>}
      </Route>

      <Route exact path="/homepage/messenger">
      {login_details.is_logged_in ? <Messenger email_id={login_details.user_email_id} firstName={login_details.firstName}
       attemptLogout={logout} /> : <Redirect to= "/"/>}
      </Route>


    
      
      
    </Switch>
    </Router>
  </div>
    
  );
 
}