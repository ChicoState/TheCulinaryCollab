import React, { useState} from 'react';
import '../components/PublicRecipesPage.css';
import RecipeStack from './RecipeStack';
import {motion as m } from "framer-motion";

const cocktails = [
	{
		name: "Mojito",
		ingredients: [
			{ item: "White rum", quantity: "50ml" },
			{ item: "Lime juice", quantity: "20ml" },
			{ item: "Sugar", quantity: "2 teaspoons" },
			{ item: "Mint leaves", quantity: "10" },
			{ item: "Soda water", quantity: "100ml" },
			{ item: "Ice cubes", quantity: "as required" }
		],
		instructions: "Muddle mint leaves with sugar. Add lime juice, rum, and top with soda water. Serve with ice."
	},
	{
		name: "Margarita",
		ingredients: [
			{ item: "Tequila", quantity: "50ml" },
			{ item: "Triple sec", quantity: "20ml" },
			{ item: "Lime juice", quantity: "20ml" },
			{ item: "Salt", quantity: "for rimming" },
			{ item: "Ice cubes", quantity: "as required" }
		],
		instructions: "Shake tequila, triple sec, and lime juice with ice. Rim glass with salt and strain mixture into glass."
	},
	{
		name: "Cosmopolitan",
		ingredients: [
			{ item: "Vodka", quantity: "40ml" },
			{ item: "Triple sec", quantity: "15ml" },
			{ item: "Cranberry juice", quantity: "30ml" },
			{ item: "Lime juice", quantity: "10ml" },
			{ item: "Ice cubes", quantity: "as required" }
		],
		instructions: "Shake all ingredients with ice. Strain into a chilled martini glass."
	},
	{
		name: "Pina Colada",
		ingredients: [
			{ item: "White rum", quantity: "50ml" },
			{ item: "Coconut milk", quantity: "50ml" },
			{ item: "Pineapple juice", quantity: "100ml" },
			{ item: "Pineapple slice", quantity: "for garnish" },
			{ item: "Cherries", quantity: "for garnish" },
			{ item: "Ice cubes", quantity: "as required" }
		],
		instructions: "Blend all ingredients (except garnishes) until smooth. Pour into a chilled glass and garnish with a slice of pineapple and a cherry."
	},
	{
		name: "Bloody Mary",
		ingredients: [
			{ item: "Vodka", quantity: "45ml" },
			{ item: "Tomato juice", quantity: "90ml" },
			{ item: "Lemon juice", quantity: "15ml" },
			{ item: "Worcestershire sauce", quantity: "2 dashes" },
			{ item: "Tabasco", quantity: "2 dashes" },
			{ item: "Celery salt", quantity: "1 pinch" },
			{ item: "Pepper", quantity: "1 pinch" },
			{ item: "Celery stick", quantity: "for garnish" }
		],
		instructions: "Shake all ingredients with ice. Strain into a large glass filled with ice and garnish with a celery stick."
	},
	{
		name: "Old Fashioned",
		ingredients: [
			{ item: "Whiskey", quantity: "45ml" },
			{ item: "Sugar cube", quantity: "1" },
			{ item: "Angostura bitters", quantity: "2 dashes" },
			{ item: "Water", quantity: "1 dash" },
			{ item: "Orange twist", quantity: "for garnish" },
			{ item: "Ice cubes", quantity: "as required" }
		],
		instructions: "Muddle sugar cube, water, and bitters. Add ice and whiskey. Garnish with an orange twist."
	}
];

const newCocktails = [
	{
		name: "Gin Tonic",
		ingredients: [
			{ item: "Gin", quantity: "50ml" },
			{ item: "Tonic Water", quantity: "100ml" },
			{ item: "Lime wedge", quantity: "1" },
			{ item: "Ice cubes", quantity: "as required" }
		],
		instructions: "Fill a glass with ice cubes. Add gin, top with tonic water and garnish with a lime wedge."
	},
	{
		name: "Whiskey Sour",
		ingredients: [
			{ item: "Whiskey", quantity: "50ml" },
			{ item: "Lemon juice", quantity: "25ml" },
			{ item: "Sugar syrup", quantity: "15ml" },
			{ item: "Cherry", quantity: "for garnish" },
			{ item: "Lemon slice", quantity: "for garnish" }
		],
		instructions: "Shake whiskey, lemon juice, and sugar syrup with ice. Strain into a chilled glass and garnish with a slice of lemon and a cherry."
	},
	{
		name: "Espresso Martini",
		ingredients: [
			{ item: "Vodka", quantity: "50ml" },
			{ item: "Coffee liqueur", quantity: "25ml" },
			{ item: "Freshly brewed espresso", quantity: "25ml" },
			{ item: "Sugar syrup", quantity: "15ml" }
		],
		instructions: "Shake all ingredients with ice. Strain into a chilled martini glass and serve."
	}
];

const userCocktails = []

