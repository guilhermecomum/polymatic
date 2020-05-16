import React, { useEffect, useContext, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import About from "./pages/About";
import Home from "./pages/Home";
import Header from "./components/Header";
import BufferLoader from "./lib/bufferLoader";
import instruments from "./instruments";
import "./custom.scss";
import "./App.sass";
import { store } from "./store";
import { Spinner } from "react-bootstrap";
const context = new (window.AudioContext || window.webkitAudioContext)();

function App() {
  const [loading, setLoading] = useState(true);
  const trackingId = "UA-160360260-2";
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname + window.location.search);
  const { dispatch } = useContext(store);

  useEffect(() => {
    const finishedLoading = bufferList => {
      dispatch({
        type: "load.app",
        instruments: bufferList,
        context: context
      });
      setLoading(false);
    };

    let bufferLoader = new BufferLoader(context, instruments, finishedLoading);

    bufferLoader.load();
  }, [dispatch]);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <HashRouter basename="/">
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/sobre" component={About} />
        <Route exact path="/guias" component={Home} />
      </Switch>
    </HashRouter>
  );
}

export default App;
