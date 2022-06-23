import React from "react";
import { Switch } from "react-router";
import SignIn from "./Pages/SignIn";
import PrivateRoute from "./My Components/PrivateRoute";
import "rsuite/dist/styles/rsuite-default.min.css";
import "./styles/utility.scss";
import "./styles/main.scss";

import Home from "./Pages/Home";
import PublicRoute from "./My Components/PublicRoute";
import { ProfileProvider } from "./Context/profileContext";

const App = () => {
  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute path="/signin">
          <SignIn />
        </PublicRoute>
        <PrivateRoute path="/">
          <Home />
        </PrivateRoute>
      </Switch>
    </ProfileProvider>
  );
};

export default App;
