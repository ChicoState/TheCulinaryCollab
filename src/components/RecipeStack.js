const RecipeStack = ({
	currentRecipeIndex,
	setCurrentRecipeIndex,
	animationDirection,
	setAnimationDirection,
	cardOpacity,
	setCardOpacity,
	recipes,
}) => {
	const handlePrevRecipe = () => {
		setAnimationDirection('fade-left');
		setCardOpacity(0);
		setTimeout(() => {
			if (currentRecipeIndex === 0) {
				setCurrentRecipeIndex(recipes.length - 1);
			} else {
				setCurrentRecipeIndex(currentRecipeIndex - 1);
			}
			setTimeout(() => {
				setAnimationDirection('enter-from-left');
				setCardOpacity(1);
			}, 50);
		}, 500);
	};

	const handleNextRecipe = () => {
		setAnimationDirection('fade-right');
		setCardOpacity(0);
		setTimeout(() => {
			if (currentRecipeIndex === recipes.length - 1) {
				setCurrentRecipeIndex(0);
			} else {
				setCurrentRecipeIndex(currentRecipeIndex + 1);
			}
			setTimeout(() => {
				setAnimationDirection('enter-from-right');
				setCardOpacity(1);
			}, 50);
		}, 500);
	};

	return (
		<div className="recipe-container">
		<button className="nav-button nav-button-left" onClick={handlePrevRecipe}>
		&lt;
		</button>

		<div className={`recipe-card ${animationDirection}`} style={{ opacity: cardOpacity }}>
		<h2>{recipes[currentRecipeIndex]?.name || "No Recipe Available"}</h2>
		<ul>
		{recipes[currentRecipeIndex]?.ingredients.map((ingredient, i) => (
			<li key={i}>
			{ingredient.item}: {ingredient.quantity}
			</li>
		)) || <li>No ingredients</li>}
		</ul>
		<div className="instructions-box">
		{recipes[currentRecipeIndex]?.instructions || "No instructions available."}
		</div>
		</div>

		<button className="nav-button nav-button-right" onClick={handleNextRecipe}>
		&gt;
		</button>
		</div>
	);
};

export default RecipeStack;
