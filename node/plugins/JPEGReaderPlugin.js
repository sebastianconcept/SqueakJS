/* Smalltalk from Squeak4.5 with VMMaker 4.13.6 translated as JS source on 3 November 2014 1:52:20 pm */
/* Automatically generated by
	JSPluginCodeGenerator VMMakerJS-bf.15 uuid: fd4e10f2-3773-4e80-8bb5-c4b471a014e5
   from
	JPEGReaderPlugin VMMaker-bf.353 uuid: 8ae25e7e-8d2c-451e-8277-598b30e9c002
 */

var sqModule = require('../sqModule');
var Squeak = require('../vm').Squeak;

sqModule("users.bert.SqueakJS.plugins.JPEGReaderPlugin").requires("users.bert.SqueakJS.vm").toRun(function() {
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
var BlockWidthIndex = 5;
var BlueIndex = 2;
var ConstBits = 13;
var CurrentXIndex = 0;
var CurrentYIndex = 1;
var DCTSize = 8;
var DCTSize2 = 64;
var FIXn0n298631336 = 2446;
var FIXn0n34414 = 22554;
var FIXn0n390180644 = 3196;
var FIXn0n541196100 = 4433;
var FIXn0n71414 = 46802;
var FIXn0n765366865 = 6270;
var FIXn0n899976223 = 7373;
var FIXn1n175875602 = 9633;
var FIXn1n40200 = 91881;
var FIXn1n501321110 = 12299;
var FIXn1n77200 = 116130;
var FIXn1n847759065 = 15137;
var FIXn1n961570560 = 16069;
var FIXn2n053119869 = 16819;
var FIXn2n562915447 = 20995;
var FIXn3n072711026 = 25172;
var GreenIndex = 1;
var HScaleIndex = 2;
var MCUBlockIndex = 4;
var MCUWidthIndex = 8;
var MaxBits = 16;
var MaxMCUBlocks = 128;
var MaxSample = 255;
var MinComponentSize = 11;
var Pass1Bits = 2;
var Pass1Div = 2048;
var Pass2Div = 262144;
var PriorDCValueIndex = 10;
var RedIndex = 0;
var SampleOffset = 127;
var VScaleIndex = 3;

/*** Variables ***/
var acTable = null;
var acTableSize = 0;
var cbBlocks = new Array(128);
var cbComponent = new Array(11);
var cbSampleStream = 0;
var crBlocks = new Array(128);
var crComponent = new Array(11);
var crSampleStream = 0;
var dcTable = null;
var dcTableSize = 0;
var ditherMask = 0;
var interpreterProxy = null;
var jpegBits = null;
var jpegBitsSize = 0;
var jpegNaturalOrder = [
	0, 1, 8, 16, 9, 2, 3, 10,
	17, 24, 32, 25, 18, 11, 4, 5,
	12, 19, 26, 33, 40, 48, 41, 34,
	27, 20, 13, 6, 7, 14, 21, 28,
	35, 42, 49, 56, 57, 50, 43, 36,
	29, 22, 15, 23, 30, 37, 44, 51,
	58, 59, 52, 45, 38, 31, 39, 46,
	53, 60, 61, 54, 47, 55, 62, 63
];
var jsBitBuffer = 0;
var jsBitCount = 0;
var jsCollection = null;
var jsPosition = 0;
var jsReadLimit = 0;
var moduleName = "JPEGReaderPlugin 3 November 2014 (e)";
var residuals = null;
var yBlocks = new Array(128);
var yComponent = new Array(11);
var ySampleStream = 0;


function cbColorComponentFrom(oop) {
	return colorComponentfrom(cbComponent, oop) && (colorComponentBlocksfrom(cbBlocks, oop));
}

function colorComponentfrom(aColorComponent, oop) {
	if (typeof oop === "number") {
		return false;
	}
	if (!interpreterProxy.isPointers(oop)) {
		return false;
	}
	if (SIZEOF(oop) < MinComponentSize) {
		return false;
	}
	aColorComponent[CurrentXIndex] = interpreterProxy.fetchIntegerofObject(CurrentXIndex, oop);
	aColorComponent[CurrentYIndex] = interpreterProxy.fetchIntegerofObject(CurrentYIndex, oop);
	aColorComponent[HScaleIndex] = interpreterProxy.fetchIntegerofObject(HScaleIndex, oop);
	aColorComponent[VScaleIndex] = interpreterProxy.fetchIntegerofObject(VScaleIndex, oop);
	aColorComponent[BlockWidthIndex] = interpreterProxy.fetchIntegerofObject(BlockWidthIndex, oop);
	aColorComponent[MCUWidthIndex] = interpreterProxy.fetchIntegerofObject(MCUWidthIndex, oop);
	aColorComponent[PriorDCValueIndex] = interpreterProxy.fetchIntegerofObject(PriorDCValueIndex, oop);
	return !interpreterProxy.failed();
}

function colorComponentBlocksfrom(blocks, oop) {
	var arrayOop;
	var blockOop;
	var i;
	var max;

	if (typeof oop === "number") {
		return false;
	}
	if (!interpreterProxy.isPointers(oop)) {
		return false;
	}
	if (SIZEOF(oop) < MinComponentSize) {
		return false;
	}
	arrayOop = interpreterProxy.fetchPointerofObject(MCUBlockIndex, oop);
	if (typeof arrayOop === "number") {
		return false;
	}
	if (!interpreterProxy.isPointers(arrayOop)) {
		return false;
	}
	max = SIZEOF(arrayOop);
	if (max > MaxMCUBlocks) {
		return false;
	}
	for (i = 0; i <= (max - 1); i++) {
		blockOop = interpreterProxy.fetchPointerofObject(i, arrayOop);
		if (typeof blockOop === "number") {
			return false;
		}
		if (!interpreterProxy.isWords(blockOop)) {
			return false;
		}
		if (SIZEOF(blockOop) !== DCTSize2) {
			return false;
		}
		blocks[i] = blockOop.wordsAsInt32Array();
	}
	return !interpreterProxy.failed();
}

function colorConvertGrayscaleMCU() {
	var i;
	var y;

	yComponent[CurrentXIndex] = 0;
	yComponent[CurrentYIndex] = 0;
	for (i = 0; i <= (jpegBitsSize - 1); i++) {
		y = nextSampleY();
		y += residuals[GreenIndex];
		y = Math.min(y, MaxSample);
		residuals[GreenIndex] = (y & ditherMask);
		y = y & (MaxSample - ditherMask);
		y = Math.max(y, 1);
		jpegBits[i] = (((4278190080 + (y << 16)) + (y << 8)) + y);
	}
}

function colorConvertMCU() {
	var blue;
	var cb;
	var cr;
	var green;
	var i;
	var red;
	var y;

	yComponent[CurrentXIndex] = 0;
	yComponent[CurrentYIndex] = 0;
	cbComponent[CurrentXIndex] = 0;
	cbComponent[CurrentYIndex] = 0;
	crComponent[CurrentXIndex] = 0;
	crComponent[CurrentYIndex] = 0;
	for (i = 0; i <= (jpegBitsSize - 1); i++) {
		y = nextSampleY();
		cb = nextSampleCb();
		cb -= SampleOffset;
		cr = nextSampleCr();
		cr -= SampleOffset;
		red = (y + ((FIXn1n40200 * cr) >> 16)) + residuals[RedIndex];
		red = Math.min(red, MaxSample);
		red = Math.max(red, 0);
		residuals[RedIndex] = (red & ditherMask);
		red = red & (MaxSample - ditherMask);
		red = Math.max(red, 1);
		green = ((y - ((FIXn0n34414 * cb) >> 16)) - ((FIXn0n71414 * cr) >> 16)) + residuals[GreenIndex];
		green = Math.min(green, MaxSample);
		green = Math.max(green, 0);
		residuals[GreenIndex] = (green & ditherMask);
		green = green & (MaxSample - ditherMask);
		green = Math.max(green, 1);
		blue = (y + ((FIXn1n77200 * cb) >> 16)) + residuals[BlueIndex];
		blue = Math.min(blue, MaxSample);
		blue = Math.max(blue, 0);
		residuals[BlueIndex] = (blue & ditherMask);
		blue = blue & (MaxSample - ditherMask);
		blue = Math.max(blue, 1);
		jpegBits[i] = (((4278190080 + (red << 16)) + (green << 8)) + blue);
	}
}

function crColorComponentFrom(oop) {
	return colorComponentfrom(crComponent, oop) && (colorComponentBlocksfrom(crBlocks, oop));
}

function decodeBlockIntocomponent(anArray, aColorComponent) {
	var bits;
	var byte;
	var i;
	var index;
	var zeroCount;

	byte = jpegDecodeValueFromsize(dcTable, dcTableSize);
	if (byte < 0) {
		return interpreterProxy.primitiveFail();
	}
	if (byte !== 0) {
		bits = getBits(byte);
		byte = scaleAndSignExtendinFieldWidth(bits, byte);
	}
	byte = aColorComponent[PriorDCValueIndex] = (aColorComponent[PriorDCValueIndex] + byte);
	anArray[0] = byte;
	for (i = 1; i <= (DCTSize2 - 1); i++) {
		anArray[i] = 0;
	}
	index = 1;
	while (index < DCTSize2) {
		byte = jpegDecodeValueFromsize(acTable, acTableSize);
		if (byte < 0) {
			return interpreterProxy.primitiveFail();
		}
		zeroCount = byte >>> 4;
		byte = byte & 15;
		if (byte !== 0) {
			index += zeroCount;
			bits = getBits(byte);
			byte = scaleAndSignExtendinFieldWidth(bits, byte);
			if ((index < 0) || (index >= DCTSize2)) {
				return interpreterProxy.primitiveFail();
			}
			anArray[jpegNaturalOrder[index]] = byte;
		} else {
			if (zeroCount === 15) {
				index += zeroCount;
			} else {
				return null;
			}
		}
		++index;
	}
}

function fillBuffer() {
	var byte;

	while (jsBitCount <= 16) {
		if (!(jsPosition < jsReadLimit)) {
			return jsBitCount;
		}
		byte = jsCollection[jsPosition];
		++jsPosition;
		if (byte === 255) {

			/* peek for 00 */

			if (!((jsPosition < jsReadLimit) && (jsCollection[jsPosition] === 0))) {
				--jsPosition;
				return jsBitCount;
			}
			++jsPosition;
		}
		jsBitBuffer = (jsBitBuffer << 8) | byte;
		jsBitCount += 8;
	}
	return jsBitCount;
}

function getBits(requestedBits) {
	var value;

	if (requestedBits > jsBitCount) {
		fillBuffer();
		if (requestedBits > jsBitCount) {
			return -1;
		}
	}
	jsBitCount -= requestedBits;
	value = SHR(jsBitBuffer, jsBitCount);
	jsBitBuffer = jsBitBuffer & ((SHL(1, jsBitCount)) - 1);
	return value;
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

function idctBlockIntqt(anArray, qt) {
	var anACTerm;
	var dcval;
	var i;
	var j;
	var row;
	var t0;
	var t1;
	var t10;
	var t11;
	var t12;
	var t13;
	var t2;
	var t3;
	var v;
	var ws = new Array(64);
	var z1;
	var z2;
	var z3;
	var z4;
	var z5;

	;
	for (i = 0; i <= (DCTSize - 1); i++) {
		anACTerm = -1;
		for (row = 1; row <= (DCTSize - 1); row++) {
			if (anACTerm === -1) {
				if (anArray[(row * DCTSize) + i] !== 0) {
					anACTerm = row;
				}
			}
		}
		if (anACTerm === -1) {
			dcval = (anArray[i] * qt[0]) << 2;
			for (j = 0; j <= (DCTSize - 1); j++) {
				ws[(j * DCTSize) + i] = dcval;
			}
		} else {
			z2 = anArray[(DCTSize * 2) + i] * qt[(DCTSize * 2) + i];
			z3 = anArray[(DCTSize * 6) + i] * qt[(DCTSize * 6) + i];
			z1 = (z2 + z3) * FIXn0n541196100;
			t2 = z1 + (z3 * (0 - FIXn1n847759065));
			t3 = z1 + (z2 * FIXn0n765366865);
			z2 = anArray[i] * qt[i];
			z3 = anArray[(DCTSize * 4) + i] * qt[(DCTSize * 4) + i];
			t0 = (z2 + z3) << 13;
			t1 = (z2 - z3) << 13;
			t10 = t0 + t3;
			t13 = t0 - t3;
			t11 = t1 + t2;
			t12 = t1 - t2;
			t0 = anArray[(DCTSize * 7) + i] * qt[(DCTSize * 7) + i];
			t1 = anArray[(DCTSize * 5) + i] * qt[(DCTSize * 5) + i];
			t2 = anArray[(DCTSize * 3) + i] * qt[(DCTSize * 3) + i];
			t3 = anArray[DCTSize + i] * qt[DCTSize + i];
			z1 = t0 + t3;
			z2 = t1 + t2;
			z3 = t0 + t2;
			z4 = t1 + t3;
			z5 = (z3 + z4) * FIXn1n175875602;
			t0 = t0 * FIXn0n298631336;
			t1 = t1 * FIXn2n053119869;
			t2 = t2 * FIXn3n072711026;
			t3 = t3 * FIXn1n501321110;
			z1 = z1 * (0 - FIXn0n899976223);
			z2 = z2 * (0 - FIXn2n562915447);
			z3 = z3 * (0 - FIXn1n961570560);
			z4 = z4 * (0 - FIXn0n390180644);
			z3 += z5;
			z4 += z5;
			t0 = (t0 + z1) + z3;
			t1 = (t1 + z2) + z4;
			t2 = (t2 + z2) + z3;
			t3 = (t3 + z1) + z4;
			ws[i] = ((t10 + t3) >> 11);
			ws[(DCTSize * 7) + i] = ((t10 - t3) >> 11);
			ws[(DCTSize * 1) + i] = ((t11 + t2) >> 11);
			ws[(DCTSize * 6) + i] = ((t11 - t2) >> 11);
			ws[(DCTSize * 2) + i] = ((t12 + t1) >> 11);
			ws[(DCTSize * 5) + i] = ((t12 - t1) >> 11);
			ws[(DCTSize * 3) + i] = ((t13 + t0) >> 11);
			ws[(DCTSize * 4) + i] = ((t13 - t0) >> 11);
		}
	}
	for (i = 0; i <= (DCTSize2 - DCTSize); i += DCTSize) {
		z2 = ws[i + 2];
		z3 = ws[i + 6];
		z1 = (z2 + z3) * FIXn0n541196100;
		t2 = z1 + (z3 * (0 - FIXn1n847759065));
		t3 = z1 + (z2 * FIXn0n765366865);
		t0 = (ws[i] + ws[i + 4]) << 13;
		t1 = (ws[i] - ws[i + 4]) << 13;
		t10 = t0 + t3;
		t13 = t0 - t3;
		t11 = t1 + t2;
		t12 = t1 - t2;
		t0 = ws[i + 7];
		t1 = ws[i + 5];
		t2 = ws[i + 3];
		t3 = ws[i + 1];
		z1 = t0 + t3;
		z2 = t1 + t2;
		z3 = t0 + t2;
		z4 = t1 + t3;
		z5 = (z3 + z4) * FIXn1n175875602;
		t0 = t0 * FIXn0n298631336;
		t1 = t1 * FIXn2n053119869;
		t2 = t2 * FIXn3n072711026;
		t3 = t3 * FIXn1n501321110;
		z1 = z1 * (0 - FIXn0n899976223);
		z2 = z2 * (0 - FIXn2n562915447);
		z3 = z3 * (0 - FIXn1n961570560);
		z4 = z4 * (0 - FIXn0n390180644);
		z3 += z5;
		z4 += z5;
		t0 = (t0 + z1) + z3;
		t1 = (t1 + z2) + z4;
		t2 = (t2 + z2) + z3;
		t3 = (t3 + z1) + z4;
		v = ((t10 + t3) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i] = v;
		v = ((t10 - t3) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i + 7] = v;
		v = ((t11 + t2) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i + 1] = v;
		v = ((t11 - t2) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i + 6] = v;
		v = ((t12 + t1) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i + 2] = v;
		v = ((t12 - t1) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i + 5] = v;
		v = ((t13 + t0) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i + 3] = v;
		v = ((t13 - t0) >> 18) + SampleOffset;
		v = Math.min(v, MaxSample);
		v = Math.max(v, 0);
		anArray[i + 4] = v;
	}
}


/*	Decode the next value in the receiver using the given huffman table. */

function jpegDecodeValueFromsize(table, tableSize) {
	var bits;
	var bitsNeeded;
	var index;
	var tableIndex;
	var value;


	/* Initial bits needed */

	bitsNeeded = table[0] >>> 24;
	if (bitsNeeded > MaxBits) {
		return -1;
	}

	/* First real table */

	tableIndex = 2;
	while (true) {

		/* Get bits */

		bits = getBits(bitsNeeded);
		if (bits < 0) {
			return -1;
		}
		index = (tableIndex + bits) - 1;
		if (index >= tableSize) {
			return -1;
		}

		/* Lookup entry in table */

		value = table[index];
		if ((value & 1056964608) === 0) {
			return value;
		}

		/* Table offset in low 16 bit */

		tableIndex = value & 65535;

		/* Additional bits in high 8 bit */

		bitsNeeded = (value >>> 24) & 255;
		if (bitsNeeded > MaxBits) {
			return -1;
		}
	}
	return -1;
}

function loadJPEGStreamFrom(streamOop) {
	var oop;
	var sz;

	if (SIZEOF(streamOop) < 5) {
		return false;
	}
	if (!interpreterProxy.isPointers(streamOop)) {
		return false;
	}
	oop = interpreterProxy.fetchPointerofObject(0, streamOop);
	if (typeof oop === "number") {
		return false;
	}
	if (!interpreterProxy.isBytes(oop)) {
		return false;
	}
	jsCollection = oop.bytes;
	sz = BYTESIZEOF(oop);
	jsPosition = interpreterProxy.fetchIntegerofObject(1, streamOop);
	jsReadLimit = interpreterProxy.fetchIntegerofObject(2, streamOop);
	jsBitBuffer = interpreterProxy.fetchIntegerofObject(3, streamOop);
	jsBitCount = interpreterProxy.fetchIntegerofObject(4, streamOop);
	if (interpreterProxy.failed()) {
		return false;
	}
	if (sz < jsReadLimit) {
		return false;
	}
	if ((jsPosition < 0) || (jsPosition >= jsReadLimit)) {
		return false;
	}
	return true;
}

function nextSampleCb() {
	var blockIndex;
	var curX;
	var dx;
	var dy;
	var sample;
	var sampleIndex;
	var sx;
	var sy;

	dx = (curX = cbComponent[CurrentXIndex]);
	dy = cbComponent[CurrentYIndex];
	sx = cbComponent[HScaleIndex];
	sy = cbComponent[VScaleIndex];
	if ((sx !== 0) && (sy !== 0)) {
		dx = DIV(dx, sx);
		dy = DIV(dy, sy);
	}
	blockIndex = ((dy >>> 3) * cbComponent[BlockWidthIndex]) + (dx >>> 3);
	sampleIndex = ((dy & 7) << 3) + (dx & 7);
	sample = cbBlocks[blockIndex][sampleIndex];
	++curX;
	if (curX < (cbComponent[MCUWidthIndex] * 8)) {
		cbComponent[CurrentXIndex] = curX;
	} else {
		cbComponent[CurrentXIndex] = 0;
		cbComponent[CurrentYIndex]++;
	}
	return sample;
}

function nextSampleCr() {
	var blockIndex;
	var curX;
	var dx;
	var dy;
	var sample;
	var sampleIndex;
	var sx;
	var sy;

	dx = (curX = crComponent[CurrentXIndex]);
	dy = crComponent[CurrentYIndex];
	sx = crComponent[HScaleIndex];
	sy = crComponent[VScaleIndex];
	if ((sx !== 0) && (sy !== 0)) {
		dx = DIV(dx, sx);
		dy = DIV(dy, sy);
	}
	blockIndex = ((dy >>> 3) * crComponent[BlockWidthIndex]) + (dx >>> 3);
	sampleIndex = ((dy & 7) << 3) + (dx & 7);
	sample = crBlocks[blockIndex][sampleIndex];
	++curX;
	if (curX < (crComponent[MCUWidthIndex] * 8)) {
		crComponent[CurrentXIndex] = curX;
	} else {
		crComponent[CurrentXIndex] = 0;
		crComponent[CurrentYIndex]++;
	}
	return sample;
}

function nextSampleY() {
	var blockIndex;
	var curX;
	var dx;
	var dy;
	var sample;
	var sampleIndex;
	var sx;
	var sy;

	dx = (curX = yComponent[CurrentXIndex]);
	dy = yComponent[CurrentYIndex];
	sx = yComponent[HScaleIndex];
	sy = yComponent[VScaleIndex];
	if ((sx !== 0) && (sy !== 0)) {
		dx = DIV(dx, sx);
		dy = DIV(dy, sy);
	}
	blockIndex = ((dy >>> 3) * yComponent[BlockWidthIndex]) + (dx >>> 3);
	sampleIndex = ((dy & 7) << 3) + (dx & 7);
	sample = yBlocks[blockIndex][sampleIndex];
	++curX;
	if (curX < (yComponent[MCUWidthIndex] * 8)) {
		yComponent[CurrentXIndex] = curX;
	} else {
		yComponent[CurrentXIndex] = 0;
		yComponent[CurrentYIndex]++;
	}
	return sample;
}


/*	Requires:
		JPEGColorComponent
		bits
		WordArray with: 3*Integer (residuals)
		ditherMask
	 */

function primitiveColorConvertGrayscaleMCU() {
	var arrayOop;

	stInit();
	if (interpreterProxy.methodArgumentCount() !== 4) {
		return interpreterProxy.primitiveFail();
	}
	ditherMask = interpreterProxy.stackIntegerValue(0);
	arrayOop = interpreterProxy.stackObjectValue(1);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!(interpreterProxy.isWords(arrayOop) && (SIZEOF(arrayOop) === 3))) {
		return interpreterProxy.primitiveFail();
	}
	residuals = arrayOop.wordsAsInt32Array();
	arrayOop = interpreterProxy.stackObjectValue(2);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!interpreterProxy.isWords(arrayOop)) {
		return interpreterProxy.primitiveFail();
	}
	jpegBitsSize = SIZEOF(arrayOop);
	jpegBits = arrayOop.wordsAsInt32Array();
	arrayOop = interpreterProxy.stackObjectValue(3);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!yColorComponentFrom(arrayOop)) {
		return interpreterProxy.primitiveFail();
	}
	colorConvertGrayscaleMCU();
	interpreterProxy.pop(4);
}


