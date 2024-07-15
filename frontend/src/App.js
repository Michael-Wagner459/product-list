import React from 'react';
import { Provider } from 'react-redux';
import store from './app/store';
import SearchBar from './components/SearcBar';
import ProductsList from './components/ProductList';

const App = () => {
	return (
		<Provider store={store}>
			<div>
				<SearchBar />
				<ProductsList />
			</div>
		</Provider>
	);
};

export default App;
