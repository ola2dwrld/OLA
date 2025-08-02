import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  stock: number;
  sku?: string;
  specifications?: { [key: string]: string };
  tags: string[];
  isActive: boolean;
  rating: {
    average: number;
    count: number;
  };
  reviews: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  vendor?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  filters: ProductFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  categories: [],
  filters: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductFilters & { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_BASE_URL}/products?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories/list`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const addProductReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, review }: { productId: string; review: { rating: number; comment: string } }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products/${productId}/reviews`, review);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: state.pagination.limit,
        };
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      
      // Add review
      .addCase(addProductReview.fulfilled, (state, action) => {
        if (state.currentProduct) {
          state.currentProduct = action.payload;
        }
        // Update the product in the products array if it exists
        const productIndex = state.products.findIndex(p => p._id === action.payload._id);
        if (productIndex !== -1) {
          state.products[productIndex] = action.payload;
        }
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  clearCurrentProduct,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;