/*	Requires:
		Array with: 3*JPEGColorComponent
		bits
		WordArray with: 3*Integer (residuals)
		ditherMask
	 */

function primitiveColorConvertMCU() {
	var arrayOop;

	stInit();
	if (interpreterProxy.methodArgumentCount() !== 4) {
		return interpreterProxy.primitiveFail();
	}
	ditherMask = interpreterProxy.stackIntegerValue(0);
	arrayOop = interpreterProxy.stackObjectValue(1);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!(interpreterProxy.isWords(arrayOop) && (SIZEOF(arrayOop) === 3))) {
		return interpreterProxy.primitiveFail();
	}
	residuals = arrayOop.wordsAsInt32Array();
	arrayOop = interpreterProxy.stackObjectValue(2);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!interpreterProxy.isWords(arrayOop)) {
		return interpreterProxy.primitiveFail();
	}
	jpegBitsSize = SIZEOF(arrayOop);
	jpegBits = arrayOop.wordsAsInt32Array();
	arrayOop = interpreterProxy.stackObjectValue(3);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!(interpreterProxy.isPointers(arrayOop) && (SIZEOF(arrayOop) === 3))) {
		return interpreterProxy.primitiveFail();
	}
	if (!yColorComponentFrom(interpreterProxy.fetchPointerofObject(0, arrayOop))) {
		return interpreterProxy.primitiveFail();
	}
	if (!cbColorComponentFrom(interpreterProxy.fetchPointerofObject(1, arrayOop))) {
		return interpreterProxy.primitiveFail();
	}
	if (!crColorComponentFrom(interpreterProxy.fetchPointerofObject(2, arrayOop))) {
		return interpreterProxy.primitiveFail();
	}
	colorConvertMCU();
	interpreterProxy.pop(4);
}


