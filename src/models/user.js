import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  // _id:String,
  designation: String,
  role: String,
  firstName: String, // String is shorthand for {type: String}
  lastName: String,
  fullName: String,
  email:String,
  nic:String,
  contact_no: String,
});

export default mongoose.model("User", userSchema, "user");