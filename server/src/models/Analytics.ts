import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  pageViews: number;
  projectClicks: number;
  uniqueVisitors: number;
  visitorIds: string[];
  projectClickerIds: string[];
}

const AnalyticsSchema = new Schema<IAnalytics>({
  date: { type: Date, required: true, unique: true },
  pageViews: { type: Number, default: 0 },
  projectClicks: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  visitorIds: { type: [String], default: [] },
  projectClickerIds: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
