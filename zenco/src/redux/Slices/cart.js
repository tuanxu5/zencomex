import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : { items: [], totalQuantity: 0, totalPrice: 0 };
    }
    return { items: [], totalQuantity: 0, totalPrice: 0 }; // Default state when SSR
};

const saveCartToLocalStorage = (cart) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
};

const initialState = loadCartFromLocalStorage();

// Thunk để lưu giỏ hàng lên server
export const saveCartToServer = createAsyncThunk("cart/saveCartToServer", async (cart, thunkAPI) => {
    try {
        const response = await fetch("/api/cart", {
            method: "POST",
            body: JSON.stringify(cart),
            headers: { "Content-Type": "application/json" },
        });
        return await response.json();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
            } else {
                state.items.push({ ...item, quantity: item.quantity || 1, checked: true });
            }
            state.totalQuantity += item.quantity || 1;
            state.totalPrice += item.price * (item.quantity || 1);
            saveCartToLocalStorage(state);
        },
        changeQuantityToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                if (item.type === "increase") {
                    existingItem.quantity += 1;
                    state.totalQuantity += 1;
                    state.totalPrice += item.price * 1;
                }
                if (item.type === "decrease") {
                    existingItem.quantity -= 1;
                    state.totalQuantity -= 1;
                    state.totalPrice -= item.price * 1;
                }
                if (item.type === "change") {
                    const quantityEnd = state.totalQuantity - existingItem.quantity + item.quantity;
                    const totalEnd =
                        state.totalPrice - existingItem.price * existingItem.quantity + item.quantity * item.price;
                    existingItem.quantity = item.quantity;
                    state.totalQuantity = quantityEnd;
                    state.totalPrice = totalEnd;
                }
            }
            saveCartToLocalStorage(state);
        },
        changeSelectedToCart: (state, action) => {
            const item = action.payload;
            if (item.type === "All") {
                state.items = item.cart;
            } else {
                const existingItem = state.items.find((i) => i.id === item.cart.id);
                existingItem.checked = !existingItem.checked;
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const itemIndex = state.items.findIndex((i) => i.id === id);
            if (itemIndex !== -1) {
                const item = state.items[itemIndex];
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;
                state.items.splice(itemIndex, 1);
            }
            saveCartToLocalStorage(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            saveCartToLocalStorage(state);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveCartToServer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveCartToServer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(saveCartToServer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addToCart, removeFromCart, clearCart, changeQuantityToCart, changeSelectedToCart } = cartSlice.actions;

export default cartSlice.reducer;
