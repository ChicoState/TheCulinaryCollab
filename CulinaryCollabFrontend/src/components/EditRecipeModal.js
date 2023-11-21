import React, { useState, useEffect } from 'react';
import './AddRecipeModal.css';

const EditRecipeModal = ({ isOpen, onClose, updateRecipe, recipe}) => {
	const [name, setName] = useState('');
	const [timing, setTiming] = useState('');
	const [taste, setTaste] = useState('');
	const [preparation, setPreparation] = useState('');
	const [ingredients, setIngredients] = useState([{ ingredient: '', amount: '', unit: '' }]);
	const [visibility, setVisibility] = useState('private');

	const handleAddIngredient = () => {
		setIngredients([...ingredients, { ingredient: '', amount: '', unit: '' }]);
	};

const handleIngredientChange = (index, field, value) => {
    const newIngredients = ingredients.map((ingredient, i) => {
        if (i === index) {
            return { ...ingredient, [field]: value };
        }
        return ingredient;
    });
    setIngredients(newIngredients);
};


	const handleRemoveIngredient = (index) => {
		const updatedIngredients = [...ingredients];
		updatedIngredients.splice(index, 1);
		setIngredients(updatedIngredients);
	};

const handleSubmit = async (e) => {
	console.log("FFFFFFFFFF");
    e.preventDefault();
    const updatedRecipeData = {
        name,
        timing,
        taste,
        ingredients: ingredients.filter(ing => ing.ingredient !== ''),
        preparation,
        visibility,
    };
    await updateRecipe(updatedRecipeData);
		setName('');
		setTiming('');
		setTaste('');
		setPreparation('');
		setIngredients([{ ingredient: '', amount: '', unit: '' }]);
		setVisibility('private');
		console.log("1111111111");
		onClose();
	};
useEffect(() => {
    if (recipe) {
        setName(recipe.name);
        setTiming(recipe.timing);
        setTaste(recipe.taste);
        setPreparation(recipe.preparation);
        setIngredients(recipe.ingredients || []);
        setVisibility(recipe.visibility || 'private');
    }
}, [recipe]);



	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
		
		<div className="modal-content">
		<form onSubmit={handleSubmit}>
		<label>Name</label>
		<input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

		<label>Timing</label>
		<input type="text" value={timing} onChange={(e) => setTiming(e.target.value)} required />

		<label>Taste</label>
		<input type="text" value={taste} onChange={(e) => setTaste(e.target.value)} required />

		<label>Ingredients</label>
		{ingredients.map((ingredient, index) => (
			<div key={index} className="ingredient-input">
			<div className="ingredient-row">
			<input
			type="text"
			placeholder="Ingredient"
			value={ingredient.ingredient}
			onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
			/>
			<input
			type="text"
			placeholder="Amount"
			value={ingredient.amount}
			onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
			/>
			<input
			type="text"
			placeholder="Unit"
			value={ingredient.unit}
			onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
			/>
			</div>
			<button type="button" onClick={() => handleRemoveIngredient(index)}>
			Remove
			</button>
			</div>
		))}
		<button type="button" onClick={handleAddIngredient}>
		Add Ingredient
		</button>

		<label>Preparation</label>
		<textarea rows="4" value={preparation} onChange={(e) => setPreparation(e.target.value)} required />

		<div className="visibility-section">
		<label>Visibility</label>
		<select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
		<option value="private">Private</option>
		<option value="public">Public</option>
		</select>
		</div>

		<div className="button-row">
		<div className="back-button">
		<button type="button" onClick={onClose}>
		Close
		</button>
		</div>
		<div className="save-button">
		<button type="submit" onClick={handleSubmit}>Save</button>
		</div>
		</div>
		</form>
		</div>
		</div>
		
	);
};

export default EditRecipeModal;

