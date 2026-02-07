export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  department: string;
  university: string;
  bio: string;
  qualifications: string[];
  subjects: string[];
  pricePerHour: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  availability: AvailabilitySlot[];
  portfolio: PortfolioItem[];
  joinedAt: Date;
  isVerified: boolean;
  responseTime: string;
}

export interface AvailabilitySlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  course: string;
  grade?: string;
}

export interface TutorReview {
  id: string;
  tutorId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  course: string;
  createdAt: Date;
}

export interface TutorBooking {
  id: string;
  tutorId: string;
  studentName: string;
  date: Date;
  startTime: string;
  endTime: string;
  subject: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface TutorFilter {
  search: string;
  department: string;
  subject: string;
  priceMin: number | null;
  priceMax: number | null;
  minRating: number | null;
  availability: string;
  sortBy: 'rating' | 'price-low' | 'price-high' | 'most-reviews' | 'newest';
}

export const UG_DEPARTMENTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business Administration',
  'Accounting',
  'Political Science',
  'Psychology',
  'English',
  'Law',
  'Engineering',
  'Medicine',
  'Pharmacy',
  'Nursing',
] as const;

export const TUTOR_SUBJECTS = [
  'Calculus',
  'Linear Algebra',
  'Statistics',
  'Programming (Python)',
  'Programming (Java)',
  'Programming (C++)',
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Database Systems',
  'Organic Chemistry',
  'Inorganic Chemistry',
  'Biochemistry',
  'Physics (Mechanics)',
  'Physics (Electromagnetism)',
  'Microeconomics',
  'Macroeconomics',
  'Financial Accounting',
  'Managerial Accounting',
  'Business Law',
  'Constitutional Law',
  'Research Methods',
  'Academic Writing',
  'Public Speaking',
] as const;

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
] as const;
