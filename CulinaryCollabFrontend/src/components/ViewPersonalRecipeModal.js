import React, {useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import {doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import './ViewRecipeModal.css';
import RatingStars from './RatingStars';
const PersonalRecipeViewModal = ({ isOpen, onClose, recipe, onEdit, onDelete }) => {
	const [averageRating, setAverageRating] = useState(0);
	const [totalRatingsCount, setTotalRatingsCount] = useState(0);
	const [comments, setComments] = useState([]);
	const [showComments, setShowComments] = useState(false);

	useEffect(() => {
		const fetchRatings = async () => {
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
						rating: doc.data().rating,
						comment: doc.data().comment,
					});
				}
			});

			setAverageRating(count === 0 ? 0 : total / count);
			setTotalRatingsCount(count);
			setComments(commentsArray);
		};

		if (isOpen) {
			fetchRatings();
		}
	}, [isOpen, recipe]);

	if (!recipe) return null;
	const handleEditClick = () => {
		onEdit(recipe.id);
		onClose();
	}
	const handleDeleteClick = () => {
		onDelete(recipe.id);
		onClose();
	};

	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content">
		<button className="edit-button" onClick={handleEditClick}>Edit</button>

		{/* Display average rating */}
		{averageRating !== null && (
			<div className="average-rating-section">
			<p>
			Average Rating: <RatingStars value={averageRating} readOnly />
			<span className="ratings-count"> ({totalRatingsCount} Ratings)</span>
			</p>
			<div className="comments-toggle">
			<button onClick={() => setShowComments(!showComments)}>
			Show Comments ({comments.length})
			</button>
			</div>
			</div>
		)}

		{/* Comments Dropdown */}
		{showComments && (
			<div className="comments-dropdown">
			{comments.map((comment, index) => (
				<div key={index} className="comment-box">
				<p><strong>User:</strong> {comment.user}</p>
				<p>
				<strong>Rating:</strong>
				<RatingStars value={comment.rating} readOnly />
				</p>
				{comment.comment && <p><strong>Comment:</strong> {comment.comment}</p>}
				</div>
			))}
			</div>
		)}

		<h2>{recipe.name}</h2>
		<p><strong>Timing:</strong> {recipe.timing}</p>
		<p><strong>Taste:</strong> {recipe.taste}</p>
		<p><strong>Ingredients:</strong></p>
		<ul>
		{recipe.ingredients.map((ingredient, index) => (
			<li key={index}>
			{ingredient.ingredient} ({ingredient.amount} {ingredient.unit})
			</li>
		))}
		</ul>
		<p><strong>Preparation:</strong> {recipe.preparation}</p>
		{recipe.cost && <p><strong>Cost:</strong> {recipe.cost}</p>}
		{recipe.timeToMake && <p><strong>Time to Make:</strong> {recipe.timeToMake}</p>}
		<button onClick={handleDeleteClick}>Delete</button>
		<button onClick={onClose}>Close</button>
		</div>
		</div>
	);
};

export default PersonalRecipeViewModal;

