import Metro from "./wa-metro.js";
import WatchJS from "melanke-watchjs";

const watch = WatchJS.watch;

function Layer(id, context, tempo, sequence, on, off) {
  if (!off) off = function() {};
  var self = this;
  this.idi = id;
  this.on = on;
  this.off = off;
  this.tempo = tempo;
  self.metro = new Metro(context, function(time, step, timeFromScheduled) {
    if (self.metro.steps !== sequence.seq.length) {
      self.metro.steps = sequence.seq.length;
    }
    if (sequence.seq[step - 1] === "1") {
      self.on(time, step, timeFromScheduled);
    } else {
      self.off(time, step, timeFromScheduled);
    }
  });

  this.metro.steps = sequence.seq.length;
  this.metro.tempo = this.tempo;

  watch(self, ["tempo"], function() {
    self.metro.tempo = self.tempo;
  });
}

Layer.prototype.start = function() {
  this.metro.start();
  return this;
};

Layer.prototype.pause = function() {
  this.metro.pause();
  return this;
};

Layer.prototype.stop = function() {
  this.metro.stop();
  return this;
};

export default Layer;
