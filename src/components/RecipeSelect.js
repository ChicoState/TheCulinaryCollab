import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const RecipeSelector = ({ isOpen, onClose, onRecipeSelect, userId }) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            if (!userId) return;

            const q = query(collection(firestore, 'recipes'), where('ownerId', '==', userId));
            const querySnapshot = await getDocs(q);
            const fetchedRecipes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setRecipes(fetchedRecipes);
        };

        if (isOpen) {
            fetchRecipes();
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id} onClick={() => onRecipeSelect(recipe)}>
                        {recipe.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeSelector;

