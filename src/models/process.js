import mongoose from "mongoose";
const { Schema } = mongoose;

const processSchema = new Schema({
  //processID: 
  land: { 
    type: Schema.Types.ObjectId, 
    ref: "Land",  // Assuming you have a Land collection
    required: true 
  },
  started_date: { 
    type: Date, 
    required: false 
  },
  end_date: { 
    type: Date, 
    required: false 
  },
  status: { 
    type: String, 
    maxlength: 255 
  },
  update_history: [{ 
    type: String // Assuming array of strings; change type if storing objects
  }]
}, { timestamps: true });

export default mongoose.model("Process", processSchema,"process");
