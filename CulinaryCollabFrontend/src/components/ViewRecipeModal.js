import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import './ViewRecipeModal.css';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore';

const ViewRecipeModal = ({ isOpen, onClose, recipe, onSave, showSaveOption }) => {
	const [userRating, setUserRating] = useState(null);
	const [totalRatingsCount, setTotalRatingsCount] = useState(0);
	const [tempRating, setTempRating] = useState(0);
	const [comment, setComment] = useState('');
	const [averageRating, setAverageRating] = useState(null);
	const [comments, setComments] = useState([]);
	const [showComments, setShowComments] = useState(false);
	const [username, setUsername] = useState('');
	const user = auth.currentUser;

	useEffect(() => {
		const fetchUserData = async () => {
			if (user) {
				const userRef = doc(firestore, 'users', user.uid);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists()) {
					setUsername(userSnap.data().originalUsername);
				}
			}
		};

		if (isOpen) {
			fetchUserData();
			fetchRatings();
		}
	}, [isOpen, user]);

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

	const handleSubmitRating = async () => {
		if (user && username) {
			const ratingRef = doc(firestore, `recipes/${recipe.id}/ratings`, user.uid);
			await setDoc(ratingRef, { 
				rating: tempRating,
				comment: comment,
				username: username
			});
			setUserRating(tempRating);
			setTempRating(0);
			setComment('');
			fetchRatings();
		}
	};
	if (!recipe) return null;

	return (
		<div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content">
		<h2>{recipe.name}</h2>
		{user && (
			<div>
			<p>Your Rating:</p>
			<RatingStars value={tempRating || userRating || 0} onChange={setTempRating} />
			<input
			type="text"
			value={comment}
			onChange={(e) => setComment(e.target.value)}
			placeholder="Add a comment"
			/>
			<button onClick={handleSubmitRating}>Submit Rating</button>
			</div>
		)}
		{averageRating !== null && (
			<div className="average-rating-section">
			<div className="average-rating">
			<p>
			Average Rating: <RatingStars value={averageRating} readOnly />
			<span className="ratings-count"> ({totalRatingsCount} Ratings)</span>
			</p>
			</div>
			<div className="comments-toggle">
			<button onClick={() => setShowComments(!showComments)}>
			Show Comments ({comments.length})
			</button>
			</div>
			</div>
		)}

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
		{showSaveOption && user && <button onClick={onSave}>Save Recipe</button>}
		<button onClick={onClose}>Close</button>
		</div>
		</div>
	);
};

export default ViewRecipeModal;
