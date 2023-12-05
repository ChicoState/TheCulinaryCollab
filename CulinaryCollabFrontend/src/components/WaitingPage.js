import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const WaitingPage = () => {
    const navigate = useNavigate();
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                setIsEmailVerified(true);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isEmailVerified) {
            navigate('/workshop');
        }
    }, [isEmailVerified, navigate]);

    return (
        <div>
            <h2>Please wait while we verify your email...</h2>
        </div>
    );
};

export default WaitingPage;

