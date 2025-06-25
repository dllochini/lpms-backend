import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  // _id:String,
  firstName: String, // String is shorthand for {type: String}
  lastName: String,
  email:String,
  nic:String,
});

export default mongoose.model("User", userSchema, "user");
