/* Smalltalk from Squeak4.5 with VMMaker 4.13.6 translated as JS source on 3 November 2014 1:52:26 pm */
/* Automatically generated by
	JSPluginCodeGenerator VMMakerJS-bf.15 uuid: fd4e10f2-3773-4e80-8bb5-c4b471a014e5
   from
	SoundGenerationPlugin VMMaker-bf.353 uuid: 8ae25e7e-8d2c-451e-8277-598b30e9c002
 */
var module = require('../extensions').module;

module("users.bert.SqueakJS.plugins.SoundGenerationPlugin").requires("users.bert.SqueakJS.vm").toRun(function() {
"use strict";

var VM_PROXY_MAJOR = 1;
var VM_PROXY_MINOR = 11;

/*** Functions ***/
function CLASSOF(obj) { return typeof obj === "number" ? interpreterProxy.classSmallInteger() : obj.sqClass }
function SIZEOF(obj) { return obj.pointers ? obj.pointers.length : obj.words ? obj.words.length : obj.bytes ? obj.bytes.length : 0 }
function BYTESIZEOF(obj) { return obj.bytes ? obj.bytes.length : obj.words ? obj.words.length * 4 : 0 }
function DIV(a, b) { return Math.floor(a / b) | 0; }   // integer division
function MOD(a, b) { return a - DIV(a, b) * b | 0; }   // signed modulus
function SHL(a, b) { return b > 31 ? 0 : a << b; }     // fix JS shift
function SHR(a, b) { return b > 31 ? 0 : a >>> b; }    // fix JS shift
function SHIFT(a, b) { return b < 0 ? (b < -31 ? 0 : a >>> (0-b) ) : (b > 31 ? 0 : a << b); }

/*** Constants ***/
var IncrementFractionBits = 16;
var LoopIndexFractionMask = 511;
var LoopIndexScaleFactor = 512;
var ScaleFactor = 32768;
var ScaledIndexOverflow = 536870912;

/*** Variables ***/
var interpreterProxy = null;
var moduleName = "SoundGenerationPlugin 3 November 2014 (e)";



/*	Note: This is coded so that plugins can be run from Squeak. */

function getInterpreter() {
	return interpreterProxy;
}


/*	Note: This is hardcoded so it can be run from Squeak.
	The module name is used for validating a module *after*
	it is loaded to check if it does really contain the module
	we're thinking it contains. This is important! */

function getModuleName() {
	return moduleName;
}

function halt() {
	;
}

function msg(s) {
	console.log(moduleName + ": " + s);
}

function primitiveApplyReverb() {
	var rcvr;
	var aSoundBuffer;
	var startIndex;
	var n;
	var delayedLeft;
	var delayedRight;
	var i;
	var j;
	var out;
	var sliceIndex;
	var tapGain;
	var tapIndex;
	var bufferIndex;
	var bufferSize;
	var leftBuffer;
	var rightBuffer;
	var tapCount;
	var tapDelays;
	var tapGains;

	rcvr = interpreterProxy.stackValue(3);
	aSoundBuffer = interpreterProxy.stackInt16Array(2);
	startIndex = interpreterProxy.stackIntegerValue(1);
	n = interpreterProxy.stackIntegerValue(0);
	tapDelays = interpreterProxy.fetchInt32ArrayofObject(7, rcvr);
	tapGains = interpreterProxy.fetchInt32ArrayofObject(8, rcvr);
	tapCount = interpreterProxy.fetchIntegerofObject(9, rcvr);
	bufferSize = interpreterProxy.fetchIntegerofObject(10, rcvr);
	bufferIndex = interpreterProxy.fetchIntegerofObject(11, rcvr);
	leftBuffer = interpreterProxy.fetchInt16ArrayofObject(12, rcvr);
	rightBuffer = interpreterProxy.fetchInt16ArrayofObject(13, rcvr);
	if (interpreterProxy.failed()) {
		return null;
	}
	for (sliceIndex = startIndex; sliceIndex <= ((startIndex + n) - 1); sliceIndex++) {
		delayedLeft = (delayedRight = 0);
		for (tapIndex = 1; tapIndex <= tapCount; tapIndex++) {
			i = bufferIndex - tapDelays[tapIndex - 1];
			if (i < 1) {
				i += bufferSize;
			}
			tapGain = tapGains[tapIndex - 1];
			delayedLeft += tapGain * leftBuffer[i - 1];
			delayedRight += tapGain * rightBuffer[i - 1];
		}
		j = (2 * sliceIndex) - 1;
		out = aSoundBuffer[j - 1] + (delayedLeft >> 15);
		if (out > 32767) {
			out = 32767;
		}
		if (out < -32767) {
			out = -32767;
		}
		aSoundBuffer[j - 1] = out;
		leftBuffer[bufferIndex - 1] = out;
		++j;
		out = aSoundBuffer[j - 1] + (delayedRight >> 15);
		if (out > 32767) {
			out = 32767;
		}
		if (out < -32767) {
			out = -32767;
		}
		aSoundBuffer[j - 1] = out;
		rightBuffer[bufferIndex - 1] = out;
		bufferIndex = (MOD(bufferIndex, bufferSize)) + 1;
	}
	if (interpreterProxy.failed()) {
		return null;
	}
	interpreterProxy.storeIntegerofObjectwithValue(11, rcvr, bufferIndex);
	interpreterProxy.pop(3);
}


/*	Play samples from a wave table by stepping a fixed amount through the table on every sample. The table index and increment are scaled to allow fractional increments for greater pitch accuracy. */
/*	(FMSound pitch: 440.0 dur: 1.0 loudness: 0.5) play */

function primitiveMixFMSound() {
	var rcvr;
	var n;
	var aSoundBuffer;
	var startIndex;
	var leftVol;
	var rightVol;
	var doingFM;
	var i;
	var lastIndex;
	var offset;
	var s;
	var sample;
	var sliceIndex;
	var count;
	var normalizedModulation;
	var scaledIndex;
	var scaledIndexIncr;
	var scaledOffsetIndex;
	var scaledOffsetIndexIncr;
	var scaledVol;
	var scaledVolIncr;
	var scaledVolLimit;
	var scaledWaveTableSize;
	var waveTable;

	rcvr = interpreterProxy.stackValue(5);
	n = interpreterProxy.stackIntegerValue(4);
	aSoundBuffer = interpreterProxy.stackInt16Array(3);
	startIndex = interpreterProxy.stackIntegerValue(2);
	leftVol = interpreterProxy.stackIntegerValue(1);
	rightVol = interpreterProxy.stackIntegerValue(0);
	scaledVol = interpreterProxy.fetchIntegerofObject(3, rcvr);
	scaledVolIncr = interpreterProxy.fetchIntegerofObject(4, rcvr);
	scaledVolLimit = interpreterProxy.fetchIntegerofObject(5, rcvr);
	count = interpreterProxy.fetchIntegerofObject(7, rcvr);
	waveTable = interpreterProxy.fetchInt16ArrayofObject(8, rcvr);
	scaledWaveTableSize = interpreterProxy.fetchIntegerofObject(9, rcvr);
	scaledIndex = interpreterProxy.fetchIntegerofObject(10, rcvr);
	scaledIndexIncr = interpreterProxy.fetchIntegerofObject(11, rcvr);
	normalizedModulation = interpreterProxy.fetchIntegerofObject(14, rcvr);
	scaledOffsetIndex = interpreterProxy.fetchIntegerofObject(15, rcvr);
	scaledOffsetIndexIncr = interpreterProxy.fetchIntegerofObject(16, rcvr);
	if (interpreterProxy.failed()) {
		return null;
	}
	doingFM = (normalizedModulation !== 0) && (scaledOffsetIndexIncr !== 0);
	lastIndex = (startIndex + n) - 1;
	for (sliceIndex = startIndex; sliceIndex <= lastIndex; sliceIndex++) {
		sample = (scaledVol * waveTable[scaledIndex >> 15]) >> 15;
		if (doingFM) {
			offset = normalizedModulation * waveTable[scaledOffsetIndex >> 15];
			scaledOffsetIndex = MOD((scaledOffsetIndex + scaledOffsetIndexIncr), scaledWaveTableSize);
			if (scaledOffsetIndex < 0) {
				scaledOffsetIndex += scaledWaveTableSize;
			}
			scaledIndex = MOD(((scaledIndex + scaledIndexIncr) + offset), scaledWaveTableSize);
			if (scaledIndex < 0) {
				scaledIndex += scaledWaveTableSize;
			}
		} else {
			scaledIndex = MOD((scaledIndex + scaledIndexIncr), scaledWaveTableSize);
		}
		if (leftVol > 0) {
			i = (2 * sliceIndex) - 1;
			s = aSoundBuffer[i - 1] + ((sample * leftVol) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		if (rightVol > 0) {
			i = 2 * sliceIndex;
			s = aSoundBuffer[i - 1] + ((sample * rightVol) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		if (scaledVolIncr !== 0) {
			scaledVol += scaledVolIncr;
			if (((scaledVolIncr > 0) && (scaledVol >= scaledVolLimit)) || ((scaledVolIncr < 0) && (scaledVol <= scaledVolLimit))) {

				/* reached the limit; stop incrementing */

				scaledVol = scaledVolLimit;
				scaledVolIncr = 0;
			}
		}
	}
	count -= n;
	if (interpreterProxy.failed()) {
		return null;
	}
	interpreterProxy.storeIntegerofObjectwithValue(3, rcvr, scaledVol);
	interpreterProxy.storeIntegerofObjectwithValue(4, rcvr, scaledVolIncr);
	interpreterProxy.storeIntegerofObjectwithValue(7, rcvr, count);
	interpreterProxy.storeIntegerofObjectwithValue(10, rcvr, scaledIndex);
	interpreterProxy.storeIntegerofObjectwithValue(15, rcvr, scaledOffsetIndex);
	interpreterProxy.pop(5);
}


/*	Play samples from a wave table by stepping a fixed amount through the table on every sample. The table index and increment are scaled to allow fractional increments for greater pitch accuracy.  If a loop length is specified, then the index is looped back when the loopEnd index is reached until count drops below releaseCount. This allows a short sampled sound to be sustained indefinitely. */
/*	(LoopedSampledSound pitch: 440.0 dur: 5.0 loudness: 0.5) play */

function primitiveMixLoopedSampledSound() {
	var rcvr;
	var n;
	var aSoundBuffer;
	var startIndex;
	var leftVol;
	var rightVol;
	var compositeLeftVol;
	var compositeRightVol;
	var i;
	var isInStereo;
	var lastIndex;
	var leftVal;
	var m;
	var nextSampleIndex;
	var rightVal;
	var s;
	var sampleIndex;
	var sliceIndex;
	var count;
	var lastSample;
	var leftSamples;
	var loopEnd;
	var releaseCount;
	var rightSamples;
	var scaledIndex;
	var scaledIndexIncr;
	var scaledLoopLength;
	var scaledVol;
	var scaledVolIncr;
	var scaledVolLimit;

	rcvr = interpreterProxy.stackValue(5);
	n = interpreterProxy.stackIntegerValue(4);
	aSoundBuffer = interpreterProxy.stackInt16Array(3);
	startIndex = interpreterProxy.stackIntegerValue(2);
	leftVol = interpreterProxy.stackIntegerValue(1);
	rightVol = interpreterProxy.stackIntegerValue(0);
	scaledVol = interpreterProxy.fetchIntegerofObject(3, rcvr);
	scaledVolIncr = interpreterProxy.fetchIntegerofObject(4, rcvr);
	scaledVolLimit = interpreterProxy.fetchIntegerofObject(5, rcvr);
	count = interpreterProxy.fetchIntegerofObject(7, rcvr);
	releaseCount = interpreterProxy.fetchIntegerofObject(8, rcvr);
	leftSamples = interpreterProxy.fetchInt16ArrayofObject(10, rcvr);
	rightSamples = interpreterProxy.fetchInt16ArrayofObject(11, rcvr);
	lastSample = interpreterProxy.fetchIntegerofObject(16, rcvr);
	loopEnd = interpreterProxy.fetchIntegerofObject(17, rcvr);
	scaledLoopLength = interpreterProxy.fetchIntegerofObject(18, rcvr);
	scaledIndex = interpreterProxy.fetchIntegerofObject(19, rcvr);
	scaledIndexIncr = interpreterProxy.fetchIntegerofObject(20, rcvr);
	if (interpreterProxy.failed()) {
		return null;
	}
	isInStereo = leftSamples !== rightSamples;
	compositeLeftVol = (leftVol * scaledVol) >> 15;
	compositeRightVol = (rightVol * scaledVol) >> 15;
	i = (2 * startIndex) - 1;
	lastIndex = (startIndex + n) - 1;
	for (sliceIndex = startIndex; sliceIndex <= lastIndex; sliceIndex++) {
		sampleIndex = ((scaledIndex += scaledIndexIncr)) >> 9;
		if ((sampleIndex > loopEnd) && (count > releaseCount)) {

			/* loop back if not within releaseCount of the note end */
			/* note: unlooped sounds will have loopEnd = lastSample */

			sampleIndex = ((scaledIndex -= scaledLoopLength)) >> 9;
		}
		if (((nextSampleIndex = sampleIndex + 1)) > lastSample) {
			if (sampleIndex > lastSample) {
				count = 0;
				if (interpreterProxy.failed()) {
					return null;
				}
				interpreterProxy.storeIntegerofObjectwithValue(3, rcvr, scaledVol);
				interpreterProxy.storeIntegerofObjectwithValue(4, rcvr, scaledVolIncr);
				interpreterProxy.storeIntegerofObjectwithValue(7, rcvr, count);
				interpreterProxy.storeIntegerofObjectwithValue(19, rcvr, scaledIndex);
				interpreterProxy.popthenPush(6, null);
				return null;
			}
			if (scaledLoopLength === 0) {
				nextSampleIndex = sampleIndex;
			} else {
				nextSampleIndex = ((scaledIndex - scaledLoopLength) >> 9) + 1;
			}
		}
		m = scaledIndex & LoopIndexFractionMask;
		rightVal = (leftVal = ((leftSamples[sampleIndex - 1] * (LoopIndexScaleFactor - m)) + (leftSamples[nextSampleIndex - 1] * m)) >> 9);
		if (isInStereo) {
			rightVal = ((rightSamples[sampleIndex - 1] * (LoopIndexScaleFactor - m)) + (rightSamples[nextSampleIndex - 1] * m)) >> 9;
		}
		if (leftVol > 0) {
			s = aSoundBuffer[i - 1] + ((compositeLeftVol * leftVal) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		++i;
		if (rightVol > 0) {
			s = aSoundBuffer[i - 1] + ((compositeRightVol * rightVal) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		++i;
		if (scaledVolIncr !== 0) {

			/* update volume envelope if it is changing */

			scaledVol += scaledVolIncr;
			if (((scaledVolIncr > 0) && (scaledVol >= scaledVolLimit)) || ((scaledVolIncr < 0) && (scaledVol <= scaledVolLimit))) {

				/* reached the limit; stop incrementing */

				scaledVol = scaledVolLimit;
				scaledVolIncr = 0;
			}
			compositeLeftVol = (leftVol * scaledVol) >> 15;
			compositeRightVol = (rightVol * scaledVol) >> 15;
		}
	}
	count -= n;
	if (interpreterProxy.failed()) {
		return null;
	}
	interpreterProxy.storeIntegerofObjectwithValue(3, rcvr, scaledVol);
	interpreterProxy.storeIntegerofObjectwithValue(4, rcvr, scaledVolIncr);
	interpreterProxy.storeIntegerofObjectwithValue(7, rcvr, count);
	interpreterProxy.storeIntegerofObjectwithValue(19, rcvr, scaledIndex);
	interpreterProxy.pop(5);
}


/*	The Karplus-Strong plucked string algorithm: start with a buffer full of random noise and repeatedly play the contents of that buffer while averaging adjacent samples. High harmonics damp out more quickly, transfering their energy to lower ones. The length of the buffer corresponds to the length of the string. */
/*	(PluckedSound pitch: 220.0 dur: 6.0 loudness: 0.8) play */

function primitiveMixPluckedSound() {
	var rcvr;
	var n;
	var aSoundBuffer;
	var startIndex;
	var leftVol;
	var rightVol;
	var average;
	var i;
	var lastIndex;
	var s;
	var sample;
	var scaledNextIndex;
	var scaledThisIndex;
	var sliceIndex;
	var count;
	var ring;
	var scaledIndex;
	var scaledIndexIncr;
	var scaledIndexLimit;
	var scaledVol;
	var scaledVolIncr;
	var scaledVolLimit;

	rcvr = interpreterProxy.stackValue(5);
	n = interpreterProxy.stackIntegerValue(4);
	aSoundBuffer = interpreterProxy.stackInt16Array(3);
	startIndex = interpreterProxy.stackIntegerValue(2);
	leftVol = interpreterProxy.stackIntegerValue(1);
	rightVol = interpreterProxy.stackIntegerValue(0);
	scaledVol = interpreterProxy.fetchIntegerofObject(3, rcvr);
	scaledVolIncr = interpreterProxy.fetchIntegerofObject(4, rcvr);
	scaledVolLimit = interpreterProxy.fetchIntegerofObject(5, rcvr);
	count = interpreterProxy.fetchIntegerofObject(7, rcvr);
	ring = interpreterProxy.fetchInt16ArrayofObject(8, rcvr);
	scaledIndex = interpreterProxy.fetchIntegerofObject(9, rcvr);
	scaledIndexIncr = interpreterProxy.fetchIntegerofObject(10, rcvr);
	scaledIndexLimit = interpreterProxy.fetchIntegerofObject(11, rcvr);
	if (interpreterProxy.failed()) {
		return null;
	}
	lastIndex = (startIndex + n) - 1;
	scaledThisIndex = (scaledNextIndex = scaledIndex);
	for (sliceIndex = startIndex; sliceIndex <= lastIndex; sliceIndex++) {
		scaledNextIndex = scaledThisIndex + scaledIndexIncr;
		if (scaledNextIndex >= scaledIndexLimit) {
			scaledNextIndex = ScaleFactor + (scaledNextIndex - scaledIndexLimit);
		}
		average = (ring[(scaledThisIndex >> 15) - 1] + ring[(scaledNextIndex >> 15) - 1]) >> 1;
		ring[(scaledThisIndex >> 15) - 1] = average;

		/* scale by volume */

		sample = (average * scaledVol) >> 15;
		scaledThisIndex = scaledNextIndex;
		if (leftVol > 0) {
			i = (2 * sliceIndex) - 1;
			s = aSoundBuffer[i - 1] + ((sample * leftVol) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		if (rightVol > 0) {
			i = 2 * sliceIndex;
			s = aSoundBuffer[i - 1] + ((sample * rightVol) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		if (scaledVolIncr !== 0) {
			scaledVol += scaledVolIncr;
			if (((scaledVolIncr > 0) && (scaledVol >= scaledVolLimit)) || ((scaledVolIncr < 0) && (scaledVol <= scaledVolLimit))) {

				/* reached the limit; stop incrementing */

				scaledVol = scaledVolLimit;
				scaledVolIncr = 0;
			}
		}
	}
	scaledIndex = scaledNextIndex;
	count -= n;
	if (interpreterProxy.failed()) {
		return null;
	}
	interpreterProxy.storeIntegerofObjectwithValue(3, rcvr, scaledVol);
	interpreterProxy.storeIntegerofObjectwithValue(4, rcvr, scaledVolIncr);
	interpreterProxy.storeIntegerofObjectwithValue(7, rcvr, count);
	interpreterProxy.storeIntegerofObjectwithValue(9, rcvr, scaledIndex);
	interpreterProxy.pop(5);
}


/*	Mix the given number of samples with the samples already in the given buffer starting at the given index. Assume that the buffer size is at least (index + count) - 1. */

function primitiveMixSampledSound() {
	var rcvr;
	var n;
	var aSoundBuffer;
	var startIndex;
	var leftVol;
	var rightVol;
	var i;
	var lastIndex;
	var outIndex;
	var overflow;
	var s;
	var sample;
	var sampleIndex;
	var count;
	var indexHighBits;
	var samples;
	var samplesSize;
	var scaledIncrement;
	var scaledIndex;
	var scaledVol;
	var scaledVolIncr;
	var scaledVolLimit;

	rcvr = interpreterProxy.stackValue(5);
	n = interpreterProxy.stackIntegerValue(4);
	aSoundBuffer = interpreterProxy.stackInt16Array(3);
	startIndex = interpreterProxy.stackIntegerValue(2);
	leftVol = interpreterProxy.stackIntegerValue(1);
	rightVol = interpreterProxy.stackIntegerValue(0);
	scaledVol = interpreterProxy.fetchIntegerofObject(3, rcvr);
	scaledVolIncr = interpreterProxy.fetchIntegerofObject(4, rcvr);
	scaledVolLimit = interpreterProxy.fetchIntegerofObject(5, rcvr);
	count = interpreterProxy.fetchIntegerofObject(7, rcvr);
	samples = interpreterProxy.fetchInt16ArrayofObject(8, rcvr);
	samplesSize = interpreterProxy.fetchIntegerofObject(10, rcvr);
	scaledIndex = interpreterProxy.fetchIntegerofObject(11, rcvr);
	indexHighBits = interpreterProxy.fetchIntegerofObject(12, rcvr);
	scaledIncrement = interpreterProxy.fetchIntegerofObject(13, rcvr);
	if (interpreterProxy.failed()) {
		return null;
	}
	lastIndex = (startIndex + n) - 1;

	/* index of next stereo output sample pair */

	outIndex = startIndex;
	sampleIndex = indexHighBits + (scaledIndex >>> 16);
	while ((sampleIndex <= samplesSize) && (outIndex <= lastIndex)) {
		sample = (samples[sampleIndex - 1] * scaledVol) >> 15;
		if (leftVol > 0) {
			i = (2 * outIndex) - 1;
			s = aSoundBuffer[i - 1] + ((sample * leftVol) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		if (rightVol > 0) {
			i = 2 * outIndex;
			s = aSoundBuffer[i - 1] + ((sample * rightVol) >> 15);
			if (s > 32767) {
				s = 32767;
			}
			if (s < -32767) {
				s = -32767;
			}
			aSoundBuffer[i - 1] = s;
		}
		if (scaledVolIncr !== 0) {
			scaledVol += scaledVolIncr;
			if (((scaledVolIncr > 0) && (scaledVol >= scaledVolLimit)) || ((scaledVolIncr < 0) && (scaledVol <= scaledVolLimit))) {

				/* reached the limit; stop incrementing */

				scaledVol = scaledVolLimit;
				scaledVolIncr = 0;
			}
		}
		scaledIndex += scaledIncrement;
		if (scaledIndex >= ScaledIndexOverflow) {
			overflow = scaledIndex >>> 16;
			indexHighBits += overflow;
			scaledIndex -= overflow << 16;
		}
		sampleIndex = indexHighBits + (scaledIndex >>> 16);
		++outIndex;
	}
	count -= n;
	if (interpreterProxy.failed()) {
		return null;
	}
	interpreterProxy.storeIntegerofObjectwithValue(3, rcvr, scaledVol);
	interpreterProxy.storeIntegerofObjectwithValue(4, rcvr, scaledVolIncr);
	interpreterProxy.storeIntegerofObjectwithValue(7, rcvr, count);
	interpreterProxy.storeIntegerofObjectwithValue(11, rcvr, scaledIndex);
	interpreterProxy.storeIntegerofObjectwithValue(12, rcvr, indexHighBits);
	interpreterProxy.pop(5);
}


/*	Note: This is coded so that is can be run from Squeak. */

function setInterpreter(anInterpreter) {
	var ok;

	interpreterProxy = anInterpreter;
	ok = interpreterProxy.majorVersion() == VM_PROXY_MAJOR;
	if (ok === false) {
		return false;
	}
	ok = interpreterProxy.minorVersion() >= VM_PROXY_MINOR;
	return ok;
}


Squeak.registerExternalModule("SoundGenerationPlugin", {
	primitiveMixFMSound: primitiveMixFMSound,
	primitiveMixSampledSound: primitiveMixSampledSound,
	setInterpreter: setInterpreter,
	getModuleName: getModuleName,
	primitiveApplyReverb: primitiveApplyReverb,
	primitiveMixPluckedSound: primitiveMixPluckedSound,
	primitiveMixLoopedSampledSound: primitiveMixLoopedSampledSound,
});

}); // end of module
