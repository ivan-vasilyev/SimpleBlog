const {db, Schema} = require('./db');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  salt: String
});

userSchema.methods.verifyPassword = function(password){
  return (this.password === password + this.salt) ? true : false;
};

module.exports = db.model('User', userSchema);

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
    /* return new Promise((resolve, reject) => {
      const newTask = new Task({
        id: task.id,
        text: task.text,
        complete: task.complete,
      });

      newTask.save(err => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    }); */
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
  },
};
