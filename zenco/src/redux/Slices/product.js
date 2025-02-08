// redux/Slices/productSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCategories, fetchCategories, fetchChildCategories, fetchProducts } from "../thunks/productThunks";

const initialState = {
    category: {
        categoryList: [],
        categoryCount: 0,
    },
    allCategory: [],
    childCategory: {
        childCategoryList: [],
        childCategoryCount: 0,
    },

    product: {
        productList: [],
        productCount: 0,
    },
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Categories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.category.categoryList = action.payload.DT;
                state.category.categoryCount = action.payload.total;
                state.loading = false;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Child Categories
        builder
            .addCase(fetchChildCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChildCategories.fulfilled, (state, action) => {
                state.childCategory.childCategoryList = action.payload.DT;
                state.childCategory.childCategoryCount = action.payload.total;
                state.loading = false;
            })
            .addCase(fetchChildCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.product.productList = action.payload.DT;
                state.product.productCount = action.payload.total;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch All Categories
        builder
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.allCategory = action.payload.DT;
                state.loading = false;
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;
