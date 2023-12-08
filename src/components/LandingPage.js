import React from 'react';
import {motion as m } from "framer-motion";
import YellowInfographic from './Yellow_Landingpage_p2.png'; // Import the image
function LandingPage() {
	return (
		<m.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.75}}>
		<div className="landing-page-container">
		<div className="landing-content">
		{}
		<img
            src={YellowInfographic}
            alt="Culinary Image"
            className="landing-image"
          />
		</div>
		<div className="about-content">
            		<h1>About Us</h1>
            		<div className="about-box">
                		<p>In TheCullinaryCollab, we are a small community of students driven by the passion to learn and exchange new drink recipes with everyone! Our goal is to enable users to share their uniquely favorite creations and effortlessly access a variety of recipes within our platform</p>
            		</div>
        	</div>
		</div>
		</m.div>
	);
}

export default LandingPage;

