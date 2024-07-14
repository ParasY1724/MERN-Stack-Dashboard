const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  likes:{
    type: Number,
    default:0
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
