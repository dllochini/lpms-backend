import mongoose from "mongoose";
const { Schema } = mongoose;

const workDoneSchema = new Schema({
   // workID :String
   resource: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },
    task:{
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
    start_Date : Date,
    end_Date: Date,
    amount :Number,
    description: String,
});

export default mongoose.model("WorkDone", workDoneSchema, "workDone");
