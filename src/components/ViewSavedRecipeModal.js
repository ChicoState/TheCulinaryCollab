import React from 'react';
//import './ViewSavedRecipeModal.css';

const ViewSavedRecipeModal = ({ isOpen, onClose, recipe, onRemove }) => {
    if (!recipe) return null;
	
	const handleClick = () => {
		onRemove();
		onClose();
	};
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2>{recipe.name}</h2>
                <p><strong>Timing:</strong> {recipe.timing}</p>
                <p><strong>Taste:</strong> {recipe.taste}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.ingredient} ({ingredient.amount} {ingredient.unit})
                        </li>
                    ))}
                </ul>
                <p><strong>Preparation:</strong> {recipe.preparation}</p>
                <div className="modal-buttons">
                    <button onClick={handleClick}>Remove Recipe</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewSavedRecipeModal;

