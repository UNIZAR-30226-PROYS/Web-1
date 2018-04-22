//Note: bins needs to be a power of 2
var displayBins = 2048;
var backgroundColour = "#ffffff";
var barColour = "#EC1A55";
var songFont = "15px 'Open Sans'";
//Where the bottom of the waveform is rendered at (out of 255). I recommend
//leaving it at 96 since it seems to work well, basically any volume will push
//it past 96. If your audio stream is quiet though, you'll want to reduce this.
var floorLevel = 96;

//Whether to draw the frequencies directly, or scale the x-axis logarithmically and show pitch instead.
var drawPitch = true;
//Whether to draw the visualisation as a curve instead of discrete bars
var drawCurved = true;
//If drawCurved is enabled, this flag fills the area beneath the curve (the same colour as the line)
var drawFilled = false;
//Whether to draw text the songText on top of the visualisation
var drawText = false;

//Can't touch this
var audioContext;
var audioBuffer;
var audioAnalyserNode;
var audioVisualizerInitialized = false;
var songText = "";
var textSize;
var canvasContext;
var canvasWidth;
var canvasHeight;
var multiplier;
var finalBins = [];
var logLookupTable = [];
var logBinLengths = [];
var binWidth;
var magicConstant = 42; //Meaning of everything. I don't know why this works.


/**
 *  Inicializador del visualizador
 */
function pruebaVisualizer(canvasElement) {
		//var file = URL.createObjectURL(files[0]);
		audioElemen=new Audio();
		audioElemen.crossOrigin = "anonymous";
		audioElemen.src = 'C:\Users\jorge\Desktop\PrSw\git\Web\vistaWeb\songs\llamada.mp3';
        audioElemen.play();

		initializeVisualizer(canvasElement, audioElemen);


}





/**
 *  Inicializador del visualizador
 */
function initializeVisualizer(canvasElement, audioElement) {
	try {
		var ctxt = window.AudioContext || window.webkitAudioContext;
		if (ctxt) {
			initCanvas(canvasElement);
			audioContext = new ctxt();
			setupAudioApi(audioElement);
		}
	} catch(e) {
		console.log(e);
	}
}

function updateSongText(newText) {
	songText = newText;
	if (canvasContext)
		textSize = canvasContext.measureText(songText);
}

function setupAudioApi(audioElement) {
	
	var src = audioContext.createMediaElementSource(audioElement);
	

	audioAnalyserNode = audioContext.createAnalyser();
	//FFT node takes in 2 samples per bin, and we internally use 2 samples per bin
	audioAnalyserNode.fftSize = drawPitch ? displayBins * 8 : displayBins * 2;
	multiplier = Math.pow(22050, 1 / displayBins) * Math.pow(1 / magicConstant, 1 / displayBins);
	finalBins = [];
	logLookupTable = [];
	logBinLengths = [];
	for (var i = 0; i < displayBins; i++) {
		finalBins.push(0);
		logLookupTable.push(0);
	}
	createLookupTable(audioAnalyserNode.frequencyBinCount, logBinLengths, logLookupTable);
	binWidth = Math.ceil(canvasWidth / (displayBins - 1));

	src.connect(audioAnalyserNode);
	
	audioAnalyserNode.connect(audioContext.destination);
	

	audioVisualizerInitialized = true;
}

function initCanvas(canvasElement) {
	canvasContext = canvasElement.getContext('2d');
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	requestAnimationFrame(paint);
	canvasContext.font = songFont;
	canvasContext.strokeStyle = barColour;

	textSize = canvasContext.measureText(songText);
}

