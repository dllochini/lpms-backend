import mongoose from 'mongoose';
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  fullplot: String,
  year: Number,
  languages: [String],
  released: Date,
});

export default mongoose.model("movies", movieSchema);