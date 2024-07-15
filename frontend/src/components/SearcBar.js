import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPage, setSearchCategorySort } from '../slices/productsSlice';
import '../styles.css';

const SearchBar = () => {
	const dispatch = useDispatch();
	//sets up initial state for queries
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [sort, setSort] = useState('');
	//adjusts state upon button click that causes the api to retrieve information
	const handleSearchClick = () => {
		dispatch(setPage(1));
		dispatch(setSearchCategorySort({ search, category, sort }));
	};
	//ui for search bar
	return (
		<div className='search-bar'>
			<input
				type='text'
				placeholder='Search'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='search-input'
			/>
			<select
				value={category}
				onChange={(e) => setCategory(e.target.value)}
				className='search-select'
			>
				<option value=''>All Categories</option>
				<option value='Movies'>Movies</option>
				<option value='Music'>Music</option>
			</select>
			<select
				value={sort}
				onChange={(e) => setSort(e.target.value)}
				className='search-select'
			>
				<option value=''>Sort By</option>
				<option value='highest'>Price: High to Low</option>
				<option value='lowest'>Price: Low to High</option>
			</select>
			<button onClick={handleSearchClick} className='search-button'>
				Search
			</button>
		</div>
	);
};

export default SearchBar;
