import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/ApiClient";

/* ================= FETCH CART ================= */
export const fetchCartItems = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/api/v1/cart/get");
      return Array.isArray(res.data.data.items)
        ? res.data.data.items
        : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);

/* ================= ADD ITEM ================= */
export const addItemToCart = createAsyncThunk(
  "cart/add",
  async (
    { productId, variantId, brandId, categoryId, quantity = 1 },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiClient.post(
        `/api/v1/cart/add/${productId}`,
        {
          variantId,
          brandId,
          categoryId,
          quantity,
        }
      );
      return res.data.data.cartResponse;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Add failed"
      );
    }
  }
);

/* ================= UPDATE QTY ================= */
export const updateItemQuantity = createAsyncThunk(
  "cart/updateQty",
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(
        `/api/v1/cart/update-qty/${variantId}`,
        { quantity }
      );
      return res.data.data.item;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

/* ================= REMOVE ITEM ================= */
export const removeItemFromCart = createAsyncThunk(
  "cart/remove",
  async (variantId, { rejectWithValue }) => {
    try {
      await apiClient.delete(
        `/api/v1/cart/remove/${variantId}`
      );
      return variantId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Remove failed"
      );
    }
  }
);

/* ================= CLEAR CART ================= */
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete("/api/v1/cart/clear");
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Clear failed"
      );
    }
  }
);

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle", // ONLY for fetch
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ================= FETCH CART ================= */
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ================= ADD ITEM ================= */
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      /* ================= UPDATE QTY ================= */
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) =>
            item.variant.id === action.payload.variant.id
        );
        if (index !== -1) {
          state.items[index].quantity =
            action.payload.quantity;
        }
      })

      /* ================= REMOVE ITEM ================= */
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) =>
            item.variant.id !== action.payload
        );
      })

      /* ================= CLEAR CART ================= */
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;