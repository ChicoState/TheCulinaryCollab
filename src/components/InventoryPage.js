import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';
import { doc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { motion as m } from "framer-motion";
import AddItemModal from './AddItemModal';
import ViewItemModal from './ViewItemModal';
import EditItemModal from './EditItemModal';
import './InventoryPage.css';

const RecipeFinder = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    const handleIngredientsChange = (e) => {
        setIngredients(e.target.value);
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

    const searchRecipes = () => {
        const matchingRecipes = recipes.filter(recipe =>
          recipe.ingredients && recipe.ingredients.some(ingredient =>
            ingredient.toLowerCase().includes(ingredients.toLowerCase())
          )
        );

        setFilteredRecipes(matchingRecipes);
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <div className="recipe-finder">
            <h2>Find Recipes</h2>
            <div className="form-group">
                <label>Enter Ingredients (comma-separated):</label>
                <input type="text" value={ingredients} onChange={handleIngredientsChange} />
            </div>
            <button type="button" onClick={searchRecipes}>Find Recipes</button>
            <h3>Matching Recipes:</h3>
            <ul>
                {filteredRecipes.map((recipe, index) => (
                    <li key={index}>{recipe.name}</li>
                ))}
            </ul>
        </div>
    );
};

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
	  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewItemModalOpen, setViewItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setEditItemModalOpen] = useState(false);
    const userID = auth.currentUser?.uid;

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
const handleItemUpdate = async (e, itemId) => {
  e.preventDefault();
  try {
    const newName = e.target.elements.name.value;
    const newQuantity = e.target.elements.quantity.value;

    // Update the item in Firestore
    const itemRef = doc(firestore, `users/${userID}/inventory`, itemId);
    await updateDoc(itemRef, { name: newName, quantity: newQuantity });

    // Fetch updated inventory
    await fetchUserInventory();
    setEditItemModalOpen(false);
  } catch (error) {
    console.error("Error updating item:", error);
    // Handle error (e.g., show an error message to the user)
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

    const addItem = (item) => {
        setInventory([...inventory, item]);
    };

    const openAddItemModal = () => {
        setAddItemModalOpen(true);
    };

    const closeAddItemModal = () => {
        setAddItemModalOpen(false);
    };

      return (
    <m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.75}}>
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
            </div>
        </m.div>
    );
};

export default InventoryPage;
