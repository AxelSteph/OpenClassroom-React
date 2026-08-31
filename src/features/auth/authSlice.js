import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Erreur lors de la connexion"
        );
      }

      return data.body.token;
    } catch (error) {
      return rejectWithValue("Impossible de contacter le serveur");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;