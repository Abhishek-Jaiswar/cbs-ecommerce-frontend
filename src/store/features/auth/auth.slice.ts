import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/services/api/auth/auth-api.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      if (typeof window !== "undefined") {
        try {
          const minimalUser = {
            id: action.payload.id,
            name: action.payload.name,
            email: action.payload.email,
            role: action.payload.role,
          };
          localStorage.setItem("user", JSON.stringify(minimalUser));
        } catch (e) {
          console.error("Error saving user to localStorage", e);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("user");
        } catch (e) {
          console.error("Error removing user from localStorage", e);
        }
      }
    },
  },
});

export const { setCredentials, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
