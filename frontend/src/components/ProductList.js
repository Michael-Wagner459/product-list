import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage } from '../slices/productsSlice';

const ProductsList = () => {
	const dispatch = useDispatch();
	const {
		items,
		status,
		error,
		currentPage,
		totalPages,
		currentSearch,
		currentCategory,
		currentSort,
	} = useSelector((state) => state.products);

	useEffect(() => {
		dispatch(
			fetchProducts({
				search: currentSearch,
				category: currentCategory,
				sort: currentSort,
				page: currentPage,
			})
		);
	}, [dispatch, currentSearch, currentCategory, currentSort, currentPage]);

	const handlePageClick = (page) => {
		dispatch(setPage(page));
	};

	if (status === 'loading') return <div>Loading...</div>;
	if (status === 'failed' && error === 'No products found')
		return (
			<div>
				<h1>No products were found</h1>
			</div>
		);
	if (status === 'failed') return <div>Error: {error}</div>;

	return (
		<div>
			<div className='product-grid'>
				{items.map((product) => (
					<div key={product.id} className='product-item'>
						<div className='product-header'>
							<span className='product-category'>
								Category: {product.category}
							</span>
							<span className='product-price'>
								${product.price}
							</span>
						</div>
						<div className='product-image'>
							<img
								src='https://www.carverartsandscience.org/sites/main/files/main-images/camera_lense_0.jpeg'
								alt={product.name}
							/>
						</div>
						<h3 className='product-name'>{product.name}</h3>
					</div>
				))}
			</div>
			<div className='pagination'>
				{[...Array(totalPages).keys()].map((page) => (
					<button
						key={page + 1}
						onClick={() => handlePageClick(page + 1)}
						disabled={currentPage === page + 1}
					>
						{page + 1}
					</button>
				))}
			</div>
		</div>
	);
};

export default ProductsList;
