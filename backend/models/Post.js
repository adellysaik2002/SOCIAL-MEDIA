const mongoose = require('mongoose')

const url = "mongodb://localhost:27017/ProjectDB";


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const PostSchema = new mongoose.Schema(
     {
       userId :{
         type : String,
         required: true,
       },
      desc : {
         type : String,
         max:500,
       },
       img: {
         type : String,
       },
       likes:{
           type:Array,
           default:[],
       }
     },

     {timestamps:true}
      
)



module.exports = mongoose.model('Post', PostSchema);