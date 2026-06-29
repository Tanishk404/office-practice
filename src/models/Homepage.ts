import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────
const HighlightArticleSchema = new Schema({
  section: { type: String, default: "EDITORIAL" },
  title: { type: String, required: true },
  authorDetails: { type: String, default: "" },
  citation: { type: String, default: "" },
});

const IndexingSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, default: "" },
});

// ✅ FIX: ab duplicate title/summary/journalName store nahi karte.
// Sirf real JournalArticle ko reference karte hain — link automatically
// sahi article detail page par jayega (jisme abstract, authors, DOI, PDF — sab already kaam karta hai).
const MostPopularSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "JournalArticle",
    required: [true, "Please select an article"],
  },
  // optional: agar admin sidebar mein chhota custom summary dikhana chahe
  // (warna abstract se auto-truncate hoga)
  customSummary: { type: String, default: "" },
});

// ─── Main Homepage Schema ─────────────────────────────────────────────────────
export interface IHomepage extends Document {
  issn_print: string;
  issn_online: string;
  coden: string;
  aboutText: string;
  coverImageUrl: string;
  highlights: typeof HighlightArticleSchema[];
  indexing: typeof IndexingSchema[];
  mostPopular: typeof MostPopularSchema[];
  updatedAt: Date;
}

const HomepageSchema = new Schema<IHomepage>(
  {
    issn_print: { type: String, default: "" },
    issn_online: { type: String, default: "" },
    coden: { type: String, default: "" },
    aboutText: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    highlights: { type: [HighlightArticleSchema], default: [] },
    indexing: { type: [IndexingSchema], default: [] },
    mostPopular: { type: [MostPopularSchema], default: [] },
  },
  { timestamps: true }
);

const Homepage: Model<IHomepage> =
  mongoose.models.Homepage ||
  mongoose.model<IHomepage>("Homepage", HomepageSchema);

export default Homepage;