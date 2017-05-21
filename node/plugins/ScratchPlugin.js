/* Smalltalk from Squeak4.5 with VMMaker 4.13.6 translated as JS source on 3 November 2014 1:52:23 pm */
/* Automatically generated by
	JSPluginCodeGenerator VMMakerJS-bf.15 uuid: fd4e10f2-3773-4e80-8bb5-c4b471a014e5
   from
	ScratchPlugin VMMaker-bf.353 uuid: 8ae25e7e-8d2c-451e-8277-598b30e9c002
 */
var module = require('../extensions').module;

module("users.bert.SqueakJS.plugins.ScratchPlugin").requires("users.bert.SqueakJS.vm").toRun(function() {
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

/*** Variables ***/
var interpreterProxy = null;
var moduleName = "ScratchPlugin 3 November 2014 (e)";


function bitmapatputHsv(bitmap, i, hue, saturation, brightness) {
	var hF;
	var hI;
	var outPix;
	var p;
	var q;
	var t;
	var v;


	/* integer part of hue (0..5) */

	hI = DIV(hue, 60);

	/* fractional part ofhue */

	hF = MOD(hue, 60);
	p = (1000 - saturation) * brightness;
	q = (1000 - (DIV((saturation * hF), 60))) * brightness;
	t = (1000 - (DIV((saturation * (60 - hF)), 60))) * brightness;
	v = DIV((brightness * 1000), 3922);
	p = DIV(p, 3922);
	q = DIV(q, 3922);
	t = DIV(t, 3922);
	if (0 === hI) {
		outPix = ((v << 16) + (t << 8)) + p;
	}
	if (1 === hI) {
		outPix = ((q << 16) + (v << 8)) + p;
	}
	if (2 === hI) {
		outPix = ((p << 16) + (v << 8)) + t;
	}
	if (3 === hI) {
		outPix = ((p << 16) + (q << 8)) + v;
	}
	if (4 === hI) {
		outPix = ((t << 16) + (p << 8)) + v;
	}
	if (5 === hI) {
		outPix = ((v << 16) + (p << 8)) + q;
	}
	if (outPix === 0) {
		outPix = 1;
	}
	bitmap[i] = outPix;
	return 0;
}


/*	Return an unsigned int pointer to the first indexable word of oop, which must be a words object. */

function checkedFloatPtrOf(oop) {
	interpreterProxy.success(interpreterProxy.isWordsOrBytes(oop));
	if (interpreterProxy.failed()) {
		return 0;
	}
	return oop.wordsAsFloat64Array();
}


/*	Return an unsigned int pointer to the first indexable word of oop, which must be a words object. */

function checkedUnsignedIntPtrOf(oop) {
	interpreterProxy.success(interpreterProxy.isWords(oop));
	if (interpreterProxy.failed()) {
		return 0;
	}
	return oop.words;
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


/*	Answer the hue, an angle between 0 and 360. */

function hueFromRGBminmax(r, g, b, min, max) {
	var result;
	var span;

	span = max - min;
	if (span === 0) {
		return 0;
	}
	if (r === max) {
		result = DIV((60 * (g - b)), span);
	} else {
		if (g === max) {
			result = 120 + (DIV((60 * (b - r)), span));
		} else {
			result = 240 + (DIV((60 * (r - g)), span));
		}
	}
	if (result < 0) {
		return result + 360;
	}
	return result;
}


/*	Answer the interpolated pixel value between the given two pixel values. If either pixel is zero (transparent) answer the other pixel. If both pixels are  transparent, answer transparent. The fraction is between 0 and 1023, out of a total range of 1024. */

function interpolateandfrac(pix1, pix2, frac2) {
	var b;
	var frac1;
	var g;
	var r;
	var result;

	if (pix1 === 0) {
		return pix2;
	}
	if (pix2 === 0) {
		return pix1;
	}
	frac1 = 1024 - frac2;
	r = ((frac1 * ((pix1 >>> 16) & 255)) + (frac2 * ((pix2 >>> 16) & 255))) >> 10;
	g = ((frac1 * ((pix1 >>> 8) & 255)) + (frac2 * ((pix2 >>> 8) & 255))) >> 10;
	b = ((frac1 * (pix1 & 255)) + (frac2 * (pix2 & 255))) >> 10;
	result = ((r << 16) + (g << 8)) + b;
	if (result === 0) {
		result = 1;
	}
	return result;
}


/*	Answer the interpolated pixel value from the given bitmap at the given point. The x and y coordinates are fixed-point integers with 10 bits of fraction (i.e. they were multiplied by 1024, then truncated). If the given point is right on an edge, answer the nearest edge pixel value. If it is entirely outside of the image, answer 0 (transparent). */

function interpolatedFromxywidthheight(bitmap, xFixed, yFixed, w, h) {
	var bottomPix;
	var index;
	var topPix;
	var x;
	var xFrac;
	var y;
	var yFrac;

	x = xFixed >>> 10;
	if ((x < -1) || (x >= w)) {
		return 0;
	}
	y = yFixed >>> 10;
	if ((y < -1) || (y >= h)) {
		return 0;
	}
	xFrac = xFixed & 1023;
	if (x === -1) {
		x = 0;
		xFrac = 0;
	}
	if (x === (w - 1)) {
		xFrac = 0;
	}
	yFrac = yFixed & 1023;
	if (y === -1) {
		y = 0;
		yFrac = 0;
	}
	if (y === (h - 1)) {
		yFrac = 0;
	}

	/* for squeak: + 1 */

	index = (y * w) + x;
	topPix = bitmap[index] & 16777215;
	if (xFrac > 0) {
		topPix = interpolateandfrac(topPix, bitmap[index + 1] & 16777215, xFrac);
	}
	if (yFrac === 0) {
		return topPix;
	}

	/* for squeak: + 1 */

	index = ((y + 1) * w) + x;
	bottomPix = bitmap[index] & 16777215;
	if (xFrac > 0) {
		bottomPix = interpolateandfrac(bottomPix, bitmap[index + 1] & 16777215, xFrac);
	}
	return interpolateandfrac(topPix, bottomPix, yFrac);
}

function primitiveBlur() {
	var bTotal;
	var dX;
	var dY;
	var gTotal;
	var height;
	var in_;
	var inOop;
	var n;
	var out;
	var outOop;
	var outPix;
	var pix;
	var rTotal;
	var sz;
	var width;
	var x;
	var y;

	inOop = interpreterProxy.stackValue(2);
	outOop = interpreterProxy.stackValue(1);
	width = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	sz = SIZEOF(inOop);
	interpreterProxy.success(SIZEOF(outOop) === sz);
	if (interpreterProxy.failed()) {
		return null;
	}
	height = DIV(sz, width);
	for (y = 1; y <= (height - 2); y++) {
		for (x = 1; x <= (width - 2); x++) {
			n = (rTotal = (gTotal = (bTotal = 0)));
			for (dY = -1; dY <= 1; dY++) {
				for (dX = -1; dX <= 1; dX++) {

					/* add 1 when testing in Squeak */

					pix = in_[((y + dY) * width) + (x + dX)] & 16777215;
					if (pix !== 0) {

						/* skip transparent pixels */

						rTotal += (pix >>> 16) & 255;
						gTotal += (pix >>> 8) & 255;
						bTotal += pix & 255;
						++n;
					}
				}
			}
			if (n === 0) {
				outPix = 0;
			} else {
				outPix = (((DIV(rTotal, n)) << 16) + ((DIV(gTotal, n)) << 8)) + (DIV(bTotal, n));
			}
			out[(y * width) + x] = outPix;
		}
	}
	interpreterProxy.pop(3);
	return 0;
}

function primitiveBrightnessShift() {
	var b;
	var brightness;
	var g;
	var hue;
	var i;
	var in_;
	var inOop;
	var max;
	var min;
	var out;
	var outOop;
	var pix;
	var r;
	var saturation;
	var shift;
	var sz;

	inOop = interpreterProxy.stackValue(2);
	outOop = interpreterProxy.stackValue(1);
	shift = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	sz = SIZEOF(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	interpreterProxy.success(SIZEOF(outOop) === sz);
	if (interpreterProxy.failed()) {
		return null;
	}
	for (i = 0; i <= (sz - 1); i++) {
		pix = in_[i] & 16777215;
		if (pix !== 0) {

			/* skip pixel values of 0 (transparent) */

			r = (pix >>> 16) & 255;
			g = (pix >>> 8) & 255;

			/* find min and max color components */

			b = pix & 255;
			max = (min = r);
			if (g > max) {
				max = g;
			}
			if (b > max) {
				max = b;
			}
			if (g < min) {
				min = g;
			}
			if (b < min) {
				min = b;
			}

			/* find current saturation and brightness with range 0 to 1000 */

			hue = hueFromRGBminmax(r, g, b, min, max);
			if (max === 0) {
				saturation = 0;
			} else {
				saturation = DIV(((max - min) * 1000), max);
			}

			/* compute new brigthness */

			brightness = DIV((max * 1000), 255);
			brightness += shift * 10;
			if (brightness > 1000) {
				brightness = 1000;
			}
			if (brightness < 0) {
				brightness = 0;
			}
			bitmapatputHsv(out, i, hue, saturation, brightness);
		}
	}
	interpreterProxy.pop(3);
	return 0;
}

function primitiveCondenseSound() {
	var count;
	var dst;
	var dstOop;
	var factor;
	var i;
	var j;
	var max;
	var src;
	var srcOop;
	var sz;
	var v;
	var _src = 0;
	var _dst = 0;

	srcOop = interpreterProxy.stackValue(2);
	dstOop = interpreterProxy.stackValue(1);
	factor = interpreterProxy.stackIntegerValue(0);
	interpreterProxy.success(interpreterProxy.isWords(srcOop));
	interpreterProxy.success(interpreterProxy.isWords(dstOop));
	count = DIV((2 * SIZEOF(srcOop)), factor);
	sz = 2 * SIZEOF(dstOop);
	interpreterProxy.success(sz >= count);
	if (interpreterProxy.failed()) {
		return null;
	}
	src = srcOop.wordsAsInt16Array();
	dst = dstOop.wordsAsInt16Array();
	for (i = 1; i <= count; i++) {
		max = 0;
		for (j = 1; j <= factor; j++) {
			v = src[_src++];
			if (v < 0) {
				v = 0 - v;
			}
			if (v > max) {
				max = v;
			}
		}
		dst[_dst++] = max;
	}
	interpreterProxy.pop(3);
	return 0;
}

function primitiveDoubleSize() {
	var baseIndex;
	var dstX;
	var dstY;
	var i;
	var in_;
	var inH;
	var inOop;
	var inW;
	var out;
	var outH;
	var outOop;
	var outW;
	var pix;
	var x;
	var y;

	inOop = interpreterProxy.stackValue(7);
	inW = interpreterProxy.stackIntegerValue(6);
	inH = interpreterProxy.stackIntegerValue(5);
	outOop = interpreterProxy.stackValue(4);
	outW = interpreterProxy.stackIntegerValue(3);
	outH = interpreterProxy.stackIntegerValue(2);
	dstX = interpreterProxy.stackIntegerValue(1);
	dstY = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	interpreterProxy.success((dstX + (2 * inW)) < outW);
	interpreterProxy.success((dstY + (2 * inH)) < outH);
	if (interpreterProxy.failed()) {
		return null;
	}
	for (y = 0; y <= (inH - 1); y++) {
		baseIndex = ((dstY + (2 * y)) * outW) + dstX;
		for (x = 0; x <= (inW - 1); x++) {
			pix = in_[x + (y * inW)];
			i = baseIndex + (2 * x);
			out[i] = pix;
			out[i + 1] = pix;
			out[i + outW] = pix;
			out[(i + outW) + 1] = pix;
		}
	}
	interpreterProxy.pop(8);
	return 0;
}

function primitiveExtractChannel() {
	var dst;
	var dstOop;
	var i;
	var rightFlag;
	var src;
	var srcOop;
	var sz;
	var _src = 0;
	var _dst = 0;

	srcOop = interpreterProxy.stackValue(2);
	dstOop = interpreterProxy.stackValue(1);
	rightFlag = interpreterProxy.booleanValueOf(interpreterProxy.stackValue(0));
	interpreterProxy.success(interpreterProxy.isWords(srcOop));
	interpreterProxy.success(interpreterProxy.isWords(dstOop));
	sz = SIZEOF(srcOop);
	interpreterProxy.success(SIZEOF(dstOop) >= (sz >> 1));
	if (interpreterProxy.failed()) {
		return null;
	}
	src = srcOop.wordsAsInt16Array();
	dst = dstOop.wordsAsInt16Array();
	if (rightFlag) {
		_src++;
	}
	for (i = 1; i <= sz; i++) {
		dst[_dst++] = src[_src]; _src += 2;
	}
	interpreterProxy.pop(3);
	return 0;
}

function primitiveFisheye() {
	var ang;
	var centerX;
	var centerY;
	var dx;
	var dy;
	var height;
	var in_;
	var inOop;
	var out;
	var outOop;
	var pix;
	var power;
	var r;
	var scaledPower;
	var srcX;
	var srcY;
	var sz;
	var width;
	var x;
	var y;

	inOop = interpreterProxy.stackValue(3);
	outOop = interpreterProxy.stackValue(2);
	width = interpreterProxy.stackIntegerValue(1);
	power = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	sz = SIZEOF(inOop);
	interpreterProxy.success(SIZEOF(outOop) === sz);
	if (interpreterProxy.failed()) {
		return null;
	}
	height = DIV(sz, width);
	centerX = width >> 1;
	centerY = height >> 1;
	height = DIV(sz, width);
	centerX = width >> 1;
	centerY = height >> 1;
	scaledPower = power / 100.0;
	for (x = 0; x <= (width - 1); x++) {
		for (y = 0; y <= (height - 1); y++) {
			dx = (x - centerX) / centerX;
			dy = (y - centerY) / centerY;
			r = Math.pow(Math.sqrt((dx * dx) + (dy * dy)),scaledPower);
			if (r <= 1.0) {
				ang = Math.atan2(dy,dx);
				srcX = ((1024 * (centerX + ((r * Math.cos(ang)) * centerX)))|0);
				srcY = ((1024 * (centerY + ((r * Math.sin(ang)) * centerY)))|0);
			} else {
				srcX = 1024 * x;
				srcY = 1024 * y;
			}
			pix = interpolatedFromxywidthheight(in_, srcX, srcY, width, height);
			out[(y * width) + x] = pix;
		}
	}
	interpreterProxy.pop(4);
	return 0;
}

function primitiveHalfSizeAverage() {
	var b;
	var dstH;
	var dstIndex;
	var dstW;
	var dstX;
	var dstY;
	var g;
	var in_;
	var inH;
	var inW;
	var out;
	var outH;
	var outW;
	var pixel;
	var r;
	var srcIndex;
	var srcX;
	var srcY;
	var x;
	var y;

	in_ = checkedUnsignedIntPtrOf(interpreterProxy.stackValue(11));
	inW = interpreterProxy.stackIntegerValue(10);
	inH = interpreterProxy.stackIntegerValue(9);
	out = checkedUnsignedIntPtrOf(interpreterProxy.stackValue(8));
	outW = interpreterProxy.stackIntegerValue(7);
	outH = interpreterProxy.stackIntegerValue(6);
	srcX = interpreterProxy.stackIntegerValue(5);
	srcY = interpreterProxy.stackIntegerValue(4);
	dstX = interpreterProxy.stackIntegerValue(3);
	dstY = interpreterProxy.stackIntegerValue(2);
	dstW = interpreterProxy.stackIntegerValue(1);
	dstH = interpreterProxy.stackIntegerValue(0);
	interpreterProxy.success((srcX >= 0) && (srcY >= 0));
	interpreterProxy.success((srcX + (2 * dstW)) <= inW);
	interpreterProxy.success((srcY + (2 * dstH)) <= inH);
	interpreterProxy.success((dstX >= 0) && (dstY >= 0));
	interpreterProxy.success((dstX + dstW) <= outW);
	interpreterProxy.success((dstY + dstH) <= outH);
	if (interpreterProxy.failed()) {
		return null;
	}
	for (y = 0; y <= (dstH - 1); y++) {
		srcIndex = (inW * (srcY + (2 * y))) + srcX;
		dstIndex = (outW * (dstY + y)) + dstX;
		for (x = 0; x <= (dstW - 1); x++) {
			pixel = in_[srcIndex];
			r = pixel & 16711680;
			g = pixel & 65280;
			b = pixel & 255;
			pixel = in_[srcIndex + 1];
			r += pixel & 16711680;
			g += pixel & 65280;
			b += pixel & 255;
			pixel = in_[srcIndex + inW];
			r += pixel & 16711680;
			g += pixel & 65280;
			b += pixel & 255;
			pixel = in_[(srcIndex + inW) + 1];
			r += pixel & 16711680;
			g += pixel & 65280;

			/* store combined RGB into target bitmap */

			b += pixel & 255;
			out[dstIndex] = (((r >>> 2) & 16711680) | (((g >>> 2) & 65280) | (b >>> 2)));
			srcIndex += 2;
			++dstIndex;
		}
	}
	interpreterProxy.pop(12);
	return 0;
}

function primitiveHalfSizeDiagonal() {
	var b;
	var dstH;
	var dstIndex;
	var dstW;
	var dstX;
	var dstY;
	var g;
	var in_;
	var inH;
	var inW;
	var out;
	var outH;
	var outW;
	var p1;
	var p2;
	var r;
	var srcIndex;
	var srcX;
	var srcY;
	var x;
	var y;

	in_ = checkedUnsignedIntPtrOf(interpreterProxy.stackValue(11));
	inW = interpreterProxy.stackIntegerValue(10);
	inH = interpreterProxy.stackIntegerValue(9);
	out = checkedUnsignedIntPtrOf(interpreterProxy.stackValue(8));
	outW = interpreterProxy.stackIntegerValue(7);
	outH = interpreterProxy.stackIntegerValue(6);
	srcX = interpreterProxy.stackIntegerValue(5);
	srcY = interpreterProxy.stackIntegerValue(4);
	dstX = interpreterProxy.stackIntegerValue(3);
	dstY = interpreterProxy.stackIntegerValue(2);
	dstW = interpreterProxy.stackIntegerValue(1);
	dstH = interpreterProxy.stackIntegerValue(0);
	interpreterProxy.success((srcX >= 0) && (srcY >= 0));
	interpreterProxy.success((srcX + (2 * dstW)) <= inW);
	interpreterProxy.success((srcY + (2 * dstH)) <= inH);
	interpreterProxy.success((dstX >= 0) && (dstY >= 0));
	interpreterProxy.success((dstX + dstW) <= outW);
	interpreterProxy.success((dstY + dstH) <= outH);
	if (interpreterProxy.failed()) {
		return null;
	}
	for (y = 0; y <= (dstH - 1); y++) {
		srcIndex = (inW * (srcY + (2 * y))) + srcX;
		dstIndex = (outW * (dstY + y)) + dstX;
		for (x = 0; x <= (dstW - 1); x++) {
			p1 = in_[srcIndex];
			p2 = in_[(srcIndex + inW) + 1];
			r = (((p1 & 16711680) + (p2 & 16711680)) >>> 1) & 16711680;
			g = (((p1 & 65280) + (p2 & 65280)) >>> 1) & 65280;

			/* store combined RGB into target bitmap */

			b = ((p1 & 255) + (p2 & 255)) >>> 1;
			out[dstIndex] = (r | (g | b));
			srcIndex += 2;
			++dstIndex;
		}
	}
	interpreterProxy.pop(12);
	return 0;
}

function primitiveHueShift() {
	var b;
	var brightness;
	var g;
	var hue;
	var i;
	var in_;
	var inOop;
	var max;
	var min;
	var out;
	var outOop;
	var pix;
	var r;
	var saturation;
	var shift;
	var sz;

	inOop = interpreterProxy.stackValue(2);
	outOop = interpreterProxy.stackValue(1);
	shift = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	sz = SIZEOF(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	interpreterProxy.success(SIZEOF(outOop) === sz);
	if (interpreterProxy.failed()) {
		return null;
	}
	for (i = 0; i <= (sz - 1); i++) {
		pix = in_[i] & 16777215;
		if (pix !== 0) {

			/* skip pixel values of 0 (transparent) */

			r = (pix >>> 16) & 255;
			g = (pix >>> 8) & 255;

			/* find min and max color components */

			b = pix & 255;
			max = (min = r);
			if (g > max) {
				max = g;
			}
			if (b > max) {
				max = b;
			}
			if (g < min) {
				min = g;
			}
			if (b < min) {
				min = b;
			}
			brightness = DIV((max * 1000), 255);
			if (max === 0) {
				saturation = 0;
			} else {
				saturation = DIV(((max - min) * 1000), max);
			}
			if (brightness < 110) {

				/* force black to a very dark, saturated gray */

				brightness = 110;
				saturation = 1000;
			}
			if (saturation < 90) {
				saturation = 90;
			}
			if ((brightness === 110) || (saturation === 90)) {

				/* tint all blacks and grays the same */

				hue = 0;
			} else {
				hue = hueFromRGBminmax(r, g, b, min, max);
			}

			/* compute new hue */

			hue = MOD(((hue + shift) + 360000000), 360);
			bitmapatputHsv(out, i, hue, saturation, brightness);
		}
	}
	interpreterProxy.pop(3);
	return 0;
}

function primitiveInterpolate() {
	var in_;
	var inOop;
	var result;
	var sz;
	var width;
	var xFixed;
	var yFixed;

	inOop = interpreterProxy.stackValue(3);
	width = interpreterProxy.stackIntegerValue(2);
	xFixed = interpreterProxy.stackIntegerValue(1);
	yFixed = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	sz = SIZEOF(inOop);
	if (interpreterProxy.failed()) {
		return null;
	}
	result = interpolatedFromxywidthheight(in_, xFixed, yFixed, width, DIV(sz, width));
	interpreterProxy.pop(5);
	interpreterProxy.pushInteger(result);
	return 0;
}

function primitiveSaturationShift() {
	var b;
	var brightness;
	var g;
	var hue;
	var i;
	var in_;
	var inOop;
	var max;
	var min;
	var out;
	var outOop;
	var pix;
	var r;
	var saturation;
	var shift;
	var sz;

	inOop = interpreterProxy.stackValue(2);
	outOop = interpreterProxy.stackValue(1);
	shift = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	sz = SIZEOF(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	interpreterProxy.success(SIZEOF(outOop) === sz);
	if (interpreterProxy.failed()) {
		return null;
	}
	for (i = 0; i <= (sz - 1); i++) {
		pix = in_[i] & 16777215;
		if (!(pix < 2)) {

			/* skip pixel values of 0 (transparent) and 1 (black) */

			r = (pix >>> 16) & 255;
			g = (pix >>> 8) & 255;

			/* find min and max color components */

			b = pix & 255;
			max = (min = r);
			if (g > max) {
				max = g;
			}
			if (b > max) {
				max = b;
			}
			if (g < min) {
				min = g;
			}
			if (b < min) {
				min = b;
			}
			brightness = DIV((max * 1000), 255);
			if (max === 0) {
				saturation = 0;
			} else {
				saturation = DIV(((max - min) * 1000), max);
			}
			if (saturation > 0) {

				/* do nothing if pixel is unsaturated (gray) */


				/* compute new saturation */

				hue = hueFromRGBminmax(r, g, b, min, max);
				saturation += shift * 10;
				if (saturation > 1000) {
					saturation = 1000;
				}
				if (saturation < 0) {
					saturation = 0;
				}
				bitmapatputHsv(out, i, hue, saturation, brightness);
			}
		}
	}
	interpreterProxy.pop(3);
	return 0;
}


/*	Scale using bilinear interpolation. */

function primitiveScale() {
	var in_;
	var inH;
	var inOop;
	var inW;
	var inX;
	var inY;
	var out;
	var outH;
	var outOop;
	var outPix;
	var outW;
	var outX;
	var outY;
	var p1;
	var p2;
	var p3;
	var p4;
	var t;
	var tWeight;
	var w1;
	var w2;
	var w3;
	var w4;
	var xIncr;
	var yIncr;

	inOop = interpreterProxy.stackValue(5);
	inW = interpreterProxy.stackIntegerValue(4);
	inH = interpreterProxy.stackIntegerValue(3);
	outOop = interpreterProxy.stackValue(2);
	outW = interpreterProxy.stackIntegerValue(1);
	outH = interpreterProxy.stackIntegerValue(0);
	interpreterProxy.success(SIZEOF(inOop) === (inW * inH));
	interpreterProxy.success(SIZEOF(outOop) === (outW * outH));
	in_ = checkedUnsignedIntPtrOf(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	if (interpreterProxy.failed()) {
		return null;
	}

	/* source x and y, scaled by 1024 */

	inX = (inY = 0);

	/* source x increment, scaled by 1024 */

	xIncr = DIV((inW * 1024), outW);

	/* source y increment, scaled by 1024 */

	yIncr = DIV((inH * 1024), outH);
	for (outY = 0; outY <= (outH - 1); outY++) {
		inX = 0;
		for (outX = 0; outX <= (outW - 1); outX++) {

			/* compute weights, scaled by 2^20 */

			w1 = (1024 - (inX & 1023)) * (1024 - (inY & 1023));
			w2 = (inX & 1023) * (1024 - (inY & 1023));
			w3 = (1024 - (inX & 1023)) * (inY & 1023);

			/* get source pixels */

			w4 = (inX & 1023) * (inY & 1023);
			t = ((inY >>> 10) * inW) + (inX >>> 10);
			p1 = in_[t];
			if ((inX >>> 10) < (inW - 1)) {
				p2 = in_[t + 1];
			} else {
				p2 = p1;
			}
			if ((inY >>> 10) < (inH - 1)) {
				t += inW;
			}
			p3 = in_[t];
			if ((inX >>> 10) < (inW - 1)) {
				p4 = in_[t + 1];
			} else {
				p4 = p3;
			}
			tWeight = 0;
			if (p1 === 0) {
				p1 = p2;
				tWeight += w1;
			}
			if (p2 === 0) {
				p2 = p1;
				tWeight += w2;
			}
			if (p3 === 0) {
				p3 = p4;
				tWeight += w3;
			}
			if (p4 === 0) {
				p4 = p3;
				tWeight += w4;
			}
			if (p1 === 0) {
				p1 = p3;
				p2 = p4;
			}
			if (p3 === 0) {
				p3 = p1;
				p4 = p2;
			}
			outPix = 0;
			if (tWeight < 500000) {

				/* compute an (opaque) output pixel if less than 50% transparent */

				t = (((w1 * ((p1 >>> 16) & 255)) + (w2 * ((p2 >>> 16) & 255))) + (w3 * ((p3 >>> 16) & 255))) + (w4 * ((p4 >>> 16) & 255));
				outPix = ((t >>> 20) & 255) << 16;
				t = (((w1 * ((p1 >>> 8) & 255)) + (w2 * ((p2 >>> 8) & 255))) + (w3 * ((p3 >>> 8) & 255))) + (w4 * ((p4 >>> 8) & 255));
				outPix = outPix | (((t >>> 20) & 255) << 8);
				t = (((w1 * (p1 & 255)) + (w2 * (p2 & 255))) + (w3 * (p3 & 255))) + (w4 * (p4 & 255));
				outPix = outPix | ((t >>> 20) & 255);
				if (outPix === 0) {
					outPix = 1;
				}
			}
			out[(outY * outW) + outX] = outPix;
			inX += xIncr;
		}
		inY += yIncr;
	}
	interpreterProxy.pop(6);
	return 0;
}

function primitiveWaterRipples1() {
	var aArOop;
	var aArray;
	var allPix;
	var bArOop;
	var bArray;
	var blops;
	var d;
	var dist;
	var dx;
	var dx2;
	var dy;
	var dy2;
	var f;
	var g;
	var h;
	var height;
	var i;
	var in_;
	var inOop;
	var j;
	var newLoc;
	var out;
	var outOop;
	var pix;
	var power;
	var q;
	var ripply;
	var t;
	var t1;
	var temp;
	var val;
	var val2;
	var width;
	var x;
	var y;

	inOop = interpreterProxy.stackValue(5);
	outOop = interpreterProxy.stackValue(4);
	width = interpreterProxy.stackIntegerValue(3);
	in_ = checkedUnsignedIntPtrOf(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	allPix = SIZEOF(inOop);
	ripply = interpreterProxy.stackIntegerValue(2);
	aArOop = interpreterProxy.stackValue(1);
	bArOop = interpreterProxy.stackValue(0);
	aArray = checkedFloatPtrOf(aArOop);
	bArray = checkedFloatPtrOf(bArOop);
	interpreterProxy.success(SIZEOF(outOop) === allPix);
	if (interpreterProxy.failed()) {
		return null;
	}
	height = DIV(allPix, width);
	t1 = Math.random();
	blops = (MOD(t1, ripply)) - 1;
	for (t = 0; t <= ((blops / 2) - 1); t++) {
		t1 = Math.random();
		x = MOD(t1, width);
		t1 = Math.random();
		y = MOD(t1, height);
		t1 = Math.random();
		power = MOD(t1, 8);
		for (g = -4; g <= 4; g++) {
			for (h = -4; h <= 4; h++) {
				dist = ((g * g) + (h * h));
				if ((dist < 25) && (dist > 0)) {
					dx = ((x + g)|0);
					dy = ((y + h)|0);
					if ((dx > 0) && ((dy > 0) && ((dy < height) && (dx < width)))) {
						aArray[(dy * width) + dx] = (power * (1.0 - (dist / 25.0)));
					}
				}
			}
		}
	}
	for (f = 1; f <= (width - 2); f++) {
		for (d = 1; d <= (height - 2); d++) {
			val = (d * width) + f;
			aArray[val] = (((((((((bArray[val + 1] + bArray[val - 1]) + bArray[val + width]) + bArray[val - width]) + (bArray[(val - 1) - width] / 2)) + (bArray[(val - 1) + width] / 2)) + (bArray[(val + 1) - width] / 2)) + (bArray[(val + 1) + width] / 2)) / 4) - aArray[val]);
			aArray[val] = (aArray[val] * 0.9);
		}
	}
	for (q = 0; q <= (width * height); q++) {
		temp = bArray[q];
		bArray[q] = aArray[q];
		aArray[q] = temp;
	}
	for (j = 0; j <= (height - 1); j++) {
		for (i = 0; i <= (width - 1); i++) {
			if ((i > 1) && ((i < (width - 1)) && ((j > 1) && (j < (height - 1))))) {
				val2 = (j * width) + i;
				dx2 = (((aArray[val2] - aArray[val2 - 1]) + (aArray[val2 + 1] - aArray[val2])) * 64);
				dy2 = (((aArray[val2] - aArray[val2 - width]) + (aArray[val2 + width] - aArray[val2])) / 64);
				if (dx2 < 2) {
					dx2 = -2;
				}
				if (dx2 > 2) {
					dx2 = 2;
				}
				if (dy2 < 2) {
					dy2 = -2;
				}
				if (dy2 > 2) {
					dy2 = 2;
				}
				newLoc = ((((j + dy2) * width) + (i + dx2))|0);
				if ((newLoc < (width * height)) && (newLoc >= 0)) {
					pix = in_[newLoc];
				} else {
					pix = in_[i + (j * width)];
				}
			} else {
				pix = in_[i + (j * width)];
			}
			out[i + (j * width)] = pix;
		}
	}
	interpreterProxy.pop(6);
	return 0;
}

function primitiveWhirl() {
	var ang;
	var centerX;
	var centerY;
	var cosa;
	var d;
	var degrees;
	var dx;
	var dy;
	var factor;
	var height;
	var in_;
	var inOop;
	var out;
	var outOop;
	var pix;
	var radius;
	var radiusSquared;
	var scaleX;
	var scaleY;
	var sina;
	var sz;
	var whirlRadians;
	var width;
	var x;
	var y;

	inOop = interpreterProxy.stackValue(3);
	outOop = interpreterProxy.stackValue(2);
	width = interpreterProxy.stackIntegerValue(1);
	degrees = interpreterProxy.stackIntegerValue(0);
	in_ = checkedUnsignedIntPtrOf(inOop);
	out = checkedUnsignedIntPtrOf(outOop);
	sz = SIZEOF(inOop);
	interpreterProxy.success(SIZEOF(outOop) === sz);
	if (interpreterProxy.failed()) {
		return null;
	}
	height = DIV(sz, width);
	centerX = width >> 1;
	centerY = height >> 1;
	if (centerX < centerY) {
		radius = centerX;
		scaleX = centerY / centerX;
		scaleY = 1.0;
	} else {
		radius = centerY;
		scaleX = 1.0;
		if (centerY < centerX) {
			scaleY = centerX / centerY;
		} else {
			scaleY = 1.0;
		}
	}
	whirlRadians = (-3.141592653589793 * degrees) / 180.0;
	radiusSquared = (radius * radius);
	for (x = 0; x <= (width - 1); x++) {
		for (y = 0; y <= (height - 1); y++) {
			dx = scaleX * (x - centerX);
			dy = scaleY * (y - centerY);
			d = (dx * dx) + (dy * dy);
			if (d < radiusSquared) {

				/* inside the whirl circle */

				factor = 1.0 - (Math.sqrt(d) / radius);
				ang = whirlRadians * (factor * factor);
				sina = Math.sin(ang);
				cosa = Math.cos(ang);
				pix = interpolatedFromxywidthheight(in_, ((1024.0 * ((((cosa * dx) - (sina * dy)) / scaleX) + centerX))|0), ((1024.0 * ((((sina * dx) + (cosa * dy)) / scaleY) + centerY))|0), width, height);
				out[(width * y) + x] = pix;
			}
		}
	}
	interpreterProxy.pop(4);
	return 0;
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


Squeak.registerExternalModule("ScratchPlugin", {
	primitiveCondenseSound: primitiveCondenseSound,
	getModuleName: getModuleName,
	primitiveFisheye: primitiveFisheye,
	primitiveWaterRipples1: primitiveWaterRipples1,
	primitiveHalfSizeDiagonal: primitiveHalfSizeDiagonal,
	primitiveScale: primitiveScale,
	primitiveDoubleSize: primitiveDoubleSize,
	setInterpreter: setInterpreter,
	primitiveWhirl: primitiveWhirl,
	primitiveBlur: primitiveBlur,
	primitiveBrightnessShift: primitiveBrightnessShift,
	primitiveHalfSizeAverage: primitiveHalfSizeAverage,
	primitiveSaturationShift: primitiveSaturationShift,
	primitiveHueShift: primitiveHueShift,
	primitiveInterpolate: primitiveInterpolate,
	primitiveExtractChannel: primitiveExtractChannel,
});

}); // end of module
