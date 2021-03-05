import React,{ useState } from 'react';
import Login from "./Login"
import Signup from "./Signup"
import "../style/Login.css"
import Alert from 'react-bootstrap/Alert';

function LoginPage({ setFavList }) {
    const [loginActive, setLoginActive] = useState(true);
    const [signupActive, setSignupActive] = useState(false);
    
    const [errorDisplay, setErrorDisplay] = useState(false);
    const [errorContent, setErrorContent] = useState('');
    
    function toggleActive(){
        setLoginActive(!loginActive);
        setSignupActive(!signupActive);
        setErrorDisplay(false);
        setErrorContent('');
    }
    
    return (
        <div className="center">
            <section className="loginBlock">
                <div className="tabs">
                    <li onClick={toggleActive} className={loginActive ? "active" : ""}>Login</li>
                    <li onClick={toggleActive} className={signupActive ? "active" : ""}>Sign up</li>
                </div>
              
                <div className="formBlock">
                    {loginActive ? <Login setErrorDisplay={setErrorDisplay} setErrorContent={setErrorContent} setFavList={setFavList}/> : <Signup setErrorDisplay={setErrorDisplay} errorDisplay={errorDisplay} errorContent={errorContent} setErrorContent={setErrorContent}/>}
                </div>
            </section> 
            
            <div>
                {errorDisplay && <div className="alertBox">
                    <Alert variant="danger" onClose={() => setErrorDisplay(false)} dismissible >
                        <Alert.Heading>error!</Alert.Heading>
                        <p>
                            {errorContent}
                        </p>
                    </Alert>
                </div>}
            </div>  
        
        </div>  
    );
}

export default LoginPage;
