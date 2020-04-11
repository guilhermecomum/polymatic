class Channel {
  constructor() {
    this.volume = 1.0;
    this.context = null;
    this.beet = null;
    this.instrument = null;
  }

  configure(context, beet, instrument) {
    this.context = context;
    this.beet = beet;
    this.instrument = instrument;
  }

  setVolume(volume) {
    this.volume = volume;
  }

  getVolume() {
    return this.volume;
  }

  callbackOn = (time, step) => {
    const gainNode = this.context.createGain();
    gainNode.gain.value = this.volume;
    gainNode.connect(this.context.destination);

    const source = this.context.createBufferSource();
    source.buffer = this.instrument;
    source.connect(gainNode);
    source.start(time);
  };
}

export default Channel;
