import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PublicRecipesPage from './components/PublicRecipesPage';
import WorkshopPage from './components/WorkshopPage';
import BrowseRecipesPage from './components/BrowseRecipesPage';
import InventoryPage from './components/InventoryPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SocialPage from './components/SocialPage';
import ProfilePage from './components/ProfilePage';
import UserProfilePage from './components/UserProfilePage';
import ChatPage from './components/ChatPage';
function App() {
	return (
		<Router>
		<div className="App">
		<Header pageTitle={""} /> {}
		<Routes>
		<Route path="/" element={<LandingPage />} />
		<Route path="/login" element={<LoginPage />} />
		<Route path="/public-recipes" element={<PublicRecipesPage />} />
		<Route path="/workshop" element={<WorkshopPage />} />
		<Route path="/browse" element={<BrowseRecipesPage />} />
		<Route path="/inventory-page" element={<InventoryPage />} />
		<Route path="/register" element={<RegisterPage />} />
		<Route path="/social" element={<SocialPage />} />
		<Route path="/profile" element={<ProfilePage />} />
		<Route path="/user/:uid" element={<UserProfilePage />} />
		<Route path="/chat/:friendId" element={<ChatPage />} />
		</Routes>
		</div>
		</Router>
	);
}

export default App;

