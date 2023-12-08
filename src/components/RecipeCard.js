import React from 'react';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
	return (
		<div className="recipe-card" onClick={() => {}}>
		<h3>{recipe.name}</h3>
		</div>
	);
};

export default RecipeCard;

