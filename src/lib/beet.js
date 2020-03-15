import shortid from "shortid";
import Pattern from "./pattern";
import Layer from "./layer";

class Beet {
  constructor({ context, tempo }) {
    this.context = context;
    this.tempo = tempo || 120;
    this.layers = [];
  }

  layer(sequence, on, off) {
    return new Layer(
      shortid.generate(),
      this.context,
      this.tempo,
      sequence,
      on,
      off
    );
  }

  pattern(pulses, steps) {
    return new Pattern(pulses, steps);
  }

  add(layer) {
    this.layers.push(layer);
  }

  remove(layer) {
    layer.metro.stop();
    this.layers = this.layers.filter(item => item.id !== layer.id);
  }

  start() {
    this.layers.forEach(layer => {
      layer.start();
    });
  }

  pause() {
    this.layers.forEach(function(layer) {
      layer.pause();
    });
  }

  load(context, path, success, failure) {
    var request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
      context.decodeAudioData(request.response, success, failure);
    };
    request.onerror = failure;
    request.send();
  }

  changeTempo(value) {
    for (const layer of this.layers) {
      layer.metro.tempo = value;
    }
  }
}

export default Beet;
