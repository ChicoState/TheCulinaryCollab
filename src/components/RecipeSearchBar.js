import React, { useState } from 'react';
import './RecipeSearchBar.css';
const RecipeSearchBar = ({personalRecipes, savedRecipes, publicRecipes, onView }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const handleInputChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);
		console.log(e);
		handleSearch(term);
	};
	const handleSearch = (e) => {
		if (e.length <= 1){
			setSearchResults([]);
			return;
		}
		else {
			const lowercasedTerm = searchTerm.toLowerCase();
			const allRecipes = [...personalRecipes, ...savedRecipes, ...publicRecipes];
			const filtered = allRecipes.filter(recipe => {
				const recipeName = recipe.name ? recipe.name.toLowerCase() : '';
				const ingredientsMatch = recipe.ingredients ? recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(lowercasedTerm)) : false;
				const isNotInitial = recipe.id !== 'initial';
				return (recipeName.includes(lowercasedTerm) || ingredientsMatch) && isNotInitial;
			});
			console.log(e);
			setSearchResults(filtered);
		}
	};
	const isPersonalRecipe = (recipe) => {
		return personalRecipes.some(pr => pr.id === recipe.id);
	}
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
			<button onClick={() => onView(recipe)} className="view-recipe-button">
			View
			</button>
			{isPersonalRecipe(recipe) ? 
				<span className="recipe-creator"> Created by you</span> :
				(recipe.createdBy && recipe.createdBy.username && 
					<span className="recipe-creator"> Created by {recipe.createdBy.username}</span>)
			}
			</li>
		))}
		</ul>
		</div>
	);
};

export default RecipeSearchBar;
