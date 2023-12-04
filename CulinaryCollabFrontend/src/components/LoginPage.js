import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import background from "./Champagne.jpg";
import {motion as m } from "framer-motion";
const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleLogin = async () => {
		let loginInput = email.toLowerCase();

		if (!loginInput.includes('@')) {
			try {
				const usernameRef = doc(firestore, 'usernames', loginInput);
				const usernameDoc = await getDoc(usernameRef);
				if (usernameDoc.exists()) {
					loginInput = usernameDoc.data().email;
					loginInput = loginInput.toLowerCase();
				} else {
					alert('Username not found');
					return;
				}
			} catch (error) {
				console.error('Error fetching username: ', error);
				return;
			}
		}

		try {
			await signInWithEmailAndPassword(auth, loginInput, password);
			navigate('/workshop');
		} catch (error) {
			alert('Incorrect password');
		}
	};
	return (
		<m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.75}}>
		<div className="login-container" style={{backgroundImage: `url(${background})`}}>
		<div className="login-form">
		<input 
		type="email" 
		value={email} 
		onChange={(e) => setEmail(e.target.value)} 
		placeholder="Email/Username" 
		/>
		<input 
		type="password" 
		value={password} 
		onChange={(e) => setPassword(e.target.value)} 
		placeholder="Password" 
		/>
		</div>
		<div className="login-buttons">
		<button className="common-button-style" onClick={handleLogin}>Login</button>
		<button className="common-button-style" onClick={() => navigate('/register')}>Create Account</button>
		</div>
		</div>
		</m.div>
	);
};

export default LoginPage;
