import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
   // taskID :String
   land: {
    type: Schema.Types.ObjectId,
    ref: "Land",
    required: true,
  },
    operation:{
    type: Schema.Types.ObjectId,
    ref: "Operation",
    required: true,
  },
    start_date: {
      type: Date,
      required: true,
    },
    expected_end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
});

export default mongoose.model("Task", taskSchema, "task");
