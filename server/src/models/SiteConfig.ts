import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteConfig extends Document {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  about: {
    title: string;
    description: string;
  };
  projectsSection: {
    title: string;
    subtitle: string;
    githubButtonText: string;
  };
  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    buttonText: string;
    infoEmail: string;
    infoPhone: string;
    infoAddress: string;
    footerText: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const SiteConfigSchema = new Schema<ISiteConfig>({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    ctaText: { type: String, required: true }
  },
  about: {
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  projectsSection: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    githubButtonText: { type: String, required: true }
  },
  contact: {
    title: String,
    subtitle: String,
    formTitle: String,
    emailPlaceholder: String,
    messagePlaceholder: String,
    buttonText: String,
    infoEmail: String,
    infoPhone: String,
    infoAddress: String,
    footerText: String
  },
  seo: {
    title: String,
    description: String,
    keywords: String
  }
}, { timestamps: true });

export default mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
