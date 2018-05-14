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
/* 
{
  // GET /
  list(){
    return User.find({}).exec(); 
  },
  // POST /
  add(user){ // task {text: '', complete: false}
    const newUser = new User({
      username: user.username,
      password: user.password,
      email: user.email,
      salt: user.salt
    });

    return newUser.save();
  },
  // PUT /
	change(id, text){
    return Task.update({_id: id}, { $set: { text: text }});
  },
  // PATCH /
	complete(id){
    return Task.update({_id: id}, { $set: { complete: true }});
  },
  // DELETE /
  delete(id){
    return Task.remove({_id: id});
  }
};
 */