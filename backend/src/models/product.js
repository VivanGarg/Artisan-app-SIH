const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    hindiTitle: { type: String, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    artisanId: { type: String },
    artisanName: { type: String, required: true },
    artisanLineage: { type: String },
    cluster: { type: String, required: true },
    state: { type: String, required: true },
    giCertified: { type: Boolean, default: true },
    giCode: { type: String },
    silkMarkCode: { type: String },
    pehchanVerified: { type: Boolean, default: true },
    dispatchTime: { type: String, default: "48 Hours" },
    artisanWage: { type: Number },
    fairWagePercentage: { type: Number, default: 85 },
    images: [{ type: String }],
    description: { type: String },
    specs: { type: Map, of: String },
    audioStory: {
      title: String,
      duration: String,
      speaker: String
    },
    reviews: [
      {
        author: String,
        location: String,
        rating: Number,
        badge: String,
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
