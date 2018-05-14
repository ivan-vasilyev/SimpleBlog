const {db, Schema} = require('./db');
const crypto = require('crypto');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  salt: String
});

userSchema.methods.verifyPassword = function(password){
  return (this.password === crypto.pbkdf2Sync(
    req.body.password, this.salt, 1000, 64).toString('base64')) ? true : false;
};

module.exports = db.model('User', userSchema);
