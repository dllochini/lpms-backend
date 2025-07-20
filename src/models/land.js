import mongoose from "mongoose";
const { Schema } = mongoose;

const landSchema = new Schema({
  area: Number,
  division: String,
  addressLine1: String,
  addressLine2: String ,
  city: String,
  district: String,
});

export default mongoose.model("Land", landSchema, "land");
