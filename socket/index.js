const io =require("socket.io")(8900,{
    cors:{
        origin:"*",
    },
});

let users = [];
const addUser=(userId,socketId)=>{

    !users.some((user)=>user.userId===userId)&&users.push({userId,socketId});
    
    console.log("adduser:",userId);

}

const removeUser=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId);
    console.log("a user disconnected.:",users);

}

const getUser=(userId)=>{
    return(users.find(user=>user.userId===userId));
   
}


io.on("connection",(socket)=>{
   
    io.emit("welcome","hello this is socket!");
    socket.on("addUser",userId=>{
        addUser(userId,socket.id);
        console.log("a user connected.:",users);
        io.emit("getUsers",users);
    })

    socket.on("sendMessage",({senderId,receiverId,text})=>{
        console.log("message sent",text,senderId,receiverId);
      const user=getUser(receiverId);
      console.log(user);
      io.to(user?.socketId).emit("getMessage",{
          
          senderId,
          text,
      })
    })

    socket.on("disconnect",()=>{
    
     
     removeUser(socket.id);
     io.emit("getUsers",users);
    })
})



