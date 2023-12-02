import React from 'react';
import './RatingStars.css';

const RatingStars = ({ value, onChange, readOnly }) => {
	const MAX_STARS = 5;
	const stars = Array.from({ length: MAX_STARS }, (_, index) => index + 1);

	const handleClick = (rating) => {
		if (!readOnly && onChange) {
			onChange(rating);
		}
	};

	return (
		<div className="star-rating">
		{stars.map((star) => (
			<span key={star} className={`star ${value >= star ? 'filled' : ''}`} onClick={() => handleClick(star)}>
			&#9733;
			</span>
		))}
		</div>
	);
};

export default RatingStars;

