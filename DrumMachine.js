(function() {
	var proto = Object.create(HTMLElement.prototype);
	
	proto.createdCallback = function() {
		
		this.values = {};
		this.attachedNode = null;

		// making web components MWC framework proof.
		this.innerHTML = '';

		var div = document.createElement('div');
		// Current pattern [ 001 ] < > [ + ] [ - ] // <-- Not for this iteration
		// Pattern
		// Drum       x o
		// Snare      x o
		// Closed Hat x o ...
		// step       . O . ....
		div.innerHTML = 'Drum Machine';
		this.appendChild(div);
		
		this.readAttributes();
		
	};

	
	proto.attachedCallback = function() {
		// Setup input listeners, perhaps start requestAnimationFrame here
	};


	proto.detachedCallback = function() {
	};


	proto.readAttributes = function() {
		var that = this;
		[].forEach(function(attr) {
			that.setValue(attr, that.getAttribute(attr));		
		});
	};

	
	proto.setValue = function(name, value) {

		if(value !== undefined && value !== null) {
			this.values[name] = value;
		}

		// TODO: Potential re-draw or DOM update in reaction to these values
	};


	proto.getValue = function(name) {
		return this.values[name];
	};

	
	proto.attributeChangedCallback = function(attr, oldValue, newValue, namespace) {
		
		this.setValue(attr, newValue);
		
		// var e = new CustomEvent('change', { detail: this.values } });
		// this.dispatchEvent(e);
		
	};


	// Optional: for components that represent an audio node
	proto.attachTo = function(audioNode) {

		audioNode.addEventListener('step', function(e) {
			// TODO for highlighting
		});

		this.attachedNode = audioNode;

		this.setupDOM();
		
	};

	proto.setupDOM = function() {
		var dm = this.attachedNode;
		
		if(dm === null) {
			return;
		}

		var numSteps = dm.steps;
		var numTracks = dm.tracks;
		
		if(numTracks === 0) {
			console.error('No tracks in the machine-perhaps you did not use ready()?');
		}

		this.innerHTML = '';

		var matrix = makeMatrix(numSteps, numTracks);
		this.appendChild(matrix);

	};

	function makeMatrix(numSteps, numTracks) {
		var table = document.createElement('table');
		for(var i = 0; i < numTracks; i++) {
			var row = table.insertRow();
			for(var j = 0; j < numSteps; j++) {
				var cell = row.insertCell();
				cell.classList.add('step' + j);
				var checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				cell.appendChild(checkbox);
			}
		}
		return table;
	}

	//


	var component = {};
	component.prototype = proto;
	component.register = function(name) {
		document.registerElement(name, {
			prototype: proto
		});
	};

	if(typeof define === 'function' && define.amd) {
		define(function() { return component; });
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = component;
	} else {
		component.register('openmusic-drum-machine-ui'); // automatic registration
	}

}).call(this);

