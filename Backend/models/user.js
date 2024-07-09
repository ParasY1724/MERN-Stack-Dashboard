const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const progressSchema = require('./progress');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique:true
  },
  about: {
    type:String
  },
  profilePic : {
    type: String,
    default: "https://i.pinimg.com/736x/55/33/5c/55335c708ac05d8f469894d08e2671fa.jpg"
  },
  likes:[
    {
    type:Schema.Types.ObjectId,
    ref: 'Post',
    }
  ],
  progress: {
    type: progressSchema,
    default: () => ({})
  },
  socialURL:[
    {
      type:String,
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
