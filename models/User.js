const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

// Hash the plaintext password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  console.log('This is the user from the database', user);
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;