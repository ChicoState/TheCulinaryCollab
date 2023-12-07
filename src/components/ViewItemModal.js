import React from 'react';
import './ViewItemModal.css';

const ViewItemModal = ({ item, onClose, onEdit, onDelete }) => {
	return (
		<div className="modal-overlay">
		<div className="view-item-modal">
		<button className="edit-button-item" onClick={onEdit}>Edit</button>
		<h2>{item.name}</h2>
		<p>Quantity: {item.quantity}</p>
		<div className="button-container">
		<button className="delete-button-item" onClick={() => onDelete(item.id)}>Delete</button>
		<button className="close-button=item" onClick={onClose}>Close</button>
		</div>
		</div>
		</div>
	);
};

export default ViewItemModal;

