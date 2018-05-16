const {db, Schema} = require('./db');

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  header: {
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
  image: String,
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

postSchema.virtual('likes').get(function(){
  return this.positiveLikes.length - this.negativeLikes.length;
});

module.exports = db.model('Post', postSchema);
