
export interface Project {
  id: number | string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
}

export interface SiteConfig {
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
  seo: SeoSettings;
}

export interface ContactMessage {
  id: number | string;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
}
