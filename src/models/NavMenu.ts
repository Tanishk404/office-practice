import mongoose, { Schema, Document } from "mongoose";

export interface INavItem {
  label: string;
  slug: string;
  isExternal?: boolean;
}

export interface INavMenu extends Document {
  title: string;
  order: number;
  type: "dropdown" | "single";
  slug?: string;              
  isExternal?: boolean;       
  items: INavItem[];          
  isActive: boolean;
}

const NavMenuSchema = new Schema<INavMenu>(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    type: { type: String, enum: ["dropdown", "single"], default: "dropdown" },
    slug: { type: String, default: "" },
    isExternal: { type: Boolean, default: false },
    items: [
      {
        label: { type: String },
        slug: { type: String },
        isExternal: { type: Boolean, default: false },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.NavMenu ||
  mongoose.model<INavMenu>("NavMenu", NavMenuSchema);