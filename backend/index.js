const express =require("express");
const User=require("./models/user.js");
const cors = require('cors');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const { findOne, updateOne } = require("./models/user.js");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const uploadRoute=require("./routes/uploadImage");
const postRoute=require("./routes/posts");




const app= express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static('build'));
app.use(express.static(__dirname));


app.get("/",(req,res)=>{
    res.send("Hello World");
})


app.get("/users",(request,response)=>{
    User.find({}).then(users => {
        response.json(users)
      })
});

app.get("/getallusers",(request,response)=>{
  User.find({},{email:1,firstName:1}).then(users=>{
      response.json(users)
  })
});


app.post("/users",
  [
    check('firstName', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be more than 4 characters').isLength({ min: 5})
],

async (request,response)=>{
  const Errors = validationResult(request);
        if (!Errors.isEmpty()) {
            console.log("errors found are ", Errors);
            return response.status(400).json({ errors: Errors.array() });
        }
    const body = request.body;


   console.log(body);

   try{
    let already_user;
    /////////////////////////////////////////////////////////////////
    already_user = await User.findOne({ email: body.email });

    if (already_user) {
        console.log('Someone with same email-id already registered');

        return response
            .status(400)
            .json({ errors: [{ msg: 'Someone with same email-id already registered' }] });
    }

    const user = new User({
      firstName:body.firstName,
      lastName:body.lastName,
      email:body.email,
      password:body.password,
      requestsSent:[],
      requestsReceived:[],
      friends:[],
      image:"http://localhost:5000/file/1624857117814-any-name-default.jpg",
      bio:""
    })

    const user_saved =await user.save();
    console.log("applicant_model registration seems to be successful");
    console.log("Saved user is ",user_saved);
    response
    .status(200)
    .send({ email: user_saved.email, firstName: user_saved.firstName })
  


   }
   catch (err) {
    console.error(err.message);
    return response
        .status(500)
        .json({ errors: [{ msg: 'Server error due to : ' + err.message }] });
    
}
  
  
})



app.post("/login",
[
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Non empty Password is needed to login').notEmpty()
],
async (request, response) => {

  console.log("Inside login.js of backend");

  //Making sure all inputs are valid
  const errors_gen = validationResult(request);
  if (!errors_gen.isEmpty()) {
      console.log("Kenya Errors caught in express-validator");
      //The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.
      return response.status(400).json({ errors: errors_gen.array() });
  }


  const body = request.body;
  console.log("Attempt to login by cient-side");
  //check whether username is valid or not
  try {
      
      user = await User.findOne({ email: body.email});
     
      
      if (user===null) {
          console.log("Login credentials are invalid");

          return response
              .status(400)
              .json({ errors: [{ msg: 'Email id not found in database' }] });
      }

     
      const passwordCorrect = (user === null) ? false : (body.password===user.password);
      console.log( "password correct status is ", passwordCorrect);

      //if username does not exist or passowrd is incorrect
      if (!(user && passwordCorrect)) {
          console.log("RedFlag: Password is incorrect");
          return response
              .status(400)
              .json({ errors: [{ msg: 'Incorrect password' }] });
      }
      
      
      let obj_to_send={ email: user.email, firstName: user.firstName }
      
      response
          .status(200)
          .send(obj_to_send)
  }
  catch (err) {
      //might be due to jwt.sign or the other await's in try block
      console.error(err.message);
      return response
          .status(500)
          .json({ errors: [{ msg: 'Server error' }] });
  }
}
)


app.post("/getprofile", async (request,response)=>{



const body= request.body;




try{

    let currentUser= await User.findOne({email:body.email});

    if(!currentUser)
    {
        console.log("Email is not there in database");
        return(
            response.status(400).json({errors:[{msg:"email is not found in database"}]})
        )
    }

    response.status(200).json(currentUser);



}  catch (err) {
    //might be due to jwt.sign or the other await's in try block
    console.log( err.message);
    return response
        .status(500)
        .json({ errors: [{ msg: 'internal server errors' }] });
}






})

app.post("/editprofile",
[
    check('email','Invalid email').isEmail(),
    check('firstName', 'Name cannot be empty').notEmpty(),
    check('password', 'Password must be more than 4 characters').isLength({ min: 5})
  ],

  async (request, response) => {
   
    
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log(errors)
        
        return response.status(400).json({ errors: errors.array() });
    }
   

    const body = request.body;
    



    try {
        let already_user;

        
        let update = { firstName:body.firstName,password:body.password,lastName:body.lastName,bio:body.bio,image:body.image};
        
        mod_user = await User.findOneAndUpdate({ email: request.body.email}, update,
            { new: true });

        if (!mod_user) {
            console.log( 'UPDATE SEEMS TO HAVE FAILED, NULLABLE result');

            return response
                .status(400)
                .json({ errors: [{ msg: 'UPDATE SEEMS TO HAVE FAILED' }] });
        }
        ///////////////////////////////////////////////col.R///////////////////////////
        console.log("MODIFIED USER IS ", mod_user);
        response
            .status(200)
            .json(mod_user);
    }
    catch (err) {
        console.log(err.message);
        return response
            .status(500)
            .json({ errors: [{ msg: 'Server error due to : ' + err.message }] });
        
    }
}
)


