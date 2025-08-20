import mongoose from "mongoose";
const { Schema } = mongoose;

const unitSchema = new Schema({
  name:  {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
         },
  symbol:{
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
         },
  category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
             }
});

export default mongoose.model("Unit", unitSchema, "unit");
