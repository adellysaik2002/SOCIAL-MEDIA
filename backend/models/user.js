const mongoose = require('mongoose')
const isEmail = require('validator').isEmail;

const url = "mongodb://localhost:27017/ProjectDB";

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const UserSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName: String,
    email:
    {type:String , 
     required: true,
     unique: true,
     validate: [isEmail, 'invalid email'] 
    },
    password:{type: String,required:true},
    requestsSent: [String],
    requestsReceived: [String],
    friends: [String],
    image:{type:String},
    bio:{type:String,max:500}
})

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    
   
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('User', UserSchema)