import mongoose from "mongoose";
const { Schema } = mongoose;

const operationImplementSchema = new Schema(
  {
    op_Imp: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true, // auto-generated
    },
    operation: {
      type: Schema.Types.ObjectId,
      ref: "Operation",
      required: true,
    },
    implement: {
      type: Schema.Types.ObjectId,
      ref: "Implement",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

export default mongoose.model("Operation_Implement", operationImplementSchema,"operation_implement");
