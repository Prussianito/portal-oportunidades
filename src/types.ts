/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  Visitor = "Visitor",
  Registered = "Registered",
  InstitutionalPending = "InstitutionalPending",
  InstitutionalVerified = "InstitutionalVerified",
  Admin = "Admin"
}

export enum Modality {
  Presencial = "Presencial",
  Online = "Online",
  Hibrida = "Híbrida"
}

export enum CostType {
  Gratuito = "Gratuito",
  Pagado = "Pagado"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  institutionId?: string;
  savedFavorites: string[]; // Opportunity IDs
  subscribedCategories: string[]; // Category Names
  avatar?: string;
  description?: string;
  occupation?: string;
  followedUsers?: string[]; // USER IDs
  followedInstitutions?: string[]; // INSTITUTION IDs
}

export interface Institution {
  id: string;
  name: string;
  rut: string;
  website: string;
  email: string;
  contactName: string;
  contactRole: string;
  documentName?: string; // Loaded verification doc
  verified: boolean;
  logo: string;
  description: string;
  history?: string;
  phone?: string;
  occupation?: string; // Sector/Ocupación
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface EventReview {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  institutionId: string;
  institutionName: string;
  institutionLogo?: string;
  isInstitutionVerified: boolean;
  categories: string[]; // One or more categories
  modality: Modality;
  cost: CostType;
  price?: string; // e.g. "$15.000" or empty
  region: string;
  comuna: string;
  address?: string;
  targetAudience: string[]; // e.g. ["Estudiantes Media", "Docentes", "Público General"]
  imageUrl: string;
  imageGallery?: string[];
  briefDescription: string;
  fullDescription: string;
  objectives?: string;
  programDetails?: string;
  requirements?: string;
  benefits?: string;
  applicationDeadline: string; // YYYY-MM-DD
  eventDate: string; // YYYY-MM-DD
  officialWebsite?: string;
  contactEmail?: string;
  contactPhone?: string;
  registrationLink?: string;
  documents?: { name: string; url: string }[];
  faqs?: { question: string; answer: string }[];
  status: "Draft" | "Published" | "Scheduled";
  scheduledDate?: string;
  isFeatured?: boolean;
  // Stats for the publicador dashboard
  views: number;
  clicks: number;
  registrations: number;
}

export interface SearchFilter {
  keyword: string;
  categories: string[];
  regions: string[];
  comunas: string[];
  modalities: string[];
  institutionTypes: string[];
  targetAudiences: string[];
  costTypes: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "alert" | "success" | "opportunity";
  opportunityId?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  publishDate: string;
  readingTime: string;
  author: string;
  source?: string;
  tag?: string;
}

export interface AdBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  sponsorName: string;
  tags?: string[];
  type: "horizontal" | "card" | "sidebar";
  active: boolean;
}

export interface UserQuestion {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  senderName: string;
  senderEmail: string;
  question: string;
  createdAt: string;
  answered: boolean;
  answer?: string;
  publishedToFaq: boolean;
}


