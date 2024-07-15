import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage } from '../slices/productsSlice';

const Pagination = () => {
	const dispatch = useDispatch();
	const { currentPage, totalPages } = useSelector((state) => state.products);

	const handlePageChange = (page) => {
		dispatch(setPage(page));
		dispatch(fetchProducts({ page }));
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			handlePageChange(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			handlePageChange(currentPage - 1);
		}
	};

	return (
		<div className='pagination'>
			<button onClick={handlePreviousPage} disabled={currentPage === 1}>
				Previous
			</button>
			{[...Array(totalPages)].map((_, index) => (
				<button
					key={index}
					onClick={() => handlePageChange(index + 1)}
					className={currentPage === index + 1 ? 'active' : ''}
				>
					{index + 1}
				</button>
			))}
			<button
				onClick={handleNextPage}
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
