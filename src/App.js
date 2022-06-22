import React from "react";
import "rsuite/dist/styles/rsuite-default.min.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path = "/" element = {<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
