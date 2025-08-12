import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const LoginSchema = new Schema({
  firstName: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
});

// Hash password before saving
LoginSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
LoginSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("UserLogin", LoginSchema, "user");