/*	In:
		anArray 		WordArray of: DCTSize2
		aColorComponent JPEGColorComponent
		dcTable			WordArray
		acTable			WordArray
		stream			JPEGStream
	 */

function primitiveDecodeMCU() {
	var anArray;
	var arrayOop;
	var oop;

	;
	if (interpreterProxy.methodArgumentCount() !== 5) {
		return interpreterProxy.primitiveFail();
	}
	oop = interpreterProxy.stackObjectValue(0);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!loadJPEGStreamFrom(oop)) {
		return interpreterProxy.primitiveFail();
	}
	arrayOop = interpreterProxy.stackObjectValue(1);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!interpreterProxy.isWords(arrayOop)) {
		return interpreterProxy.primitiveFail();
	}
	acTableSize = SIZEOF(arrayOop);
	acTable = arrayOop.wordsAsInt32Array();
	arrayOop = interpreterProxy.stackObjectValue(2);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!interpreterProxy.isWords(arrayOop)) {
		return interpreterProxy.primitiveFail();
	}
	dcTableSize = SIZEOF(arrayOop);
	dcTable = arrayOop.wordsAsInt32Array();
	oop = interpreterProxy.stackObjectValue(3);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!colorComponentfrom(yComponent, oop)) {
		return interpreterProxy.primitiveFail();
	}
	arrayOop = interpreterProxy.stackObjectValue(4);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!interpreterProxy.isWords(arrayOop)) {
		return interpreterProxy.primitiveFail();
	}
	if (SIZEOF(arrayOop) !== DCTSize2) {
		return interpreterProxy.primitiveFail();
	}
	anArray = arrayOop.wordsAsInt32Array();
	if (interpreterProxy.failed()) {
		return null;
	}
	decodeBlockIntocomponent(anArray, yComponent);
	if (interpreterProxy.failed()) {
		return null;
	}
	storeJPEGStreamOn(interpreterProxy.stackValue(0));
	interpreterProxy.storeIntegerofObjectwithValue(PriorDCValueIndex, interpreterProxy.stackValue(3), yComponent[PriorDCValueIndex]);
	interpreterProxy.pop(5);
}


