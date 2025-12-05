import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  ip?: string;
  visitorId?: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  ip: { type: String },
  visitorId: { type: String }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
