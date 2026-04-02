export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  shuruq?: string;
  jumuah?: string;
  updatedAt: any;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: 'Actualité' | 'Événement' | 'Annonce' | 'Ramadan';
  imageUrl: string;
  publishedAt: any;
  status: 'Publié' | 'Brouillon' | 'Archivé';
  authorId: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: any;
  endDate: any;
  location: string;
  imageUrl: string;
  capacity?: number;
  registrationRequired: boolean;
  status: 'A venir' | 'Passé' | 'Annulé';
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  destination: 'Entretien' | 'Éducation' | 'Aide sociale' | 'Général';
  method: 'MonCash' | 'PayPal' | 'Virement' | 'Autre';
  status: 'Complété' | 'En attente' | 'Échoué';
  timestamp: any;
}

export interface DonationProject {
  id: string;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  imageUrl: string;
  active: boolean;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinedAt: any;
  status: 'Actif' | 'Inactif' | 'En attente';
  groups: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Lu' | 'Non lu' | 'Répondu';
  timestamp: any;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'Super Admin' | 'Éditeur' | 'Modérateur';
  lastLogin: any;
}
