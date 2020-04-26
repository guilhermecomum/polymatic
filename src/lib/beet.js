/**
 Original code
 Author: Ehsan Ziya <ehsan.ziya@gmail.com>
 source: https:github.com/zya/beet.js
**/

import shortid from "shortid";
import Pattern from "./pattern";
import Layer from "./layer";

class Beet {
  constructor({ context }) {
    this.context = context;
    this.tempo = 120;
    this.layers = [];
  }

  layer(sequence, tempo, clavis, on) {
    return new Layer(
      shortid.generate(),
      this.context,
      tempo,
      clavis,
      sequence,
      on
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
