import React from 'react';
import { useDrag } from 'react-dnd';

const RecipeItem = ({ recipe, type, onOpenModal }) => {
	const [, drag] = useDrag(() => ({
		type: 'recipe',
		item: { id: recipe.id, type, recipe },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	const renderRecipeOrigin = () => {	
		if (type === 'public' || !recipe.createdBy) {
			return <p className="recipe-origin">Public Recipe</p>;
		} else {
			return <p className="recipe-origin">Created by {recipe.createdBy.username}</p>;
		}
	};

	return (
		<div ref={drag} className="recipe-item" onClick={() => onOpenModal(recipe)}>
		<h3>{recipe.name}</h3>
		{renderRecipeOrigin()}
		</div>
	);
};

export default RecipeItem;

