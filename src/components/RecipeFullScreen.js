import React from 'react';
import './RecipeFullScreen.css';
import RatingStars from './RatingStars';
import './ViewRecipeModal.css';
const RecipeFullScreen = ({ recipe, onClose }) => {

	return (
		<div className="recipe-full-screen">
		<button className="close-button" onClick={onClose}>
		<span>X</span>
		</button>
		<h1 className="recipe-name">{recipe.name}</h1>
		<div className="recipe-details">
		{recipe.timing && <p><strong>Timing:</strong> {recipe.timing}</p>}
		{recipe.taste && <p><strong>Taste:</strong> {recipe.taste}</p>}
		{recipe.ingredients && (
			<div>
			<p><strong>Ingredients:</strong></p>
			<ul>
			{recipe.ingredients.map((ingredient, index) => (
				<li key={index}>
				{ingredient.ingredient} ({ingredient.amount} {ingredient.unit})
				</li>
			))}
			</ul>
			</div>
		)}
		{recipe.preparation && <p><strong>Preparation:</strong> {recipe.preparation}</p>}
		{recipe.cost && <p><strong>Cost:</strong> {recipe.cost}</p>}
		{recipe.timeToMake && <p><strong>Time to Make:</strong> {recipe.timeToMake}</p>}
		{recipe.rating && (
			<div>
			<p><strong>Rating:</strong> {recipe.rating}</p>
			{/* You can format the rating here as needed */}
			</div>
		)}
		</div>
		</div>
	);
};

export default RecipeFullScreen;
