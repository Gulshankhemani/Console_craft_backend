import mongoose, { Schema } from "mongoose";

const CartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Image", // Changed from "Product" to "Image"
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
  },
  { timestamps: true }
);

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [CartItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total amount cannot be negative"],
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate total amount
CartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

// Handle unique constraint errors
CartSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("A cart already exists for this user"));
  } else {
    next(error);
  }
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;