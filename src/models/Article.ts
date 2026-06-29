import mongoose, { Schema, Document } from "mongoose";

// 1. Author Sub-document Schema Interface
interface IAuthor {
  firstName: string;
  lastName: string;
  orcid?: string;
  correspondingAuthor: "Yes" | "No";
}

const AuthorSchema = new Schema<IAuthor>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  orcid: {
    type: String,
    trim: true,
    default: "",
  },
  correspondingAuthor: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },
});

// 2. Main Journal Article Schema Interface
export interface IJournalArticle extends Document {
  journalTitle: string;
  volume: string;
  issue: string;
  doiId?: string;
  articleTitle: string;
  abstract: string;
  keywords?: string;
  authorsList: IAuthor[];
  articlePdfUrl: string;
  supplementaryPdfUrl?: string;
  page?: string;
  subject?: string;
  referencesNo?: string;
  license?: string;
  articleType?: string;
  accessType: "Open" | "Restricted";
  receivedDate?: Date;
  acceptedDate?: Date;
  onlineDate?: Date;
  status: "Active" | "Inactive";
  // ✅ NEW: drag-and-drop reorder ke liye
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Core Schema
const JournalArticleSchema = new Schema<IJournalArticle>(
  {
    journalTitle: {
      type: String,
      required: [true, "Journal title is required"],
      trim: true,
    },
    volume: {
      type: String,
      required: [true, "Volume number is required"],
      trim: true,
    },
    issue: {
      type: String,
      required: [true, "Issue number is required"],
      trim: true,
    },
    doiId: {
      type: String,
      trim: true,
      default: "",
    },
    articleTitle: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
    },
    abstract: {
      type: String,
      required: false,
      default: "",
    },
    keywords: {
      type: String,
      trim: true,
      default: "",
    },
    authorsList: {
      type: [AuthorSchema],
      validate: [
        (val: IAuthor[]) => val.length > 0,
        "At least one author is required",
      ],
    },
    articlePdfUrl: {
      type: String,
      required: [true, "Main Article PDF upload karna zaroori hai"],
    },
    supplementaryPdfUrl: {
      type: String,
      default: "",
    },
    page: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    referencesNo: {
      type: String,
      trim: true,
      default: "",
    },
    license: {
      type: String,
      trim: true,
      default: "",
    },
    articleType: {
      type: String,
      trim: true,
      default: "",
    },
    accessType: {
      type: String,
      enum: ["Open", "Restricted"],
      default: "Open",
    },
    receivedDate: {
      type: Date,
    },
    acceptedDate: {
      type: Date,
    },
    onlineDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    // ✅ NEW: admin drag-and-drop reorder ke liye yeh field zaroori thi
    // Purane articles ke liye default 0 rahega — pehli baar drag karne par sahi ho jayega
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Model export
const JournalArticle =
  mongoose.models.JournalArticle ||
  mongoose.model<IJournalArticle>("JournalArticle", JournalArticleSchema);
export default JournalArticle;