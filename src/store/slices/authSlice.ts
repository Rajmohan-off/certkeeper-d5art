import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  mobileNumber: string;
  state: string;
  country: string;
  dateOfBirth: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Dummy user data
const dummyUser: User = {
  id: '1',
  email: 'demo@example.com',
  role: 'seeker',
  name: 'John Doe',
  mobileNumber: '+1 234 567 8900',
  state: 'California',
  country: 'United States',
  dateOfBirth: '1990-05-15',
  createdAt: '2024-01-01T00:00:00.000Z',
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // Accept any credentials for demo
      state.user = { ...dummyUser, email: action.payload.email };
      state.loading = false;
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { loginUser, logoutUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
