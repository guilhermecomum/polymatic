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
    this.offset = 0;
  }

  update(pulses, steps) {
    this.createSequence(pulses, steps);
  }

  shift(offset) {
    const isIncreasing = this.offset < offset ? true : false;

    if (isIncreasing) {
      const tail = this.sequence.splice(this.sequence.length - 1, 1);

      for (let i = 0; i < tail.length; i++) {
        this.sequence.unshift(tail[i]);
      }

      this.pulses = this.sequence.join("");
      this.steps = this.sequence.length;
    } else {
      const head = this.sequence.splice(0, 1);

      for (let i = 0; i < head.length; i++) {
        this.sequence.push(head[i]);
      }

      this.pulses = this.sequence.join("");
      this.steps = this.sequence.length;
    }

    this.offset = offset;
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
