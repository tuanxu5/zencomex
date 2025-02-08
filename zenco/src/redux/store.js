// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import { rootPersistConfig, rootReducer } from "./rootReducer";

// Persisted reducer configuration
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// Store configuration
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(thunk), // Ensure `redux-thunk` is included
});

const persistor = persistStore(store);

export { store, persistor };
