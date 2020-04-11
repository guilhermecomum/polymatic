import React, { useState, useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";
import ReactGA from "react-ga";
import Home from "./pages/Home";
import Header from "./components/Header";
import BufferLoader from "./lib/bufferLoader";
import instruments from "./instruments";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [loadedSamples, setLoadedSamples] = useState();
  const trackingId = "UA-160360260-2";
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname + window.location.search);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();

  useEffect(() => {
    let bufferLoader = new BufferLoader(context, instruments, finishedLoading);

    bufferLoader.load();
  }, []);

  const finishedLoading = bufferList => setLoadedSamples(bufferList);

  return (
    <HashRouter basename="/">
      <Header />
      <Route
        exact
        path="/"
        render={routeProps => (
          <Home {...routeProps} instruments={loadedSamples} context={context} />
        )}
      />
    </HashRouter>
  );
}

export default App;
