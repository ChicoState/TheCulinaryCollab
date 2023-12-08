import React from 'react';
import './RecipeFullScreen.css';

const RecipeFullScreen = ({ recipe, onClose }) => {
    return (
        <div className="recipe-full-screen">
            <button className="close-button" onClick={onClose}>X</button>
            <h3>{recipe.name}</h3>
        </div>
    );
};

export default RecipeFullScreen;

