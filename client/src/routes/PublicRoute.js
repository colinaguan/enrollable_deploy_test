import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();
    //console.log(currentUser ? "true":"false");

    // redirect the user to savedSchedules page if they already logged in
    return (
        <Route 
            {...rest}
            render={props => {
                return currentUser ? <Redirect to="/saved" /> : <Component {...rest} />
            }}
        >
        </Route>
    )
}
