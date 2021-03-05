import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();
    //console.log(currentUser ? "true":"false");

    // redirect user to login page if they are not logged in
    return (
        <Route 
            {...rest}
            render={props => {
                return currentUser ? <Component {...rest} /> : <Redirect to="/" />
            }}
        >
        </Route>
    )
}
