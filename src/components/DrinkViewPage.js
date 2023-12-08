import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import RecipeCard from './RecipeCard';
import RecipeFullScreen from './RecipeFullScreen';
import './DrinkViewPage.css';

const DrinkViewPage = () => {
	const [viewingRecipe, setViewingRecipe] = useState(null);
	const [recipes, setRecipes] = useState([]);
	const [activeCollection, setActiveCollection] = useState('My Personal Recipes');
	const user = auth.currentUser;
	const navigate = useNavigate();

	const openRecipe = (recipe) => {
		console.log("Modal should be open");
		console.log("Recipe: ", recipe);
		setViewingRecipe(recipe);
	};

	const closeRecipe = () => {
		console.log("Modal should be closed");
		setViewingRecipe(null);
	};

	const fetchPersonalRecipes = async () => {
		const personalRecipesCol = collection(firestore, `users/${auth.currentUser.uid}/personalRecipes`);
		const personalRecipesSnap = await getDocs(personalRecipesCol);
		setRecipes(personalRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
	};	
	const fetchSavedRecipes = async () => {
		const savedRecipesCollection = collection(firestore, `users/${auth.currentUser.uid}/savedRecipes`);
		const savedRecipesSnap = await getDocs(savedRecipesCollection);
		setRecipes(savedRecipesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
	};
	const fetchProfileDisplayRecipes = async () => {
		if (auth.currentUser) {
			const recipesRef = collection(firestore, `users/${auth.currentUser.uid}/Profile-display`);
			const displaySnapshot = await getDocs(recipesRef);
			setRecipes(displaySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
		}
	};
	const fetchPublicRecipes = async () => {
		const publicRecipesCollection = collection(firestore, 'public-recipes');
		const querySnapshot = await getDocs(publicRecipesCollection);
		const publicRecipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
		setRecipes(publicRecipesData);

	};

	const fetchAllUserRecipes = async () => {
		const allRecipesCollection = collection(firestore, 'allUserRecipes');
		const q = query(allRecipesCollection, where("createdBy.uid", "==", auth.currentUser.uid));

		try {
			const querySnapshot = await getDocs(q);
			const userRecipes = querySnapshot.docs
				.filter(doc => doc.exists && doc.data().createdBy && doc.data().createdBy.uid === auth.currentUser.uid)
				.map(doc => ({
					...doc.data(),
					id: doc.id
				}));

			setRecipes(userRecipes);
		} catch (error) {
			console.error("Error fetching user-created recipes:", error);
		}
	};

	useEffect(() => {
		console.log("activeCollection: ",activeCollection);
		switch (activeCollection) {
			case 'My Personal Recipes':
				console.log("Entered Personal Recipes switch");
				fetchPersonalRecipes();
				break;
			case 'My Saved Recipes':
				console.log("Entered Saved Recipes switch");
				fetchSavedRecipes();
				break;
			case 'My Displayed Recipes':
				console.log("Entered Displayed Recipes switch");
				fetchProfileDisplayRecipes();
				break;
			case 'My Posted Recipes':
				console.log("Entered Posted Recipes switch");
				fetchAllUserRecipes();
				break;
			case 'Public Recipes':
				console.log("Entered Public Recipes switch");
				fetchPublicRecipes();
				break;
			default:
				break;
		}
	}, [activeCollection, user]);
	console.log(recipes);
	return (
		<div className="drink-view-page">
		<div className="collection-buttons">
		<button className="back-to-workshop-button" onClick={() => navigate("/workshop")}>Back to Workshop</button>
		{['My Personal Recipes', 'My Saved Recipes', 'My Displayed Recipes', 'My Posted Recipes', 'Public Recipes'].map((collectionName) => (
			<button
			key={collectionName}
			className={activeCollection === collectionName ? 'active' : ''}
			onClick={() => setActiveCollection(collectionName)}
			>
			{collectionName}
			</button>
		))}
		</div>
		<div className="recipe-list">
		{recipes.map((recipe) => (
			<RecipeCard key={recipe.id} recipe={recipe} onClick={() => openRecipe(recipe)} />
		))}
		</div>
		{viewingRecipe && <RecipeFullScreen recipe={viewingRecipe} onClose={closeRecipe} />}
		</div>
	);
};	
export default DrinkViewPage;

