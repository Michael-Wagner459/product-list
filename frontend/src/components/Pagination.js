import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage } from '../slices/productsSlice';

const Pagination = () => {
	const dispatch = useDispatch();
	const { currentPage, totalPages } = useSelector((state) => state.products);
	//retrieves information if the user clicks on a page number. changes the page state but keeps the other queries as they were
	const handlePageChange = (page) => {
		dispatch(setPage(page));
		dispatch(fetchProducts({ page }));
	};
	//retrieves information if the user hits the next page button. changes the page by plus 1 and keeps other queries as they were
	const handleNextPage = () => {
		if (currentPage < totalPages) {
			handlePageChange(currentPage + 1);
		}
	};
	//retrieves information if the user hits the previous page button. Changes the page by minus 1 and keeps other queries as they were
	const handlePreviousPage = () => {
		if (currentPage > 1) {
			handlePageChange(currentPage - 1);
		}
	};
	//ui for pagination component
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
