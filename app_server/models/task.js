const {db, Schema} = require('./db');

const taskSchema = new Schema({
  text: String,
  complete: Boolean,
});

module.exports = db.model('Task', taskSchema);
