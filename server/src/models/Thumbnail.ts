import mongoose, { Document, Schema } from 'mongoose';

export interface IThumbnail extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  cloudinaryId: string;
  promptData: {
    title: string;
    style: string;
    aspectRatio: string;
    colorScheme: string;
    additionalDetails?: string;
  };
  createdAt: Date;
}

const ThumbnailSchema = new Schema<IThumbnail>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    promptData: {
      title: { type: String, required: true },
      style: { type: String, required: true },
      aspectRatio: { type: String, required: true },
      colorScheme: { type: String, required: true },
      additionalDetails: { type: String },
    },
  },
  { timestamps: true }
);

export const Thumbnail = mongoose.model<IThumbnail>('Thumbnail', ThumbnailSchema);
