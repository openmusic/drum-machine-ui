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


	proto.attachTo = function(audioNode) {

		var that = this;

		audioNode.addEventListener('step', function(e) {
			var step = e.detail.value;
			that._highlightStep(step);
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

		var matrix = this._makeMatrix(numSteps, numTracks);
		this._matrixTable = matrix.table;
		this._matrixInputs = matrix.inputs;
		this.appendChild(matrix.table);

		this._readCurrentPattern();

	};


	proto._makeMatrix = function(numSteps, numTracks) {
		var inputs = [];
		var table = document.createElement('table');
		var onInput = onPatternCellInput.bind(this);
		for(var i = 0; i < numTracks; i++) {
			var row = table.insertRow();
			var inputRow = [];
			for(var j = 0; j < numSteps; j++) {
				var cell = row.insertCell();
				cell.classList.add('step' + j);
				var checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.dataset.track = i;
				checkbox.dataset.step = j;
				checkbox.addEventListener('change', onInput);
				cell.appendChild(checkbox);
				inputRow.push(checkbox);
			}
			inputs.push(inputRow);
		}
		return { table: table, inputs: inputs };
	};


	function onPatternCellInput(ev) {
		var target = ev.target;
		var track = target.dataset.track;
		var step = target.dataset.step;
		var trigger = target.checked ? 1 : 0;
		
		this._setPatternStep(track, step, trigger);
	}


	proto._highlightStep = function(step) {
		var classToHighlight = 'step' + step;
		var highlightClass = 'highlight';
		var existingHighlight = this.querySelectorAll('[class*=' + highlightClass + ']');
		for(var i = 0; i < existingHighlight.length; i++) {
			var el = existingHighlight[i];
			el.classList.remove(highlightClass);
		}

		var toHighlight = this.querySelectorAll('[class=' + classToHighlight + ']');
		for(var j = 0; j < toHighlight.length; j++) {
			var el2 = toHighlight[j];
			el2.classList.add(highlightClass);
		}
	};


	proto._readCurrentPattern = function() {
		
		var inputs = this._matrixInputs;
		var pattern = this.attachedNode.currentPattern;
		pattern.forEach(function(track, i) {
			var trackInputs = inputs[i];
			for(var j = 0; j < track.length; j++) {
				var trigger = track[j];
				var input = trackInputs[j];
				input.checked = (trigger === 1);
			}
		});
		
	};


	proto._setPatternStep = function(track, step, trigger) {
		this.attachedNode.setStep(track, step, trigger);
		this._readCurrentPattern();
	};


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

