const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref: 'User',
  },
  level:{
    type: String,
    default: 'Rookie'
  },
  exp: {
    type: Number,
    default: 0
  },
  following: [
    {
      type:Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  followers: {
    type:Number,
    default:0
  }
});

module.exports = mongoose.model('Progress', progressSchema);
