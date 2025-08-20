import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+2519\d{8}$/, 'Please enter a valid Ethiopian phone number (e.g., +2519XXXXXXXX)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().regex(/^\+2519\d{8}$/, 'Please enter a valid Ethiopian phone number').optional(),
});

export const changePasswordSchema = z.object({
  password: z.string().min(1, 'Current password is required'),
  currentPassword: z.string().min(8, 'New password must be at least 8 characters'),
  passwordConfirm: z.string(),
}).refine((data) => data.currentPassword === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});

// Property validation schemas
export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters'),
  price: z.number().positive('Price must be a positive number'),
  currency: z.enum(['ETB', 'USD']),
  location: z.string().min(3, 'Location must be at least 3 characters').max(100, 'Location must be less than 100 characters'),
  type: z.enum(['house', 'apartment', 'villa', 'land', 'commercial']),
  status: z.enum(['for-sale', 'for-rent']),
  features: z.object({
    bedrooms: z.number().positive().optional(),
    bathrooms: z.number().positive().optional(),
    area: z.number().positive().optional(),
    parking: z.boolean().optional(),
    furnished: z.boolean().optional(),
    yearBuilt: z.number().min(1900).max(new Date().getFullYear()).optional(),
  }),
});

export const propertyFiltersSchema = z.object({
  city: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  propertyType: z.enum(['house', 'apartment', 'villa', 'land', 'commercial']).optional(),
  bedrooms: z.number().positive().optional(),
  bathrooms: z.number().positive().optional(),
  minArea: z.number().positive().optional(),
  maxArea: z.number().positive().optional(),
  furnished: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  sort: z.string().optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().max(100).optional(),
});

// Interest form validation schema
export const interestFormSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message cannot be more than 1000 characters'),
  contactInfo: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters'),
    phone: z.string().regex(/^\+2519\d{8}$/, 'Please enter a valid Ethiopian phone number'),
    email: z.string().email('Please enter a valid email address'),
  }),
});

// Review validation schema
export const reviewSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  review: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
});

// User management validation schemas (Admin)
export const createUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+2519\d{8}$/, 'Please enter a valid Ethiopian phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string(),
  role: z.enum(['admin', 'buyer', 'seller', 'agent', 'employee']).optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});

export const updateUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().regex(/^\+2519\d{8}$/, 'Please enter a valid Ethiopian phone number').optional(),
  role: z.enum(['admin', 'buyer', 'seller', 'agent', 'employee']).optional(),
  active: z.boolean().optional(),
});

// File validation
export const imageFileSchema = z.object({
  files: z.instanceof(FileList).refine((files) => {
    if (!files || files.length === 0) return false;
    return Array.from(files).every(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
  }, 'Please upload valid image files (JPEG, PNG) under 10MB each'),
}).refine((data) => {
  return data.files && data.files.length <= 6;
}, 'You can upload a maximum of 6 images');

// Export type inference helpers
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;
export type PropertyFiltersFormData = z.infer<typeof propertyFiltersSchema>;
export type InterestFormData = z.infer<typeof interestFormSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

