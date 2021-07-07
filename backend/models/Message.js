const mongoose = require('mongoose')

const url = "mongodb://localhost:27017/ProjectDB";


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const MessageSchema = new mongoose.Schema(
     {
       cid :{
         type : String,
       },
       sender : {
         type : String,
       },
       text: {
         type : String,
       }
     },

     {timestamps:true}
      
)



module.exports = mongoose.model('Message', MessageSchema);