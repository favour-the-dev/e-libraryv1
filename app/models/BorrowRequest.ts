import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBorrowRequest extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "rejected" | "returned";
  requestDate: Date;
  approvedDate?: Date;
  dueDate?: Date;
  returnedDate?: Date;
  lateFee?: number;
  daysLate?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowRequestSchema: Schema<IBorrowRequest> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    approvedDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    returnedDate: {
      type: Date,
    },
    lateFee: {
      type: Number,
      default: 0,
    },
    daysLate: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BorrowRequest: Model<IBorrowRequest> =
  mongoose.models.BorrowRequest ||
  mongoose.model<IBorrowRequest>("BorrowRequest", BorrowRequestSchema);

export default BorrowRequest;
