import shortid from "shortid";
import Pattern from "./pattern";
import Layer from "./layer";

class Beet {
  constructor({ context, tempo }) {
    this.context = context;
    this.tempo = tempo || 120;
    this.layers = [];
  }

  layer(sequence, clavis, on, off) {
    return new Layer(
      shortid.generate(),
      this.context,
      this.tempo,
      clavis,
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

  envelope(audioParam, now, opts) {
    if (!opts) opts = {};
    var peak = opts.peak || audioParam.defaultValue;
    if (opts.start === 0) opts.start = 0.000001;
    var start = opts.start || audioParam.value;
    var attack = opts.attack || 0.1;
    var decay = opts.decay || 0.0;
    var sustain = opts.sustain || peak;
    var release = opts.release || 0.5;

    audioParam.setValueAtTime(start, now);
    audioParam.linearRampToValueAtTime(peak, now + attack);
    audioParam.linearRampToValueAtTime(sustain, now + attack + decay);
    audioParam.linearRampToValueAtTime(0, now + attack + decay + release);
  }

  changeTempo(value) {
    for (const layer of this.layers) {
      layer.metro.tempo = value;
    }
  }
}

export default Beet;
