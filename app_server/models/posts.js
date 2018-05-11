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
  date: Date,
  text: {
    type: String,
    required: true
  },
  relComment: [commentSchema]
});

const postSchema = new Schema({
  header: {
    type: String,
    required: true
  },
  date: Date,
  text: {
    type: String,
    required: true
  },
  image: String,
  comments: [commentSchema]
});

module.exports = db.model('Post', postSchema);
