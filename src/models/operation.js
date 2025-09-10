import mongoose from "mongoose";

const { Schema } = mongoose;

const OperationSchema = new Schema(
  {
    // _id: String,
    name:  String,
    note: String,    
  });

export default mongoose.model("Operation", OperationSchema,"operation");
