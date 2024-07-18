const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
  level:{
    type: String,
    default: 'Novice'
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
  followers: [
    {
      type:Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
});

module.exports = progressSchema;
