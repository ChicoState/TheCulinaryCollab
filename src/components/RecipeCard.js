import React from 'react';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onClick }) => {
	return (
		<div className="recipe-card2" onClick={onClick}>
		<h3>{recipe.name}</h3>
		</div>
	);
};

export default RecipeCard;

