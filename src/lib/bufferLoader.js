/**
Original code from Boris Simus
source: https://www.html5rocks.com/en/tutorials/webaudio/intro/
**/

class BufferLoader {
  constructor(context, instruments, callback) {
    this.context = context;
    this.instruments = instruments;
    this.onload = callback;
    this.bufferList = {};
    this.loadCount = 0;
  }

  loadBuffer(instrument, index) {
    // Load buffer asynchronously
    const request = new XMLHttpRequest();
    request.open("GET", this.instruments[instrument], true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      // Asynchronously decode the audio file data in request.response
      this.context.decodeAudioData(
        request.response,
        buffer => {
          if (!buffer) {
            alert("error decoding file data: " + instrument);
            return;
          }
          this.bufferList[instrument] = buffer;
          if (++this.loadCount === Object.keys(this.instruments).length)
            this.onload(this.bufferList);
        },
        error => {
          console.error("decodeAudioData error", error);
        }
      );
    };

    request.onerror = () => {
      alert("BufferLoader: XHR error");
    };

    request.send();
  }

  load() {
    Object.keys(this.instruments).forEach(instrument => {
      this.loadBuffer(instrument);
    });
  }
}

export default BufferLoader;
