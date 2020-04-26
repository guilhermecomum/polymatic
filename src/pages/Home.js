import React, { useState, useEffect } from "react";
import er from "euclidean-rhythms";
import Beet from "../lib/beet";
import Clavis from "../lib/clavis";
import Channel from "../lib/channel";
import shortid from "shortid";
import Layer from "../components/Layer";
import Preview from "../components/Preview";
import Toolbar from "../components/Toolbar";

function Home({ context, instruments }) {
  const [layers, setLayers] = useState([]);
  const [preview, setPreview] = useState(true);
  const [pattern, setPattern] = useState("");
  const [patternError, setPatternError] = useState(false);
  const [sequence, setSequence] = useState("");
  const [store, updateStore] = useState([]);

  const beet = new Beet({
    context: context
  });

  useEffect(() => {
    const handlePattern = value => {
      const isEuclidian = new RegExp("^(\\d+(\\.\\d+)?),(\\d+(\\.\\d+)?)$");
      const isBinary = new RegExp("^[0-1]{1,}$");
      if (isEuclidian.test(pattern)) {
        const [pulse, steps] = value
          .split(",")
          .map(number => parseInt(number))
          .sort((a, b) => a - b);
        const sequence = er.getPattern(pulse, steps).join("");
        setSequence(sequence);
        setPreview(true);
        setPatternError(false);
      } else if (isBinary.test(pattern)) {
        setSequence(pattern);
        setPreview(true);
        setPatternError(false);
      } else {
        if (value === "") {
          setSequence("");
        }
        setPreview(false);
        setPatternError(true);
      }
    };
    handlePattern(pattern);
  }, [sequence, pattern]);

  const handleLayer = (sequence, tempo, sample) => {
    setPreview(false);
    const beetPattern = beet.pattern(sequence);
    const clavis = new Clavis();
    const channel = new Channel();
    channel.configure(context, beet, instruments[sample]);
    const guia = {
      layer: beet.layer(beetPattern, tempo, clavis, channel.callbackOn)
    };
    guia.layer.tempo = tempo;
    beet.add(guia.layer);
    addLayer(sequence, tempo, guia.layer, clavis, channel, sample);
  };

  const handleStoreUpdate = clave => {
    clave.instruments.forEach(instrument => {
      const { sequence, tempo, sample } = instrument;
      updateStore([...store, { sequence, tempo, sample }]);
      handleLayer(sequence, tempo, sample);
    });
    beet.start();
  };

  const addLayer = (sequence, tempo, layer, clavis, channel, sample) => {
    setLayers(layers =>
      layers.concat({
        id: shortid.generate(),
        sequence: sequence,
        tempo: tempo,
        layer: layer,
        clavis: clavis,
        channel: channel,
        sample: sample
      })
    );
  };

  const removeLayer = guia => {
    beet.remove(guia.layer);
    guia.clavis.pause();
    setLayers(layers.filter(layer => layer.id !== guia.id));
  };

  const toolbarProps = {
    layers,
    beet,
    pattern,
    setPattern,
    patternError,
    sequence,
    setPreview,
    handleStoreUpdate
  };

  return (
    <div className="App">
      <Toolbar {...toolbarProps} />
      <div className="wrapper">
        {layers.map(layer => (
          <Layer key={layer.id} guia={layer} removeLayer={removeLayer} />
        ))}
        {preview && sequence.length > 0 && (
          <Preview {...{ sequence, clavis: new Clavis() }} />
        )}
      </div>
    </div>
  );
}

export default Home;
