import React, { useState } from 'react';
import Autocomplete from 'react-autocomplete';
import './EditItemModal.css';


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

const EditItemModal = ({ item, onClose, onUpdate}) => {
    const [itemName, setItemName] = useState(item.name);
    const [itemQuantity, setItemQuantity] = useState(item.quantity);

    const handleItemQuantityChange = (e) => {
        setItemQuantity(e.target.value);
    };

    const shouldItemRender = (item, value) => {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!cocktailIngredients.includes(itemName)) {
            alert("Please select an ingredient from the list.");
            return;
        }

        const updatedItem = { ...item, name: itemName, quantity: itemQuantity };
        onUpdate(updatedItem);
    };

    return (
        <div className="modal-overlay">
            <div className="edit-item-modal">
                <h2>Edit Inventory Item</h2>
                <form onSubmit={handleFormSubmit}>
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
                                onChange={(e) => setItemName(e.target.value)}
                                onSelect={(val) => setItemName(val)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Item Quantity:</label>
                        <select value={itemQuantity} onChange={handleItemQuantityChange} required>
                            <option value="A lot">A lot</option>
                            <option value="Some">Some</option>
                            <option value="A little">A little</option>
                        </select>
                    </div>
	    
	    <div className ="button-container">
                    <button type="submit">Save Item</button>
           
                <button onClick={onClose}>Close</button>
            </div>
	    </form>
        </div>
	    </div>
    );
};

export default EditItemModal;