//Render some fancy bars
function paint() {
	requestAnimationFrame(paint);

	if(!audioVisualizerInitialized)
		return;

	canvasContext.fillStyle = backgroundColour;
	canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

	var bins = audioAnalyserNode.frequencyBinCount;
	var data = new Uint8Array(bins);
	audioAnalyserNode.getByteFrequencyData(data);
	canvasContext.fillStyle = barColour;

	if (drawPitch)
		updateBinsLog(logLookupTable, data);
	else
		updateBins(bins, logBinLengths, data);

	if (!drawCurved) {
		for (var i = 0; i < displayBins; i++) {
			paintSingleBin(i);
		}
	} else {
		canvasContext.fillStyle = barColour;
		canvasContext.beginPath();
		canvasContext.moveTo(0, canvasHeight - getBinHeight(0));
		var i;
		for (i = 0; i < displayBins - 2;) {
			var thisX = i * binWidth;
			var nextX = (i + logBinLengths[i]) * binWidth; //First subbin of the next bin
			var x = (thisX + nextX) / 2;

			var thisY = canvasHeight - getBinHeight(i);
			var nextY = canvasHeight - getBinHeight(i + logBinLengths[i]);
			var y = (thisY + nextY) / 2;

			canvasContext.quadraticCurveTo(thisX, thisY, x, y);

			i += logBinLengths[i];
		}
		canvasContext.quadraticCurveTo(i * binWidth, canvasHeight - getBinHeight(i), (i + 1) * binWidth, canvasHeight - getBinHeight(i + 1));
		if (drawFilled) {
			canvasContext.lineTo(canvasWidth, canvasHeight);
			canvasContext.lineTo(0, canvasHeight);
			canvasContext.fill();
		} else {
			canvasContext.stroke();
		}
	}

	if (drawText) {
		canvasContext.fillStyle = 'white';
		//Note: the 15's here need to be changed if you change the font size
		canvasContext.fillText(songText, canvasWidth / 2 - textSize.width / 2, canvasHeight / 2 - 15 / 2 + 15);
	}
}

//Inclusive lower, exclusive upper except with stop == start
function averageRegion(data, start, stop) {
	if (stop <= start)
		return data[start];

	var sum = 0;
	for (var i = start; i < stop; i++) {
		sum += data[i];
	}
	return sum / (stop - start);
}

function updateBins(bins, binLengths, data) {
	var step = bins / displayBins;
	for (var i = 0; i < displayBins; i++) {
		var lower = i * step;
		var upper = (i + 1) * step - 1;
		var binValue = averageRegion(data, lower, upper);
		binLengths.push(1);
		finalBins[i] = binValue;
	}
}

function createLookupTable(bins, binLengths, lookupTable) {
	if (drawPitch) {
		var lastFrequency = magicConstant / multiplier;
		var currentLength = 0;
		var lastBinIndex = 0;
		for (var i = 0; i < displayBins; i++) {
			var thisFreq = lastFrequency * multiplier;
			lastFrequency = thisFreq;
			var binIndex = Math.floor(bins * thisFreq / 22050);
			lookupTable[i] = binIndex;
			currentLength++;

			if (binIndex != lastBinIndex) {
				for (var j = 0; j < currentLength; j++)
					binLengths.push(currentLength);
				currentLength = 0;
			}

			lastBinIndex = binIndex;
		}
	} else {
		for (var i = 0; i < displayBins; i++) {
			lookupTable[i] = i;
		}
	}
}

function updateBinsLog(lookupTable, data) {
	for (var i = 0; i < displayBins; i++) {
		finalBins[i] = data[lookupTable[i]];
	}
}

function getBinHeight(i) {
	var binValue = finalBins[i];

	//Pretty much any volume will push it over [floorLevel] so we set that as the bottom threshold
	//I suspect I should be doing a logarithmic space for the volume as well
	var height = Math.max(0, (binValue - floorLevel));
	//Scale to the height of the bar
	//Since we change the base level in the previous operations, 256 should be changed to 160 (i think) if we want it to go all the way to the top
	height = (height / (256 - floorLevel)) * canvasHeight * 0.8;
	return height;
}

function paintSingleBin(i) {
	var height = getBinHeight(i);
	canvasContext.fillRect(i * binWidth, canvasHeight - height, binWidth, height);
}
