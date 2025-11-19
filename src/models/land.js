// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const landSchema = new Schema(
//   {
//     // _id: { type: String, unique: true },
//     farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     division: { type: Schema.Types.ObjectId, ref: "Division", required: true }, // divisionID (FK)
//     unit: { type: Schema.Types.ObjectId, ref: "Unit" },
//     size: { type: String, required: true },
//     address: { type: String },
//     images: [{ type: Schema.Types.Mixed }], // could be array of file refs/URLs or objects
//     documents: [{ type: Schema.Types.Mixed }], // same as images
//     signedAgreement: { type: Schema.Types.Mixed }, // boolean, file ref, or object
//     createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
//     notes: { type: String },
//     updatedHistory: [
//       {
//         updatedAt: { type: Date, default: Date.now },
//         updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
//         changes: { type: Schema.Types.Mixed }, // optional: track what changed
//       },
//     ],
//   },
//   { timestamps: true }
// ); // ✅ auto-generates createdAt & updatedAt

// // landSchema.pre("save", async function (next) {
// //   if (this.isNew) {
// //     const count = await mongoose.model("Land").countDocuments();
// //     this._id = `LAND${(count + 1).toString().padStart(5, "0")}`;
// //   }
// //   next();
// // });

// export default mongoose.model("Land", landSchema, "land");

import mongoose from "mongoose";
const { Schema } = mongoose;

const landSchema = new Schema(
  {
    // landId: { type: String, unique: true },  // <-- Custom ID field here

    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    size: { type: String, required: true },
    registrationNo: { type: String, required: true, unique: true },
    address: { type: String },
    images: [{ type: Schema.Types.Mixed }],
    documents: [{ type: Schema.Types.Mixed }],
    signedAgreement: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    updatedHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: true }
);

/* -------------------------------------------
   AUTO-GENERATE CUSTOM LAND ID (LAND00001 etc.)
-------------------------------------------- */
// landSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     const count = await mongoose.model("Land").countDocuments();
//     this.landId = `LAND${String(count + 1).padStart(5, "0")}`;
//   }
//   next();
// });

export default mongoose.model("Land", landSchema, "land");

