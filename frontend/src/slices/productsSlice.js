import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchProducts = createAsyncThunk(
	'products/fetchProducts',
	async ({ search, category, sort, page = 1 }, { rejectWithValue }) => {
		try {
			let query = `page=${page}&`;

			if (search) query += `query=${search}&`;
			if (category) query += `category=${category}&`;
			if (sort) query += `price=${sort}&`;

			const response = await axios.get(`/products?${query}`);
			return response.data;
		} catch (error) {
			if (error.response && error.response.status === 404) {
				return rejectWithValue('No products found');
			}
			return rejectWithValue(error.message);
		}
	}
);

const productsSlice = createSlice({
	name: 'products',
	initialState: {
		items: [],
		status: 'idle',
		error: null,
		currentPage: 1,
		totalPages: 1,
		currentSearch: '',
		currentCategory: '',
		currentSort: '',
	},
	reducers: {
		setPage: (state, action) => {
			state.currentPage = action.payload;
		},
		setSearchCategorySort: (state, action) => {
			state.currentSearch = action.payload.search;
			state.currentCategory = action.payload.category;
			state.currentSort = action.payload.sort;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.items = action.payload.products;
				state.totalPages = action.payload.totalPages;
				state.currentPage = action.payload.currentPage;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export const { setPage, setSearchCategorySort } = productsSlice.actions;
export default productsSlice.reducer;
