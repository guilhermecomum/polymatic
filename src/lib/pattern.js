import er from "euclidean-rhythms";
import WatchJS from "melanke-watchjs";

const watch = WatchJS.watch;

function Pattern(pulses, steps) {
  var self = this;

  self._createSequence(pulses, steps);

  watch(this, ["pulses", "steps"], function() {
    self.update(this.pulses, this.steps);
  });

  return this;
}

Pattern.prototype.update = function(pulses, steps) {
  var self = this;
  self._createSequence(pulses, steps);

  return this;
};

Pattern.prototype.shift = function(offset) {
  var off =
    offset > this.seq.length ? (offset = offset - this.seq.length) : offset;
  if (off === this.seq.length) return this;

  var tail = this.seq.splice(this.seq.length - off, off);

  for (var i = 0; i < tail.length; i++) {
    this.seq.unshift(tail[i]);
  }
  return this;
};

Pattern.prototype._createSequence = function(pulses, steps) {
  var self = this;
  var typeOfPulses = typeof pulses;

  if (typeOfPulses === "number") {
    self.pulses = pulses;
    self.steps = steps || pulses;
    self.seq = er.getPattern(self.pulses, self.steps);
  } else if (typeOfPulses === "string") {
    self.steps = pulses.length;
    self.seq = pulses.split("");
  }

  return this;
};

export default Pattern;
