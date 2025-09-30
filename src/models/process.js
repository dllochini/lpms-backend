import mongoose from "mongoose";
const { Schema } = mongoose;

const processSchema = new Schema({
  _id: { type: String, unique: true },

  land: { 
    type: Schema.Types.ObjectId, 
    ref: "Land",  // Assuming you have a Land collection
    required: true 
  },
  startedDate: { 
    type: Date, 
    required: false 
  },
  endDate: { 
    type: Date, 
    required: false 
  },
  status: { 
    type: String, 
    maxlength: 255 
  },
  updateHistory: [{ 
    type: String // Assuming array of strings; change type if storing objects
  }]
}, { timestamps: true });

export default mongoose.model("Process", processSchema,"process");
