import Clavis from "./clavis";
import shortid from "shortid";
import Metro from "./wa-metro.js";

class Clave {
  constructor(context, baseTempo, sequence, tempo, instrument, polymetric) {
    this.id = shortid.generate();
    this.context = context;
    this.baseTempo = baseTempo;
    this.tempo = tempo;
    this.instrument = instrument.name;
    this.sample = instrument.sample;
    this.isPolymetric = polymetric;
    this.clavis = new Clavis();
    this.volume = 1.0;

    // Pattern
    this.sequence = sequence;
    this.steps = sequence.length;
    this.offset = 0;

    // Player
    this.metro = new Metro(context, this.metroCallback);

    this.metro.steps = this.steps;
    this.metro.tempo = this.tempo;

    if (this.isPolymetric) {
      let firstSteps = this.baseTempo.length;

      let newSteps = this.steps;
      if (newSteps !== firstSteps) {
        if (firstSteps > newSteps) {
          let ratio = firstSteps / newSteps;
          this.tempo = (this.tempo * ratio).toFixed(2);
        } else {
          let ratio = newSteps / firstSteps;
          this.tempo = (this.tempo / ratio).toFixed(2);
        }
      }
    }
  }

  callbackOn = (time, step) => {
    const gainNode = this.context.createGain();
    gainNode.gain.value = this.volume;
    gainNode.connect(this.context.destination);

    const source = this.context.createBufferSource();
    source.buffer = this.sample;
    source.connect(gainNode);
    source.start(time);
  };

  metroCallback = (time, step, timeFromScheduled) => {
    if (this.metro.steps !== this.sequence.length) {
      this.metro.steps = this.sequence.length;
    }

    if (this.sequence[step - 1] === "1") {
      this.callbackOn(time, step, timeFromScheduled);
      setTimeout(() => {
        this.clavis.setCurrentStep(step);
      }, 1000);
    } else {
      setTimeout(() => {
        this.clavis.setCurrentStep(step);
      }, 1000);
    }
  };

  setVolume(volume) {
    this.volume = volume;
  }

  shift(offset) {
    const isIncreasing = this.offset < offset ? true : false;

    if (isIncreasing) {
      const tail = this.sequence.splice(this.sequence.length - 1, 1);

      for (let i = 0; i < tail.length; i++) {
        this.sequence.unshift(tail[i]);
      }

      this.sequence = this.sequence.join("");
      this.steps = this.sequence.length;
    } else {
      const head = this.sequence.splice(0, 1);

      for (let i = 0; i < head.length; i++) {
        this.sequence.push(head[i]);
      }

      this.sequence = this.sequence.join("");
      this.steps = this.sequence.length;
    }

    this.offset = offset;
    this.clavis.draw();
  }

  remove() {
    this.metro.stop();
    this.clavis.pause();
  }

  start() {
    this.metro.start();
    this.clavis.play();
  }

  pause() {
    this.metro.pause();
    this.clavis.pause();
  }

  stop() {
    this.metro.stop();
    this.clavis.pause();
  }
}

export default Clave;
