const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const config = require('./config');

mongoose.set('debug', true);

const db = mongoose.createConnection(config.dbConnAddress, config.params);

db.once('connected', () => console.log('Mongoose connected'));

module.exports = {
  db,
  Schema
};
