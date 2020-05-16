import Clavis from "./clavis";
import Pattern from "./pattern";
import Player from "./player";
import shortid from "shortid";

class Clave {
  constructor(context, baseTempo, sequence, tempo, instrument, polymetric) {
    this.id = shortid.generate();
    this.context = context;
    this.baseTempo = baseTempo;
    this.pattern = new Pattern(sequence);
    this.tempo = tempo;
    this.instrument = instrument.name;
    this.sample = instrument.sample;
    this.polymetric = polymetric;
    this.clavis = new Clavis();
    this.volume = 1.0;
    this.player = null;

    if (this.polymetric) {
      let firstSteps = this.baseTempo.length;

      let newSteps = this.pattern.sequence.length;
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

    this.player = new Player(
      shortid.generate(),
      this.context,
      this.tempo,
      this.clavis,
      this.pattern,
      this.callbackOn
    );
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

  setVolume(volume) {
    this.volume = volume;
  }

  pattern(pulses, steps) {
    return new Pattern(pulses, steps);
  }

  shift(value) {
    this.pattern = this.pattern.shift(value);
    this.clavis.draw();
  }

  remove() {
    this.player.stop();
    this.clavis.pause();
  }

  start() {
    this.player.start();
    this.clavis.play();
  }

  pause() {
    this.player.pause();
    this.clavis.pause();
  }

  stop() {
    this.player.stop();
    this.clavis.pause();
  }
}

export default Clave;
