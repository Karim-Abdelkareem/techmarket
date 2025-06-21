// import mongoose from "mongoose";

// const audioSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please provide a name for the audio device"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Please provide a description for the audio device"],
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: [true, "Please provide a category ID for the audio device"],
//     },
//     subcategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: [true, "Please provide a subcategory ID for the audio device"],
//     },
//     type: {
//       type: String,
//       required: [true, "Please provide a type for the audio device"],
//     },
//     color: {
//       type: String,
//       required: [true, "Please provide a color for the audio device"],
//     },
//     brand: {
//       type: String,
//       required: [true, "Please provide a brand for the audio device"],
//     },
//     features: {
//       type: String,
//       required: [true, "Please provide features for the audio device"],
//     },
//     wantrry: {
//       type: String,
//       required: [true, "Please provide a warranty period for the audio device"],
//     },
//     price: {
//       type: Number,
//       required: [true, "Please provide a price for the audio device"],
//     },
//     company: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: [true, "Please provide a company ID for the audio device"],
//     },
//     dealer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Dealer",
//       required: [true, "Please provide a dealer ID for the audio device"],
//     },
//     quantity: {
//       type: Number,
//       required: [true, "Please provide a quantity for the audio device"],
//     },
//     image: {
//       type: String,
//       required: [true, "Please provide an image for the audio device"],
//     },
//     images: {
//       type: [String],
//       required: [true, "Please provide images for the audio device"],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Audio = mongoose.model("Audio", audioSchema);
// export default Audio;
