import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import RecipeCard from './RecipeCard';
import './DrinkViewPage.css';

const DrinkViewPage = () => {
	const [recipes, setRecipes] = useState([]);
	const [activeCollection, setActiveCollection] = useState('My Personal Recipes');
	const user = auth.currentUser;
	const navigate = useNavigate();

	const fetchRecipes = async (collectionPath) => {
		try {
			const recipesRef = collection(firestore, collectionPath);
			const q = user ? query(recipesRef, where("createdBy", "==", user.uid)) : recipesRef;
			const querySnapshot = await getDocs(q);
			const fetchedRecipes = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
			console.log(fetchedRecipes);
			setRecipes(fetchedRecipes);
		} catch (error) {
			console.error("Error fetching recipes:", error);
		}
	};

	useEffect(() => {
		let collectionPath = '';
		switch (activeCollection) {
			case 'My Personal Recipes':
				collectionPath = `user/${user.uid}/personalRecipes`;
				break;
			case 'My Saved Recipes':
				collectionPath = `user/${user.uid}/savedRecipes`;
				break;
			case 'My Displayed Recipes':
				collectionPath = `user/${user.uid}/Profile-display`;
				break;
			case 'My Posted Recipes':
				collectionPath = 'allUserRecipes';
				break;
			case 'Public Recipes':
				collectionPath = 'public-recipes';
				break;
			default:
				break;
		}
		fetchRecipes(collectionPath);
	}, [activeCollection, user]);

	return (
		<div className="drink-view-page">
		<div className="collection-buttons">
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
		{recipes.map(recipe => (
			<RecipeCard key={recipe.id} recipe={recipe} />
		))}
		</div>

		<button onClick={() => navigate("/workshop")}>Back to Workshop</button>
		</div>
	);
};

export default DrinkViewPage;

