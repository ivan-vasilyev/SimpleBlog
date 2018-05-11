const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./config');

const db = mongoose.createConnection('mongodb://localhost/simpleblog', config);

db.once('connected', () => console.log('Mongoose connected'));

module.exports = {
  db,
  Schema
};
