/**
 Original code
 Author: Ehsan Ziya <ehsan.ziya@gmail.com>
 source: https:github.com/zya/beet.js
**/

export default function(self) {
  var interval = 25;
  var timer = null;
  self.onmessage = function(event) {
    if (event.data === "interval") {
      interval = event.data.interval;
    }
    if (event.data === "start") {
      timer = setInterval(function() {
        postMessage("tick");
      }, interval);
    }

    if (event.data === "stop") {
      clearInterval(timer);
      timer = null;
    }
  };
}
