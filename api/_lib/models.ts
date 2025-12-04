import mongoose, { Schema, Document } from 'mongoose';

// Project Model
export interface IProject extends Document {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  link: { type: String, default: '#' },
  image: { type: String, required: true }
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

// Message Model
export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

// SiteConfig Model
export interface ISiteConfig extends Document {
  hero: { title: string; subtitle: string; ctaText: string; };
  about: { title: string; description: string; };
  projectsSection: { title: string; subtitle: string; githubButtonText: string; };
  contact: { title: string; subtitle: string; formTitle: string; emailPlaceholder: string; messagePlaceholder: string; buttonText: string; infoEmail: string; infoPhone: string; infoAddress: string; footerText: string; };
  seo: { title: string; description: string; keywords: string; };
}

const SiteConfigSchema = new Schema<ISiteConfig>({
  hero: { title: String, subtitle: String, ctaText: String },
  about: { title: String, description: String },
  projectsSection: { title: String, subtitle: String, githubButtonText: String },
  contact: { title: String, subtitle: String, formTitle: String, emailPlaceholder: String, messagePlaceholder: String, buttonText: String, infoEmail: String, infoPhone: String, infoAddress: String, footerText: String },
  seo: { title: String, description: String, keywords: String }
}, { timestamps: true });

export const SiteConfig = mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

// Analytics Model
export interface IAnalytics extends Document {
  date: Date;
  pageViews: number;
  projectClicks: number;
  uniqueVisitors: number;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  date: { type: Date, required: true, unique: true },
  pageViews: { type: Number, default: 0 },
  projectClicks: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 }
}, { timestamps: true });

export const Analytics = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
