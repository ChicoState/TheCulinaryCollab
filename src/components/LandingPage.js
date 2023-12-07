import React from 'react';
import {motion as m } from "framer-motion";

function LandingPage() {
	return (
		<m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.75}}>
		<div className="landing-page-container">
		<div className="landing-content">
		{}
		</div>
		<div className="about-content">
            		<h1>About Us</h1>
            		<div className="about-box">
                		<p>In TheCullinaryCollab, we are just a small group of students who had an idea of being able to learn and share new drinks to anyone they want! We plan to allow users to share their creations with other users and be able to keep up with any and all recipies!</p>
            		</div>
        	</div>
		</div>
		</m.div>
	);
}

export default LandingPage;

