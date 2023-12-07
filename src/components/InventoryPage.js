import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { doc, addDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { motion as m } from "framer-motion";
import AddItemModal from './AddItemModal';
import ViewItemModal from './ViewItemModal';
import EditItemModal from './EditItemModal';
import './InventoryPage.css';
import ViewRecipeModal from './ViewRecipeModal';

const InventoryPage = () => {
	const [currentUserEmail, setCurrentEmail] = useState(null);
	const [inventory, setInventory] = useState([]);
	const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [recommendedRecipes, setRecommendedRecipes] = useState([]);
	const [isViewItemModalOpen, setViewItemModalOpen] = useState(false);
	const [isEditItemModalOpen, setEditItemModalOpen] = useState(false);
	const [recipes, setRecipes] = useState([]);
	const [isViewRecipeModalOpen, setIsViewRecipeModalOpen] = useState(false);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const userID = auth.currentUser?.uid;

	const openViewRecipeModal = (recipe) => {
		setSelectedRecipe(recipe);
		setIsViewRecipeModalOpen(true);
	};

	const closeViewRecipeModal = () => {
		setIsViewRecipeModalOpen(false);
		setSelectedRecipe(null);
	};
	const handleItemSelect = (item) => {
		setSelectedItem(item);
		setViewItemModalOpen(true);
	};

	const handleItemEdit = (item) => {
		setSelectedItem(item);
		setViewItemModalOpen(false);
		setEditItemModalOpen(true);
	};

	const fetchUserInventory = async () => {
		if (userID) {
			const userInventoryCollection = collection(firestore, `users/${userID}/inventory`);
			const inventorySnapshot = await getDocs(userInventoryCollection);
			const userInventory = inventorySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
			setInventory(userInventory);
		}
	};
	const handleItemUpdate = async (updatedItem) => {
		try {
			const isDuplicate = inventory.some(
				(item) => item.name.toLowerCase() === updatedItem.name.toLowerCase() && item.id !== updatedItem.id
			);

			if (isDuplicate) {
				alert("An item with this name already exists in your inventory.");
				return;
			}

			const itemRef = doc(firestore, `users/${userID}/inventory`, updatedItem.id);
			await updateDoc(itemRef, { name: updatedItem.name, quantity: updatedItem.quantity });

			fetchUserInventory();
			setEditItemModalOpen(false);
		} catch (error) {
			console.error("Error updating item:", error);
		}
	};

	const handleItemDelete = async (itemId) => {
		const itemRef = doc(firestore, `users/${userID}/inventory`, itemId);
		await deleteDoc(itemRef);

		fetchUserInventory();
		alert("Item deleted successfully!");
		setViewItemModalOpen(false);
	};

	useEffect(() => {
		fetchUserInventory();
	}, [userID]);

	useEffect(() => {
		fetchRecipes();
	}, []);

	useEffect(() => {
		if (recipes.length > 0 && inventory.length > 0) {
			setRecommendedRecipes(recommendRecipes(inventory, recipes));
		}
	}, [inventory, recipes]);

	const addItem = (item) => {
		setInventory([...inventory, item]);
	};

	const openAddItemModal = () => {
		setAddItemModalOpen(true);
	};

	const closeAddItemModal = () => {
		setAddItemModalOpen(false);
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

		setRecipes([...publicRecipes, ...userRecipes]);
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

	const canSaveRecipe = (recipe) => {
		const isUserLoggedIn = auth.currentUser !== null;
		const isEmailVerified = isUserLoggedIn ? auth.currentUser.emailVerified : false;
		return isUserLoggedIn && isEmailVerified && (!recipe.createdBy || (recipe.createdBy.email !== currentUserEmail));
	};


	const recommendRecipes = (inventory, allRecipes) => {
		let recommendations = [];
		inventory.forEach(item => {
			allRecipes.forEach(recipe => {
				if (recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === item.name.toLowerCase())) {
					recommendations.push({ recipe, matchedIngredient: item.name });
				}
			});
		});
		return recommendations;
	};


	return (
		<m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
		<div className="inventory-page">
		<h2>Inventory</h2>
		<button onClick={openAddItemModal}>Add Item</button>
		<div className="inventory-display">
		{inventory.map((item, index) => (
			<div
			key={index}
			className="inventory-item"
			onClick={() => handleItemSelect(item)}
			>
			<p><strong>{item.name}</strong> - {item.quantity}</p>
			</div>
		))}
		</div>
		{isAddItemModalOpen && (
			<AddItemModal addItem={addItem} closeModal={closeAddItemModal} userID={userID} />
		)}
		{isViewItemModalOpen && selectedItem && (
			<ViewItemModal
			item={selectedItem}
			onClose={() => setViewItemModalOpen(false)}
			onEdit={() => handleItemEdit(selectedItem)}
			onDelete={() => handleItemDelete(selectedItem.id)}
			/>
		)}
		{isEditItemModalOpen && selectedItem && (
			<EditItemModal
			item={selectedItem}
			onClose={() => setEditItemModalOpen(false)}
			onUpdate={handleItemUpdate}
			/>
		)}

		<div className="recipe-recommendations">
		<h3>Recommended Recipes Based on Your Inventory</h3>
		<div className="recommended-recipes">
		{recommendedRecipes.map(({ recipe, matchedIngredient }, index) => (
			<div key={index} className="recipe-item" onClick={() => openViewRecipeModal(recipe)}>
			<h4>{recipe.name}</h4>
			<p><strong>Matched based on:</strong> {matchedIngredient}</p>
			<p>Preparation: {recipe.preparation}</p>
			<p>Taste: {recipe.taste}</p>
			</div>
		))}
		</div>
		</div>

		<ViewRecipeModal isOpen={isViewRecipeModalOpen} onClose={closeViewRecipeModal} recipe={selectedRecipe} onSave={() => saveRecipe(selectedRecipe)} showSaveOption={selectedRecipe && canSaveRecipe(selectedRecipe)} />
		</div>
		</m.div>
	);
};

export default InventoryPage;
