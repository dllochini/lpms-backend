import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  _id:String,
  firstname: String, // String is shorthand for {type: String}
  lastname: String,
  email:String,
});

export default mongoose.model("User", userSchema, "user");
