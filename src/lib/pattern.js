/**
 Original code
 Author: Ehsan Ziya <ehsan.ziya@gmail.com>
 source: https:github.com/zya/beet.js
**/

import er from "euclidean-rhythms";

class Pattern {
  constructor(pulses, steps) {
    this.pulses = pulses;
    this.steps = steps;
    this.sequence = "";
    this.createSequence(pulses, steps);
  }

  update(pulses, steps) {
    this.createSequence(pulses, steps);
  }

  shift(offset) {
    if (offset === this.sequence.length) return this.pulses;

    var tail = this.sequence.splice(this.sequence.length - offset, offset);

    for (var i = 0; i < tail.length; i++) {
      this.sequence.unshift(tail[i]);
    }

    this.pulses = this.sequence.join("");
    this.steps = this.sequence.length;

    return this;
  }

  createSequence(pulses, steps) {
    var typeOfPulses = typeof pulses;

    if (typeOfPulses === "number") {
      this.steps = steps;
      this.sequence = er.getPattern(pulses, steps);
      this.pulses = this.sequence.join("");
    } else if (typeOfPulses === "string") {
      this.steps = pulses.length;
      this.sequence = pulses.split("");
    }
  }
}

export default Pattern;
