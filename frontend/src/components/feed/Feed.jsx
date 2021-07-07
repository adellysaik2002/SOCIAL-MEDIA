import "./feed.css";
import Share from "../../components/share/Share.jsx";
import Post from "../../components/post/post.jsx";
import {React,useState,useEffect} from "react";
import axios from "axios"

export default function Feed(props)
{
    const[posts,setPosts]=useState(null);
    

    useEffect(()=>{
        const firstTime=async ()=>{
             const res=await axios.get("http://localhost:5000/posts/explore/allposts");
             console.log("feed console:",res.data);
             setPosts(res.data.sort((p1,p2)=>{
                 return new Date(p2.createdAt)-new Date(p1.createdAt);
             }));
        }
        firstTime();

      // eslint-disable-next-line react-hooks/exhaustive-deps
      
    },[])

    return(
        <div className="feedContainer">
            <div className="feedWrapper">
                  <Share email={props.email}/>
            </div>
            {
                posts?.map((p)=>(<Post key={p._id} post={p} email={props.email}/>))
            }
             
        </div>
    )
}