import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRsponse.js";
import Image from "../models/Image.models.js";
import connectDB from "../db/index.js";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dcm0yakuc",
  api_key: process.env.CLOUDINARY_API_KEY || "111686871396262",
  api_secret: process.env.CLOUDINARY_API_SECRET || "m7aReiB0WQM674NKkeEq0i23zcg",
});

// Get __dirname equivalent in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Define image folder path
const IMAGE_FOLDER = path.join(__dirname, "../../public/img");

// Ensure the folder exists
if (!fs.existsSync(IMAGE_FOLDER)) {
  console.log("⚠️ Folder 'public/images' not found. Creating it...");
  fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
}

// ✅ Predefined product details
const predefinedProducts = [
  {
    fileName: "logo.png",
    title: "logo",
    price: 0,
    rating: 0,
    reviews: "0",
    category: "logo",
    platform: "logo",
    storage: "1 TB",
    ram: "16 GB",
  },
];

// ✅ Upload a single image to Cloudinary and save to MongoDB
const uploadImageToCloudinary = async (imagePath, product) => {
  try {
    console.log(`🚀 Uploading ${product.fileName} to Cloudinary...`);

    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: "image",
      folder: "images",
      public_id: product.fileName.split(".")[0], // Use filename without extension as public_id
    });

    console.log(`✅ Successfully uploaded ${product.fileName}: ${result.secure_url}`);

    // Check if the image already exists in the DB by imageUrl
    const existingImage = await Image.findOne({ imageUrl: result.secure_url });
    if (existingImage) {
      console.log(`⚠️ Image already exists in DB: ${product.title}. Skipping save...`);
      return result.secure_url; // Return the URL but skip saving to DB
    }

    // Save image details to MongoDB with predefined data
    const newImage = new Image({
      title: product.title,
      imageUrl: result.secure_url,
      thumbnail: result.secure_url.replace("/upload/", "/upload/w_300,h_200/"),
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      platform: product.platform,
      storage: product.storage,
      ram: product.ram,
      isSponsored: product.isSponsored || false,
    });

    await newImage.save();
    console.log(`📦 Saved to DB: ${product.title}`);

    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${product.fileName}:`, error);
    throw new ApiError(500, "Error uploading image to Cloudinary");
  }
};

// ✅ Upload all images from folder, save to Cloudinary & DB
export const uploadAllImages = async () => {
  try {
    await connectDB();
    console.log("📂 Checking image folder...");
    const files = fs.readdirSync(IMAGE_FOLDER);

    // Filter for image files (e.g., .jpg, .jpeg, .png, .gif)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log("⚠️ No images found in the folder.");
      return new ApiResponse(200, "No images found.");
    }

    let uploadedImages = [];

    for (const file of imageFiles) {
      // Find the corresponding product data
      const product = predefinedProducts.find((p) => p.fileName === file);
      if (!product) {
        console.log(`⚠️ No predefined data found for ${file}. Skipping...`);
        continue;
      }

      const filePath = path.join(IMAGE_FOLDER, file);
      const imageUrl = await uploadImageToCloudinary(filePath, product);
      uploadedImages.push(imageUrl);

      // 🗑️ Delete local file after upload
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted local file: ${file}`);
    }

    console.log("🎉 All images uploaded successfully!");
    return new ApiResponse(200, "Images uploaded successfully", uploadedImages);
  } catch (error) {
    console.error("❌ Error processing image uploads:", error);
    throw new ApiError(500, "Error processing image uploads");
  } finally {
    process.exit();
  }
};

// ✅ Call the function to upload all images
uploadAllImages().catch((err) => console.error("❌ Upload Error:", err));