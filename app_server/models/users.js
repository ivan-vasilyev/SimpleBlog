const {db, Schema} = require('./db');
const crypto = require('crypto');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  salt: Buffer,
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.verifyPassword = function(password){
  return (this.password === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('base64')) ? true : false;
};

module.exports = db.model('User', userSchema);
