import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  user: null,
  isLoggedIn: Boolean(localStorage.getItem("token")),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Identifiants invalides"
        );
      }

      return data.body.token;
    } catch {
      return rejectWithValue(
        "Impossible de contacter le serveur"
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",

  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch(
        "http://localhost:3001/api/v1/user/profile",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(
          data.message ||
            "Impossible de récupérer le profil"
        );
      }

      return data.body;
    } catch {
      return rejectWithValue(
        "Impossible de contacter le serveur"
      );
    }
  }
);

export const updateUserName = createAsyncThunk(
  "auth/updateUserName",

  async (userName, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch(
        "http://localhost:3001/api/v1/user/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userName }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Impossible de modifier le nom"
        );
      }

      return data.body;
    } catch {
      return rejectWithValue(
        "Impossible de contacter le serveur"
      );
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
      localStorage.removeItem("token");
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
        localStorage.setItem("token", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;