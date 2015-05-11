# openmusic-drum-machine-ui

> UI for OpenMusic drum machine instrument

[![Install with NPM](https://nodei.co/npm/openmusic-drum-machine-ui.png?downloads=true&stars=true)](https://nodei.co/npm/openmusic-drum-machine-ui/)

## Installation

Do `npm install openmusic-drum-machine-ui`.

You need to load the module first (with `require`) and then register it--it is not automatically registered!

```javascript
require('openmusic-drum-machine-ui').register('openmusic-drum-machine-ui');
```

But you could even register it with other name, for example:

```javascript
require('openmusic-drum-machine-ui').register('mega-drum-machine-ui');
```

Up to you.

## Usage

Either create an instance in mark-up:

```html
<openmusic-drum-machine-ui></openmusic-drum-machine-ui>
```

or via `document.createElement`:

```javascript
var el = document.createElement('openmusic-drum-machine-ui');
document.body.appendChild(el);
```

Although it's pretty useless without an actual machine to control! So you need to attach it to a drum machine instance:

```javascript
var DrumMachine = require('openmusic-drum-machine');
var context = new AudioContext();

var machine = DrumMachine(context);

// You need to wait until the machine is ready to be used.
machine.ready().then(function() {
	el.attachTo(machine);
});
```
Have a look at `demo/main.js` for an example that demonstrates how to use this component with the Web Audio drum machine instrument.

<!--
### Attributes

#### `attribute`

Explanation of attribute.

Examples:

```javascript
<openmusic-drum-machine-ui attribute="-1"></openmusic-drum-machine-ui>
```

### Events

#### `event`

This event will be dispatched when x happens. To listen for `event` events on this component, add an event listener:

```javascript
component.addEventListener('event', function(ev) {
	var detail = ev.detail;
	// detail contains the values you want
});
```
-->
