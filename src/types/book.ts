export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  category: string;
  description: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  location: string;
  createdAt: Date;
  isNegotiable: boolean;
  isbn?: string;
  edition?: string;
  yearPublished?: number;
}

export interface BookFilter {
  search: string;
  category: string;
  condition: string;
  priceMin: number | null;
  priceMax: number | null;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
}

export interface Offer {
  id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  originalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  bookId?: string;
  bookTitle?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
  rating: number;
  totalSales: number;
  totalPurchases: number;
}

export const BOOK_CATEGORIES = [
  'Applied Science',
  'Commerce',
  'Law',
  'Humanities',
  'Information Technology',
  'Textbooks',
  'Science & Technology',
  'Business & Economics',
  'Arts & Humanities',
  'Children\'s Books',
  'Comics & Graphic Novels',
  'Biographies',
  'Self-Help',
  'Religion & Spirituality',
  'History',
  'Travel',
  'Cookbooks',
] as const;

export const BOOK_CONDITIONS = [
  { value: 'new', label: 'New', description: 'Never used, pristine condition' },
  { value: 'like-new', label: 'Like New', description: 'Minimal signs of use' },
  { value: 'good', label: 'Good', description: 'Some wear, fully functional' },
  { value: 'fair', label: 'Fair', description: 'Visible wear, still readable' },
  { value: 'poor', label: 'Poor', description: 'Heavy wear, may have damage' },
] as const;
