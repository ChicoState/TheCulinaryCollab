import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    const [workshopRecipes, setWorkshopRecipes] = useState([]); // State to store workshop recipes

    // Function to add a recipe to the workshop
    const addRecipeToWorkshop = (recipe) => {
        setWorkshopRecipes([...workshopRecipes, recipe]);
    };

    return (
        <div className="landing-page-container">
            <div className="landing-content">
                <h2>Workshop Recipes</h2>
                <ul>
                    {workshopRecipes.map((recipe, index) => (
                        <li key={index}>{recipe}</li>
                    ))}
                </ul>
            </div>

            <div className="about-button-container">
                <Link to="/about">
                    <button className="about-button">About</button>
                </Link>
                {/* Button to add a recipe to the workshop */}
                <button onClick={() => addRecipeToWorkshop("New Recipe")}>Add Recipe to Workshop</button>
                {/* Button to share a recipe */}
                <button onClick={() => alert("Recipe shared!")}>Share Recipe</button>
            </div>
        </div>
    );
}

export default LandingPage;