/*	In:
		anArray: IntegerArray new: DCTSize2
		qt: IntegerArray new: DCTSize2.
	 */

function primitiveIdctInt() {
	var anArray;
	var arrayOop;
	var qt;

	;
	if (interpreterProxy.methodArgumentCount() !== 2) {
		return interpreterProxy.primitiveFail();
	}
	arrayOop = interpreterProxy.stackObjectValue(0);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!(interpreterProxy.isWords(arrayOop) && (SIZEOF(arrayOop) === DCTSize2))) {
		return interpreterProxy.primitiveFail();
	}
	qt = arrayOop.wordsAsInt32Array();
	arrayOop = interpreterProxy.stackObjectValue(1);
	if (interpreterProxy.failed()) {
		return null;
	}
	if (!(interpreterProxy.isWords(arrayOop) && (SIZEOF(arrayOop) === DCTSize2))) {
		return interpreterProxy.primitiveFail();
	}
	anArray = arrayOop.wordsAsInt32Array();
	idctBlockIntqt(anArray, qt);
	interpreterProxy.pop(2);
}

function scaleAndSignExtendinFieldWidth(aNumber, w) {
	if (aNumber < (SHL(1, (w - 1)))) {
		return (aNumber - (SHL(1, w))) + 1;
	} else {
		return aNumber;
	}
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

function stInit() {
	;
}

function storeJPEGStreamOn(streamOop) {
	interpreterProxy.storeIntegerofObjectwithValue(1, streamOop, jsPosition);
	interpreterProxy.storeIntegerofObjectwithValue(3, streamOop, jsBitBuffer);
	interpreterProxy.storeIntegerofObjectwithValue(4, streamOop, jsBitCount);
}

function yColorComponentFrom(oop) {
	return colorComponentfrom(yComponent, oop) && (colorComponentBlocksfrom(yBlocks, oop));
}


Squeak.registerExternalModule("JPEGReaderPlugin", {
	setInterpreter: setInterpreter,
	primitiveIdctInt: primitiveIdctInt,
	primitiveColorConvertMCU: primitiveColorConvertMCU,
	primitiveColorConvertGrayscaleMCU: primitiveColorConvertGrayscaleMCU,
	primitiveDecodeMCU: primitiveDecodeMCU,
	getModuleName: getModuleName,
});

}); // end of module