const PublicRecipesPage = () => {
	const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
	const [animationDirection, setAnimationDirection] = useState('none');
	const [cardOpacity, setCardOpacity] = useState(1);

	const [newCurrentRecipeIndex, setNewCurrentRecipeIndex] = useState(0);
	const [newAnimationDirection, setNewAnimationDirection] = useState('none');
	const [newCardOpacity, setNewCardOpacity] = useState(1)

	const [userCurrentRecipeIndex, setUserCurrentRecipeIndex] = useState(0);
	const [userAnimationDirection, setUserAnimationDirection] = useState('none');
	const [userCardOpacity, setUserCardOpacity] = useState(1);

	const [searchTerm, setSearchTerm] = useState('');
	const [searchPopupVisible, setSearchPopupVisible] = useState(false);
	const [searchCocktails, setSearchCocktails] = useState([]);

	const [selectedRecipe,setSelectedRecipe] = useState(null);
	const [isPopupOpen, setPopupOpen] = useState(false);



	const handleSelectRecipe = (recipe) => {
		setSelectedRecipe(recipe);
		setPopupOpen(true);
	};
	const handleCloseModal = () => {
		setSelectedRecipe(null);
		setPopupOpen(false);
	};


	const openSearchPopup = () => {
		setSearchPopupVisible(true);
	};


	const closeSearchPopup = () => {
		setSearchPopupVisible(false);
	};

	const SearchResultsPopup = () => {
		return (
			searchPopupVisible && (
				<div className="search-results-popup">
				<ul>
				{searchCocktails.map((recipe, index) => (
					<li key={index}>
					{recipe.name}
					<button className="view-recipe-button" onClick={() => handleSelectRecipe(recipe)}>
					View Recipe
					</button>
					</li>
				))}
				</ul>
				<button className="close-search-button" onClick={closeSearchPopup}>
				Close
				</button>
				</div>
			)
		);
	};


	const RecipeModal = () => {
		if (!selectedRecipe) {
			return null;
		}
		return (
			<div className="modal-overlay">
			<div className="recipe-modal">
			<h2>{selectedRecipe.name}</h2>
			<ul>
			{selectedRecipe.ingredients.map((ingredient, i) => (
				<li key={i}>
				{ingredient.item}: {ingredient.quantity}
				</li>
			))}
			</ul>
			<div className="instructions-box">{selectedRecipe.instructions}</div>
			<button className="close-modal-button" onClick={handleCloseModal}>
			Close
			</button>
			</div>
			</div>
		);
	};


	const handleInputChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);
		if (term.length > 0 || term.length === 0) {
			handleSearch(term);
		}
	};

	const handleSearch = (e) => {
		if (e.length <= 1){
			setSearchCocktails([]);
			return;
		}
		else {
			const results = cocktails.filter((recipe) =>
				recipe.name.toLowerCase().includes(e.toLowerCase()) ||
				recipe.ingredients.some((ingredient) =>
					ingredient.item.toLowerCase().includes(e.toLowerCase())
				)
			);
			setSearchCocktails(results);
		}
		
		console.log(e);
		openSearchPopup();
	};


	return (
		<m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.75}}>
		<div className="recipe-page-container">
		{}
		<div className="search-results-container">
		{/* Search Bar */}
		<div className="search-bar-container">
		<input
		type="text"
		placeholder="Search for recipe"
		value={searchTerm}
		onChange={handleInputChange}
		className="search-bar"
		/>
		<button className="search-button" onClick={openSearchPopup}>
		Search
		</button>
		</div>
		{searchPopupVisible && <SearchResultsPopup />}
		{isPopupOpen && <RecipeModal />}
		</div>

		{/* Cocktails */}
		<RecipeStack
		currentRecipeIndex={currentRecipeIndex}
		setCurrentRecipeIndex={setCurrentRecipeIndex}
		animationDirection={animationDirection}
		setAnimationDirection={setAnimationDirection}
		cardOpacity={cardOpacity}
		setCardOpacity={setCardOpacity}
		recipes={cocktails}
		/>

		{/* User Cocktails */}
		<RecipeStack
		currentRecipeIndex={userCurrentRecipeIndex}
		setCurrentRecipeIndex={setUserCurrentRecipeIndex}
		animationDirection={userAnimationDirection}
		setAnimationDirection={setUserAnimationDirection}
		cardOpacity={userCardOpacity}
		setCardOpacity={setUserCardOpacity}
		recipes={userCocktails}
		/>

		{/* New Cocktails */}
		<RecipeStack
		currentRecipeIndex={newCurrentRecipeIndex}
		setCurrentRecipeIndex={setNewCurrentRecipeIndex}
		animationDirection={newAnimationDirection}
		setAnimationDirection={setNewAnimationDirection}
		cardOpacity={newCardOpacity}
		setCardOpacity={setNewCardOpacity}
		recipes={newCocktails}
		/>
		</div>
		</m.div>
	);
};
export default PublicRecipesPage;

