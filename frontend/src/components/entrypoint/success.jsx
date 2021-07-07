import React from "react";
import Button from 'react-bootstrap/Button';


function Success(props){
    return(
        
        
        <div className="container3">
            <h1 className="heading">Hello</h1>
            <div className="xy">
                U have succesfully created your account.
                
            </div>
            <div className="xy">
            Click here to login. 
            </div>

            <div className="xy">
            <Button variant="link" onClick={props.change} size="md">Login</Button>
            </div>
            
        </div>
        

        
        
          

    )

}

export default Success;