import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  slug: string;        // e.g., "about", "contact-us"
  title: string;       // Page heading
  content: string;     // Rich HTML content
  metaDescription?: string;
  isActive: boolean;
}

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Page ||
  mongoose.model<IPage>("Page", PageSchema);