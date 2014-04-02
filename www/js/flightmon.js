/**
 * $Id: default.js 61 2011-12-14 10:29:20Z virga $
 * 
 * Copyright (c) 2007-2010 Aero Systems Indonesia, PT.
 * All rights reserved.
 * 
 * AERO SYSTEMS INDONESIA PROPRIETARY/CONFIDENTIAL. Use is subject to
 * license terms.
 */
(function ($) {

var daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var shortMonthsInYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var longMonthsInYear = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
var shortMonthsToNumber = [];
shortMonthsToNumber["Jan"] = "01";
shortMonthsToNumber["Feb"] = "02";
shortMonthsToNumber["Mar"] = "03";
shortMonthsToNumber["Apr"] = "04";
shortMonthsToNumber["May"] = "05";
shortMonthsToNumber["Jun"] = "06";
shortMonthsToNumber["Jul"] = "07";
shortMonthsToNumber["Aug"] = "08";
shortMonthsToNumber["Sep"] = "09";
shortMonthsToNumber["Oct"] = "10";
shortMonthsToNumber["Nov"] = "11";
shortMonthsToNumber["Dec"] = "12";

    $.format = (function () {
        function strDay(value) {
  return daysInWeek[parseInt(value, 10)] || value;
        }

        function strMonth(value) {
var monthArrayIndex = parseInt(value, 10) - 1;
  return shortMonthsInYear[monthArrayIndex] || value;
        }

        function strLongMonth(value) {
var monthArrayIndex = parseInt(value, 10) - 1;
return longMonthsInYear[monthArrayIndex] || value;
        }

        var parseMonth = function (value) {
return shortMonthsToNumber[value] || value;
        };

        var parseTime = function (value) {
                var retValue = value;
                var millis = "";
                if (retValue.indexOf(".") !== -1) {
                    var delimited = retValue.split('.');
                    retValue = delimited[0];
                    millis = delimited[1];
                }

                var values3 = retValue.split(":");

                if (values3.length === 3) {
                    hour = values3[0];
                    minute = values3[1];
                    second = values3[2];

                    return {
                        time: retValue,
                        hour: hour,
                        minute: minute,
                        second: second,
                        millis: millis
                    };
                } else {
                    return {
                        time: "",
                        hour: "",
                        minute: "",
                        second: "",
                        millis: ""
                    };
                }
            };

        return {
            date: function (value, format) {
                /*
value = new java.util.Date()
2009-12-18 10:54:50.546
*/
                try {
                    var date = null;
                    var year = null;
                    var month = null;
                    var dayOfMonth = null;
                    var dayOfWeek = null;
                    var time = null;
                    if (typeof value.getFullYear === "function") {
                        year = value.getFullYear();
                        month = value.getMonth() + 1;
                        dayOfMonth = value.getDate();
                        dayOfWeek = value.getDay();
                        time = parseTime(value.toTimeString());
} else if (value.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[-+]?\d{2}:\d{2}/) != -1) { /* 2009-04-19T16:11:05+02:00 */
                        var values = value.split(/[T\+-]/);
                        year = values[0];
                        month = values[1];
                        dayOfMonth = values[2];
                        time = parseTime(values[3].split(".")[0]);
                        date = new Date(year, month - 1, dayOfMonth);
                        dayOfWeek = date.getDay();
                    } else {
                        var values = value.split(" ");
                        switch (values.length) {
                        case 6:
                            /* Wed Jan 13 10:43:41 CET 2010 */
                            year = values[5];
                            month = parseMonth(values[1]);
                            dayOfMonth = values[2];
                            time = parseTime(values[3]);
                            date = new Date(year, month - 1, dayOfMonth);
                            dayOfWeek = date.getDay();
                            break;
                        case 2:
                            /* 2009-12-18 10:54:50.546 */
                            var values2 = values[0].split("-");
                            year = values2[0];
                            month = values2[1];
                            dayOfMonth = values2[2];
                            time = parseTime(values[1]);
                            date = new Date(year, month - 1, dayOfMonth);
                            dayOfWeek = date.getDay();
                            break;
                        case 7:
                            /* Tue Mar 01 2011 12:01:42 GMT-0800 (PST) */
                        case 9:
                            /*added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0800 (China Standard Time) */
                        case 10:
                            /* added by Larry, for Fri Apr 08 2011 00:00:00 GMT+0200 (W. Europe Daylight Time) */
                            year = values[3];
                            month = parseMonth(values[1]);
                            dayOfMonth = values[2];
                            time = parseTime(values[4]);
                            date = new Date(year, month - 1, dayOfMonth);
                            dayOfWeek = date.getDay();
                            break;
                        default:
                            return value;
                        }
                    }

                    var pattern = "";
                    var retValue = "";
                    /*
Issue 1 - variable scope issue in format.date
Thanks jakemonO
*/
                    for (var i = 0; i < format.length; i++) {
                        var currentPattern = format.charAt(i);
                        pattern += currentPattern;
                        switch (pattern) {
                        case "ddd":
                            retValue += strDay(dayOfWeek);
                            pattern = "";
                            break;
                        case "dd":
                            if (format.charAt(i + 1) == "d") {
                                break;
                            }
                            if (String(dayOfMonth).length === 1) {
                                dayOfMonth = '0' + dayOfMonth;
                            }
                            retValue += dayOfMonth;
                            pattern = "";
                            break;
                        case "MMMM":
                            retValue += strLongMonth(month);
                            pattern = "";
                            break;
                        case "MMM":
                            if (format.charAt(i + 1) === "M") {
                                break;
                            }
                            retValue += strMonth(month);
                            pattern = "";
                            break;
                        case "MM":
                            if (format.charAt(i + 1) == "M") {
                                break;
                            }
                            if (String(month).length === 1) {
                                month = '0' + month;
                            }
                            retValue += month;
                            pattern = "";
                            break;
                        case "yyyy":
                            retValue += year;
                            pattern = "";
                            break;
                        case "yy":
                            if (format.charAt(i + 1) == "y" &&
                            format.charAt(i + 2) == "y") {
                             break;
                       }
                            retValue += String(year).slice(-2);
                            pattern = "";
                            break;
                        case "HH":
                            retValue += time.hour;
                            pattern = "";
                            break;
                        case "hh":
                            /* time.hour is "00" as string == is used instead of === */
                            var hour = (time.hour == 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
                            hour = String(hour).length == 1 ? '0'+hour : hour;
                            retValue += hour;
                            pattern = "";
                            break;
                        case "mm":
                            retValue += time.minute;
                            pattern = "";
                            break;
                        case "ss":
                            /* ensure only seconds are added to the return string */
                            retValue += time.second.substring(0, 2);
                            pattern = "";
                            break;
                        case "SSS":
                            retValue += time.millis.substring(0, 3);
                            pattern = "";
                            break;
                        case "a":
                            retValue += time.hour >= 12 ? "PM" : "AM";
                            pattern = "";
                            break;
                        case " ":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        case "/":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        case ":":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        default:
                            if (pattern.length === 2 && pattern.indexOf("y") !== 0 && pattern != "SS") {
                                retValue += pattern.substring(0, 1);
                                pattern = pattern.substring(1, 2);
                            } else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) {
                                pattern = "";
                            }
                        }
                    }
                    return retValue;
                } catch (e) {
                    console.log(e);
                    return value;
                }
            }
        };
    }());
}(jQuery));


