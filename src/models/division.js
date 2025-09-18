import mongoose from "mongoose";
const { Schema } = mongoose;

const divisionSchema = new Schema({
  // _id: String,
  name: String,
});

export default mongoose.model("Division", divisionSchema, "division");
