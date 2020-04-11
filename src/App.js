import React from "react";
import { HashRouter, Route } from "react-router-dom";
import ReactGA from "react-ga";
import Home from "./pages/Home";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const trackingId = "UA-160360260-2";
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname + window.location.search);

  return (
    <HashRouter basename="/">
      <Header />
      <Route exact path="/" component={Home} />
    </HashRouter>
  );
}

export default App;
