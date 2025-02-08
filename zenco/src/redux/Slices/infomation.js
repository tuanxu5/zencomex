import { createSlice } from "@reduxjs/toolkit";
import { fetchInformation } from "../thunks/informationThunk";
const initialState = {
    overviewInfo: {},
    loading: false,
    error: null,
};

const infomationSlice = createSlice({
    name: "information",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Categories
        builder
            .addCase(fetchInformation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInformation.fulfilled, (state, action) => {
                state.overviewInfo = action.payload.DT;
                state.loading = false;
            })
            .addCase(fetchInformation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default infomationSlice.reducer;
