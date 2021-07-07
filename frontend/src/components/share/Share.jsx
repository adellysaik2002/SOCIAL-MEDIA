import './share.css';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import {React,useState,useRef,useEffect} from "react";
import axios from 'axios';
import CancelIcon from '@material-ui/icons/Cancel';


export default function Share(props)
{
    const [User,setUser]=useState(null)
    useEffect(()=>{
        async function firstTime(){
            
            const res=await axios.post("http://localhost:5000/othersDetails",{email:props.email});
           
           
            setUser(res.data);
        }

        firstTime();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const desc=useRef();
    const[file,setFile]=useState(null);

    const submitHandler =async(e)=>{
        e.preventDefault()
        const newPost={
            userId:props.email,
            desc:desc.current.value
        };

        if(file){
            const data=new FormData();
            const fileName=props.email+file.name;
            data.append("file",file);
            data.append("name",fileName);
            try{
               const Image= await axios.post("http://localhost:5000/file/upload",data);
              
               newPost.img=Image.data;
            }catch(err){
                console.log(err);
            }
        }

        try{
           await axios.post("http://localhost:5000/posts",newPost);
           window.location.reload();
           console.log("posted succesfully");

        }catch(err){
            console.log(err);
        }
        
    }
    return(
    <div className="share">
        <div className="shareWrapper">
            <div className="shareTop">
            <img className="shareprofileImg" src={User?.image} alt=""/>
            <span className="shareUserName">{User?.firstName}</span>
            

            </div>
            
            <hr className="shareHr"></hr>
            <div className="shareText">
            <textarea placeholder="Share what's on your mind" className="shareMessageInput" ref={desc}></textarea>
            {
                file&&(
                    <div className="shareImageContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt=""/>
                        <CancelIcon className="shareCancelImg" onClick={()=>setFile(null)}/>
                    </div>
                )
            }
            <form className="shareBottom" onSubmit={submitHandler}>
                 {/* <div className="shareOptions">
                       <span>Add an Image to your post</span>
                 </div> */}
                 <label htmlFor="file" className="shareOption">
                 <PermMediaIcon htmlColor="tomato" className="shareIcon"/>
                 <span className="shareOptionText">Add an Image</span>
                 <input style={{display:"none"}}type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e)=>setFile(e.target.files[0])}/>
                 </label>

                 <button className="shareButton" type="submit">Share</button>
                 </form>
            </div>
            
            
        </div>
        
    </div>
    )
}