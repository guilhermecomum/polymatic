import WatchJS from "melanke-watchjs";
import Pattern from "./pattern";
import Layer from "./layer";
import utils from "./utils";

const watch = WatchJS.watch;

if (!Array.from) {
  Array.from = function(object) {
    return [].slice.call(object);
  };
}

function Beet(opts) {
  this.context = opts.context;
  this.tempo = opts.tempo || 120;
  this.layers = [];
  var self = this;

  watch(this, "tempo", function() {
    self._change_tempo(self.tempo);
  });
}

Beet.prototype.layer = function(seq, on, off) {
  var layer = new Layer(this.context, this.tempo, seq, on, off);
  return layer;
};

Beet.prototype.pattern = function(pulses, steps) {
  var pattern = new Pattern(pulses, steps);
  return pattern;
};

Beet.prototype.add = function() {
  var self = this;
  var array = Array.from(arguments);

  array.forEach(function(layer) {
    self.layers.push(layer);
  });

  return this;
};

Beet.prototype.remove = function(layer) {
  var index = this.layers.indexOf(layer);
  var found = this.layers[index];
  found.metro.stop();
  this.layers.splice(index, 1);
  return this;
};

Beet.prototype.start = function(when) {
  var self = this;
  var start_time = when || 0;
  setTimeout(function() {
    self.layers.forEach(function(layer) {
      layer.start();
    });
  }, start_time * 1000);
  return this;
};

Beet.prototype.stop = function(when) {
  var self = this;
  var start_time = when || 0;
  setTimeout(function() {
    self.layers.forEach(function(layer) {
      layer.stop();
    });
  }, start_time * 1000);
  return this;
};

Beet.prototype.pause = function(when) {
  var self = this;
  var start_time = when || 0;
  setTimeout(function() {
    self.layers.forEach(function(layer) {
      layer.pause();
    });
  }, start_time * 1000);
  return this;
};

Beet.prototype.utils = utils;

Beet.prototype._change_tempo = function(value) {
  this.layers.forEach(function(layer) {
    layer.metro.tempo = value;
  });
};

export default Beet;
