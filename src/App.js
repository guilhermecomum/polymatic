import React, { useEffect, useContext, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import About from "./pages/About";
import Home from "./pages/Home";
import Playground from "./pages/Playground";
import Header from "./components/Header";
import instruments from "./instruments";
import "./custom.scss";
import "./App.sass";
import { store } from "./store";
import { Spinner } from "react-bootstrap";
import * as Tone from "tone";

function App() {
  const [loading, setLoading] = useState(true);
  const trackingId = "UA-160360260-2";
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname + window.location.search);
  const { dispatch } = useContext(store);

  useEffect(() => {
    const samplers = new Tone.ToneAudioBuffers({
      urls: {
        ...instruments,
      },
      onload: () => setLoading(false),
    });
    dispatch({
      type: "load.app",
      samplers: samplers,
    });
    const piano = new Tone.Sampler({
      urls: {
        A1: "A1.mp3",
        A2: "A2.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/casio/",
      onload: () => setLoading(false),
    }).toDestination();
    dispatch({
      type: "load.piano",
      piano: piano,
    });
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
        <Route exact path="/circle" component={Playground} />
      </Switch>
    </HashRouter>
  );
}

export default App;
