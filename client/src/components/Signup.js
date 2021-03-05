import React, { useState} from 'react'
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function Signup(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const { signup, firestoreInit } = useAuth()
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    

    async function handleSubmit(e) {
        e.preventDefault()

        if (password !== passwordConfirm){
            props.setErrorDisplay(true);
            return props.setErrorContent('Passwords do not match');//setError('Passwords do not match')
        }

        try {
            props.setErrorDisplay(false);
            props.setErrorContent('');
            setLoading(true)
            await signup(email, password) 
            await firestoreInit(email, firstName, lastName)
            history.push("/search")
        } catch (error) {
            props.setErrorDisplay(true);
            props.setErrorContent(error.message);
        }
        setLoading(false)
    }


    return (
        <div>
            <form action="">
                <input type="text" 
                    id="first" 
                    placeholder="First Name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required />
                <input type="text" 
                    id="last" 
                    placeholder="Last Name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required />
                <input type="email" 
                    id="signupEmail" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                <input type="password" 
                    id="signupPassword" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <input type="password" 
                    id="confirm" 
                    placeholder="Confirm Password" 
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required />
                <div>
                    <button type="submit" id="signup" disabled={loading} onClick={handleSubmit}>
                        Sign Up
                    </button>
                </div>
            </form>
        </div>  
    );
}
export default Signup;