app.post("/sendrequest", async(request, response) => {

     const body = request.body;
     

     const user1= body.sender;
     const user2=body.receiver;

     try{
         
         const foundUser2 = await User.findOneAndUpdate({email: user2}, { $addToSet: { requestsReceived: user1} });
         const foundUser1 = await User.findOneAndUpdate({email: user1}, { $addToSet: { requestsSent: user2 } }); 
          

         if(!foundUser1){
             return response.status(400).json({ errors: [{msg: "Invalid Username1"}]})
         }

         if(!foundUser2){
             return response.status(400).json({ errors: [{msg: "Invalid Username2"}]})
        }
         

          return  response.status(200).json({ msg: "request Sent " });
          
     }

     catch(error){
        console.log(error.msg)
        return response
        .status(500)
        .json({ errors: [{ msg: 'Server error due to : ' + error.message }] });
     }
})


app.post("/confirmrequest", async (request, response) => {

    const body = request.body;
    
    const user1= body.sender;
    const user2=body.receiver;

    try{
        const foundUser1 = await User.findOneAndUpdate({email: user1}, { $pull: { requestsReceived: user2 } }); 
        const foundUser12 = await User.findOneAndUpdate({email: user1}, { $addToSet: { friends: user2 } }); 
        const foundUser2 = await User.findOneAndUpdate({email: user2}, { $pull: { requestsSent: user1} });
        const foundUser22 = await User.findOneAndUpdate({email: user2}, { $addToSet: { friends: user1 } }); 

        if(!foundUser1 || !foundUser12 || !foundUser2 || !foundUser22){

           return response.status(400).json({ errors: [{msg: "Invalid Username(s)"}]});
        }

        return  response.status(200).json({ msg: "friend request accepted " });
    }
    catch(error){
            console.log(error.msg)
            return response
            .status(500)
            .json({ errors: [{ msg: 'Server error due to : ' + error.message }] });
    }
})


app.post("/removefriend", async(request, response) => {
     
    console.log("remove friend called");
    const body = request.body;
    
    const user1= body.sender;
    const user2=body.receiver;

    try{
        const foundUser1 = await User.findOneAndUpdate({email: user1}, { $pull: { friends: user2 } }); 
        const foundUser2 = await User.findOneAndUpdate({email: user2}, { $pull: { friends: user1 } });
        
        if(!foundUser1 ||  !foundUser2 ){

            return response.status(400).json({ errors: [{msg: "Invalid Username(s)"}]});
         }
 
         return  response.status(200).json({ msg: "friend removed " });
    }
    catch(error){
        console.log(error.msg)
        return response
        .status(500)
        .json({ errors: [{ msg: 'Server error due to : ' + error.message }] });
}


})

app.post("/deleterequest",async(request, response) => {

    const body = request.body;
    
    const user1= body.sender;
    const user2=body.receiver;

    try{
        const foundUser1 = await User.findOneAndUpdate({email: user1}, { $pull: { requestsReceived: user2 } }); 
        const foundUser2 = await User.findOneAndUpdate({email: user2}, { $pull: { requestsSent: user1 } });
        
        if(!foundUser1 ||  !foundUser2 ){

            return response.status(400).json({ errors: [{msg: "Invalid Username(s)"}]});
         }
 
         return  response.status(200).json({ msg: "request removed " });
    }
    catch(error){
        console.log(error.msg)
        return response
        .status(500)
        .json({ errors: [{ msg: 'Server error due to : ' + error.message }] });
}


})


app.post("/othersDetails", async(req, res) => {

const body= req.body;
try{

    let currentUser= await User.findOne({email:body.email});

    if(!currentUser)
    {
        console.log("Email is not there in database");
        return(
            res.status(400).json({errors:[{msg:"email is not found in database"}]})
        )
    }
  const obj ={
      email:currentUser.email,
    firstName: currentUser.firstName,
    lastName: currentUser.lastname,
    friends: currentUser.friends,
    image:currentUser.image,
    bio:currentUser.bio,
    
  }
    res.status(200).json(obj);
}  catch (err) {
    //might be due to jwt.sign or the other await's in try block
    console.log( err.message);
    return res
        .status(500)
        .json({ errors: [{ msg: 'internal server errors' }] });
}

})



app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute );
app.use("/file",uploadRoute);
app.use("/posts",postRoute);




app.listen(5000,()=>{
    console.log("server is running in port 5000");
})