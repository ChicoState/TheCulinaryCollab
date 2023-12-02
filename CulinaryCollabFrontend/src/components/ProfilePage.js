import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './ProfilePage.css';
const defaultProfilePic = 'https://firebasestorage.googleapis.com/v0/b/culinarycollab.appspot.com/o/profilePictures%2FD.png?alt=media&token=a23fae95-8ed6-4c3f-81da-9a49e92aa543';

const ProfilePage = () => {
	const [userData, setUserData] = useState(null);
	const [profilePic, setProfilePic] = useState('');
	const [uploading, setUploading] = useState(false);
	const [bio, setBio] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [personalRecipes, setPersonalRecipes] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [recipesPerPage] = useState(8);
	const user = auth.currentUser;

	const handleEditBio = () => {
		setIsEditing(true);
	};
	const handleSaveBio = async () => {
		const userRef = doc(firestore, 'users', user.uid);
		try {
			await updateDoc(userRef, { bio: bio });
			setIsEditing(false);
		} catch (error) {
			console.error('Error saving bio: ', error);
		}
	};
	useEffect(() => {
		const fetchUserData = async () => {
			if (user) {
				const userRef = doc(firestore, 'users', auth.currentUser.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					const userData = userSnap.data();
					setUserData(userData.originalUsername);
					setBio(userData.bio || '');
					setUserData(userData.originalUsername);
					const storageRef = ref(storage, `profilePictures/${user.uid}`);
					try {
						const photoURL = await getDownloadURL(storageRef);
						setProfilePic(photoURL);
					} catch (error) {
						console.error('Error fetching profile picture: ', error);
					}
				}
			}
		};
		const fetchProfileDisplayRecipes = async () => {
			if (auth.currentUser) {
				const recipesRef = collection(firestore, `users/${auth.currentUser.uid}/Profile-display`);
				const displaySnapshot = await getDocs(recipesRef);
				const fetchedRecipes = displaySnapshot.docs
					.map(doc => ({ ...doc.data(), id: doc.id }))
					.filter(recipe => recipe.id !== 'initial');
				setPersonalRecipes(fetchedRecipes);
			}
		};
		fetchProfileDisplayRecipes();
		fetchUserData();
	}, [user]);

	const indexOfLastRecipe = currentPage * recipesPerPage;
	const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
	const currentRecipes = personalRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

	const paginate = pageNumber => setCurrentPage(pageNumber);

	const renderPaginationButtons = () => {
		const pageNumbers = [];
		for (let i = 1; i <= Math.ceil(personalRecipes.length / recipesPerPage); i++) {
			pageNumbers.push(i);
		}
		return (
			<div className="pagination">
			<button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
			Previous
			</button>
			{pageNumbers.map(number => (
				<button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
				{number}
				</button>
			))}
			<button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
			Next
			</button>
			</div>
		);
	};
	const handleProfilePicChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const storageRef = ref(storage, `profilePictures/${user.uid}`);
		setUploading(true);

		try {
			const snapshot = await uploadBytes(storageRef, file);
			const photoURL = await getDownloadURL(snapshot.ref);
			setProfilePic(photoURL);

			const userRef = doc(firestore, 'usernames', user.displayName.toLowerCase());
			await updateDoc(userRef, { profilePic: photoURL });
			setUploading(false);
		} catch (error) {
			console.error("Error uploading file: ", error);
			setUploading(false);
		}
	};
	if (!auth.currentUser) {
		return (
			<div className="login-prompt">
			<h1>Please Log In</h1>
			<p>To access this page, you need to be logged in.</p>
			</div>
		);
	}
	return (
		<div className="profile-container">
		<img
		src={profilePic || defaultProfilePic}
		alt="Profile"
		className="profile-picture"
		onClick={() => document.getElementById('fileInput').click()}
		/>
		<input
		type="file"
		id="fileInput"
		accept="image/*"
		style={{ display: 'none' }}
		onChange={handleProfilePicChange}
		/>
		{uploading && <p>Uploading...</p>}

		<h2 className="username">{userData || 'No username set'}</h2>
		<p className="email">{user.email}</p>

		<div className="bio-box">
		<h2>Bio:</h2>
		{isEditing ? (
			<>
			<textarea
			value={bio}
			onChange={(e) => setBio(e.target.value)}
			className="bio-textarea"
			/>
			<button onClick={handleSaveBio}>Save</button>
			</>
		) : (
			<>
			<p className={`bio-content ${!bio && 'bio-empty'}`}>
			{bio || 'No bio set'}
			</p>
			<button onClick={handleEditBio}>Edit</button>
			</>
		)}
		</div>
		<div className="personal-recipes-grid">
		{currentRecipes.map(recipe => (
			<div key={recipe.id} className="recipe-item">
			<h3>{recipe.name}</h3>
			<p>{recipe.description}</p>
			</div>
		))}
		</div>

		{renderPaginationButtons()}
		</div>
	);
};

export default ProfilePage;

