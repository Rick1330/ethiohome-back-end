// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  role: 'admin' | 'buyer' | 'seller' | 'agent' | 'employee';
  isVerified: boolean;
  active: boolean;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
}

// Property types
export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  parking?: boolean;
  furnished?: boolean;
  yearBuilt?: number;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: 'ETB' | 'USD';
  priceDiscount?: number;
  location: string;
  type: 'house' | 'apartment' | 'villa' | 'land' | 'commercial';
  status: 'for-sale' | 'for-rent';
  features: PropertyFeatures;
  images: string[];
  owner: {
    _id: string;
    name: string;
  };
  isVerified: boolean;
  verificationDate?: string;
  verifiedBy?: string;
  createdAt: string;
  sold: boolean;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  currency: 'ETB' | 'USD';
  location: string;
  type: 'house' | 'apartment' | 'villa' | 'land' | 'commercial';
  status: 'for-sale' | 'for-rent';
  features: PropertyFeatures;
  images: FileList | null;
}

export interface PropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnished?: boolean;
  isVerified?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

// Interest Form types
export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface InterestForm {
  _id: string;
  buyerId: string | User;
  propertyId: string | Property;
  contactInfo: ContactInfo;
  message: string;
  status: 'pending' | 'contacted' | 'schedule' | 'visited' | 'rejected';
  visitScheduled: boolean;
  visitDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterestFormData {
  propertyId: string;
  message: string;
  contactInfo: ContactInfo;
}

// Review types
export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  buyer: {
    _id: string;
    name: string;
    photo: string;
  };
  property?: string;
}

export interface ReviewFormData {
  propertyId: string;
  rating: number;
  review: string;
}

// Selling/Transaction types
export interface Transaction {
  _id: string;
  property: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    name: string;
  };
  amount: number;
  currency: string;
  chapa_charge?: number;
  tx_ref: string;
  payment_method: string;
  createdAt: string;
  paid: boolean;
}

export interface PaymentData {
  propertyId: string;
  amount: number;
  currency: string;
  return_url: string;
  tx_ref: string;
}

// Property Statistics
export interface PropertyStats {
  _id: string;
  numProperty: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface PropertyStatsResponse {
  status: string;
  data: {
    statsOfVerified: PropertyStats[];
    statsOfUnverified: PropertyStats[];
  };
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: {
    data: T;
  } | T;
  results?: number;
}

export interface ApiError {
  status: 'fail' | 'error';
  message: string;
}

// Pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'property_verified' | 'new_interest' | 'interest_update' | 'payment_confirmed' | 'new_review' | 'system_alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

