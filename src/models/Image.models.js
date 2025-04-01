import mongoose, { Schema } from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    imageUrl: {
      type: String,
      required: true,
      unique: true
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: String,
      default: "0",
    },
    category: {
      type: String,
      enum: ["Games", "PC_Components", "PlayStation", "Xbox","logo"],
      default: "PlayStation",
    },
    platform: {
      type: String,
      enum: ["PC", "PS5", "PS4", "Xbox","logo"],
      default: "PS5",
    },
    storage: {
      type: String,
      enum: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"],
      default: "1 TB",
    },
    ram: {
      type: String,
      enum: ["4 GB", "8 GB", "16 GB", "32 GB"],
      default: "16 GB",
    },
    isSponsored: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", ImageSchema);
export default Image;