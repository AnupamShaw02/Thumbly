import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthToken extends Document {
  token: string;
  userId: string;
  expiresAt: Date;
}

const AuthTokenSchema = new Schema<IAuthToken>({
  token: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const AuthToken = mongoose.model<IAuthToken>('AuthToken', AuthTokenSchema);