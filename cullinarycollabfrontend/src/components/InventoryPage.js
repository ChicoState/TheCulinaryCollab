import React, { useState } from 'react';
import './InventoryPage.css';

const RecipeFinder = ({ inventory }) => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);

    const handleIngredientsChange = (e) => {
        setIngredients(e.target.value);
    };

    const findRecipes = () => {
        const availableRecipes = [
            { name: 'Recipe 1', ingredients: ['Ingredient A', 'Ingredient B'] },
            { name: 'Recipe 2', ingredients: ['Ingredient B', 'Ingredient C'] },
            // Add more recipes as needed
        ];

        const matchingRecipes = availableRecipes.filter(recipe =>
            recipe.ingredients.every(ingredient => ingredients.includes(ingredient))
        );

        setRecipes(matchingRecipes);
    };

    return (
        <div className="recipe-finder">
            <h2>Find Recipes</h2>
            <div className="form-group">
                <label>Enter Ingredients (comma-separated):</label>
                <input type="text" value={ingredients} onChange={handleIngredientsChange} />
            </div>
            <button type="button" onClick={findRecipes}>Find Recipes</button>

            <h3>Matching Recipes:</h3>
            <ul>
                {recipes.map((recipe, index) => (
                    <li key={index}>{recipe.name}</li>
                ))}
            </ul>
        </div>
    );
};

const AddItemModel = ({ addItem, closeModel }) => {
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
        closeModel();
    };

    return (
        <div className="model-overlay">
            <div className="add-item-model">
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
                <button className="close-model-button" onClick={closeModel}>
                    Close
                </button>
            </div>
        </div>
    );
};

const SampleInventory = [
    { name: 'Vodka', quantity: '1 bottle', category: 'Spirits' },
    { name: 'Gin', quantity: '1 bottle', category: 'Spirits' },
    { name: 'Lime Juice', quantity: '1 bottle', category: 'Juices' },
];



const InventoryPage = () => {
    const [inventory, setInventory] = useState(SampleInventory);
    const [isAddItemModelOpen, setAddItemModelOpen] = useState(false);

    const addItem = (item) => {
        setInventory([...inventory, item]);
    };

    const openAddItemModel = () => {
        setAddItemModelOpen(true);
    };

    const closeAddItemModel = () => {
        setAddItemModelOpen(false);
    };

    return (
        <div className="inventory-page">
            <h2>Inventory</h2>
            <button onClick={openAddItemModel}>Add Item</button>
	    <ul>{inventory.map((item, index) => (
                    <li key={index}>{item.name} - {item.quantity} - {item.category}</li>
                ))}</ul>
            <RecipeFinder inventory={inventory} />
            {isAddItemModelOpen && (
                <AddItemModel addItem={addItem} closeModel={closeAddItemModel} />
            )}
        </div>
    );
};

export default InventoryPage;
