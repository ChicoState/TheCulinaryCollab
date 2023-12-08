import React, { useState, useEffect } from 'react';
import './BrowseRecipesPage.css';
import { firestore, auth } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { motion as m } from "framer-motion";
import RecipeSearchBarBrowse from './RecipeSearchBarBrowse';
import ViewRecipeModal from './ViewRecipeModal';
import background from "./Browse-background.png";
const user = auth.currentUser;
const BrowseRecipesPage = () => {
	const [recipes, setRecipes] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [currentUserEmail, setCurrentEmail] = useState(null);
	const recipesPerPage = 20;

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	};
	const fetchRecipes = async () => {
		const publicRecipesCollection = collection(firestore, 'public-recipes');
		const userRecipesCollection = collection(firestore, 'allUserRecipes');

		const [publicRecipesSnapshot, userRecipesSnapshot] = await Promise.all([
			getDocs(publicRecipesCollection),
			getDocs(userRecipesCollection)
		]);

		const publicRecipes = publicRecipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
		const userRecipes = userRecipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

		const combinedRecipes = [...publicRecipes, ...userRecipes];
		shuffleArray(combinedRecipes);
		setRecipes(combinedRecipes);
	};

	const canSaveRecipe = (recipe) => {
		const isUserLoggedIn = auth.currentUser !== null;
		const isEmailVerified = isUserLoggedIn ? auth.currentUser.emailVerified : false;
		return isUserLoggedIn && isEmailVerified && (!recipe.createdBy || (recipe.createdBy.email !== currentUserEmail));
	};

	const displayedRecipes = recipes.slice(currentPage * recipesPerPage, (currentPage + 1) * recipesPerPage);

	const openViewModal = (recipe) => {
		setSelectedRecipe(recipe);
		setIsViewModalOpen(true);
	};

	const closeViewModal = () => {
		setIsViewModalOpen(false);
		setSelectedRecipe(null);
	};

	const saveRecipe = async (recipe) => {
		if (auth.currentUser) {
			const recipeToSave = {
				...recipe,
				originalCreator: recipe.createdBy ? (recipe.createdBy.username || recipe.createdBy.email) : 'Public',
				savedFromUsername: recipe.createdBy ? recipe.createdBy.username : 'Public'
			};

			const savedRecipesRef = collection(firestore, `users/${auth.currentUser.uid}/savedRecipes`);
			await addDoc(savedRecipesRef, recipeToSave);
		}
	};

const renderPaginationButtons = () => {
    let pages = [];
    const numPages = Math.ceil(recipes.length / recipesPerPage);

    for (let i = 1; i <= numPages; i++) {
        const buttonClass = currentPage === i - 1 ? 'active-page' : '';

        if (i === 1 || i === numPages || i === currentPage + 1 || i === currentPage + 2 || i === currentPage) {
            pages.push(<button key={i} onClick={() => setCurrentPage(i - 1)} className={buttonClass}>{i}</button>);
        } else if (i === currentPage + 3 || i === currentPage - 1) {
            pages.push(<span key={i}>. . .</span>);
        }
    }
    return pages;
};

	useEffect(() => {
		fetchRecipes();
		if (auth.currentUser) {
			setCurrentEmail(auth.currentUser.email);
		}
	}, []);

	return (
		<m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.75}}>
		<div className="landing-page" style={{backgroundImage: `url(${background})`}}>
		<h2>Browse Public Workshop Recipes</h2>
		<RecipeSearchBarBrowse recipes={recipes} onView={openViewModal} onSave={() => saveRecipe(selectedRecipe)} />
		<div className="recipes-grid">
		{displayedRecipes.map(recipe => (
			<div key={recipe.id} className="recipe-item" onClick={() => openViewModal(recipe)}>
			<h3>{recipe.name}</h3>
			<p className="recipe-origin">
			{recipe.createdBy ? `From: ${recipe.createdBy.username || recipe.createdBy.email}` : 'Public Recipe'}
			</p>
			</div>
		))}
		</div>
		<div className="pagination-buttons">
		{currentPage > 0 && <button className="common-button-style" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>}
		{renderPaginationButtons()}
		{(currentPage + 1) * recipesPerPage < recipes.length && <button className="common-button-style" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>}
		</div>
		<ViewRecipeModal isOpen={isViewModalOpen} onClose={closeViewModal} recipe={selectedRecipe} onSave={() => saveRecipe(selectedRecipe)} showSaveOption={selectedRecipe && canSaveRecipe(selectedRecipe)} />
		</div>
		</m.div>
	);
}

export default BrowseRecipesPage;

