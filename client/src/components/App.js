import React, { useState } from 'react';
import {
  Switch,
  Route
} from "react-router-dom";
import Header from './Header';
import LoginPage from './LoginPage';
import ClassSearchPage from './ClassSearchPage';
import GenerateSchedulesPage from './GenerateSchedulesPage';
import SavedSchedulesPage from './SavedSchedulesPage';
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoute from "../routes/PrivateRoute";
import PublicRoute from "../routes/PublicRoute";

function App() {
  const [favList, setFavList] = useState([]);
  return (
    <div>
      <AuthProvider>
        <Header/>
          <Switch>
            <Route path="/search">
              <PrivateRoute component={ClassSearchPage} favList={favList} setFavList={setFavList} />
            </Route>
            <Route path="/generate">
              <PrivateRoute component={GenerateSchedulesPage} favList={favList} setFavList={setFavList} />
            </Route>
            <Route path="/saved">
              <PrivateRoute component={SavedSchedulesPage} />
            </Route>
            <Route path="/">
              <PublicRoute component={LoginPage} setFavList={setFavList} />
            </Route>
          </Switch>
    </AuthProvider>
    </div>
  );
}

export default App;