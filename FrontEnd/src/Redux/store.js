import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authenticationDetailsReducer from "./authenticationDetailsSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from 'redux'; // Added to combine multiple reducers

// Persist configuration
const persistConfig = {
  key: "root", // Key for the persisted state in localStorage
  storage, // Use localStorage as the storage engine
  whitelist: ['authenticationDetails'] // Specify which reducers to persist
};

// Combine your reducers
const rootReducer = combineReducers({
  authenticationDetails: authenticationDetailsReducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions in serializable check
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create a persistor object to persist the store
export const persistor = persistStore(store);