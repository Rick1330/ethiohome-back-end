import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    resources: {
      en: {
        translation: {
          // Navigation
          home: 'Home',
          properties: 'Properties',
          aboutUs: 'About Us',
          contactUs: 'Contact Us',
          login: 'Login',
          signup: 'Signup',
          logout: 'Logout',
          myProfile: 'My Profile',
          myListings: 'My Listings',
          myInterests: 'My Interests',
          
          // Search & Filters
          search: 'Search',
          location: 'Location',
          priceRange: 'Price Range',
          propertyType: 'Property Type',
          bedrooms: 'Bedrooms',
          bathrooms: 'Bathrooms',
          area: 'Area (sqm)',
          forSale: 'For Sale',
          forRent: 'For Rent',
          
          // Property Details
          description: 'Description',
          features: 'Features',
          amenities: 'Amenities',
          contactSeller: 'Contact Seller',
          expressInterest: 'Express Interest',
          
          // Forms
          submit: 'Submit',
          cancel: 'Cancel',
          emailAddress: 'Email Address',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          phoneNumber: 'Phone Number',
          fullName: 'Full Name',
          sendMessage: 'Send Message',
          
          // Reviews
          reviews: 'Reviews',
          submitReview: 'Submit Review',
          rating: 'Rating',
          yourReview: 'Your Review',
          
          // Status
          verified: 'Verified',
          unverified: 'Unverified',
          
          // Admin
          adminDashboard: 'Admin Dashboard',
          userManagement: 'User Management',
          propertyVerification: 'Property Verification',
          transactions: 'Transactions',
          analytics: 'Analytics',
          
          // Settings
          settings: 'Settings',
          changePassword: 'Change Password',
          deactivateAccount: 'Deactivate Account',
          
          // Error Messages
          tooManyLoginAttempts: 'Too many login attempts. Please try again later.',
          incorrectEmailOrPassword: 'Incorrect email or password.',
          pleaseProvideEmailAndPassword: 'Please provide email and password!',
          userAlreadyExists: 'User already exists.',
          pleaseVerifyEmail: 'Please verify your email.',
          linkAlreadyUsed: 'Link already used.',
          propertyNotFound: 'Property not found.',
          noActiveSubscription: 'No active subscription found.',
          invalidFileType: 'Invalid file type. Only images and videos are allowed.',
          messageTooLong: 'Message cannot be more than 1000 characters.',
          reviewCannotBeEmpty: 'Review can not be empty!',
          reviewLength: 'Review must be between 10 and 1000 characters.',
          ratingRange: 'Rating must be between 1.0 and 5.0.',
          
          // Property Types
          house: 'House',
          apartment: 'Apartment',
          villa: 'Villa',
          land: 'Land',
          commercial: 'Commercial',
          
          // Currency
          etb: 'ETB',
          usd: 'USD',
          
          // Common Actions
          edit: 'Edit',
          delete: 'Delete',
          view: 'View',
          save: 'Save',
          loading: 'Loading...',
          noResults: 'No results found',
          
          // Dashboard
          dashboard: 'Dashboard',
          welcome: 'Welcome',
          totalProperties: 'Total Properties',
          totalUsers: 'Total Users',
          totalTransactions: 'Total Transactions',
          recentActivity: 'Recent Activity',
        }
      },
      am: {
        translation: {
          // Navigation (Amharic translations would go here)
          home: 'ቤት',
          properties: 'ንብረቶች',
          aboutUs: 'ስለ እኛ',
          contactUs: 'አግኙን',
          login: 'ግባ',
          signup: 'ተመዝገብ',
          logout: 'ውጣ',
          myProfile: 'የእኔ መገለጫ',
          myListings: 'የእኔ ዝርዝሮች',
          myInterests: 'የእኔ ፍላጎቶች',
          
          // Search & Filters
          search: 'ፈልግ',
          location: 'አካባቢ',
          priceRange: 'የዋጋ ክልል',
          propertyType: 'የንብረት አይነት',
          bedrooms: 'መኝታ ቤቶች',
          bathrooms: 'መታጠቢያ ቤቶች',
          area: 'ስፋት (ካሬ ሜትር)',
          forSale: 'ለሽያጭ',
          forRent: 'ለኪራይ',
          
          // Property Details
          description: 'መግለጫ',
          features: 'ባህሪያት',
          amenities: 'አገልግሎቶች',
          contactSeller: 'ሻጩን አግኝ',
          expressInterest: 'ፍላጎት ግለጽ',
          
          // Forms
          submit: 'አስገባ',
          cancel: 'ሰርዝ',
          emailAddress: 'የኢሜይል አድራሻ',
          password: 'የይለፍ ቃል',
          confirmPassword: 'የይለፍ ቃል አረጋግጥ',
          phoneNumber: 'ስልክ ቁጥር',
          fullName: 'ሙሉ ስም',
          sendMessage: 'መልእክት ላክ',
          
          // Reviews
          reviews: 'ግምገማዎች',
          submitReview: 'ግምገማ አስገባ',
          rating: 'ደረጃ',
          yourReview: 'የእርስዎ ግምገማ',
          
          // Status
          verified: 'የተረጋገጠ',
          unverified: 'ያልተረጋገጠ',
          
          // Admin
          adminDashboard: 'የአስተዳዳሪ ዳሽቦርድ',
          userManagement: 'የተጠቃሚ አስተዳደር',
          propertyVerification: 'የንብረት ማረጋገጫ',
          transactions: 'ግብይቶች',
          analytics: 'ትንታኔዎች',
          
          // Settings
          settings: 'ቅንብሮች',
          changePassword: 'የይለፍ ቃል ቀይር',
          deactivateAccount: 'መለያ አቦዝ',
          
          // Property Types
          house: 'ቤት',
          apartment: 'አፓርትመንት',
          villa: 'ቪላ',
          land: 'መሬት',
          commercial: 'ንግድ',
          
          // Currency
          etb: 'ብር',
          usd: 'ዶላር',
          
          // Common Actions
          edit: 'አርም',
          delete: 'ሰርዝ',
          view: 'ተመልከት',
          save: 'አስቀምጥ',
          loading: 'በመጫን ላይ...',
          noResults: 'ምንም ውጤት አልተገኘም',
          
          // Dashboard
          dashboard: 'ዳሽቦርድ',
          welcome: 'እንኳን ደህና መጡ',
          totalProperties: 'ጠቅላላ ንብረቶች',
          totalUsers: 'ጠቅላላ ተጠቃሚዎች',
          totalTransactions: 'ጠቅላላ ግብይቶች',
          recentActivity: 'የቅርብ ጊዜ እንቅስቃሴ',
        }
      }
    }
  });

export default i18n;

