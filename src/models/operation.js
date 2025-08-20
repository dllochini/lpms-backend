import mongoose from "mongoose";

const { Schema } = mongoose;

const OperationSchema = new Schema(
  {
    // _id: String,
    operation_Name:  String,    
  });

export default mongoose.model("Operation", OperationSchema,"operation");
