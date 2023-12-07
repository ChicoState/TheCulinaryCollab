import React, { useEffect, useState } from 'react';
import { firestore, storage, auth } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import {motion as m } from "framer-motion";
import './InventoryPage.css';

const RecipeFinder = ({ onAddItem, setInventory }) => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    const handleIngredientsChange = (e) => {
        setIngredients(e.target.value);
    };

    const fetchRecipes = async () => {
        const publicRecipesCollection = collection(firestore, 'public-recipes');;
        const userRecipesCollection = collection(firestore, 'allUserRecipes');
    
        const [publicRecipesSnapshot, userRecipesSnapshot] = await Promise.all([
          getDocs(publicRecipesCollection),
          getDocs(userRecipesCollection)
        ]);

    const publicRecipes = publicRecipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const userRecipes = userRecipesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    setRecipes([...publicRecipes, ...userRecipes]);
    };

    //search recipes by typing in an ingredient
    const searchRecipes = () => {
        const matchingRecipes = recipes.filter(recipe =>
          recipe.ingredients &&
          recipe.ingredients.some(ingredient =>
            typeof ingredient === 'string' && ingredient.toLowerCase().includes(ingredients.toLowerCase())
          )
        );
      
        setFilteredRecipes(matchingRecipes);
    };

    //adding ingredient items to the database
    //And make sure u are adding stuff to the right place, 
    //The pages data storage container is set up it’s in /user/userID/inventory
    //So you need to add the ingredient to the inventory collection

    

    
  useEffect(() => {
    fetchRecipes();
    
    }, []);


	if (auth.currentUser && !auth.currentUser.emailVerified) {
		return (
			<div className="verify-prompt">
			<h1>Please Verify Your account</h1>
			<p> Check your email for a verification email to use the website, or reload the page if you have! If you need to resend the email see your profile page.</p>
			</div>
		);
	}
	if (!auth.currentUser) {
		return (
			<div className="login-prompt">
			<h1>Please Log In</h1>
			<p>To access this page, you need to be logged in.</p>
			</div>
		);
	}
	return (
        <div className="recipe-finder">
            <h2>Find Recipes</h2>
            <div className="form-group">
                <label>Enter Ingredients (comma-separated):</label>
                <input type="text" value={ingredients} onChange={handleIngredientsChange} />
            </div>
            <button type="button" onClick={searchRecipes}>Search Recipes</button>

            <h3>Matching Recipes:</h3>
            <ul>
                {filteredRecipes.map((recipe, index) => (
                    <li key={index}>{recipe.name}</li>
                ))}
            </ul>
        </div>
    );
};

const AddItemModal = ({ addItem, closeModal }) => {
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemCategory, setItemCategory] = useState('');

    const handleItemNameChange = (e) => {
        setItemName(e.target.value);
    };

    const handleItemQuantityChange = (e) => {
        setItemQuantity(e.target.value);
    };

    const handleItemCategoryChange = (e) => {
        setItemCategory(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addItem({
            name: itemName,
            quantity: itemQuantity,
            category: itemCategory,
        });
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="add-item-modal">
                <h2>Add Inventory Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Item Name:</label>
                        <input type="text" value={itemName} onChange={handleItemNameChange} required />
                    </div>
                    <div className="form-group">
                        <label>Item Quantity:</label>
                        <input type="number" value={itemQuantity} onChange={handleItemQuantityChange} required />
                    </div>
                    <div className="form-group">
                        <label>Item Category:</label>
                        <input type="text" value={itemCategory} onChange={handleItemCategoryChange} required />
                    </div>
                    <button type="submit">Add Item</button>
                </form>
                <button className="close-modal-button" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>
    );
};


const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
    const [addItemFunction, setAddItemFunction] = useState(null);

    const addItem = (item) => {
        setInventory([...inventory, item]);
    };

    const openAddItemModal = () => {
        setAddItemFunction(() => addItem);
        setAddItemModalOpen(true);
    };

    const closeAddItemModal = () => {
        setAddItemModalOpen(false);
    };

    const AddItem = async (item) => {
        try {
            const inventoryRef = collection(firestore, `users/${auth.currentUser.uid}/inventory`);
            await addDoc(inventoryRef, item);
            alert('Item added successfully!');
            setInventory(prevInventory => [...prevInventory, item]);
            //fetchRecipes();
        } catch (error) {
            console.error(error);
            alert('Error adding item!');
        }
    };

    return (
	<m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.75}}>
        <div className="inventory-page">
            <h2>Inventory</h2>
            <button onClick={openAddItemModal}>Add Item</button>
            <ul>{inventory.map((item, index) => (
                    <li key={index}>{item.name} - {item.quantity} - {item.category}</li>
                ))}</ul>
            <RecipeFinder onAddItem={AddItem} setInventory={setInventory} />
            {isAddItemModalOpen && addItemFunction && (
                <AddItemModal addItem={AddItem} closeModal={closeAddItemModal} />
            )}
        </div>
	</m.div>
    );
};

export default InventoryPage;
