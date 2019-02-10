window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var beet = new Beet({
  context: context
});
var pattern = beet.pattern("1000101010");
var layer = beet.layer(pattern, callbackOn);
beet.add(layer).start();
