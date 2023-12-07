import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import Autocomplete from 'react-autocomplete';
import './AddItemModal.css';
const cocktailIngredients = [
	// Spirits and Liquors
	"Vodka",
	"Gin",
	"Rum",
	"White Rum",
	"Dark Rum",
	"Spiced Rum",
	"Tequila",
	"Blanco Tequila",
	"Reposado Tequila",
	"Añejo Tequila",
	"Whiskey",
	"Bourbon",
	"Scotch",
	"Rye Whiskey",
	"Irish Whiskey",
	"Brandy",
	"Cognac",
	"Armagnac",
	"Mezcal",
	"Sake",
	"Absinthe",
	"Vermouth",
	"Dry Vermouth",
	"Sweet Vermouth",
	"Triple Sec",
	"Cointreau",
	"Curacao",
	"Blue Curacao",
	"Orange Curacao",
	"Amaretto",
	"Campari",
	"Aperol",
	"Baileys Irish Cream",
	"Kahlua",
	"Grand Marnier",
	"Chartreuse",
	"Green Chartreuse",
	"Yellow Chartreuse",
	"St. Germain",
	"Drambuie",
	"Frangelico",
	"Chambord",
	"Midori",
	"Pimm's No. 1",
	"Sambuca",
	"Southern Comfort",
	"Tia Maria",

	// Mixers and Non-Alcoholic Ingredients
	"Milk",
	"Club Soda",
	"Tonic Water",
	"Cola",
	"Ginger Beer",
	"Ginger Ale",
	"Lemonade",
	"Lime Juice",
	"Lemon Juice",
	"Orange Juice",
	"Cranberry Juice",
	"Pineapple Juice",
	"Tomato Juice",
	"Grapefruit Juice",
	"Apple Juice",
	"Coconut Cream",
	"Coconut Water",
	"Simple Syrup",
	"Grenadine",
	"Angostura Bitters",
	"Orange Bitters",
	"Peach Bitters",
	"Mint Leaves",
	"Basil Leaves",
	"Rosemary Sprigs",
	"Thyme Sprigs",
	"Cucumber Slices",
	"Fresh Berries",
	"Strawberries",
	"Raspberries",
	"Blueberries",
	"Chili Peppers",
	"Muddled Fruits",
	"Egg Whites",
	"Cream",
	"Sugar",
	"White Sugar",
	"Brown Sugar",
	"Salt",
	"Margarita Salt",
	"Pepper",
	"Nutmeg",
	"Cinnamon",
	"Vanilla Extract",
	"Honey",
	"Agave Nectar",
	"Maple Syrup",

	// Seasonal Ingredients
	"Pumpkin Spice",
	"Peppermint",
	"Cranberries",
	"Blood Orange",
	"Rhubarb",
	"Watermelon",
	"Peach",
	"Lavender",
	"Elderflower",

	// Niche and Exotic Ingredients
	"Dragon Fruit",
	"Lychee",
	"Passion Fruit",
	"Tamarind",
	"Hibiscus",
	"Yuzu",
	"Açai Berry",
	"Kumquat",
	"Durian",
	"Goji Berry",
	"Matcha",
	"Garam Masala",
	"Cardamom"
];

const AddItemModal = ({ addItem, closeModal, userID }) => {
	const [itemName, setItemName] = useState('');
	const [itemQuantity, setItemQuantity] = useState('');
	const [isDuplicate, setIsDuplicate] = useState(false);

	const handleItemQuantityChange = (e) => {
		setItemQuantity(e.target.value);
	};

	const shouldItemRender = (item, value) => {
		return item.toLowerCase().indexOf(value.toLowerCase()) > -1 && value.length > 0;
	};

	const checkForDuplicate = async (itemName) => {
		const userInventoryCollection = collection(firestore, `users/${userID}/inventory`);
		const q = query(userInventoryCollection, where("name", "==", itemName));
		const querySnapshot = await getDocs(q);
		return !querySnapshot.empty;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const alreadyExists = await checkForDuplicate(itemName);
		if (alreadyExists) {
			setIsDuplicate(true);
			alert("This item is already in your inventory.");
			return;
		}

		if (!cocktailIngredients.includes(itemName)) {
			alert("Please select an ingredient from the list.");
			return;
		}

		const newItem = {
			name: itemName,
			quantity: itemQuantity,
		};

		const userInventoryCollection = collection(firestore, `users/${userID}/inventory`);
		await addDoc(userInventoryCollection, newItem);
		addItem(newItem);
		closeModal();
	};

	return (
		<div className="modal-overlay">
		<div className="add-item-modal">
		<h2>Add Inventory Item</h2>
		<form onSubmit={handleSubmit}>
		<div className="form-group">
		<label>Item Name:</label>
		<div className="react-autocomplete-input">
		<Autocomplete
		getItemValue={(item) => item}
		items={cocktailIngredients}
		shouldItemRender={shouldItemRender}
		renderItem={(item, isHighlighted) =>
			<div key={item} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
			{item}
			</div>
		}

		value={itemName}
		onChange={(e) => {
			setItemName(e.target.value);
			setIsDuplicate(false);
		}}
		onSelect={(val) => setItemName(val)}
		wrapperStyle={{ position: 'relative', display: 'block' }}
		menuStyle={{ position: 'absolute', top: '100%', left: 0, right: 0 }}
		/>

		</div>
		{isDuplicate && <div className="error-message">Item already exists.</div>}
		</div>
		<div className="form-group">
		<label>Item Quantity:</label>
		<select value={itemQuantity} onChange={handleItemQuantityChange} required>
		<option value="">Select Quantity</option>
		<option value="A lot">A lot</option>
		<option value="Some">Some</option>
		<option value="A little">A little</option>
		</select>
		</div>
		<button type="submit" disabled={isDuplicate}>Add Item</button>
		</form>
		<button className="close-modal-button" onClick={closeModal}>
		Close
		</button>
		</div>
		</div>
	);
};

export default AddItemModal;
