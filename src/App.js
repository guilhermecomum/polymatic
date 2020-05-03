import React, { useState, useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";
import ReactGA from "react-ga";
import About from "./pages/About";
import Home from "./pages/Home";
import Header from "./components/Header";
import BufferLoader from "./lib/bufferLoader";
import instruments from "./instruments";
import "./custom.scss";
import "./App.sass";

const context = new (window.AudioContext || window.webkitAudioContext)();

function App() {
  const [loadedSamples, setLoadedSamples] = useState();
  const trackingId = "UA-160360260-2";
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname + window.location.search);

  const finishedLoading = bufferList => setLoadedSamples(bufferList);

  useEffect(() => {
    let bufferLoader = new BufferLoader(context, instruments, finishedLoading);

    bufferLoader.load();
  }, []);

  return (
    <HashRouter basename="/">
      <Header />

      <Route exact path="/sobre">
        <About />
      </Route>
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
