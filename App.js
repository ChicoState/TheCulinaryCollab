import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import PublicRecipesPage from './components/PublicRecipesPage';
import WorkshopPage from './components/WorkshopPage';
import BarHelpPage from './components/BarHelpPage';
import LoginPage from './components/LoginPage';
function App() {
    return (
        <Router>
            <div className="App">
                <Header pageTitle={""} /> {}
                <Routes>
	            <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/public-recipes" element={<PublicRecipesPage />} />
                    <Route path="/workshop" element={<WorkshopPage />} />
	            <Route path="/bar-help" element={<BarHelpPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

