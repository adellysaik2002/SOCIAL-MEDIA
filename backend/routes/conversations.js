const router = require("express").Router();
const Conversation = require("../models/Conversation");
 

router.post("/",  async (req, res) => {
   
    const newConversation = new Conversation({
        members : [req.body.sender, req.body.receiver],
    });

    try{
         const savedConversation = await newConversation.save();
         res.status(200).json(savedConversation);
    }
    catch(err){
        res.status(500).json(err);

    }

})

router.get("/:userId", async(req, res) =>{
     
     try{
         const conversation = await Conversation.find({
             members : { $in : [req.params.userId]}
         });
         res.status(200).json(conversation);
     }
     catch(err){
         res.status(500).json(err);
     }
})

router.post("/delete", async (req, res) => {


    try{
       const post=await Conversation.find({members : { $in : [req.body.sender]},members : { $in : [req.body.receiver]}});
        
         await Conversation.deleteOne({ "_id" :post[0]._id });
            res.status(200).json("successfully deleted")
       
         
        
    }catch(err){
        res.status(500).json(err);
    }
    
   
  
  
     
  })




module.exports = router;