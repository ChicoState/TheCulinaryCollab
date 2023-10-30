import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';


const LoginInfo = [ /*array of usernames and passwords for testing, will reroute to use the database of user info instead later*/
    {
        Username : "User1",
        Password : "Password1"
    },
    {
        Username : "User2",
        Password : "Password2"
    },
    {
        Username : "User3",
        Password : "Password3"
    },
];

function toggleBadLoginTextUser(value){
    var text = document.getElementById("bad_credentials_user");
    if(value){
        text.style.display = "block";
    }else{
        text.style.display = "none";
    }
}
function toggleBadLoginTextPass(value){
    var text = document.getElementById("bad_credentials_pass");
    if(value){
        text.style.display = "block";
    }else{
        text.style.display = "none";
    }
}


const LoginPage = () => {
    const [UsernameTerm, setUsernameTerm] = useState('');
    const [PasswordTerm, setPasswordTerm] = useState('');

    const navigate = useNavigate();

    const handleUsernameChange = (e) => {/*here*/
        const username = e.target.value;
        setUsernameTerm(username);
        if (username.length > 1 || username.length === 0) {
            //handleSearch(term); 
        }
    };

    const handlePasswordChange = (e) => {/*here*/
        const password = e.target.value;
        setPasswordTerm(password);
        if (password.length > 1 || password.length === 0) {
            //handleSearch(term); 
        }
    };

    const LoginCheck = () => {
        console.log(UsernameTerm);
        console.log(PasswordTerm);
        //replace LoginInfo with the database holding users login info
        const checkCred = LoginInfo.filter((credentials) =>
            credentials.Username === (UsernameTerm) &&
            credentials.Password === (PasswordTerm)
        );

        if(checkCred.length > 0 && UsernameTerm.length > 0 && PasswordTerm.length > 0){//username and password found
            //success
            console.log("Working Login");
            navigate('/')
        }else{

            const checkUser = LoginInfo.filter((credentials) => 
            credentials.Username === (UsernameTerm)
            );

            if(checkUser <= 0 || UsernameTerm.length <= 0){
                console.log("User on");
                toggleBadLoginTextUser(true);
            }else{
                console.log("User off");
                toggleBadLoginTextUser(false);
            }

            const checkPass = LoginInfo.filter((credentials) => 
            credentials.Username === (UsernameTerm) &&
            credentials.Password === (PasswordTerm)
            );

            if(checkPass <= 0 || PasswordTerm.length <= 0){
                console.log("Pass on");
                toggleBadLoginTextPass(true);
            }else{
                console.log("pass off");
                toggleBadLoginTextUser(false);
            }
            
            console.log("Bad Login Credentials");
        }

    };
return(
    <div className="login-page-container">
        <div className="login-container">
            <label for="">Username</label>
            <div className="username-container">
                <input
                type="text"
                placeholder="Username"
                value={UsernameTerm}
                onChange={handleUsernameChange}
                />
            </div>
            <label for="">Password</label>
            <div className="password-container">
                <input
                type="text"
                placeholder="Password"
                value={PasswordTerm}
                onChange={handlePasswordChange}
                />
            </div>
            <p id='bad_credentials_user' class='bad_credentials'>Invalid Username</p>
            <p id='bad_credentials_pass' class='bad_credentials'>Invalid Password</p>
            
            <button className="login-button" onClick={LoginCheck}>Login</button>

        </div>
    </div>
);
}

export default LoginPage;