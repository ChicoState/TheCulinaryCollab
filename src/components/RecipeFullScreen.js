import React, { useEffect, useState } from 'react';
import './RecipeFullScreen.css';
import RatingStars from './RatingStars';
import './ViewRecipeModal.css';
import { firestore } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';
const RecipeFullScreen = ({ recipe, onClose }) => {
	const [averageRating, setAverageRating] = useState(null);
	const [comments, setComments] = useState([]);
	useEffect(() => {
		if (recipe) {
			fetchRatingsAndComments();
		}
	}, [recipe]);
	const fetchRatingsAndComments = async () => {
		if (!recipe) return;

		const ratingsRef = collection(firestore, `recipes/${recipe.id}/ratings`);
		const ratingsSnap = await getDocs(ratingsRef);
		let total = 0;
		let count = 0;
		let commentsArray = [];

		ratingsSnap.forEach((doc) => {
			total += doc.data().rating;
			count++;
			if (doc.data().comment) {
				commentsArray.push({
					user: doc.data().username,
					comment: doc.data().comment,
					rating: doc.data().rating,
				});
			}
		});
		setAverageRating(count === 0 ? 0 : total / count);
		setComments(commentsArray);
	};
	return (
		<div className="recipe-full-screen">
		<button className="close-button" onClick={onClose}>
		<span>X</span>
		</button>
		<h1 className="recipe-name">{recipe.name}</h1>
		<div className="recipe-details">
		{recipe.timing && <p><strong>Timing:</strong> {recipe.timing}</p>}
		{recipe.taste && <p><strong>Taste:</strong> {recipe.taste}</p>}
		{recipe.ingredients && (
			<div>
			<p><strong>Ingredients:</strong></p>
			<ul>
			{recipe.ingredients.map((ingredient, index) => (
				<li key={index}>
				{ingredient.ingredient} ({ingredient.amount} {ingredient.unit})
				</li>
			))}
			</ul>
			</div>
		)}
		{recipe.preparation && <p><strong>Preparation:</strong> {recipe.preparation}</p>}
		{recipe.cost && <p><strong>Cost:</strong> {recipe.cost}</p>}
		{recipe.timeToMake && <p><strong>Time to Make:</strong> {recipe.timeToMake}</p>}
		{/* Display Average Rating */}
		{averageRating !== null && (
			<div>
			<p><strong>Average Rating:</strong></p>
			<RatingStars value={averageRating} readOnly />
			</div>
		)}

		{/* Display Comments */}
		{comments.length > 0 && (
			<div>
			<h3>Comments</h3>
			{comments.map((comment, index) => (
				<div key={index} className="comment-box">
				<p><strong>User:</strong> {comment.user}</p>
				<p>
				<strong>Rating:</strong> 
				<RatingStars value={comment.rating} readOnly />
				</p>
				<p><strong>Comment:</strong> {comment.comment}</p>
				</div>
			))}
			</div>
		)}
		</div>
		</div>
	);
};

export default RecipeFullScreen;
