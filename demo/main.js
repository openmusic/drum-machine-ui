require('webcomponents-lite');
require('openmusic-oscilloscope').register('openmusic-oscilloscope');
require('openmusic-transport').register('openmusic-transport');
require('../').register('openmusic-drum-machine-ui');

var ac = new AudioContext();
var masterVolume = ac.createGain();
masterVolume.gain.value = 0.05;
masterVolume.connect(ac.destination);

var limiter = ac.createDynamicsCompressor();
limiter.connect(masterVolume);

var analyser = ac.createAnalyser();
var oscilloscope = document.querySelector('openmusic-oscilloscope');
oscilloscope.attachTo(analyser);

analyser.connect(limiter);

var DrumMachine = require('openmusic-drum-machine');
var drumMachineNode = DrumMachine(ac);
drumMachineNode.connect(analyser);

var drumMachineElement = document.querySelector('openmusic-drum-machine-ui');

drumMachineNode.ready().then(function() {
	drumMachineElement.attachTo(drumMachineNode);
});

var transport = document.querySelector('openmusic-transport');
transport.addEventListener('play', function() {
	drumMachineNode.start();
});

transport.addEventListener('stop', function() {
	drumMachineNode.stop();
});

transport.addEventListener('bpm', function(ev) {
	drumMachineNode.bpm = ev.detail.value;
});

