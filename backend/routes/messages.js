const router = require("express").Router();
const Message = require("../models/Message");
 

router.post("/",  async (req, res) => {
    console.log(req.body);
   
    const newMessage = new Message(req.body);

    try{
         const savedMessage = await newMessage.save();
         console.log(savedMessage);
         res.status(200).json(savedMessage);
    }
    catch(err){
        res.status(500).json(err);
    }

})

router.get("/:conId", async (req, res) => {

    console.log("conversationid",req.params.conId);

    try{

        const messages = await Message.find({
            cid : req.params.conId,
        })
        console.log(messages);

        res.status(200).json(messages);
    }
    catch(err){
       res.status(500).json(err);
    }
})



module.exports = router;