import React from "react";
import { Switch } from "react-router";
import SignIn from "./Pages/SignIn";
import PrivateRoute from "./My Components/PrivateRoute"
import "rsuite/dist/styles/rsuite-default.min.css";
import "./styles/utility.scss";
import "./styles/main.scss";

import Home from "./Pages/Home";
import PublicRoute from "./My Components/PublicRoute";


const App = () => {
  return (
    <Switch>
      <PublicRoute path = "/signin"><SignIn /></PublicRoute>
      <PrivateRoute path = "/">
        <Home />
      </PrivateRoute>
    </Switch>
  );
}

export default App;
