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

const User = db.model('User', userSchema);

module.exports = {
  userModel: User,
  // GET /
  list(){
    return User.find({}).exec();
    /* return new Promise((resolve, reject) => {
      Task.find({}).exec((err, res) => {
        if (err) {
          reject(err);
        }
        console.log(res);
        resolve(res);
      });
    });  */   
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



/* const first = new Task({
  id: 3,
  text: 'Третья задача',
  complete: false
});

first.save(err => {
  if (err) {
    console.log(err);
  }

  console.log('Task created');
}); */

/* (function list(){
  return new Promise((resolve, reject) => {
    Task.find({}).exec((err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });    
})().then(res => console.log(res), err => console.error(err)); */