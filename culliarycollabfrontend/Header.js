import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ pageTitle }) => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="logo-container" onClick={() => navigate('/')}>
                <span className="dummy-logo">🔶</span>
                <h1>Cullinary Collab</h1>
            </div>
            <h2>{pageTitle}</h2>
            <nav className="navigation">
                <button onClick={() => navigate('/public-recipes')}>Public Recipes</button>
                <button onClick={() => navigate('/workshop')}>Workshop</button>
	            <button onClick={() => navigate('/bar-help')}>Bar Help</button>
                <button onClick={() => navigate('/login')}>Login</button>
            </nav>
        </header>
    );
};

export default Header;

