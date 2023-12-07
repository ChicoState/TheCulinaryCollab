import React, { useState } from 'react';

const RecipeSearchBarBrowse = ({ recipes, onView }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const handleInputChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);
		if (term.length > 0 || term.length === 0) {
			handleSearch(term);
		}
	};

	const handleSearch = (e) => {
		if (e.length <= 1) {
			setSearchResults([]);
			return;
		} else {
			const lowercasedTerm = searchTerm.toLowerCase();
			const filtered = recipes.filter((recipe) => {
				const recipeNameMatches = recipe.name && recipe.name.toLowerCase().includes(lowercasedTerm);
				const ingredientMatches = recipe.ingredients && recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase().includes(lowercasedTerm));
				const createdByMatches = recipe.createdBy && recipe.createdBy.username && recipe.createdBy.username.toLowerCase().includes(lowercasedTerm);
				return recipeNameMatches || ingredientMatches || createdByMatches;
			});
			setSearchResults(filtered);
		}
	};
	const getRecipeCreator = (recipe) => {
		return recipe.createdBy && recipe.createdBy.username
			? `Created by ${recipe.createdBy.username}`
			: "Public Recipe";
	};

	return (
		<div>
		<div className="search-bar-container">
		<input
		type="text"
		placeholder="Search for recipe"
		value={searchTerm}
		onChange={handleInputChange}
		className="search-bar"
		/>
		<button onClick={handleSearch} className="search-button">Search</button>
		</div>
		<ul className="search-results-list">
		{searchResults.map((recipe, index) => (
			<li key={index} className="search-result-item">
			{recipe.name}
			<button onClick={() => onView(recipe)} className="view-recipe-button">View</button>
			<span className="recipe-creator"> {getRecipeCreator(recipe)}</span> 
			</li>
		))}
		</ul>
		</div>
	);
};

export default RecipeSearchBarBrowse;

