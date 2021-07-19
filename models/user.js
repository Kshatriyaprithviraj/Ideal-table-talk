const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.method.validUserPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
