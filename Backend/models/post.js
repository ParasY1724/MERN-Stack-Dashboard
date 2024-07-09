const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userId:{
      type:Schema.Types.ObjectId,
      ref: 'User',
    },
    mediaURL: {
      type: String,
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: {
      type:Number,
      default:0
    },
    comments:[
      {
        type:Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
