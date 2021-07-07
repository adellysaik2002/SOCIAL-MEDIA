import "./post.css"

import {React,useState,useEffect} from "react";

import axios from "axios";
import {format} from "timeago.js";


export default function Post(props){

    const [like,setLike]=useState(props.post?.likes.length);
    const [isLiked,setIsLiked]=useState(false);
    const [user,setUser]=useState({});

    useEffect(()=>{
       setIsLiked(props.post.likes.includes(props.email));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.post.likes]);

    useEffect(()=>{
        const fetchPosts=async()=>{
            const res=await axios.post("http://localhost:5000/othersDetails",{email:props.post?.userId});
            //console.log("post console",res.data);
            
            setUser(res.data);
        };
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const likeHandler=async()=>{
        try{
          const res= await axios.put("http://localhost:5000/posts/"+props.post?._id+"/like",{userId:props.email});
          console.log(res.data);
        }catch(err){
            console.log(err);
        }
        setLike(isLiked? like-1:like+1);
        setIsLiked(!isLiked);
    }

    return(
        <div className="post">
           
               <div className="postWrapper">
                   <div className="postTop">
                   <img className="postProfileImg" src={user.image} alt="hi" />
                   
                   <span className="postUserName">{user?.firstName} </span>
                   <span className="postDate"> {format(props.post?.createdAt)}</span>
                   </div>
                   <hr className="postHr"></hr>
                   <div className="postCenter"></div>
                   <span className="postText">{props.post?.desc}</span>
                   <img className="postImg" src={props.post?.img} alt="" />
                   <div className="postBottom">
                       <button className="likeButton" onClick={likeHandler}>
                           Like
                           </button>

                           <span className="likespan">{`${like} people like it`}</span>
                   </div>

               </div>
        
        </div>
    )
}