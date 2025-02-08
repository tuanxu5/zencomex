// redux/Slices/productThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
// Đảm bảo bạn đã cấu hình axios đúng

export const fetchCategories = createAsyncThunk(
    "product/fetchCategories",
    async ({ page, rowsPerPage, searchCategoryByName }, thunkAPI) => {
        try {
            const response = await axiosInstance.get(
                `/product/category?page=${page}&pageSize=${rowsPerPage}&name=${searchCategoryByName}`
            );
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const fetchChildCategories = createAsyncThunk(
    "product/fetchChildCategories",
    async ({ page, rowsPerPage, searchChildCategoryByName }, thunkAPI) => {
        try {
            const response = await axiosInstance.get(
                `/product/child-category?page=${page}&pageSize=${rowsPerPage}&name=${searchChildCategoryByName}`
            );
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async (
        { page, rowsPerPage, searchProductByName, filterProductByCategory, filterProductByChildCategory },
        thunkAPI
    ) => {
        try {
            const response = await axiosInstance.get(
                `/admin/product/list?page=${page}&pageSize=${rowsPerPage}&name=${searchProductByName}&id_list=${filterProductByCategory}&id_cat=${filterProductByChildCategory}`
            );
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const fetchAllCategories = createAsyncThunk("product/fetchAllCategories", async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get("/product/category");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
        return thunkAPI.rejectWithValue(errorMessage);
    }
});
