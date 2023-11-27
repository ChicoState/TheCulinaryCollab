import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
const RegisterPage = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const validatePassword = (password) => {
		return password.length >= 6 &&
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/[0-9]/.test(password);
	};

	const validateUsername = (username) => {
		const isValidLength = username.length >= 4 && username.length < 15;
		const hasValidCharacters = /^[a-zA-Z0-9_]+$/.test(username);
		const noSpaces = !/\s/.test(username);
		return isValidLength && hasValidCharacters && noSpaces;
	};

	const isUsernameUnique = async (username) => {
		const usernameRef = doc(firestore, 'usernames', username.toLowerCase());
		const docSnap = await getDoc(usernameRef);
		return !docSnap.exists();
	};


	const handleRegister = async () => {
		if (!validatePassword(password)) {
			alert('Password must have at least 6 characters, including an uppercase letter, a lowercase letter, and a number.');
			return;
		}
		if (!validateUsername(username)) {
			alert('Username must be 4-15 characters long, contain no spaces, and only include letters, numbers, and underscores.');
			return;
		}
		const lowerCaseUsername = username.toLowerCase();
		const lowerCaseEmail = email.toLowerCase();

		const uniqueUsername = await isUsernameUnique(lowerCaseUsername);
		if (!uniqueUsername) {
			alert('Username is already taken. Please choose a different username.');
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, lowerCaseEmail, password);
			await setDoc(doc(firestore, 'users', userCredential.user.uid), { username: lowerCaseUsername, originalUsername: username, email: lowerCaseEmail });	
			await setDoc(doc(firestore, 'usernames', lowerCaseUsername), { email: lowerCaseEmail });
			await setDoc(doc(firestore, `users/${userCredential.user.uid}/personalRecipes`, 'initial'), {});
			await setDoc(doc(firestore, `users/${userCredential.user.uid}/savedRecipes`, 'initial'), {});
			await setDoc(doc(firestore, `users/${userCredential.user.uid}/inventory`, 'initial'), {});
			await setDoc(doc(firestore, 'users', userCredential.user.uid), {
				username: lowerCaseUsername,
				originalUsername: username,
				email: lowerCaseEmail,
				friendRequests: [], // Initialize friendRequests as an empty array
				friendsList: [] // Also initialize friendsList as an empty array if needed
				// Add other fields as needed
			});		
			navigate('/workshop');
		} catch (error) {
			console.error('Error during registration: ', error);
			if (error.code === 'auth/invalid-email') {
				alert('The email address is not valid. Please enter a valid email address.');
			}
			else {
				alert('Registration failed. Please try again.');
			}
		}
	};

	return (
		<div className="register-page">
		<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
		<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
		<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
		<button className="common-button-style" onClick={handleRegister}>Register</button>
		<button className="common-button-style" onClick={() => navigate('/login')}>Back to Login</button>
		</div>
	);
};

export default RegisterPage;

