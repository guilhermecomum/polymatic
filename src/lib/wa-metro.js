/**
 Original code
 Author: Ehsan Ziya <ehsan.ziya@gmail.com>
 source: https:github.com/zya/beet.js
**/

import work from "webworkify-webpack";

class Metro {
  constructor(context, callback) {
    if (!context) throw new Error("Context is mandatory");
    if (!callback) throw new Error("Callback is mandatory");

    this.context = context;
    this.tempo = 120;
    this.callback = callback;
    this.look_ahead = 1.0;
    this.is_running = false;
    this.scheduler_interval = 20;
    this.next_event_time = 0.0;
    this.first = true;
    this.step = 1;
    this.worker = work(require.resolve("./worker.js"));
    this.worker.onmessage = event => {
      if (event.data === "tick" && this.is_running) {
        this.scheduler();
      }
    };

    this.worker.postMessage({
      interval: this.scheduler_interval
    });
  }

  start(callback) {
    if (this.is_running) {
      console.log("already started");
      return;
    }
    this.is_running = true;
    this.worker.postMessage("start");
  }

  pause() {
    this.is_running = false;
    this.worker.postMessage("stop");
  }

  stop() {
    this.first = true;
    this.step = 1;
    this.is_running = false;
    this.worker.postMessage("stop");
  }

  scheduler() {
    if (this.step === 1 && this.first) {
      this.next_event_time = this.context.currentTime;
    }
    while (this.next_event_time < this.context.currentTime + this.look_ahead) {
      var event_time_from_scheduled =
        this.next_event_time - this.context.currentTime;
      this.callback(this.next_event_time, this.step, event_time_from_scheduled);
      this.next();
    }
  }

  next() {
    this.step++;
    if (this.first) {
      this.next_event_time = this.context.currentTime;
      this.first = false;
    }
    if (this.step > this.steps) {
      this.step = 1;
    }
    this.next_event_time += ((60.0 / this.tempo) * 4) / 16;
  }
}

export default Metro;
