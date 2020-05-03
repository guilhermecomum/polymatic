/**
 Original code
 Author: Ehsan Ziya <ehsan.ziya@gmail.com>
 source: https:github.com/zya/beet.js
**/

import Metro from "./wa-metro.js";

class Player {
  constructor(id, context, tempo, clavis, sequence, on) {
    this.id = id;
    this.on = on;
    this.tempo = tempo;
    this.clavis = clavis;
    this.context = context;
    this.pattern = pattern;
    this.metro = new Metro(context, (time, step, timeFromScheduled) => {
      if (this.metro.steps !== this.pattern.sequence.length) {
        this.metro.steps = this.pattern.sequence.length;
      }

      if (this.pattern.sequence[step - 1] === "1") {
        this.on(time, step, timeFromScheduled);
        setTimeout(() => {
          clavis.setCurrentStep(step);
        }, 1000);
      } else {
        setTimeout(() => {
          clavis.setCurrentStep(step);
        }, 1000);
      }
    });
    this.metro.steps = this.pattern.sequence.length;
    this.metro.tempo = this.tempo;
  }

  start() {
    this.metro.start();
  }

  pause() {
    this.metro.pause();
  }

  stop() {
    this.metro.stop();
  }

  watch(value) {
    this.metro.tempo = value;
  }
}

export default Player;
