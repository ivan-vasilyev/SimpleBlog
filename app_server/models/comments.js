const {db, Schema} = require('./db');

const commentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date, 
    default: Date.now 
  },
  text: {
    type: String,
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  positiveLikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  negativeLikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

commentSchema.virtual('likes').get(function(){
  return this.positiveLikes.length - this.negativeLikes.length;
});

module.exports = db.model('Comment', commentSchema);
