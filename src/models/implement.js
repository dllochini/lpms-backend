import mongoose from "mongoose";

const { Schema } = mongoose;

const ImplementSchema = new Schema({
  // _id: String,
  name: String,
  operations: [{ type: Schema.Types.ObjectId, ref: "Operation" }],
});

export default mongoose.model("Implement", ImplementSchema, "implement");
