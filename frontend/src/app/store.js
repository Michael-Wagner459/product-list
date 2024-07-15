import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';
//setting up the store
const store = configureStore({
	reducer: {
		products: productsReducer,
	},
});

export default store;
