import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBook extends Document {
  isbn: number;
  cover: string;
  coverId?: number;
  bookTitle: string;
  authors: string;
  category: string;
  status: "available" | "borrowed";
  publishedDate: string;
  borrowedBy?: mongoose.Types.ObjectId;
  borrowedDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema<IBook> = new Schema(
  {
    isbn: {
      type: Number,
      required: [true, "Please provide an ISBN"],
      unique: true,
    },
    cover: {
      type: String,
      default: "/assets/book-placeholder.jpg",
    },
    coverId: {
      type: Number,
    },
    bookTitle: {
      type: String,
      required: [true, "Please provide a book title"],
      trim: true,
    },
    authors: {
      type: String,
      required: [true, "Please provide author name(s)"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "borrowed"],
      default: "available",
    },
    publishedDate: {
      type: String,
      required: [true, "Please provide a published date"],
    },
    borrowedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    borrowedDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);

export default Book;
