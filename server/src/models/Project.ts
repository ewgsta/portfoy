import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  link: { type: String, default: '#' },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
