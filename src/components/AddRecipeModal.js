import React, { useRef, useState } from 'react';
import './AddRecipeModal.css';

const AddRecipeModal = ({ isOpen, onClose, addRecipe }) => {
	const nameRef = useRef();
	const timingRef = useRef();
	const tasteRef = useRef();
	const preparationRef = useRef();
	const costRef = useRef();
	const timeToMakeRef = useRef();
	const [ingredients, setIngredients] = useState([{ ingredient: '', amount: '', unit: '' }]);
	const [visibility, setVisibility] = useState('private');
	const handleAddIngredient = () => {
		setIngredients([...ingredients, { ingredient: '', amount: '', unit: '' }]);
	};
	const handleIngredientChange = (index, field, value) => {
		const updatedIngredients = [...ingredients];
		updatedIngredients[index][field] = value;
		setIngredients(updatedIngredients);
	};
	const handleRemoveIngredient = (index) => {
		const updatedIngredients = [...ingredients];
		updatedIngredients.splice(index, 1);
		setIngredients(updatedIngredients);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const ingredientsArray = ingredients.filter((ingredient) => ingredient.ingredient !== '');

		const recipeData = {
			name: nameRef.current.value,
			timing: timingRef.current.value,
			taste: tasteRef.current.value,
			ingredients: ingredientsArray,
			preparation: preparationRef.current.value,
			cost: costRef.current.value,
			timeToMake: timeToMakeRef.current.value,
		};

		addRecipe(recipeData);
		nameRef.current.value = '';
		timingRef.current.value = '';
		tasteRef.current.value = '';
		preparationRef.current.value = '';
		setIngredients([{ ingredient: '', amount: '', unit: '' }]);
		costRef.current.value = '';
		timeToMakeRef.current.value = '';
		onClose();
	};

	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content">
		<form onSubmit={handleSubmit}>
		<label>Name</label>
		<input type="text" ref={nameRef} required />

		<label>Timing</label>
		<input type="text" ref={timingRef} required />

		<label>Taste</label>
		<input type="text" ref={tasteRef} required />

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
		<textarea rows="4" ref={preparationRef} required />
		<label>Cost</label>
		<input type="text" ref={costRef} />

		<label>Time to Make</label>
		<input type="text" ref={timeToMakeRef} />
		<div className="button-row">
		<div className="back-button">
		<button type="button" onClick={onClose}>
		Back
		</button>
		</div>
		<div className="save-button">
		<button type="submit">Save</button>
		</div>
		</div>
		</form>
		</div>
		</div>
	);

};

export default AddRecipeModal;

