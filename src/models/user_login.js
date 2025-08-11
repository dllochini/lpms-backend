// models/UserLogin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userLoginSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
});

// Hash password before saving
userLoginSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userLoginSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("UserLogin", userLoginSchema, "user_login");
