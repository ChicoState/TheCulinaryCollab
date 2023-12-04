import React, { useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './RegisterPage';

const WaitingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        await auth.onAuthStateChanged(async (user) => {
          if (user) {
            await user.reload();
            if (user.emailVerified) {
              // Email verified, navigate to the desired page
                        navigate('/workshop');
            }
          }
        });
      } catch (error) {
        alert('Error checking email verification: ', error);
      }
    };

    const interval = setInterval(checkEmailVerification, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div>
      <h2>Please wait while we verify your email...</h2>
    </div>
  );
};

export default WaitingPage;
