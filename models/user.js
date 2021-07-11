const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  fullname: {
    default: '',
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
    default: '',
  },
  userImage: {
    type: String,
    default: 'default.png',
  },
  facebook: {
    type: String,
    default: '',
  },
  fbTokens: Array,
  google: {
    type: String,
    unique: true,
  },
  googleTokens: Array,
});

module.exports = mongoose.model('User', userSchemar);
