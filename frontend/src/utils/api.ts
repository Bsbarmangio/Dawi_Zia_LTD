import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login or refresh page
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Types
export interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  established_year: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface RawMaterial {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string;
  nutritional_info?: any;
  supplier: string;
  origin_country: string;
  quality_grade: 'A' | 'B' | 'C';
  status: 'available' | 'out_of_stock' | 'discontinued';
  created_at: string;
  updated_at: string;
}

export interface AnimalMedicine {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string;
  active_ingredients: string;
  dosage_instructions: string;
  target_animals: string[];
  manufacturer: string;
  expiry_date?: string;
  batch_number?: string;
  requires_prescription: boolean;
  status: 'available' | 'out_of_stock' | 'discontinued';
  created_at: string;
  updated_at: string;
}

export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  status?: 'new' | 'in_progress' | 'resolved';
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  sessionId: string;
  message: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// API Functions

// Companies
export const companiesApi = {
  getAll: () => api.get<ApiResponse<Company[]>>('/companies'),
  getById: (id: number) => api.get<ApiResponse<Company>>(`/companies/${id}`),
};

// Raw Materials
export const rawMaterialsApi = {
  getAll: (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get<ApiResponse<RawMaterial[]>>('/raw-materials', { params }),
  getCategories: () => api.get<ApiResponse<string[]>>('/raw-materials/categories'),
  getById: (id: number) => api.get<ApiResponse<RawMaterial>>(`/raw-materials/${id}`),
};

// Animal Medicines
export const animalMedicinesApi = {
  getAll: (params?: {
    category?: string;
    status?: string;
    search?: string;
    requires_prescription?: boolean;
    page?: number;
    limit?: number;
  }) => api.get<ApiResponse<AnimalMedicine[]>>('/animal-medicines', { params }),
  getCategories: () => api.get<ApiResponse<string[]>>('/animal-medicines/categories'),
  getById: (id: number) => api.get<ApiResponse<AnimalMedicine>>(`/animal-medicines/${id}`),
};

// Contact
export const contactApi = {
  submit: (inquiry: ContactInquiry) => api.post<ApiResponse<ContactInquiry>>('/contact', inquiry),
};

// Chatbot
export const chatbotApi = {
  chat: (message: string, sessionId?: string) => 
    api.post<ApiResponse<ChatMessage>>('/chatbot/chat', { message, sessionId }),
  getRecommendations: (query: string, category?: string) =>
    api.post<ApiResponse<any[]>>('/chatbot/recommend', { query, category }),
};

// Auth (for future use)
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: any }>>('/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<any>>('/auth/register', userData),
  getProfile: () => api.get<ApiResponse<{ user: any }>>('/auth/profile'),
  verify: () => api.get<ApiResponse<{ user: any }>>('/auth/verify'),
};