import React, { useState } from 'react';
import './RecipeStack2.css';

const RecipeStack2 = ({ recipes }) => {
	const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

	const handlePrevRecipe = () => {
		setCurrentRecipeIndex((prevIndex) => (prevIndex === 0 ? recipes.length - 1 : prevIndex - 1));
	};

	const handleNextRecipe = () => {
		setCurrentRecipeIndex((prevIndex) => (prevIndex === recipes.length - 1 ? 0 : prevIndex + 1));
	};

	return (
		<div className="recipe-container">
		<button className="nav-button nav-button-left" onClick={handlePrevRecipe}>
		&lt;
		</button>

		<div className="recipe-card">
		<h2>{recipes[currentRecipeIndex]?.name || 'No Recipe Available'}</h2>
		<p>Timing: {recipes[currentRecipeIndex]?.timing || 'Not specified'}</p>
		<p>Taste: {recipes[currentRecipeIndex]?.taste || 'Not specified'}</p>
		<h3>Ingredients:</h3>
		<ul>
		{recipes[currentRecipeIndex]?.ingredients.map((ingredient, i) => (
			<li key={i}>
			{ingredient.ingredient}: {ingredient.amount} {ingredient.unit}
			</li>
		)) || <li>No ingredients</li>}
		</ul>
		<div className="instructions-box">
		<h3>Preparation:</h3>
		<p>{recipes[currentRecipeIndex]?.preparation || 'No instructions available.'}</p>
		</div>
		</div>

		<button className="nav-button nav-button-right" onClick={handleNextRecipe}>
		&gt;
		</button>
		</div>
	);
};

export default RecipeStack2;

