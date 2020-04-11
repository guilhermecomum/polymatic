import Metro from "./wa-metro.js";

class Layer {
  constructor(id, context, tempo, clavis, sequence, on) {
    this.id = id;
    this.on = on;
    this.tempo = tempo;
    this.clavis = clavis;
    this.context = context;
    this.sequence = sequence;
    this.metro = new Metro(context, (time, step, timeFromScheduled) => {
      if (this.metro.steps !== this.sequence.seq.length) {
        this.metro.steps = this.sequence.seq.length;
      }

      if (sequence.seq[step - 1] === "1") {
        this.on(time, step, timeFromScheduled);
        setTimeout(() => {
          clavis.setCurrentStep(step);
        }, 1000);
      }
    });
    this.metro.steps = sequence.seq.length;
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

export default Layer;