$(document).ready(function () {
    $(".shortDateFormat").each(function (idx, elem) {
        if ($(elem).is(":input")) {
            $(elem).val($.format.date($(elem).val(), "dd/MM/yyyy"));
        } else {
            $(elem).text($.format.date($(elem).text(), "dd/MM/yyyy"));
        }
    });
    $(".longDateFormat").each(function (idx, elem) {
        if ($(elem).is(":input")) {
            $(elem).val($.format.date($(elem).val(), "dd/MM/yyyy hh:mm:ss"));
        } else {
            $(elem).text($.format.date($(elem).text(), "dd/MM/yyyy hh:mm:ss"));
        }
    });
});
//Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns are not implemented.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Non uniform scaling does not correctly scale strokes.
// * Optimize. There is always room for speed improvements.

// Only add this code if we do not already have a canvas implementation
if (!document.createElement('canvas').getContext) {

(function() {

  // alias some functions to make (compiled) code shorter
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;
  var abs = m.abs;
  var sqrt = m.sqrt;

  // this is used for sub pixel precision
  var Z = 10;
  var Z2 = Z / 2;

  /**
   * This funtion is assigned to the <canvas> elements as element.getContext().
   * @this {HTMLElement}
   * @return {CanvasRenderingContext2D_}
   */
  function getContext() {
    return this.context_ ||
        (this.context_ = new CanvasRenderingContext2D_(this));
  }

  var slice = Array.prototype.slice;

  /**
   * Binds a function to an object. The returned function will always use the
   * passed in {@code obj} as {@code this}.
   *
   * Example:
   *
   *   g = bind(f, obj, a, b)
   *   g(c, d) // will do f.call(obj, a, b, c, d)
   *
   * @param {Function} f The function to bind the object to
   * @param {Object} obj The object that should act as this when the function
   *     is called
   * @param {*} var_args Rest arguments that will be used as the initial
   *     arguments when the function is called
   * @return {Function} A new function that has bound this
   */
  function bind(f, obj, var_args) {
    var a = slice.call(arguments, 2);
    return function() {
      return f.apply(obj, a.concat(slice.call(arguments)));
    };
  }

  var G_vmlCanvasManager_ = {
    init: function(opt_doc) {
      if (/MSIE/.test(navigator.userAgent) && !window.opera) {
        var doc = opt_doc || document;
        // Create a dummy element so that IE will allow canvas elements to be
        // recognized.
        doc.createElement('canvas');
        doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
      }
    },

    init_: function(doc) {
      // create xmlns
      if (!doc.namespaces['g_vml_']) {
        doc.namespaces.add('g_vml_', 'urn:schemas-microsoft-com:vml',
                           '#default#VML');

      }
      if (!doc.namespaces['g_o_']) {
        doc.namespaces.add('g_o_', 'urn:schemas-microsoft-com:office:office',
                           '#default#VML');
      }

      // Setup default CSS.  Only add one style sheet per document
      if (!doc.styleSheets['ex_canvas_']) {
        var ss = doc.createStyleSheet();
        ss.owningElement.id = 'ex_canvas_';
        ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
            // default size is 300x150 in Gecko and Opera
            'text-align:left;width:300px;height:150px}' +
            'g_vml_\\:*{behavior:url(#default#VML)}' +
            'g_o_\\:*{behavior:url(#default#VML)}';

      }

      // find all canvas elements
      var els = doc.getElementsByTagName('canvas');
      for (var i = 0; i < els.length; i++) {
        this.initElement(els[i]);
      }
    },

    /**
     * Public initializes a canvas element so that it can be used as canvas
     * element from now on. This is called automatically before the page is
     * loaded but if you are creating elements using createElement you need to
     * make sure this is called on the element.
     * @param {HTMLElement} el The canvas element to initialize.
     * @return {HTMLElement} the element that was created.
     */
    initElement: function(el) {
      if (!el.getContext) {

        el.getContext = getContext;

        // Remove fallback content. There is no way to hide text nodes so we
        // just remove all childNodes. We could hide all elements and remove
        // text nodes but who really cares about the fallback content.
        el.innerHTML = '';

        // do not use inline function because that will leak memory
        el.attachEvent('onpropertychange', onPropertyChange);
        el.attachEvent('onresize', onResize);

        var attrs = el.attributes;
        if (attrs.width && attrs.width.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setWidth_(attrs.width.nodeValue);
          el.style.width = attrs.width.nodeValue + 'px';
        } else {
          el.width = el.clientWidth;
        }
        if (attrs.height && attrs.height.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setHeight_(attrs.height.nodeValue);
          el.style.height = attrs.height.nodeValue + 'px';
        } else {
          el.height = el.clientHeight;
        }
        //el.getContext().setCoordsize_()
      }
      return el;
    }
  };

  function onPropertyChange(e) {
    var el = e.srcElement;

    switch (e.propertyName) {
      case 'width':
        el.style.width = el.attributes.width.nodeValue + 'px';
        el.getContext().clearRect();
        break;
      case 'height':
        el.style.height = el.attributes.height.nodeValue + 'px';
        el.getContext().clearRect();
        break;
    }
  }

  function onResize(e) {
    var el = e.srcElement;
    if (el.firstChild) {
      el.firstChild.style.width =  el.clientWidth + 'px';
      el.firstChild.style.height = el.clientHeight + 'px';
    }
  }

  G_vmlCanvasManager_.init();

  // precompute "00" to "FF"
  var dec2hex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  function matrixMultiply(m1, m2) {
    var result = createMatrixIdentity();

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;

        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }

        result[x][y] = sum;
      }
    }
    return result;
  }

  function copyState(o1, o2) {
    o2.fillStyle     = o1.fillStyle;
    o2.lineCap       = o1.lineCap;
    o2.lineJoin      = o1.lineJoin;
    o2.lineWidth     = o1.lineWidth;
    o2.miterLimit    = o1.miterLimit;
    o2.shadowBlur    = o1.shadowBlur;
    o2.shadowColor   = o1.shadowColor;
    o2.shadowOffsetX = o1.shadowOffsetX;
    o2.shadowOffsetY = o1.shadowOffsetY;
    o2.strokeStyle   = o1.strokeStyle;
    o2.globalAlpha   = o1.globalAlpha;
    o2.arcScaleX_    = o1.arcScaleX_;
    o2.arcScaleY_    = o1.arcScaleY_;
    o2.lineScale_    = o1.lineScale_;
  }

  function processStyle(styleString) {
    var str, alpha = 1;

    styleString = String(styleString);
    if (styleString.substring(0, 3) == 'rgb') {
      var start = styleString.indexOf('(', 3);
      var end = styleString.indexOf(')', start + 1);
      var guts = styleString.substring(start + 1, end).split(',');

      str = '#';
      for (var i = 0; i < 3; i++) {
        str += dec2hex[Number(guts[i])];
      }

      if (guts.length == 4 && styleString.substr(3, 1) == 'a') {
        alpha = guts[3];
      }
    } else {
      str = styleString;
    }

    return {color: str, alpha: alpha};
  }

  function processLineCap(lineCap) {
    switch (lineCap) {
      case 'butt':
        return 'flat';
      case 'round':
        return 'round';
      case 'square':
      default:
        return 'square';
    }
  }

  /**
   * This class implements CanvasRenderingContext2D interface as described by
   * the WHATWG.
   * @param {HTMLElement} surfaceElement The element that the 2D context should
   * be associated with
   */
  function CanvasRenderingContext2D_(surfaceElement) {
    this.m_ = createMatrixIdentity();

    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];

    // Canvas context properties
    this.strokeStyle = '#000';
    this.fillStyle = '#000';

    this.lineWidth = 1;
    this.lineJoin = 'miter';
    this.lineCap = 'butt';
    this.miterLimit = Z * 1;
    this.globalAlpha = 1;
    this.canvas = surfaceElement;

    var el = surfaceElement.ownerDocument.createElement('div');
    el.style.width =  surfaceElement.clientWidth + 'px';
    el.style.height = surfaceElement.clientHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.position = 'absolute';
    surfaceElement.appendChild(el);

    this.element_ = el;
    this.arcScaleX_ = 1;
    this.arcScaleY_ = 1;
    this.lineScale_ = 1;
  }

  var contextPrototype = CanvasRenderingContext2D_.prototype;
  contextPrototype.clearRect = function() {
    this.element_.innerHTML = '';
  };

  contextPrototype.beginPath = function() {
    // TODO: Branch current matrix so that save/restore has no effect
    //       as per safari docs.
    this.currentPath_ = [];
  };

  contextPrototype.moveTo = function(aX, aY) {
    var p = this.getCoords_(aX, aY);
    this.currentPath_.push({type: 'moveTo', x: p.x, y: p.y});
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.lineTo = function(aX, aY) {
    var p = this.getCoords_(aX, aY);
    this.currentPath_.push({type: 'lineTo', x: p.x, y: p.y});

    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                            aCP2x, aCP2y,
                                            aX, aY) {
    var p = this.getCoords_(aX, aY);
    var cp1 = this.getCoords_(aCP1x, aCP1y);
    var cp2 = this.getCoords_(aCP2x, aCP2y);
    bezierCurveTo(this, cp1, cp2, p);
  };

  // Helper function that takes the already fixed cordinates.
  function bezierCurveTo(self, cp1, cp2, p) {
    self.currentPath_.push({
      type: 'bezierCurveTo',
      cp1x: cp1.x,
      cp1y: cp1.y,
      cp2x: cp2.x,
      cp2y: cp2.y,
      x: p.x,
      y: p.y
    });
    self.currentX_ = p.x;
    self.currentY_ = p.y;
  }

  contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    // the following is lifted almost directly from
    // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

    var cp = this.getCoords_(aCPx, aCPy);
    var p = this.getCoords_(aX, aY);

    var cp1 = {
      x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
      y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
    };
    var cp2 = {
      x: cp1.x + (p.x - this.currentX_) / 3.0,
      y: cp1.y + (p.y - this.currentY_) / 3.0
    };

    bezierCurveTo(this, cp1, cp2, p);
  };

  contextPrototype.arc = function(aX, aY, aRadius,
                                  aStartAngle, aEndAngle, aClockwise) {
    aRadius *= Z;
    var arcType = aClockwise ? 'at' : 'wa';

    var xStart = aX + mc(aStartAngle) * aRadius - Z2;
    var yStart = aY + ms(aStartAngle) * aRadius - Z2;

    var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
    var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

    // IE won't render arches drawn counter clockwise if xStart == xEnd.
    if (xStart == xEnd && !aClockwise) {
      xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                       // that can be represented in binary
    }

    var p = this.getCoords_(aX, aY);
    var pStart = this.getCoords_(xStart, yStart);
    var pEnd = this.getCoords_(xEnd, yEnd);

    this.currentPath_.push({type: arcType,
                           x: p.x,
                           y: p.y,
                           radius: aRadius,
                           xStart: pStart.x,
                           yStart: pStart.y,
                           xEnd: pEnd.x,
                           yEnd: pEnd.y});

  };

  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
  };

  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.stroke();

    this.currentPath_ = oldPath;
  };

  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.fill();

    this.currentPath_ = oldPath;
  };

  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
    var gradient = new CanvasGradient_('gradient');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    return gradient;
  };

  contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
                                                   aX1, aY1, aR1) {
    var gradient = new CanvasGradient_('gradientradial');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.r0_ = aR0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    gradient.r1_ = aR1;
    return gradient;
  };

  contextPrototype.drawImage = function(image, var_args) {
    var dx, dy, dw, dh, sx, sy, sw, sh;

    // to find the original width we overide the width and height
    var oldRuntimeWidth = image.runtimeStyle.width;
    var oldRuntimeHeight = image.runtimeStyle.height;
    image.runtimeStyle.width = 'auto';
    image.runtimeStyle.height = 'auto';

    // get the original size
    var w = image.width;
    var h = image.height;

    // and remove overides
    image.runtimeStyle.width = oldRuntimeWidth;
    image.runtimeStyle.height = oldRuntimeHeight;

    if (arguments.length == 3) {
      dx = arguments[1];
      dy = arguments[2];
      sx = sy = 0;
      sw = dw = w;
      sh = dh = h;
    } else if (arguments.length == 5) {
      dx = arguments[1];
      dy = arguments[2];
      dw = arguments[3];
      dh = arguments[4];
      sx = sy = 0;
      sw = w;
      sh = h;
    } else if (arguments.length == 9) {
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else {
      throw Error('Invalid number of arguments');
    }

    var d = this.getCoords_(dx, dy);

    var w2 = sw / 2;
    var h2 = sh / 2;

    var vmlStr = [];

    var W = 10;
    var H = 10;

    // For some reason that I've now forgotten, using divs didn't work
    vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

    // If filters are necessary (rotation exists), create them
    // filters are bog-slow, so only create them if abbsolutely necessary
    // The following check doesn't account for skews (which don't exist
    // in the canvas spec (yet) anyway.

    if (this.m_[0][0] != 1 || this.m_[0][1]) {
      var filter = [];

      // Note the 12/21 reversal
      filter.push('M11=', this.m_[0][0], ',',
                  'M12=', this.m_[1][0], ',',
                  'M21=', this.m_[0][1], ',',
                  'M22=', this.m_[1][1], ',',
                  'Dx=', mr(d.x / Z), ',',
                  'Dy=', mr(d.y / Z), '');

      // Bounding box calculation (need to minimize displayed area so that
      // filters don't waste time on unused pixels.
      var max = d;
      var c2 = this.getCoords_(dx + dw, dy);
      var c3 = this.getCoords_(dx, dy + dh);
      var c4 = this.getCoords_(dx + dw, dy + dh);

      max.x = m.max(max.x, c2.x, c3.x, c4.x);
      max.y = m.max(max.y, c2.y, c3.y, c4.y);

      vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
                  'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
                  filter.join(''), ", sizingmethod='clip');")
    } else {
      vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
    }

    vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, 'px;',
                ' height:', Z * dh, 'px;"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

    this.element_.insertAdjacentHTML('BeforeEnd',
                                    vmlStr.join(''));
  };

  contextPrototype.stroke = function(aFill) {
    var lineStr = [];
    var lineOpen = false;
    var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
    var color = a.color;
    var opacity = a.alpha * this.globalAlpha;

    var W = 10;
    var H = 10;

    lineStr.push('<g_vml_:shape',
                 ' filled="', !!aFill, '"',
                 ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
                 ' coordorigin="0 0" coordsize="', Z * W, ' ', Z * H, '"',
                 ' stroked="', !aFill, '"',
                 ' path="');

    var newSeq = false;
    var min = {x: null, y: null};
    var max = {x: null, y: null};

    for (var i = 0; i < this.currentPath_.length; i++) {
      var p = this.currentPath_[i];
      var c;

      switch (p.type) {
        case 'moveTo':
          c = p;
          lineStr.push(' m ', mr(p.x), ',', mr(p.y));
          break;
        case 'lineTo':
          lineStr.push(' l ', mr(p.x), ',', mr(p.y));
          break;
        case 'close':
          lineStr.push(' x ');
          p = null;
          break;
        case 'bezierCurveTo':
          lineStr.push(' c ',
                       mr(p.cp1x), ',', mr(p.cp1y), ',',
                       mr(p.cp2x), ',', mr(p.cp2y), ',',
                       mr(p.x), ',', mr(p.y));
          break;
        case 'at':
        case 'wa':
          lineStr.push(' ', p.type, ' ',
                       mr(p.x - this.arcScaleX_ * p.radius), ',',
                       mr(p.y - this.arcScaleY_ * p.radius), ' ',
                       mr(p.x + this.arcScaleX_ * p.radius), ',',
                       mr(p.y + this.arcScaleY_ * p.radius), ' ',
                       mr(p.xStart), ',', mr(p.yStart), ' ',
                       mr(p.xEnd), ',', mr(p.yEnd));
          break;
      }


      // TODO: Following is broken for curves due to
      //       move to proper paths.

      // Figure out dimensions so we can do gradient fills
      // properly
      if (p) {
        if (min.x == null || p.x < min.x) {
          min.x = p.x;
        }
        if (max.x == null || p.x > max.x) {
          max.x = p.x;
        }
        if (min.y == null || p.y < min.y) {
          min.y = p.y;
        }
        if (max.y == null || p.y > max.y) {
          max.y = p.y;
        }
      }
    }
    lineStr.push(' ">');

    if (!aFill) {
      var lineWidth = this.lineScale_ * this.lineWidth;

      // VML cannot correctly render a line if the width is less than 1px.
      // In that case, we dilute the color to make the line look thinner.
      if (lineWidth < 1) {
        opacity *= lineWidth;
      }

      lineStr.push(
        '<g_vml_:stroke',
        ' opacity="', opacity, '"',
        ' joinstyle="', this.lineJoin, '"',
        ' miterlimit="', this.miterLimit, '"',
        ' endcap="', processLineCap(this.lineCap), '"',
        ' weight="', lineWidth, 'px"',
        ' color="', color, '" />'
      );
    } else if (typeof this.fillStyle == 'object') {
      var fillStyle = this.fillStyle;
      var angle = 0;
      var focus = {x: 0, y: 0};

      // additional offset
      var shift = 0;
      // scale factor for offset
      var expansion = 1;

      if (fillStyle.type_ == 'gradient') {
        var x0 = fillStyle.x0_ / this.arcScaleX_;
        var y0 = fillStyle.y0_ / this.arcScaleY_;
        var x1 = fillStyle.x1_ / this.arcScaleX_;
        var y1 = fillStyle.y1_ / this.arcScaleY_;
        var p0 = this.getCoords_(x0, y0);
        var p1 = this.getCoords_(x1, y1);
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        angle = Math.atan2(dx, dy) * 180 / Math.PI;

        // The angle should be a non-negative number.
        if (angle < 0) {
          angle += 360;
        }

        // Very small angles produce an unexpected result because they are
        // converted to a scientific notation string.
        if (angle < 1e-6) {
          angle = 0;
        }
      } else {
        var p0 = this.getCoords_(fillStyle.x0_, fillStyle.y0_);
        var width  = max.x - min.x;
        var height = max.y - min.y;
        focus = {
          x: (p0.x - min.x) / width,
          y: (p0.y - min.y) / height
        };

        width  /= this.arcScaleX_ * Z;
        height /= this.arcScaleY_ * Z;
        var dimension = m.max(width, height);
        shift = 2 * fillStyle.r0_ / dimension;
        expansion = 2 * fillStyle.r1_ / dimension - shift;
      }

      // We need to sort the color stops in ascending order by offset,
      // otherwise IE won't interpret it correctly.
      var stops = fillStyle.colors_;
      stops.sort(function(cs1, cs2) {
        return cs1.offset - cs2.offset;
      });

      var length = stops.length;
      var color1 = stops[0].color;
      var color2 = stops[length - 1].color;
      var opacity1 = stops[0].alpha * this.globalAlpha;
      var opacity2 = stops[length - 1].alpha * this.globalAlpha;

      var colors = [];
      for (var i = 0; i < length; i++) {
        var stop = stops[i];
        colors.push(stop.offset * expansion + shift + ' ' + stop.color);
      }

      // When colors attribute is used, the meanings of opacity and o:opacity2
      // are reversed.
      lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
                   ' method="none" focus="100%"',
                   ' color="', color1, '"',
                   ' color2="', color2, '"',
                   ' colors="', colors.join(','), '"',
                   ' opacity="', opacity2, '"',
                   ' g_o_:opacity2="', opacity1, '"',
                   ' angle="', angle, '"',
                   ' focusposition="', focus.x, ',', focus.y, '" />');
    } else {
      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
                   '" />');
    }

    lineStr.push('</g_vml_:shape>');

    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
  };

  contextPrototype.fill = function() {
    this.stroke(true);
  }

  contextPrototype.closePath = function() {
    this.currentPath_.push({type: 'close'});
  };

  /**
   * @private
   */
  contextPrototype.getCoords_ = function(aX, aY) {
    var m = this.m_;
    return {
      x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
      y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
    }
  };

  contextPrototype.save = function() {
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  contextPrototype.restore = function() {
    copyState(this.aStack_.pop(), this);
    this.m_ = this.mStack_.pop();
  };

  function matrixIsFinite(m) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 2; k++) {
        if (!isFinite(m[j][k]) || isNaN(m[j][k])) {
          return false;
        }
      }
    }
    return true;
  }

  function setM(ctx, m, updateLineScale) {
    if (!matrixIsFinite(m)) {
      return;
    }
    ctx.m_ = m;

    if (updateLineScale) {
      // Get the line scale.
      // Determinant of this.m_ means how much the area is enlarged by the
      // transformation. So its square root can be used as a scale factor
      // for width.
      var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      ctx.lineScale_ = sqrt(abs(det));
    }
  }

  contextPrototype.translate = function(aX, aY) {
    var m1 = [
      [1,  0,  0],
      [0,  1,  0],
      [aX, aY, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.rotate = function(aRot) {
    var c = mc(aRot);
    var s = ms(aRot);

    var m1 = [
      [c,  s, 0],
      [-s, c, 0],
      [0,  0, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.scale = function(aX, aY) {
    this.arcScaleX_ *= aX;
    this.arcScaleY_ *= aY;
    var m1 = [
      [aX, 0,  0],
      [0,  aY, 0],
      [0,  0,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
    var m1 = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
    var m = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, m, true);
  };

  /******** STUBS ********/
  contextPrototype.clip = function() {
    // TODO: Implement
  };

  contextPrototype.arcTo = function() {
    // TODO: Implement
  };

  contextPrototype.createPattern = function() {
    return new CanvasPattern_;
  };

  // Gradient / Pattern Stubs
  function CanvasGradient_(aType) {
    this.type_ = aType;
    this.x0_ = 0;
    this.y0_ = 0;
    this.r0_ = 0;
    this.x1_ = 0;
    this.y1_ = 0;
    this.r1_ = 0;
    this.colors_ = [];
  }

  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
    aColor = processStyle(aColor);
    this.colors_.push({offset: aOffset,
                       color: aColor.color,
                       alpha: aColor.alpha});
  };

  function CanvasPattern_() {}

  // set up externs
  G_vmlCanvasManager = G_vmlCanvasManager_;
  CanvasRenderingContext2D = CanvasRenderingContext2D_;
  CanvasGradient = CanvasGradient_;
  CanvasPattern = CanvasPattern_;

})();

} // if
/*

***Requires excanvas.js***

jQuery Speedometer v1.1.0 (2011/07/11)
by Jacob King
http://www.jacob-king.com/

Tested on IE 7-9, Firefox 3-5, Chrome 8-11.

Usage: 
	$([selector]).speedometer([options object]);

Options:
	percentage: (float/int, default: 0) 
		Value to display on speedometer and digital readout. Can also be specified as the selector's innerHTML.
	scale: (float/int, default 100)
		The value considered to be 100% on the speedometer.
	limit: (float/int, default true)
		Specifies that the speedometer will "break" if the value is out of bounds.
	minimum: (float/int, default 0)
		The lowest value the needle can go without the glass cracking.
	maximum: (float/int, default 100)
		The highest value the needle can go without the glass cracking.
	animate: (boolean, default: true)
		Specifies that the speedometer needle will animate from current value to intended value.	
	suffix: (string, default ' %')
		A unit to display after the digital readout's value. Set to an empty string for none.

    *** Modifying these properties is not yet tested/documented:
	thisCss: Default settings object for speedometer.
	needleProperties: Default settings for canvas/needle.
	digitalCss: Default settings object for digital readout.
	
*/

(function ($) {

    var canvas_id;

    $.fn.speedometer = function ( options ) {

        /* A tad bit speedier, plus avoids possible confusion with other $(this) references. */
        var $this = $(this);

        if (canvas_id == null) {
            canvas_id = $('canvas').size();
        }


        /* handle multiple selectors */
        if ($this.length > 1) {
            $this.each(function () {
                $(this).speedometer(options);

            });
            return $this;
        }

        var def = {
            /* If percentage not specified, look in selector's innerHTML before defaulting to zero. */
            percentage: $.trim($this.html()) || 0,
            scale: 100,
            limit: true,
            minimum: 0,
            maximum: 100,
            suffix: ' %',
            animate: true,
            digitalRoll: true,
            thisCss: {
                position: 'relative', /* Very important to align needle with gague. */
                width: '150px',
                height: '103px',
                padding: '0px',
                border: '0px',
                fontFamily: 'Arial',
                fontWeight: '900',
                backgroundImage: "url('./img/gaugeNew2.png')"
            },
            needleProperties: {
                fulcrumX: 75,
                fulcrumY: 75,
                strokeStyle: "rgb(255,0,0)"
            },
            digitalCss: {
                backgroundColor: 'black',
                borderColor: '#555555 #999999 #999999 #555555',
                borderStyle: 'solid',
                borderWidth: '2px',
                color: 'white',
                fontSize: '12px',
                height: '15px',
                left: '47px',
                padding: '1px',
                position: 'absolute',
                textAlign: 'center',
                top: '46px',
                width: '50px',
                zIndex: '0',
                lineHeight: '15px',
                overflow: 'hidden'
            },
            threshold: 0
        }



        $this.html('');

        $this.css(def.thisCss);

        $.extend(def, options);

        def.percentage = parseFloat(def.percentage, 10)

        /* digital percentage displayed in middle of image */
        var digitalGauge = $('<div></div>');
        $this.append(digitalGauge);
        digitalGauge.css(def.digitalCss);



        /* not a number */
        if (isNaN(def.percentage)) 
        {
            $this.css('backgroundImage', 'url("./img/gaugeNew2.png")');
            digitalGauge.text("0%");
        } 

        /* out of range */
        else if (def.limit && (def.percentage > def.maximum || def.percentage < def.minimum)) 
        {
            /* the glass cracks */
            $this.css('backgroundImage', 'url("./img/gaugeNew2.png")');
            digitalGauge.text("0%");

        } else {

            var el = document.createElement('canvas');
            el.setAttribute("width", parseInt($this.css("padding-left")) + parseInt($this.css("padding-right")) + $this.width());
            el.setAttribute("height", parseInt($this.css("padding-bottom")) + parseInt($this.css("padding-top")) + $this.height());
            el.setAttribute("id", "jquery-speedometer-" + canvas_id);

            // Fire up excanvas for IE7 & IE8 support.
            if ($.browser.msie && $.browser.version < 9) {
                G_vmlCanvasManager.initElement(el);
            };

            if (def.limit && def.percentage < def.threshold) {
                digitalGauge.css('background', '#c10101 url("./img/bg_td_red.gif") repeat-x 0 0');
            };
            
            var canvas = $(el);
            $this.append(canvas);

            canvas.css({
                zIndex: 1,
                position: "relative"//,
                //left: new_position_left,
                // top: new_position_top
            });

            var ctx = el.getContext("2d"),
		    lingrad,
            thisWidth;

            ctx.lineWidth = 2;
            ctx.strokeStyle = def.needleProperties.strokeStyle;

            /* point of origin for drawing AND canvas rotation (lines up with middle of the black circle on the image) */
            ctx.translate(def.needleProperties.fulcrumX, def.needleProperties.fulcrumY);

            ctx.save(); //remember linewidth, strokestyle, and translate



            function _animate() {

                ctx.restore(); //reset ctx.rotate to properly draw clearRect
                ctx.save(); //remember this default state again

                ctx.clearRect(-105, -105, 300, 300); //erase the canvas

                /* rotate based on percentage. */
                ctx.rotate(i * Math.PI / def.scale);



                /* Draw the needle. This is zero position when ctx.rotate is zero. */
                ctx.beginPath();
                ctx.moveTo(-60, 0);
                ctx.lineTo(10, 0);
                ctx.stroke();

                /* internally remember current needle value */
                $this.data('currentPercentage', i);

                /* update digital gauge */
                if (def.digitalRoll) {
                    digitalGauge.text(i + def.suffix);
                }

                if (i != def.percentage) {

                    //properly handle fractions
                    i += Math.abs(def.percentage - i) < 1
                        ? def.percentage - i
                        : def.increment;

                    setTimeout(function () {
                        _animate()
                    }, 20);
                }


            }

            /* Are we animating or just displaying the percentage? */
            if (def.animate) {
                var i = parseInt($this.data('currentPercentage')) || 0;
                def.increment = (i < def.percentage) ? 1 : -1;
                if (def.digitalRoll) {
                    digitalGauge.text(i + def.suffix);
                }
                else {
                    digitalGauge.text(def.percentage + def.suffix);
                }
            }
            else {
                var i = (def.percentage);
                digitalGauge.text(def.percentage + def.suffix);
            }


            _animate();

        }
        return $this;
    }

})(jQuery)
/**
 * Flight Monitoring (War Room) Javascript library.
 * @author virga
 * @version $Revision: 61 $
 *
 */
 var reloadTimeInMillis = 600000; // refresh time 10 minutes
 var depTimeArray = [];
 var actualDepTimeArray = [];
 
$(document).ready(function(){
      displayTime();
	  loadWarRoomData();
	  
	  
	  document.addEventListener("backbutton", function(e) {
          if ( $.mobile.activePage.is('#plan_wrap')) {
          	e.preventDefault();
          	exitAppPopup();
          } else {
          	navigator.app.backHistory();       
          }
      }, false);
      
});

loadWarRoomData = function() {
   
	 $.ajax({
	  type: "GET",
	  url: "https://flightmonitoring.firebaseio.com/data.json",
	  //url : "flightmonitoring-data.json",
	  dataType: "json",
	  cache: false,
	  success: function(data) {
				
			$('#plan_war_room_result_body').empty();  
		    $('#actual_war_room_result_body').empty();
		    $('#nbrDepart').empty();
		    $('#nbrDelay').empty();
		    
		    depTimeArray = [];
			actualDepTimeArray = [];
		    
			var delay = 0;
			var movement = 0;
			var OTP = 0;
			var tempPax = [];
			var totalCPax = 0;
			var totalYPax = 0;
			var ACVer = 0;
			var PLF = 0;
			var i=0;
			var cancelled = 0;
			
		$.each(data,function( key, val ) {
		   $.each(val, function(k,dt) {
				
		    var seqNumber = dt.SEQ_NO;
		    var flightNumber = dt.FLT_NBR;
		    var depDate = dt.DEP_DATE_SCHED_LOCAL;
		    var depTime = dt.DEP_TIME_SCHED_LOCAL;
		    var depStation = dt.DEP_STN_SCHED;
		    
		    var arrDate = dt.ARR_DATE_SCHED_LOCAL;
		    var arrTime = dt.ARR_TIME_SCHED_LOCAL;
		    var arrStation = dt.ARR_STN_SCHED;
		    
		    var aircraftEx = typeof(dt.EX) != "undefined" ? dt.EX : "";
		    var aircraftType = dt.AC_TYPE;
		    var aircraftReg = dt.AC_REG;
		    var aircraftVer = dt.AC_VER;
		    
		    var actualDepDate = typeof(dt.DEP_DATE_ACT_LOCAL) != "undefined" ? dt.DEP_DATE_ACT_LOCAL : "";
		    var actualDepTime = typeof(dt.DEP_TIME_ACT_LOCAL) != "undefined" ? dt.DEP_TIME_ACT_LOCAL : "";
		    var actualDepStation = typeof(dt.DEP_STN_ACT) != "undefined" ?  dt.DEP_STN_ACT : "";
		    
		    var actualArrDate = typeof(dt.ARR_DATE_ACT_LOCAL) != "undefined" ? dt.ARR_DATE_ACT_LOCAL : "";
		    var actualArrTime = typeof(dt.ARR_TIME_ACT_LOCAL) != "undefined" ? dt.ARR_TIME_ACT_LOCAL : "";
		    var actualArrStation = typeof(dt.ARR_STN_ACT) != "undefined" ? dt.ARR_STN_ACT : "";
		    
		    var delayCode = typeof(dt.CODE_DELAY) != "undefined" ? dt.CODE_DELAY : "";
		    var delayTime = typeof(dt.TIME_DELAY) != "undefined" ? dt.TIME_DELAY : "";
		    var delayRemark = typeof(dt.REMARK) != "undefined" ? dt.REMARK : "";
		 
		    /** Start Adding new Column */
		  
		    var cargoWeight = typeof(dt.CARGO_WEIGHT) != "undefined" ? dt.CARGO_WEIGHT : "";
		    var mailWeight = typeof(dt.MAIL_WEIGHT) != "undefined" ? dt.MAIL_WEIGHT : "";
		    var cPax = typeof(dt.C_PAX) != "undefined" ? dt.C_PAX : "";
		    var yPax = typeof(dt.Y_PAX) != "undefined" ? dt.Y_PAX : "";
		    var bagPieces = typeof(dt.BAG_PIECES) != "undefined" ? dt.BAG_PIECES : "";
		    var bagWeight = typeof(dt.BAG_WEIGHT) != "undefined" ? dt.BAG_WEIGHT : "";
		    var legState =  typeof(dt.LEG_STATE) != "undefined" ? dt.LEG_STATE : "";
		    /** End Adding new Column */
		    
		    /** Calculate Pax - Start*/
		    if((cPax != null) && (cPax != "") && (yPax != null) && (yPax != "")) {
		    	
		    	totalCPax = totalCPax + parseInt(cPax);
			    totalYPax = totalYPax + parseInt(yPax);
			    
			    tempPax = [];
			    tempPax = aircraftVer.split(/[,A-Z]+/);
			    for(i=0;i<tempPax.length;i++) {
				    if(tempPax[i]!="") {
				    	ACVer = ACVer + parseInt(tempPax[i]);
				    }
			    }
		    }
		    if (actualDepDate != null && actualDepDate != "") {
				movement++;
			}
		    /** Calculate Pax - End*/
		    if (legState != null && legState != "" && (legState == 'CNL' || legState == 'CANCEL')) {
		    	cancelled ++;
		    }
		    
		   	$('<tr></tr>').html('<td width=\"6%\">'+seqNumber+'</td><td width=\"8%\">'+flightNumber+'</td><td width=\"12%\">'+depDate+'</td><td width=\"9%\" id=\"depTime_'+ depTime +'\">'+depTime+'</td><td width=\"8%\">'
					+depStation+'</td><td width=\"12%\">'+arrDate+'</td><td width=\"9%\">'+arrTime+'</td><td width=\"8%\">'+arrStation+'</td><td width=\"9%\">'+aircraftEx+'</td><td width=\"8%\">'
					+aircraftType+'</td><td width=\"12%\">'+aircraftReg+'</td>').appendTo('#plan_war_room_result_body');
	    	
	    	/** Delay calculation - Start*/
	    	var time='';
	    	if(delayTime!=null && delayTime!='') {
		    	var hours = Math.floor(parseInt(delayTime)/60);
		    	var minutes = parseInt(delayTime)%60;
		    	if(hours < 10) hours = '0'+hours;
		    	if(minutes < 10) minutes = '0'+minutes;
		    	time = hours + ":" + minutes;
	   		}
	    	/** Delay calculation - End*/
	    	
		    if(parseInt(delayTime)> 15) {	    
		    	delay++;
			    $('<tr></tr>').html('<td width=\"4%\">'+seqNumber+'</td><td width=\"5%\">'+flightNumber+'</td><td width=\"8%\">'+actualDepDate+'</td><td width=\"5%\" id=\"actualDepTime_'+ actualDepTime +'\">'+actualDepTime+
						'</td><td width=\"5%\">'+actualDepStation+'</td>' + '<td width=\"8%\">'+actualArrDate+'</td><td class=\"red\" width=\"5%\">'+actualArrTime+'</td><td width=\"5%\">'
						+actualArrStation+'</td><td class="red" width=\"5%\">'+time+'</td><td class=\"red\" width=\"5%\">' +delayCode+'</td><td class=\"red aleft\" width=\"18%\"><div class="remarks">'+delayRemark+
						'</div></td><td class=\"aright\" width=\"5%\">'+cargoWeight+'</td><td class=\"aright\" width=\"5%\">'+mailWeight+'</td><td class=\"aright\" width=\"4%\">'+cPax+
						'</td><td class=\"aright\" width=\"4%\">'+yPax+'</td><td class=\"aright\" width=\"4%\">'+bagPieces+'</td><td class=\"aright\" width=\"5%\">'+bagWeight+
						'</td>').appendTo('#actual_war_room_result_body');
		    } else {
		    	$('<tr></tr>').html('<td width=\"4%\">'+seqNumber+'</td><td width=\"5%\">'+flightNumber+'</td><td width=\"8%\">'+actualDepDate+'</td><td width=\"5%\" id=\"actualDepTime_'+ actualDepTime +'\">'+actualDepTime+
						'</td><td width=\"5%\">'+actualDepStation+'</td>' + '<td width=\"8%\">'+actualArrDate+'</td><td width=\"5%\">'+actualArrTime+'</td><td width=\"5%\">'+actualArrStation+
						'</td><td width=\"5%\">'+time+'</td><td width=\"5%\">' +delayCode+'</td><td class=\"aleft\" width=\"18%\"><div class="remarks">'+delayRemark+'</div></td><td class=\"aright\" width=\"5%\">'+cargoWeight+
						'</td><td class=\"aright\" width=\"5%\">'+mailWeight+'</td><td class=\"aright\" width=\"4%\">'+cPax+'</td><td class=\"aright\" width=\"4%\">'+yPax+
						'</td><td class=\"aright\" width=\"4%\">'+bagPieces+'</td><td class=\"aright\" width=\"5%\">'+bagWeight+'</td>').appendTo('#actual_war_room_result_body');
		    }
		    var planHrDiff = getHourDiff(depTime);
		    var actualHrDiff = getHourDiff(actualDepTime);
		   
		     if (actualHrDiff  >= -1 && actualHrDiff <= 0 && $.inArray(actualDepTime, actualDepTimeArray) == -1) {
		    		 actualDepTimeArray.push(actualDepTime);
			 }
			 if (planHrDiff >= -1 && planHrDiff <= 0 && $.inArray(depTime, depTimeArray) == -1) {
				 depTimeArray.push(depTime);
			  }	
			 
		   });
	     });
		   movement = movement + cancelled;
		   PLF = ((totalCPax + totalYPax) / ACVer)*100;
		   OTP = ((movement-delay)/movement)*100;
		   if(PLF == null || PLF == "" || isNaN(PLF) || PLF > 100 || PLF < 0){
			   PLF=0;
		   }
		   if(OTP == null || OTP == "" || isNaN(OTP) || OTP > 100 || OTP < 0){
			   OTP=0;
		   }
		   
		   /** OTP & PLF Gauge - Start*/
			$('#plf_gauge').speedometer({ percentage: PLF.toFixed(2) || 0, threshold : 75.53 });
			$('#otp_gauge').speedometer({ percentage: OTP.toFixed(2) || 0, threshold : 85});
			/** OTP & PLF Gauge - End*/
			$('#nbrDepart').html(movement);
			$('#nbrDelay').html(delay);
			
		
	  },
	  beforeSend: function(xhr){
		  if (xhr.overrideMimeType)
		    {
		      xhr.overrideMimeType("application/json");
		    }
		    
	      //$('#war_room_msg_load').append("<div class=\"wing\"><div class=\"logo\"><span class=\"credits\">Loading data...</span></div></div>");	      
	      
	      $('#container_top').fadeOut('slow');
	      $.mobile.loading('show');
	      
	  },
	  complete : function() {
		    $('#container_top').show("slow");
		    $('#loading_pad').empty();
		    $('#loading_pad').hide();
		    $('#war_room_msg_load').empty();		  
		    $('#war_room_msg_load').hide();   
		    $('#plan_wrap_table').scrollTo(0);
		    $('#actual_wrap_table').scrollTo(0);
		    // Reset the screen to (0,0)
		    $.scrollTo(0); 
		    depTimeArray.sort();
		    actualDepTimeArray.sort();
		    if(depTimeArray.length > 0) {    	
		       $('#plan_wrap_table').scrollTo( $('#depTime_' + depTimeArray[0]), { duration:1000, axis:'y'});
		    }
		    if( actualDepTimeArray.length > 0 ) {
		    	$('#actual_wrap_table').scrollTo($('#actualDepTime_' + actualDepTimeArray[0]), { duration:1000, axis:'y'});
		    }
		    $(".credits").append("&copy; 2011 Garuda Indonesia. Powered by <span class=\"asyst\"></span>");
		    $.mobile.loading('hide');
		    
	  }
	 });
	
};
	
setInterval('loadWarRoomData()', reloadTimeInMillis);

displayTime = function() {
	var display = "<div class=\"time_right\">Local Time " + $.format.date(new Date(), "MM-dd-yyyy")
	           +" " +  $.format.date(new Date(), "HH:mm:ss")
	           + " - UTC " + $.format.date(localDateToUTC(new Date()), "MM-dd-yyyy")
	           +" " +  $.format.date(localDateToUTC(new Date()), "HH:mm:ss")+"</div>";
	
	$(".top_pane").html(display);
	setTimeout("displayTime()", 0);
};

localDateToUTC = function(localDate) {	
	return new Date(localDate.getUTCFullYear(), localDate.getUTCMonth(), 
			localDate.getUTCDate(), localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds());
};

getHourDiff = function(hourMinuteOrigin) {
	  var originDate = new Date();
	  var today = new Date();
	  originDate.setHours(parseInt(hourMinuteOrigin.substring(0, 2)), parseInt(hourMinuteOrigin.substring(2, 4)), 0, 0);
	 
	  return timeDifference(today, originDate, 'h');
};
timeDifference = function(laterdate,earlierdate, diffType) {
  var difference = laterdate.getTime() - earlierdate.getTime();

  var daysDifference = Math.floor(difference/1000/60/60/24);
  difference -= daysDifference*1000*60*60*24

  var hoursDifference = Math.floor(difference/1000/60/60);
  difference -= hoursDifference*1000*60*60

  var minutesDifference = Math.floor(difference/1000/60);
  difference -= minutesDifference*1000*60

  var secondsDifference = Math.floor(difference/1000);
  
  if (typeof(diffType) == 'undefined') {
  	return daysDifference;
  }
  
  if (diffType == 'd') {
  	return daysDifference;
  }
  else if (diffType == 'h' || diffType == 'H') {
  	return hoursDifference;
  }
  else if (diffType == 'm') {
  	return minutesDifference;
  }
  else if (diffType == 's') {
  	return secondsDifference;
  }
};

// jquery mobile swipe page

$('div.ui-page').live("swipeleft", function(){
	var nextpage = $(this).next('div[data-role="page"]');
	if (nextpage.length > 0) {
		$.mobile.changePage(nextpage, "slide", false, true);
	}
});
$('div.ui-page').live("swiperight", function(){
	var prevpage = $(this).prev('div[data-role="page"]');
	if (prevpage.length > 0) {
		$.mobile.changePage(prevpage, {transition: "slide",
			reverse: true}, true, true);
	}
});

exitAppPopup = function() {
	navigator.notification.confirm(
	          'Exit Flight Monitor ?'
	        , function(button) {
	              if (button == 2) {
	                  navigator.app.exitApp();
	              }
	          }
	        , 'Exit'
	        , 'No,Yes'
	    );  
	    return false;
};
