import Beet from "./beet";
import Clavis from "./clavis";
import Channel from "./channel";
import shortid from "shortid";

class Clave {
  constructor(context, baseTempo, sequence, tempo, instrument, polymetric) {
    this.id = shortid.generate();
    this.beet = new Beet({ context });
    this.sequence = sequence;
    this.clavis = new Clavis();
    this.channel = new Channel();
    this.tempo = tempo;
    this.instruments = instrument;
    this.channel.configure(context, this.beet, this.instruments);
    this.beetLayer = null;
    this.polymetric = polymetric;

    if (this.polymetric) {
      let firstSteps = baseTempo.length;

      let newSteps = this.sequence.length;
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

    const layer = this.beet.layer(
      this.beet.pattern(this.sequence),
      this.tempo,
      this.clavis,
      this.channel.callbackOn
    );
    this.beet.add(layer);
    this.beetLayer = layer;
  }

  remove() {
    this.beet.remove(this.beetLayer);
    this.clavis.pause();
  }

  start() {
    this.beet.start();
    this.clavis.play();
  }

  pause() {
    this.beet.pause();
    this.clavis.pause();
  }

  stop() {
    this.beet.stop();
    this.clavis.pause();
  }
}

export default Clave;
