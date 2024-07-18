const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const progressSchema = require('./progress');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique:true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type:String,
    required : true
  },
  username: {
    type: String,
    required: true,
    unique:true,
    index: true
  },
  about: {
    type:String
  },
  profilePic : {
    type: String,
    default: "https://t3.ftcdn.net/jpg/03/91/19/22/360_F_391192211_2w5pQpFV1aozYQhcIw3FqA35vuTxJKrB.jpg"
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
