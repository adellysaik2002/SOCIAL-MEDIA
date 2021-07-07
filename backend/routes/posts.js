const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/user");
 



router.post("/", async (req, res) => {

  const newPost=new Post(req.body);
  try{
      const savedPost=await newPost.save();
      res.status(200).json(savedPost);
  }catch(err){
      res.status(500).json(err)
  }


   
})


router.delete("/:id/?userId=", async (req, res) => {

    try{
        const post=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
          await Post.deleteOne({ "_id" :post._id });
           res.status(200).json("the post has been deleted")
        }else{
         res.status(403).json("you can delete only your post")
         }
    }catch(err){
        res.status(500).json(err);
    }
 })


  

  router.put("/:id/like",async(re,res)=>{

    try{
      const post=await Post.findById(re.params.id);
      if(!post.likes.includes(re.body.userId)){
          await post.updateOne({$push:{likes:re.body.userId}});
          res.status(200).json("The post has been liked")
      }else{
          await post.updateOne({$pull:{likes:re.body.userId}});
          res.status(200).json("The post has been disliked");
      }
    }catch(err){
        res.status(500).json(err);
    }
  })

  router.get("/:id",async(re,res)=>{
      try{
          const post=await Post.findById(re.params.id); 
          res.status(200).json(post);
      }catch(err){
          res.status(500).json(err)
      }
  })



router.get("/explore/allposts",async(re,res)=>{
    try{
        posts=await Post.find({});
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err);
    }
})

  router.get("/:userId/timeline",async(re,res) =>{
      
    try{
       
        const userPosts=await Post.find({userId:re.params.userId});
        
        res.status(200).json(userPosts);
    }catch(err){
        res.status(500).json(err);
    }
})









module.exports = router;