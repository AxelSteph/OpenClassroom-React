import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const initialState = {
  accounts: [],
  loading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",

  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch(
        "http://localhost:3001/api/v1/accounts",
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
            "Impossible de récupérer les comptes"
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

const accountsSlice = createSlice({
  name: "accounts",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchAccounts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.accounts = action.payload;
        }
      )

      .addCase(
        fetchAccounts.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default accountsSlice.reducer;