import React, { useEffect, useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Header.css';

const Header = ({ pageTitle }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showSocialsDropdown, setShowSocialsDropdown] = useState(false);
	const [showDrinksDropdown, setShowDrinksDropdown] = useState(false);
	const navigate = useNavigate();

	const closeAllDropdowns = () => {
		setShowSocialsDropdown(false);
		setShowDrinksDropdown(false);
	};

	const handleUserClick = (path) => {
		closeAllDropdowns();
		navigate(path);
	};
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsLoggedIn(!!user); 
		});
		return () => unsubscribe();
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate('/login');
		} catch (error) {
			console.error('Error signing out: ', error);
		}
	};

return (
    <header className="header">
        <div className="logo-container" onClick={() => {closeAllDropdowns(); navigate('/')}}>
            <img src="/Logo.png" alt="Culinary Collab Logo" className="header-logo" />
            <h1 className="header-title">The Culinary Collab</h1>
        </div>
        <h2>{pageTitle}</h2>
        <nav className="navigation">
            <div className="dropdown">
                <button 
                    className="button-text-black" 
                    onClick={() => {
                        closeAllDropdowns();
                        setShowSocialsDropdown(!showSocialsDropdown);
                    }}>
                    Socials
                </button>
                <div className={`dropdown-content ${showSocialsDropdown ? 'show' : 'show'}`}>
                    <Link to="/profile">My Profile</Link>
                    <Link to="/social">Social</Link>
                </div>
            </div>
            <div className="dropdown">
                <button 
                    className="button-text-black" 
                    onClick={() => {
                        closeAllDropdowns();
                        setShowDrinksDropdown(!showDrinksDropdown);
                    }}>
                    Drinks
                </button>
                <div className={`dropdown-content ${showDrinksDropdown ? 'show' : 'show'}`}>
                    <Link to="/workshop">My drinks</Link>
                    <Link to="/browse">Browse</Link>
                    <Link to="/inventory-page">Inventory Page</Link>
                </div>
            </div>
            {isLoggedIn ? (
                <button 
                    className="button-text-black" 
                    onClick={() => {
                        closeAllDropdowns();
                        handleLogout();
                    }}>
                    Logout
                </button>
            ) : (
                <button 
                    className="button-text-black" 
                    onClick={() => handleUserClick('/login')}>
                    Login
                </button>
            )}
        </nav>
    </header>
);
};
export default Header;

