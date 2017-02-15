/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = {
  mainColor1: "#fdf4eb",
  mainColor2: "#fff",
  mainColor3: "#ffffcd"
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_swiper__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_swiper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_swiper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__swiper_background_animate__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__colors__ = __webpack_require__(0);

__webpack_require__(8);
__webpack_require__(9);


__webpack_require__(4);

let swiper = new __WEBPACK_IMPORTED_MODULE_0_swiper___default.a('.swiper-container', {
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  // scrollbar: '.swiper-scrollbar',
  onInit(swiper) {
    document.body.style.backgroundColor = __WEBPACK_IMPORTED_MODULE_2__colors__["a" /* default */]["mainColor" + swiper.slides[0].dataset.background];
  },
  onSlideChangeStart(swiper) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__swiper_background_animate__["a" /* default */])(swiper);
  }
});
function toggleForm(e) {
  e.preventDefault();
  document.getElementById('apply').classList.toggle('show');
  document.getElementsByClassName('swiper-container')[0].classList.toggle('hide');
}
document.getElementById('show-form').addEventListener('click', toggleForm);
document.getElementsByClassName('btn-close')[0].addEventListener('click', toggleForm);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function validate(e) {
  e.preventDefault();

  let form = e.srcElement;
  let flag = false; // 只有此处 flag = true 代表有验证不通过
  Array.prototype.forEach.call(document.querySelectorAll('input[type=text]'), function (el) {
    let fakeEvent = {
      srcElement: el
    };
    if (!validateNull(fakeEvent)) {
      flag = true;
    }
  });

  if (!validateFun(document.getElementById('newbie_name'), function (el) {
    return el.value.replace(/^\s+|\s+$/g, "").length < 20;
  }, "你名字太长啦！")) {
    flag = true;
  }
  if (!validateFun(document.getElementById('newbie_phone'), function (el) {
    return el.value.replace(/^\s+|\s+$/g, "").match(/1[0-9]{10}/);
  }, "手机号数错了吧~")) {
    flag = true;
  }
  if (!validateFun(document.getElementById('newbie_qq'), function (el) {
    return el.value.replace(/^\s+|\s+$/g, "").match(/[1-9][0-9]{5,13}/);
  }, "你的QQ很神奇")) {
    flag = true;
  }
  if (!validateFun(document.getElementById('newbie_bio'), function (el) {
    return el.value.replace(/^\s+|\s+$/g, "").length < 500;
  }, "个人简介太长，又不是写论文~")) {
    flag = ture;
  }

  if (!validateChecked(document.querySelectorAll("[name='newbie[sex]']"))) {
    flag = true;
  }
  if (!validateChecked(document.querySelectorAll("[name='newbie[group]']"))) {
    flag = true;
  }
  if (!flag) {
    let XHR = new XMLHttpRequest();
    let FD = new FormData();

    for (let i = 0, input, value; i < form.elements.length; i++) {
      input = form.elements[i];
      if (input.name && input.value) {
        value = input.type == "checkbox" || input.type == "radio" ? input.checked ? input.value : '' : input.value;
        if (value) FD.append(input.name, value.replace(/^\s+|\s+$/g, ""));
      }
    }

    XHR.onreadystatechange = function () {
      if (XHR.readyState === XMLHttpRequest.DONE) {
        if (XHR.status == 200) {
          alert("报名成功！");
        } else {
          console.log(XHR);
          alert("报名失败！" + XHR.responseText);
        }
        document.getElementById('loading').classList.add('hide');
      }
    };
    document.getElementById('loading').classList.remove('hide');
    XHR.open('POST', form.action);
    XHR.send(FD);
  }
}

function isNotNull(el) {
  return el.value.replace(/^\s+|\s+$/g, "") != "";
}

function toggleWarn(el, flag, msg) {
  if (!flag) {
    el.parentElement.getElementsByClassName('error')[0].innerText = msg;
    el.parentElement.classList.add('warn');
  } else {
    // el.parentElement.getElementsByClassName('error')[0].innerText = "";
    el.parentElement.classList.remove('warn');
  }
  return flag;
}

function validateNull(e) {
  let el = e.srcElement;
  return toggleWarn(el, isNotNull(el), "别忘了填哦~");
}

function validateFun(el, fun, msg) {
  return toggleWarn(el, fun(el), msg);
}

function validateChecked(arr) {
  let flag = false;
  arr.forEach(function (el) {
    if (el.checked) {
      flag = true;
    }
  });
  return toggleWarn(arr[0], flag, "别闹，乖乖选一个");
}

Array.prototype.forEach.call(document.querySelectorAll('input[type=text]'), function (el) {
  el.addEventListener('blur', validateNull);
});

document.getElementsByTagName('form')[0].addEventListener('submit', validate);
Array.prototype.forEach.call(document.querySelectorAll("[type=radio]"), function (el) {
  el.addEventListener('click', function (e) {
    toggleWarn(e.srcElement, true, "");
  });
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = function (swiper) {
  let actIndex = swiper.activeIndex;
  let slides = swiper.slides;
  if (slides[actIndex].classList.contains('animate-middleware')) {
    swiper.lockSwipes();
    let prevIndex = swiper.previousIndex;
    let direction = actIndex - prevIndex;

    function transitionEndCallBack() {
      swiper.unlockSwipes();
      swiper["slide" + (direction > 0 ? "Next" : "Prev")]();
    }
    setTimeout(transitionEndCallBack, 320);

    document.body.style.backgroundColor = __WEBPACK_IMPORTED_MODULE_0__colors__["a" /* default */]["mainColor" + slides[actIndex + direction].dataset.background];
  }
};;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n * Swiper 3.4.1\n * Most modern mobile touch slider and framework with hardware accelerated transitions\n * \n * http://www.idangero.us/swiper/\n * \n * Copyright 2016, Vladimir Kharlampidi\n * The iDangero.us\n * http://www.idangero.us/\n * \n * Licensed under MIT\n * \n * Released on: December 13, 2016\n */\n.swiper-container{margin-left:auto;margin-right:auto;position:relative;overflow:hidden;z-index:1}.swiper-container-no-flexbox .swiper-slide{float:left}.swiper-container-vertical>.swiper-wrapper{-webkit-box-orient:vertical;-moz-box-orient:vertical;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-transition-property:-webkit-transform;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);-o-transform:translate(0,0);-ms-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.swiper-container-multirow>.swiper-wrapper{-webkit-box-lines:multiple;-moz-box-lines:multiple;-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;flex-wrap:wrap}.swiper-container-free-mode>.swiper-wrapper{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out;margin:0 auto}.swiper-slide{-webkit-flex-shrink:0;-ms-flex:0 0 auto;flex-shrink:0;width:100%;height:100%;position:relative}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;align-items:flex-start;-webkit-transition-property:-webkit-transform,height;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform,height}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-wp8-horizontal{-ms-touch-action:pan-y;touch-action:pan-y}.swiper-wp8-vertical{-ms-touch-action:pan-x;touch-action:pan-x}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:27px;height:44px;margin-top:-22px;z-index:10;cursor:pointer;-moz-background-size:27px 44px;-webkit-background-size:27px 44px;background-size:27px 44px;background-position:center;background-repeat:no-repeat}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");left:10px;right:auto}.swiper-button-prev.swiper-button-black,.swiper-container-rtl .swiper-button-next.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-prev.swiper-button-white,.swiper-container-rtl .swiper-button-next.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");right:10px;left:auto}.swiper-button-next.swiper-button-black,.swiper-container-rtl .swiper-button-prev.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\")}.swiper-button-next.swiper-button-white,.swiper-container-rtl .swiper-button-prev.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\")}.swiper-pagination{position:absolute;text-align:center;-webkit-transition:.3s;-moz-transition:.3s;-o-transition:.3s;transition:.3s;-webkit-transform:translate3d(0,0,0);-ms-transform:translate3d(0,0,0);-o-transform:translate3d(0,0,0);transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-moz-appearance:none;-ms-appearance:none;-webkit-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-white .swiper-pagination-bullet{background:#fff}.swiper-pagination-bullet-active{opacity:1;background:#007aff}.swiper-pagination-white .swiper-pagination-bullet-active{background:#fff}.swiper-pagination-black .swiper-pagination-bullet-active{background:#000}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;-webkit-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-o-transform:translate(0,-50%);-ms-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:5px 0;display:block}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 5px}.swiper-pagination-progress{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progress .swiper-pagination-progressbar{background:#007aff;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);transform:scale(0);-webkit-transform-origin:left top;-moz-transform-origin:left top;-ms-transform-origin:left top;-o-transform-origin:left top;transform-origin:left top}.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar{-webkit-transform-origin:right top;-moz-transform-origin:right top;-ms-transform-origin:right top;-o-transform-origin:right top;transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progress{width:100%;height:4px;left:0;top:0}.swiper-container-vertical>.swiper-pagination-progress{width:4px;height:100%;left:0;top:0}.swiper-pagination-progress.swiper-pagination-white{background:rgba(255,255,255,.5)}.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar{background:#fff}.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar{background:#000}.swiper-container-3d{-webkit-perspective:1200px;-moz-perspective:1200px;-o-perspective:1200px;perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(right,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-right{background-image:-webkit-gradient(linear,right top,left top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(left,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-top{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(bottom,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(0,0,0,.5)),to(rgba(0,0,0,0)));background-image:-webkit-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-moz-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:-o-linear-gradient(top,rgba(0,0,0,.5),rgba(0,0,0,0));background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-container-coverflow .swiper-wrapper,.swiper-container-flip .swiper-wrapper{-ms-perspective:1200px}.swiper-container-cube,.swiper-container-flip{overflow:visible}.swiper-container-cube .swiper-slide,.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-cube .swiper-slide .swiper-slide,.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active,.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top,.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-slide{visibility:hidden;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube.swiper-container-rtl .swiper-slide{-webkit-transform-origin:100% 0;-moz-transform-origin:100% 0;-ms-transform-origin:100% 0;transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-fade.swiper-container-free-mode .swiper-slide{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-zoom-container{width:100%;height:100%;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-pack:center;-moz-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-moz-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;text-align:center}.swiper-zoom-container>canvas,.swiper-zoom-container>img,.swiper-zoom-container>svg{max-width:100%;max-height:100%;object-fit:contain}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-moz-transform-origin:50%;transform-origin:50%;-webkit-animation:swiper-preloader-spin 1s steps(12,end) infinite;-moz-animation:swiper-preloader-spin 1s steps(12,end) infinite;animation:swiper-preloader-spin 1s steps(12,end) infinite}.swiper-lazy-preloader:after{display:block;content:\"\";width:100%;height:100%;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");background-position:50%;-webkit-background-size:100%;background-size:100%;background-repeat:no-repeat}.swiper-lazy-preloader-white:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\")}@-webkit-keyframes swiper-preloader-spin{100%{-webkit-transform:rotate(360deg)}}@keyframes swiper-preloader-spin{100%{transform:rotate(360deg)}}", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".ani {\n  -webkit-transition: opacity .5s, -webkit-transform .5s;\n  transition: opacity .5s, -webkit-transform .5s;\n  transition: transform .5s, opacity .5s;\n  transition: transform .5s, opacity .5s, -webkit-transform .5s;\n}\n\n.swiper-slide .ani-float-up {\n  -webkit-transform: translateY(3.125rem);\n  transform: translateY(3.125rem);\n  opacity: 0;\n}\n\n.swiper-slide .ani-float-down {\n  -webkit-transform: translateY(-3.125rem);\n  transform: translateY(-3.125rem);\n  opacity: 0;\n}\n\n.swiper-slide .ani-fade-in {\n  opacity: 0;\n}\n\n.swiper-slide-active .ani-float-up {\n  -webkit-transform: translateY(0);\n  transform: translateY(0);\n  opacity: 1;\n}\n\n.swiper-slide-active .ani-float-down {\n  -webkit-transform: translateY(0);\n  transform: translateY(0);\n  opacity: 1;\n}\n\n.swiper-slide-active .ani-fade-in {\n  opacity: 1;\n}\n\n@-webkit-keyframes float {\n  0% {\n    -webkit-transform: translateY(0.15625rem);\n    transform: translateY(0.15625rem);\n  }\n\n  50% {\n    -webkit-transform: translateY(-0.15625rem);\n    transform: translateY(-0.15625rem);\n  }\n\n  100% {\n    -webkit-transform: translateY(0.15625rem);\n    transform: translateY(0.15625rem);\n  }\n}\n\n@keyframes float {\n  0% {\n    -webkit-transform: translateY(0.15625rem);\n    transform: translateY(0.15625rem);\n  }\n\n  50% {\n    -webkit-transform: translateY(-0.15625rem);\n    transform: translateY(-0.15625rem);\n  }\n\n  100% {\n    -webkit-transform: translateY(0.15625rem);\n    transform: translateY(0.15625rem);\n  }\n}\n\n.ani-loop-float {\n  -webkit-animation: float 5s infinite;\n  animation: float 5s infinite;\n}\n\n@-webkit-keyframes swing {\n  0% {\n    -webkit-transform: rotate(1deg);\n    transform: rotate(1deg);\n  }\n\n  50% {\n    -webkit-transform: rotate(-1deg);\n    transform: rotate(-1deg);\n  }\n\n  100% {\n    -webkit-transform: rotate(1deg);\n    transform: rotate(1deg);\n  }\n}\n\n@keyframes swing {\n  0% {\n    -webkit-transform: rotate(1deg);\n    transform: rotate(1deg);\n  }\n\n  50% {\n    -webkit-transform: rotate(-1deg);\n    transform: rotate(-1deg);\n  }\n\n  100% {\n    -webkit-transform: rotate(1deg);\n    transform: rotate(1deg);\n  }\n}\n\n.ani-loop-swing {\n  -webkit-animation: swing 5s infinite;\n  animation: swing 5s infinite;\n}\n\n.ani-delay-1 {\n  -webkit-transition-delay: 0.1s;\n  transition-delay: 0.1s;\n  -webkit-animation-delay: 0.1s;\n  animation-delay: 0.1s;\n}\n\n.ani-delay-2 {\n  -webkit-transition-delay: 0.2s;\n  transition-delay: 0.2s;\n  -webkit-animation-delay: 0.2s;\n  animation-delay: 0.2s;\n}\n\n.ani-delay-3 {\n  -webkit-transition-delay: 0.3s;\n  transition-delay: 0.3s;\n  -webkit-animation-delay: 0.3s;\n  animation-delay: 0.3s;\n}\n\nbody.slim .swiper-slide:nth-child(1) h1 .time {\n  margin: 0.3125rem 0 0.3125rem;\n}\n\nbody.slim .swiper-slide:nth-child(1) .title {\n  padding-top: 0.625rem;\n}\n\nbody.slim .swiper-slide:nth-child(1) .stain {\n  top: 6.5625rem;\n}\n\nbody.slim .swiper-slide:nth-child(3) .fe {\n  top: 0.3125rem;\n}\n\nbody.slim .swiper-slide:nth-child(3) .ui {\n  top: -0.3125rem;\n}\n\nbody.slim .swiper-slide:nth-child(3) .be {\n  top: 7.5rem;\n}\n\nbody.slim p.ellipsis::before {\n  line-height: 1;\n  margin-top: -0.3125rem;\n  margin-bottom: 0.3125rem;\n  font-size: 1rem;\n}\n\nbody.slim .group-desc h3 {\n  margin-top: 0.5625rem;\n  font-size: 0.6875rem;\n  line-height: 1.6;\n}\n\nbody.slim .group-desc p {\n  line-height: 2;\n}\n\nbody.slim .swiper-slide:nth-child(11) {\n  padding-top: 0.3125rem;\n}\n\nbody.slim .swiper-slide:nth-child(11) h2 {\n  font-size: 1rem;\n  padding: 5.625rem 0 0.9375rem;\n}\n\nbody.slim .swiper-slide:nth-child(11) ul {\n  margin-top: 0.46875rem;\n}\n\nbody.slim .swiper-slide:nth-child(11) ul li {\n  font-size: 0.625rem;\n  line-height: 1.8;\n}\n\nbody.slim .product-desc h3 {\n  margin: 0.5625rem 0;\n  line-height: 1.8;\n}\n\nbody.slim .product-desc p {\n  line-height: 2;\n}\n\n* {\n  border: 0;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nul {\n  list-style: none;\n}\n\na,\na:visited,\na:focus {\n  text-decoration: none;\n  color: inherit;\n}\n\n#apply {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 4;\n  color: #DCE6E6;\n  pointer-events: none;\n}\n\n#apply form {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  z-index: 5;\n}\n\n#apply form .field-group {\n  background-color: #2D3535;\n  height: 88%;\n  padding-top: 0.9375rem;\n  -webkit-transform: translateY(-100%);\n  transform: translateY(-100%);\n  -webkit-transition: -webkit-transform .5s;\n  transition: -webkit-transform .5s;\n  transition: transform .5s;\n  transition: transform .5s, -webkit-transform .5s;\n  overflow-y: auto;\n}\n\n#apply form .field-group .input-group {\n  position: relative;\n  width: 0;\n  margin: 0 0 0.625rem 10%;\n  border-bottom: 0.125rem solid rgba(255, 255, 255, .4);\n  white-space: nowrap;\n  opacity: 0;\n  -webkit-transition: all .5s;\n  transition: all .5s;\n  -webkit-transition-delay: .5s;\n  transition-delay: .5s;\n}\n\n#apply form .field-group .input-group.no-underline {\n  border-bottom: none;\n}\n\n#apply form .field-group .input-group.no-underline input:checked + label {\n  color: #DCE6E6;\n}\n\n#apply form .field-group .input-group.no-underline label {\n  margin-right: 0.78125rem;\n}\n\n#apply form .field-group .input-group .error {\n  display: block;\n  position: absolute;\n  bottom: -0.6875rem;\n  font-size: 0.4375rem;\n  font-weight: bold;\n  line-height: 1.5;\n  color: #b53030;\n  opacity: 0;\n  -webkit-transition: opacity .5s .5s;\n  transition: opacity .5s .5s;\n}\n\n#apply form .field-group .input-group.warn {\n  background-color: rgba(141, 0, 10, .5);\n}\n\n#apply form .field-group .input-group.warn .error {\n  opacity: 1;\n}\n\n#apply form .field-group input {\n  color: inherit;\n  background-color: transparent;\n  outline: none;\n  font-size: 0.6875rem;\n  letter-spacing: 0.0625rem;\n}\n\n#apply form .field-group input[type='text'] {\n  width: 100%;\n  -webkit-transition: background .5s;\n  transition: background .5s;\n}\n\n#apply form .field-group input[type='text']:focus {\n  background-color: rgba(255, 255, 255, .1);\n}\n\n#apply form .field-group label {\n  font-size: 0.6875rem;\n  color: rgba(255, 255, 255, .5);\n}\n\n#apply.show {\n  pointer-events: auto;\n}\n\n#apply.show #mask {\n  opacity: 1;\n}\n\n#apply.show #submit {\n  -webkit-transform: translateY(0);\n  transform: translateY(0);\n}\n\n#apply.show .field-group {\n  -webkit-transform: translateY(0);\n  transform: translateY(0);\n}\n\n#apply.show .field-group .input-group {\n  opacity: 1;\n  width: 80%;\n}\n\n#apply.show .btn-close {\n  opacity: 1;\n}\n\n#submit {\n  width: 100%;\n  height: 12%;\n  font-size: 0.6875rem;\n  line-height: 3;\n  color: #fff;\n  letter-spacing: 0.15625rem;\n  background-color: #22D2D2;\n  -webkit-transform: translateY(100%);\n  transform: translateY(100%);\n  -webkit-transition: -webkit-transform .5s;\n  transition: -webkit-transform .5s;\n  transition: transform .5s;\n  transition: transform .5s, -webkit-transform .5s;\n}\n\n#mask {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #000;\n  opacity: 0;\n  -webkit-transition: opacity .8s;\n  transition: opacity .8s;\n}\n\n.btn-close {\n  position: absolute;\n  top: 0.0625rem;\n  right: 0.0625rem;\n  width: 3em;\n  height: 3em;\n  cursor: pointer;\n  z-index: 6;\n  opacity: 0;\n  -webkit-transition: opacity 1s, -webkit-transform 1s;\n  transition: opacity 1s, -webkit-transform 1s;\n  transition: transform 1s, opacity 1s;\n  transition: transform 1s, opacity 1s, -webkit-transform 1s;\n}\n\n.btn-close:hover {\n  -webkit-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n\n.btn-close .x-top,\n.btn-close .x-bottom {\n  height: 50%;\n  width: 50%;\n  margin-left: 50%;\n  border: 0.0625rem solid rgba(0, 0, 0, .4);\n}\n\n.btn-close .x-top {\n  -webkit-transform-origin: left bottom;\n  transform-origin: left bottom;\n  -webkit-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n  border-color: transparent transparent currentColor currentColor;\n}\n\n.btn-close .x-bottom {\n  margin-top: -0.09375rem;\n  -webkit-transform-origin: left top;\n  transform-origin: left top;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n  border-color: currentColor transparent transparent currentColor;\n}\n\n@media all and (min-width: 1024px) {\n  div.swiper-slide:nth-child(3) img.fe,\n  div.swiper-slide:nth-child(3) img.be,\n  div.swiper-slide:nth-child(3) img.ui {\n    position: relative;\n    width: 5.9375rem;\n    top: 0;\n    left: 0;\n  }\n\n  body p.ellipsis::before {\n    line-height: 1;\n    margin-top: -0.3125rem;\n    margin-bottom: 0.3125rem;\n    font-size: 1rem;\n  }\n\n  body .group-desc {\n    overflow-x: hidden;\n    padding: 10% 0 0 50%;\n  }\n\n  body .group-desc img {\n    position: absolute;\n    left: -70%;\n    top: 0;\n    width: 120%;\n    height: 100%;\n  }\n\n  body .group-desc h3 {\n    margin-top: 0.5625rem;\n    font-size: 0.6875rem;\n    line-height: 1.6;\n  }\n\n  body .group-desc p {\n    line-height: 2;\n  }\n\n  body .swiper-slide:nth-child(11) {\n    padding-top: 0.3125rem;\n  }\n\n  body .swiper-slide:nth-child(11) h2 {\n    font-size: 1rem;\n    padding: 5.625rem 0 0.9375rem;\n  }\n\n  body .swiper-slide:nth-child(11) ul {\n    margin-top: 0.46875rem;\n  }\n\n  body .swiper-slide:nth-child(11) ul li {\n    font-size: 0.625rem;\n    line-height: 1.8;\n  }\n\n  body .product-desc {\n    overflow-x: hidden;\n    color: #ffffff;\n  }\n\n  body .product-desc::before {\n    content: \"\";\n    display: block;\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    z-index: 1;\n    background-color: rgba(0, 0, 0, .5);\n  }\n\n  body .product-desc img {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"filter\"><feGaussianBlur stdDeviation=\"4\" /></filter></svg>#filter');\n    -webkit-filter: blur(0.125rem);\n    filter: blur(0.125rem);\n    z-index: 0;\n  }\n\n  body .product-desc h3 {\n    position: relative;\n    z-index: 3;\n    margin: 1.25rem 0 0.9375rem;\n  }\n\n  body .product-desc p {\n    position: relative;\n    z-index: 3;\n  }\n\n  body .btn {\n    left: 6.25rem;\n    right: 6.25rem;\n    bottom: 0.9375rem;\n  }\n}\n\nh1,\nh2,\nh3,\np {\n  text-shadow: 0 0.03125rem 0.3125rem rgba(0, 0, 0, .18);\n}\n\nbody {\n  color: #333;\n  -webkit-transition: background .25s linear;\n  transition: background .25s linear;\n  font-family: Helvetica, 'Mirosoft Yahei', Arial, sans-serif;\n  -webkit-perspective: 12.5rem;\n  perspective: 12.5rem;\n}\n\nbody.color-1 {\n  background-color: #fdf4eb;\n}\n\nbody.color-2 {\n  background-color: #fff;\n}\n\nbody.color-3 {\n  background-color: #ffffcd;\n}\n\n.swiper-container {\n  width: 100%;\n  height: 100vh;\n  text-align: center;\n  -webkit-transition: -webkit-transform .5s;\n  transition: -webkit-transform .5s;\n  transition: transform .5s;\n  transition: transform .5s, -webkit-transform .5s;\n}\n\n.swiper-container.hide {\n  -webkit-transform: translateZ(-6.25rem);\n  transform: translateZ(-6.25rem);\n}\n\n.swiper-slide:nth-child(1) {\n  background: url(" + __webpack_require__(12) + ") center bottom no-repeat;\n  background-size: contain;\n}\n\n.swiper-slide:nth-child(1) h1 {\n  position: relative;\n  display: inline-block;\n  z-index: 1;\n}\n\n.swiper-slide:nth-child(1) h1 .headline {\n  display: inline-block;\n  background-size: contain;\n  height: 1.5625rem;\n}\n\n.swiper-slide:nth-child(1) h1 .time {\n  display: inline-block;\n  margin: 0.9375rem 0 0.9375rem;\n  height: 0.625rem;\n  background-size: contain;\n}\n\n.swiper-slide:nth-child(1) .title {\n  position: relative;\n  display: inline-block;\n  width: 9rem;\n  padding-top: 1.875rem;\n  z-index: 1;\n}\n\n.swiper-slide:nth-child(1) .stain {\n  position: absolute;\n  display: block;\n  top: 9.6875rem;\n  width: 100%;\n  z-index: 0;\n}\n\n.swiper-slide:nth-child(3) img {\n  position: absolute;\n  width: 5.9375rem;\n}\n\n.swiper-slide:nth-child(3) .fe {\n  top: 1.25rem;\n  left: 0;\n}\n\n.swiper-slide:nth-child(3) .ui {\n  top: 1.25rem;\n  left: 4.0625rem;\n}\n\n.swiper-slide:nth-child(3) .be {\n  top: 9.375rem;\n  left: 1.25rem;\n}\n\np.ellipsis::before {\n  content: \"...\";\n  display: block;\n  text-align: center;\n  font-size: 1.125rem;\n  line-height: 1.2;\n  margin-bottom: 0.625rem;\n  font-family: sans-serif;\n}\n\n.group-desc img {\n  width: 10rem;\n  height: 5.3125rem;\n  box-shadow: 0 0 1.25rem -0.3125rem rgba(0, 0, 0, .8);\n}\n\n.group-desc h3 {\n  margin-top: 0.75rem;\n  font-size: 0.75rem;\n  line-height: 2;\n}\n\n.group-desc p {\n  font-size: 0.5rem;\n  line-height: 2.4;\n  letter-spacing: 0.023438rem;\n}\n\n.group-desc p span {\n  margin-left: 0.3125rem;\n}\n\n.group-desc p span:first-of-type {\n  margin-left: 0;\n}\n\n.product-desc img {\n  width: 10rem;\n  height: 5.3125rem;\n  box-shadow: 0 0 1.25rem -0.3125rem rgba(0, 0, 0, .8);\n}\n\n.product-desc h3 {\n  margin: 0.9375rem 0;\n  font-size: 0.75rem;\n  line-height: 2;\n}\n\n.product-desc p {\n  font-size: 0.5rem;\n  line-height: 2.4;\n  letter-spacing: 0.023438rem;\n}\n\n.swiper-slide:nth-child(11) {\n  padding-top: 0.625rem;\n}\n\n.swiper-slide:nth-child(11) h2 {\n  font-size: 1.125rem;\n  padding: 6.25rem 0 0.9375rem;\n  background: url(" + __webpack_require__(13) + ") center no-repeat;\n  background-size: contain;\n}\n\n.swiper-slide:nth-child(11) ul {\n  margin-top: 0.9375rem;\n}\n\n.swiper-slide:nth-child(11) ul li {\n  font-size: 0.75rem;\n  line-height: 2;\n}\n\n.swiper-slide:last-child {\n  position: relative;\n}\n\n.swiper-slide:last-child div {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  background: url(" + __webpack_require__(11) + ") left bottom no-repeat;\n  background-size: contain;\n  height: 15.625rem;\n  width: 10rem;\n  -webkit-transform-origin: left bottom;\n  transform-origin: left bottom;\n  -webkit-transform: rotate(80deg) translateX(-1.5625rem);\n  transform: rotate(80deg) translateX(-1.5625rem);\n}\n\n.swiper-slide:last-child.swiper-slide-active div {\n  -webkit-transform: rotate(15deg) translateX(-1.5625rem);\n  transform: rotate(15deg) translateX(-1.5625rem);\n}\n\n.swiper-slide:last-child p {\n  padding: 0.78125rem 0 0 1.40625rem;\n  font-size: 0.5rem;\n  line-height: 2.4;\n  letter-spacing: 0.023438rem;\n}\n\n.swiper-slide:last-child p span {\n  color: #999900;\n}\n\n.btn {\n  display: inline-block;\n  position: absolute;\n  bottom: 0.3125rem;\n  right: 0.3125rem;\n  padding: 0 0.46875rem;\n  font-size: 0.625rem;\n  line-height: 2;\n  background-color: #fff;\n  border-radius: 0.15625rem;\n  box-shadow: 0 0.0625rem 0.3125rem rgba(0, 0, 0, .3);\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../css-loader/index.js!./swiper.min.css", function() {
			var newContent = require("!!./../../../css-loader/index.js!./swiper.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js?imprtLoaders=1!./../../node_modules/postcss-loader/index.js??ref--3-2!./index.pcss", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js?imprtLoaders=1!./../../node_modules/postcss-loader/index.js??ref--3-2!./index.pcss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Swiper 3.4.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: December 13, 2016
 */
(function () {
    'use strict';
    var $;
    /*===========================
    Swiper
    ===========================*/
    var Swiper = function (container, params) {
        if (!(this instanceof Swiper)) return new Swiper(container, params);

        var defaults = {
            direction: 'horizontal',
            touchEventsTarget: 'container',
            initialSlide: 0,
            speed: 300,
            // autoplay
            autoplay: false,
            autoplayDisableOnInteraction: true,
            autoplayStopOnLast: false,
            // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
            iOSEdgeSwipeDetection: false,
            iOSEdgeSwipeThreshold: 20,
            // Free mode
            freeMode: false,
            freeModeMomentum: true,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: true,
            freeModeMomentumBounceRatio: 1,
            freeModeMomentumVelocityRatio: 1,
            freeModeSticky: false,
            freeModeMinimumVelocity: 0.02,
            // Autoheight
            autoHeight: false,
            // Set wrapper width
            setWrapperSize: false,
            // Virtual Translate
            virtualTranslate: false,
            // Effects
            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            },
            flip: {
                slideShadows : true,
                limitRotation: true
            },
            cube: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 20,
                shadowScale: 0.94
            },
            fade: {
                crossFade: false
            },
            // Parallax
            parallax: false,
            // Zoom
            zoom: false,
            zoomMax: 3,
            zoomMin: 1,
            zoomToggle: true,
            // Scrollbar
            scrollbar: null,
            scrollbarHide: true,
            scrollbarDraggable: false,
            scrollbarSnapOnRelease: false,
            // Keyboard Mousewheel
            keyboardControl: false,
            mousewheelControl: false,
            mousewheelReleaseOnEdges: false,
            mousewheelInvert: false,
            mousewheelForceToAxis: false,
            mousewheelSensitivity: 1,
            mousewheelEventsTarged: 'container',
            // Hash Navigation
            hashnav: false,
            hashnavWatchState: false,
            // History
            history: false,
            // Commong Nav State
            replaceState: false,
            // Breakpoints
            breakpoints: undefined,
            // Slides grid
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: 'column',
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesOffsetBefore: 0, // in px
            slidesOffsetAfter: 0, // in px
            // Round length
            roundLengths: false,
            // Touches
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: true,
            onlyExternal: false,
            threshold: 0,
            touchMoveStopPropagation: true,
            touchReleaseOnEdges: false,
            // Unique Navigation Elements
            uniqueNavElements: true,
            // Pagination
            pagination: null,
            paginationElement: 'span',
            paginationClickable: false,
            paginationHide: false,
            paginationBulletRender: null,
            paginationProgressRender: null,
            paginationFractionRender: null,
            paginationCustomRender: null,
            paginationType: 'bullets', // 'bullets' or 'progress' or 'fraction' or 'custom'
            // Resistance
            resistance: true,
            resistanceRatio: 0.85,
            // Next/prev buttons
            nextButton: null,
            prevButton: null,
            // Progress
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            // Cursor
            grabCursor: false,
            // Clicks
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            // Lazy Loading
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingInPrevNextAmount: 1,
            lazyLoadingOnTransitionStart: false,
            // Images
            preloadImages: true,
            updateOnImagesReady: true,
            // loop
            loop: false,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            // Control
            control: undefined,
            controlInverse: false,
            controlBy: 'slide', //or 'container'
            normalizeSlideIndex: true,
            // Swiping/no swiping
            allowSwipeToPrev: true,
            allowSwipeToNext: true,
            swipeHandler: null, //'.swipe-handler',
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
            // Passive Listeners
            passiveListeners: true,
            // NS
            containerModifierClass: 'swiper-container-', // NEW
            slideClass: 'swiper-slide',
            slideActiveClass: 'swiper-slide-active',
            slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
            slideVisibleClass: 'swiper-slide-visible',
            slideDuplicateClass: 'swiper-slide-duplicate',
            slideNextClass: 'swiper-slide-next',
            slideDuplicateNextClass: 'swiper-slide-duplicate-next',
            slidePrevClass: 'swiper-slide-prev',
            slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
            wrapperClass: 'swiper-wrapper',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            buttonDisabledClass: 'swiper-button-disabled',
            paginationCurrentClass: 'swiper-pagination-current',
            paginationTotalClass: 'swiper-pagination-total',
            paginationHiddenClass: 'swiper-pagination-hidden',
            paginationProgressbarClass: 'swiper-pagination-progressbar',
            paginationClickableClass: 'swiper-pagination-clickable', // NEW
            paginationModifierClass: 'swiper-pagination-', // NEW
            lazyLoadingClass: 'swiper-lazy',
            lazyStatusLoadingClass: 'swiper-lazy-loading',
            lazyStatusLoadedClass: 'swiper-lazy-loaded',
            lazyPreloaderClass: 'swiper-lazy-preloader',
            notificationClass: 'swiper-notification',
            preloaderClass: 'preloader',
            zoomContainerClass: 'swiper-zoom-container',
        
            // Observer
            observer: false,
            observeParents: false,
            // Accessibility
            a11y: false,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            paginationBulletMessage: 'Go to slide {{index}}',
            // Callbacks
            runCallbacksOnInit: true
            /*
            Callbacks:
            onInit: function (swiper)
            onDestroy: function (swiper)
            onClick: function (swiper, e)
            onTap: function (swiper, e)
            onDoubleTap: function (swiper, e)
            onSliderMove: function (swiper, e)
            onSlideChangeStart: function (swiper)
            onSlideChangeEnd: function (swiper)
            onTransitionStart: function (swiper)
            onTransitionEnd: function (swiper)
            onImagesReady: function (swiper)
            onProgress: function (swiper, progress)
            onTouchStart: function (swiper, e)
            onTouchMove: function (swiper, e)
            onTouchMoveOpposite: function (swiper, e)
            onTouchEnd: function (swiper, e)
            onReachBeginning: function (swiper)
            onReachEnd: function (swiper)
            onSetTransition: function (swiper, duration)
            onSetTranslate: function (swiper, translate)
            onAutoplayStart: function (swiper)
            onAutoplayStop: function (swiper),
            onLazyImageLoad: function (swiper, slide, image)
            onLazyImageReady: function (swiper, slide, image)
            */
        
        };
        var initialVirtualTranslate = params && params.virtualTranslate;
        
        params = params || {};
        var originalParams = {};
        for (var param in params) {
            if (typeof params[param] === 'object' && params[param] !== null && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
                originalParams[param] = {};
                for (var deepParam in params[param]) {
                    originalParams[param][deepParam] = params[param][deepParam];
                }
            }
            else {
                originalParams[param] = params[param];
            }
        }
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
            else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }
        
        // Swiper
        var s = this;
        
        // Params
        s.params = params;
        s.originalParams = originalParams;
        
        // Classname
        s.classNames = [];
        /*=========================
          Dom Library and plugins
          ===========================*/
        if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){
            $ = Dom7;
        }
        if (typeof $ === 'undefined') {
            if (typeof Dom7 === 'undefined') {
                $ = window.Dom7 || window.Zepto || window.jQuery;
            }
            else {
                $ = Dom7;
            }
            if (!$) return;
        }
        // Export it to Swiper instance
        s.$ = $;
        
        /*=========================
          Breakpoints
          ===========================*/
        s.currentBreakpoint = undefined;
        s.getActiveBreakpoint = function () {
            //Get breakpoint for window width
            if (!s.params.breakpoints) return false;
            var breakpoint = false;
            var points = [], point;
            for ( point in s.params.breakpoints ) {
                if (s.params.breakpoints.hasOwnProperty(point)) {
                    points.push(point);
                }
            }
            points.sort(function (a, b) {
                return parseInt(a, 10) > parseInt(b, 10);
            });
            for (var i = 0; i < points.length; i++) {
                point = points[i];
                if (point >= window.innerWidth && !breakpoint) {
                    breakpoint = point;
                }
            }
            return breakpoint || 'max';
        };
        s.setBreakpoint = function () {
            //Set breakpoint for window width and update parameters
            var breakpoint = s.getActiveBreakpoint();
            if (breakpoint && s.currentBreakpoint !== breakpoint) {
                var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
                var needsReLoop = s.params.loop && (breakPointsParams.slidesPerView !== s.params.slidesPerView);
                for ( var param in breakPointsParams ) {
                    s.params[param] = breakPointsParams[param];
                }
                s.currentBreakpoint = breakpoint;
                if(needsReLoop && s.destroyLoop) {
                    s.reLoop(true);
                }
            }
        };
        // Set breakpoint on load
        if (s.params.breakpoints) {
            s.setBreakpoint();
        }
        
        /*=========================
          Preparation - Define Container, Wrapper and Pagination
          ===========================*/
        s.container = $(container);
        if (s.container.length === 0) return;
        if (s.container.length > 1) {
            var swipers = [];
            s.container.each(function () {
                var container = this;
                swipers.push(new Swiper(this, params));
            });
            return swipers;
        }
        
        // Save instance in container HTML Element and in data
        s.container[0].swiper = s;
        s.container.data('swiper', s);
        
        s.classNames.push(s.params.containerModifierClass + s.params.direction);
        
        if (s.params.freeMode) {
            s.classNames.push(s.params.containerModifierClass + 'free-mode');
        }
        if (!s.support.flexbox) {
            s.classNames.push(s.params.containerModifierClass + 'no-flexbox');
            s.params.slidesPerColumn = 1;
        }
        if (s.params.autoHeight) {
            s.classNames.push(s.params.containerModifierClass + 'autoheight');
        }
        // Enable slides progress when required
        if (s.params.parallax || s.params.watchSlidesVisibility) {
            s.params.watchSlidesProgress = true;
        }
        // Max resistance when touchReleaseOnEdges
        if (s.params.touchReleaseOnEdges) {
            s.params.resistanceRatio = 0;
        }
        // Coverflow / 3D
        if (['cube', 'coverflow', 'flip'].indexOf(s.params.effect) >= 0) {
            if (s.support.transforms3d) {
                s.params.watchSlidesProgress = true;
                s.classNames.push(s.params.containerModifierClass + '3d');
            }
            else {
                s.params.effect = 'slide';
            }
        }
        if (s.params.effect !== 'slide') {
            s.classNames.push(s.params.containerModifierClass + s.params.effect);
        }
        if (s.params.effect === 'cube') {
            s.params.resistanceRatio = 0;
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.centeredSlides = false;
            s.params.spaceBetween = 0;
            s.params.virtualTranslate = true;
            s.params.setWrapperSize = false;
        }
        if (s.params.effect === 'fade' || s.params.effect === 'flip') {
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.watchSlidesProgress = true;
            s.params.spaceBetween = 0;
            s.params.setWrapperSize = false;
            if (typeof initialVirtualTranslate === 'undefined') {
                s.params.virtualTranslate = true;
            }
        }
        
        // Grab Cursor
        if (s.params.grabCursor && s.support.touch) {
            s.params.grabCursor = false;
        }
        
        // Wrapper
        s.wrapper = s.container.children('.' + s.params.wrapperClass);
        
        // Pagination
        if (s.params.pagination) {
            s.paginationContainer = $(s.params.pagination);
            if (s.params.uniqueNavElements && typeof s.params.pagination === 'string' && s.paginationContainer.length > 1 && s.container.find(s.params.pagination).length === 1) {
                s.paginationContainer = s.container.find(s.params.pagination);
            }
        
            if (s.params.paginationType === 'bullets' && s.params.paginationClickable) {
                s.paginationContainer.addClass(s.params.paginationModifierClass + 'clickable');
            }
            else {
                s.params.paginationClickable = false;
            }
            s.paginationContainer.addClass(s.params.paginationModifierClass + s.params.paginationType);
        }
        // Next/Prev Buttons
        if (s.params.nextButton || s.params.prevButton) {
            if (s.params.nextButton) {
                s.nextButton = $(s.params.nextButton);
                if (s.params.uniqueNavElements && typeof s.params.nextButton === 'string' && s.nextButton.length > 1 && s.container.find(s.params.nextButton).length === 1) {
                    s.nextButton = s.container.find(s.params.nextButton);
                }
            }
            if (s.params.prevButton) {
                s.prevButton = $(s.params.prevButton);
                if (s.params.uniqueNavElements && typeof s.params.prevButton === 'string' && s.prevButton.length > 1 && s.container.find(s.params.prevButton).length === 1) {
                    s.prevButton = s.container.find(s.params.prevButton);
                }
            }
        }
        
        // Is Horizontal
        s.isHorizontal = function () {
            return s.params.direction === 'horizontal';
        };
        // s.isH = isH;
        
        // RTL
        s.rtl = s.isHorizontal() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
        if (s.rtl) {
            s.classNames.push(s.params.containerModifierClass + 'rtl');
        }
        
        // Wrong RTL support
        if (s.rtl) {
            s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
        }
        
        // Columns
        if (s.params.slidesPerColumn > 1) {
            s.classNames.push(s.params.containerModifierClass + 'multirow');
        }
        
        // Check for Android
        if (s.device.android) {
            s.classNames.push(s.params.containerModifierClass + 'android');
        }
        
        // Add classes
        s.container.addClass(s.classNames.join(' '));
        
        // Translate
        s.translate = 0;
        
        // Progress
        s.progress = 0;
        
        // Velocity
        s.velocity = 0;
        
        /*=========================
          Locks, unlocks
          ===========================*/
        s.lockSwipeToNext = function () {
            s.params.allowSwipeToNext = false;
            if (s.params.allowSwipeToPrev === false && s.params.grabCursor) {
                s.unsetGrabCursor();
            }
        };
        s.lockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = false;
            if (s.params.allowSwipeToNext === false && s.params.grabCursor) {
                s.unsetGrabCursor();
            }
        };
        s.lockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
            if (s.params.grabCursor) s.unsetGrabCursor();
        };
        s.unlockSwipeToNext = function () {
            s.params.allowSwipeToNext = true;
            if (s.params.allowSwipeToPrev === true && s.params.grabCursor) {
                s.setGrabCursor();
            }
        };
        s.unlockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = true;
            if (s.params.allowSwipeToNext === true && s.params.grabCursor) {
                s.setGrabCursor();
            }
        };
        s.unlockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
            if (s.params.grabCursor) s.setGrabCursor();
        };
        
        /*=========================
          Round helper
          ===========================*/
        function round(a) {
            return Math.floor(a);
        }
        /*=========================
          Set grab cursor
          ===========================*/
        s.setGrabCursor = function(moving) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
            s.container[0].style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
            s.container[0].style.cursor = moving ? 'grabbing': 'grab';
        };
        s.unsetGrabCursor = function () {
            s.container[0].style.cursor = '';
        };
        if (s.params.grabCursor) {
            s.setGrabCursor();
        }
        /*=========================
          Update on Images Ready
          ===========================*/
        s.imagesToLoad = [];
        s.imagesLoaded = 0;
        
        s.loadImage = function (imgElement, src, srcset, sizes, checkForComplete, callback) {
            var image;
            function onReady () {
                if (callback) callback();
            }
            if (!imgElement.complete || !checkForComplete) {
                if (src) {
                    image = new window.Image();
                    image.onload = onReady;
                    image.onerror = onReady;
                    if (sizes) {
                        image.sizes = sizes;
                    }
                    if (srcset) {
                        image.srcset = srcset;
                    }
                    if (src) {
                        image.src = src;
                    }
                } else {
                    onReady();
                }
        
            } else {//image already loaded...
                onReady();
            }
        };
        s.preloadImages = function () {
            s.imagesToLoad = s.container.find('img');
            function _onReady() {
                if (typeof s === 'undefined' || s === null || !s) return;
                if (s.imagesLoaded !== undefined) s.imagesLoaded++;
                if (s.imagesLoaded === s.imagesToLoad.length) {
                    if (s.params.updateOnImagesReady) s.update();
                    s.emit('onImagesReady', s);
                }
            }
            for (var i = 0; i < s.imagesToLoad.length; i++) {
                s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), (s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset')), s.imagesToLoad[i].sizes || s.imagesToLoad[i].getAttribute('sizes'), true, _onReady);
            }
        };
        
        /*=========================
          Autoplay
          ===========================*/
        s.autoplayTimeoutId = undefined;
        s.autoplaying = false;
        s.autoplayPaused = false;
        function autoplay() {
            var autoplayDelay = s.params.autoplay;
            var activeSlide = s.slides.eq(s.activeIndex);
            if (activeSlide.attr('data-swiper-autoplay')) {
                autoplayDelay = activeSlide.attr('data-swiper-autoplay') || s.params.autoplay;
            }
            s.autoplayTimeoutId = setTimeout(function () {
                if (s.params.loop) {
                    s.fixLoop();
                    s._slideNext();
                    s.emit('onAutoplay', s);
                }
                else {
                    if (!s.isEnd) {
                        s._slideNext();
                        s.emit('onAutoplay', s);
                    }
                    else {
                        if (!params.autoplayStopOnLast) {
                            s._slideTo(0);
                            s.emit('onAutoplay', s);
                        }
                        else {
                            s.stopAutoplay();
                        }
                    }
                }
            }, autoplayDelay);
        }
        s.startAutoplay = function () {
            if (typeof s.autoplayTimeoutId !== 'undefined') return false;
            if (!s.params.autoplay) return false;
            if (s.autoplaying) return false;
            s.autoplaying = true;
            s.emit('onAutoplayStart', s);
            autoplay();
        };
        s.stopAutoplay = function (internal) {
            if (!s.autoplayTimeoutId) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplaying = false;
            s.autoplayTimeoutId = undefined;
            s.emit('onAutoplayStop', s);
        };
        s.pauseAutoplay = function (speed) {
            if (s.autoplayPaused) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplayPaused = true;
            if (speed === 0) {
                s.autoplayPaused = false;
                autoplay();
            }
            else {
                s.wrapper.transitionEnd(function () {
                    if (!s) return;
                    s.autoplayPaused = false;
                    if (!s.autoplaying) {
                        s.stopAutoplay();
                    }
                    else {
                        autoplay();
                    }
                });
            }
        };
        /*=========================
          Min/Max Translate
          ===========================*/
        s.minTranslate = function () {
            return (-s.snapGrid[0]);
        };
        s.maxTranslate = function () {
            return (-s.snapGrid[s.snapGrid.length - 1]);
        };
        /*=========================
          Slider/slides sizes
          ===========================*/
        s.updateAutoHeight = function () {
            var activeSlides = [];
            var newHeight = 0;
            var i;
        
            // Find slides currently in view
            if(s.params.slidesPerView !== 'auto' && s.params.slidesPerView > 1) {
                for (i = 0; i < Math.ceil(s.params.slidesPerView); i++) {
                    var index = s.activeIndex + i;
                    if(index > s.slides.length) break;
                    activeSlides.push(s.slides.eq(index)[0]);
                }
            } else {
                activeSlides.push(s.slides.eq(s.activeIndex)[0]);
            }
        
            // Find new height from heighest slide in view
            for (i = 0; i < activeSlides.length; i++) {
                if (typeof activeSlides[i] !== 'undefined') {
                    var height = activeSlides[i].offsetHeight;
                    newHeight = height > newHeight ? height : newHeight;
                }
            }
        
            // Update Height
            if (newHeight) s.wrapper.css('height', newHeight + 'px');
        };
        s.updateContainerSize = function () {
            var width, height;
            if (typeof s.params.width !== 'undefined') {
                width = s.params.width;
            }
            else {
                width = s.container[0].clientWidth;
            }
            if (typeof s.params.height !== 'undefined') {
                height = s.params.height;
            }
            else {
                height = s.container[0].clientHeight;
            }
            if (width === 0 && s.isHorizontal() || height === 0 && !s.isHorizontal()) {
                return;
            }
        
            //Subtract paddings
            width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
            height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);
        
            // Store values
            s.width = width;
            s.height = height;
            s.size = s.isHorizontal() ? s.width : s.height;
        };
        
        s.updateSlidesSize = function () {
            s.slides = s.wrapper.children('.' + s.params.slideClass);
            s.snapGrid = [];
            s.slidesGrid = [];
            s.slidesSizesGrid = [];
        
            var spaceBetween = s.params.spaceBetween,
                slidePosition = -s.params.slidesOffsetBefore,
                i,
                prevSlideSize = 0,
                index = 0;
            if (typeof s.size === 'undefined') return;
            if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
                spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
            }
        
            s.virtualSize = -spaceBetween;
            // reset margins
            if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
            else s.slides.css({marginRight: '', marginBottom: ''});
        
            var slidesNumberEvenToRows;
            if (s.params.slidesPerColumn > 1) {
                if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                    slidesNumberEvenToRows = s.slides.length;
                }
                else {
                    slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
                }
                if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
                    slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
                }
            }
        
            // Calc slides
            var slideSize;
            var slidesPerColumn = s.params.slidesPerColumn;
            var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
            var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
            for (i = 0; i < s.slides.length; i++) {
                slideSize = 0;
                var slide = s.slides.eq(i);
                if (s.params.slidesPerColumn > 1) {
                    // Set slides order
                    var newSlideOrderIndex;
                    var column, row;
                    if (s.params.slidesPerColumnFill === 'column') {
                        column = Math.floor(i / slidesPerColumn);
                        row = i - column * slidesPerColumn;
                        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn-1)) {
                            if (++row >= slidesPerColumn) {
                                row = 0;
                                column++;
                            }
                        }
                        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                        slide
                            .css({
                                '-webkit-box-ordinal-group': newSlideOrderIndex,
                                '-moz-box-ordinal-group': newSlideOrderIndex,
                                '-ms-flex-order': newSlideOrderIndex,
                                '-webkit-order': newSlideOrderIndex,
                                'order': newSlideOrderIndex
                            });
                    }
                    else {
                        row = Math.floor(i / slidesPerRow);
                        column = i - row * slidesPerRow;
                    }
                    slide
                        .css(
                            'margin-' + (s.isHorizontal() ? 'top' : 'left'),
                            (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                        )
                        .attr('data-swiper-column', column)
                        .attr('data-swiper-row', row);
        
                }
                if (slide.css('display') === 'none') continue;
                if (s.params.slidesPerView === 'auto') {
                    slideSize = s.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
                    if (s.params.roundLengths) slideSize = round(slideSize);
                }
                else {
                    slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                    if (s.params.roundLengths) slideSize = round(slideSize);
        
                    if (s.isHorizontal()) {
                        s.slides[i].style.width = slideSize + 'px';
                    }
                    else {
                        s.slides[i].style.height = slideSize + 'px';
                    }
                }
                s.slides[i].swiperSlideSize = slideSize;
                s.slidesSizesGrid.push(slideSize);
        
        
                if (s.params.centeredSlides) {
                    slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                    if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                    if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                }
                else {
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                    slidePosition = slidePosition + slideSize + spaceBetween;
                }
        
                s.virtualSize += slideSize + spaceBetween;
        
                prevSlideSize = slideSize;
        
                index ++;
            }
            s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
            var newSlidesGrid;
        
            if (
                s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            }
            if (!s.support.flexbox || s.params.setWrapperSize) {
                if (s.isHorizontal()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
            }
        
            if (s.params.slidesPerColumn > 1) {
                s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
                if (s.isHorizontal()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
                if (s.params.centeredSlides) {
                    newSlidesGrid = [];
                    for (i = 0; i < s.snapGrid.length; i++) {
                        if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                    }
                    s.snapGrid = newSlidesGrid;
                }
            }
        
            // Remove last grid elements depending on width
            if (!s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] <= s.virtualSize - s.size) {
                        newSlidesGrid.push(s.snapGrid[i]);
                    }
                }
                s.snapGrid = newSlidesGrid;
                if (Math.floor(s.virtualSize - s.size) - Math.floor(s.snapGrid[s.snapGrid.length - 1]) > 1) {
                    s.snapGrid.push(s.virtualSize - s.size);
                }
            }
            if (s.snapGrid.length === 0) s.snapGrid = [0];
        
            if (s.params.spaceBetween !== 0) {
                if (s.isHorizontal()) {
                    if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                    else s.slides.css({marginRight: spaceBetween + 'px'});
                }
                else s.slides.css({marginBottom: spaceBetween + 'px'});
            }
            if (s.params.watchSlidesProgress) {
                s.updateSlidesOffset();
            }
        };
        s.updateSlidesOffset = function () {
            for (var i = 0; i < s.slides.length; i++) {
                s.slides[i].swiperSlideOffset = s.isHorizontal() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
            }
        };
        
        /*=========================
          Dynamic Slides Per View
          ===========================*/
        s.currentSlidesPerView = function () {
            var spv = 1, i, j;
            if (s.params.centeredSlides) {
                var size = s.slides[s.activeIndex].swiperSlideSize;
                var breakLoop;
                for (i = s.activeIndex + 1; i < s.slides.length; i++) {
                    if (s.slides[i] && !breakLoop) {
                        size += s.slides[i].swiperSlideSize;
                        spv ++;
                        if (size > s.size) breakLoop = true;
                    }
                }
                for (j = s.activeIndex - 1; j >= 0; j--) {
                    if (s.slides[j] && !breakLoop) {
                        size += s.slides[j].swiperSlideSize;
                        spv ++;
                        if (size > s.size) breakLoop = true;
                    }
                }
            }
            else {
                for (i = s.activeIndex + 1; i < s.slides.length; i++) {
                    if (s.slidesGrid[i] - s.slidesGrid[s.activeIndex] < s.size) {
                        spv++;
                    }
                }
            }
            return spv;
        };
        /*=========================
          Slider/slides progress
          ===========================*/
        s.updateSlidesProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            if (s.slides.length === 0) return;
            if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();
        
            var offsetCenter = -translate;
            if (s.rtl) offsetCenter = translate;
        
            // Visible Slides
            s.slides.removeClass(s.params.slideVisibleClass);
            for (var i = 0; i < s.slides.length; i++) {
                var slide = s.slides[i];
                var slideProgress = (offsetCenter + (s.params.centeredSlides ? s.minTranslate() : 0) - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                if (s.params.watchSlidesVisibility) {
                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                    var slideAfter = slideBefore + s.slidesSizesGrid[i];
                    var isVisible =
                        (slideBefore >= 0 && slideBefore < s.size) ||
                        (slideAfter > 0 && slideAfter <= s.size) ||
                        (slideBefore <= 0 && slideAfter >= s.size);
                    if (isVisible) {
                        s.slides.eq(i).addClass(s.params.slideVisibleClass);
                    }
                }
                slide.progress = s.rtl ? -slideProgress : slideProgress;
            }
        };
        s.updateProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            var wasBeginning = s.isBeginning;
            var wasEnd = s.isEnd;
            if (translatesDiff === 0) {
                s.progress = 0;
                s.isBeginning = s.isEnd = true;
            }
            else {
                s.progress = (translate - s.minTranslate()) / (translatesDiff);
                s.isBeginning = s.progress <= 0;
                s.isEnd = s.progress >= 1;
            }
            if (s.isBeginning && !wasBeginning) s.emit('onReachBeginning', s);
            if (s.isEnd && !wasEnd) s.emit('onReachEnd', s);
        
            if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
            s.emit('onProgress', s, s.progress);
        };
        s.updateActiveIndex = function () {
            var translate = s.rtl ? s.translate : -s.translate;
            var newActiveIndex, i, snapIndex;
            for (i = 0; i < s.slidesGrid.length; i ++) {
                if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                    if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                        newActiveIndex = i;
                    }
                    else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                        newActiveIndex = i + 1;
                    }
                }
                else {
                    if (translate >= s.slidesGrid[i]) {
                        newActiveIndex = i;
                    }
                }
            }
            // Normalize slideIndex
            if(s.params.normalizeSlideIndex){
                if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
            }
            // for (i = 0; i < s.slidesGrid.length; i++) {
                // if (- translate >= s.slidesGrid[i]) {
                    // newActiveIndex = i;
                // }
            // }
            snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
            if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
        
            if (newActiveIndex === s.activeIndex) {
                return;
            }
            s.snapIndex = snapIndex;
            s.previousIndex = s.activeIndex;
            s.activeIndex = newActiveIndex;
            s.updateClasses();
            s.updateRealIndex();
        };
        s.updateRealIndex = function(){
            s.realIndex = parseInt(s.slides.eq(s.activeIndex).attr('data-swiper-slide-index') || s.activeIndex, 10);
        };
        
        /*=========================
          Classes
          ===========================*/
        s.updateClasses = function () {
            s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass + ' ' + s.params.slideDuplicateActiveClass + ' ' + s.params.slideDuplicateNextClass + ' ' + s.params.slideDuplicatePrevClass);
            var activeSlide = s.slides.eq(s.activeIndex);
            // Active classes
            activeSlide.addClass(s.params.slideActiveClass);
            if (params.loop) {
                // Duplicate to all looped slides
                if (activeSlide.hasClass(s.params.slideDuplicateClass)) {
                    s.wrapper.children('.' + s.params.slideClass + ':not(.' + s.params.slideDuplicateClass + ')[data-swiper-slide-index="' + s.realIndex + '"]').addClass(s.params.slideDuplicateActiveClass);
                }
                else {
                    s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + s.realIndex + '"]').addClass(s.params.slideDuplicateActiveClass);
                }
            }
            // Next Slide
            var nextSlide = activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
            if (s.params.loop && nextSlide.length === 0) {
                nextSlide = s.slides.eq(0);
                nextSlide.addClass(s.params.slideNextClass);
            }
            // Prev Slide
            var prevSlide = activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);
            if (s.params.loop && prevSlide.length === 0) {
                prevSlide = s.slides.eq(-1);
                prevSlide.addClass(s.params.slidePrevClass);
            }
            if (params.loop) {
                // Duplicate to all looped slides
                if (nextSlide.hasClass(s.params.slideDuplicateClass)) {
                    s.wrapper.children('.' + s.params.slideClass + ':not(.' + s.params.slideDuplicateClass + ')[data-swiper-slide-index="' + nextSlide.attr('data-swiper-slide-index') + '"]').addClass(s.params.slideDuplicateNextClass);
                }
                else {
                    s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + nextSlide.attr('data-swiper-slide-index') + '"]').addClass(s.params.slideDuplicateNextClass);
                }
                if (prevSlide.hasClass(s.params.slideDuplicateClass)) {
                    s.wrapper.children('.' + s.params.slideClass + ':not(.' + s.params.slideDuplicateClass + ')[data-swiper-slide-index="' + prevSlide.attr('data-swiper-slide-index') + '"]').addClass(s.params.slideDuplicatePrevClass);
                }
                else {
                    s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + prevSlide.attr('data-swiper-slide-index') + '"]').addClass(s.params.slideDuplicatePrevClass);
                }
            }
        
            // Pagination
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                // Current/Total
                var current,
                    total = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                if (s.params.loop) {
                    current = Math.ceil((s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup);
                    if (current > s.slides.length - 1 - s.loopedSlides * 2) {
                        current = current - (s.slides.length - s.loopedSlides * 2);
                    }
                    if (current > total - 1) current = current - total;
                    if (current < 0 && s.params.paginationType !== 'bullets') current = total + current;
                }
                else {
                    if (typeof s.snapIndex !== 'undefined') {
                        current = s.snapIndex;
                    }
                    else {
                        current = s.activeIndex || 0;
                    }
                }
                // Types
                if (s.params.paginationType === 'bullets' && s.bullets && s.bullets.length > 0) {
                    s.bullets.removeClass(s.params.bulletActiveClass);
                    if (s.paginationContainer.length > 1) {
                        s.bullets.each(function () {
                            if ($(this).index() === current) $(this).addClass(s.params.bulletActiveClass);
                        });
                    }
                    else {
                        s.bullets.eq(current).addClass(s.params.bulletActiveClass);
                    }
                }
                if (s.params.paginationType === 'fraction') {
                    s.paginationContainer.find('.' + s.params.paginationCurrentClass).text(current + 1);
                    s.paginationContainer.find('.' + s.params.paginationTotalClass).text(total);
                }
                if (s.params.paginationType === 'progress') {
                    var scale = (current + 1) / total,
                        scaleX = scale,
                        scaleY = 1;
                    if (!s.isHorizontal()) {
                        scaleY = scale;
                        scaleX = 1;
                    }
                    s.paginationContainer.find('.' + s.params.paginationProgressbarClass).transform('translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')').transition(s.params.speed);
                }
                if (s.params.paginationType === 'custom' && s.params.paginationCustomRender) {
                    s.paginationContainer.html(s.params.paginationCustomRender(s, current + 1, total));
                    s.emit('onPaginationRendered', s, s.paginationContainer[0]);
                }
            }
        
            // Next/active buttons
            if (!s.params.loop) {
                if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                    if (s.isBeginning) {
                        s.prevButton.addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable(s.prevButton);
                    }
                    else {
                        s.prevButton.removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable(s.prevButton);
                    }
                }
                if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                    if (s.isEnd) {
                        s.nextButton.addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable(s.nextButton);
                    }
                    else {
                        s.nextButton.removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable(s.nextButton);
                    }
                }
            }
        };
        
        /*=========================
          Pagination
          ===========================*/
        s.updatePagination = function () {
            if (!s.params.pagination) return;
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                var paginationHTML = '';
                if (s.params.paginationType === 'bullets') {
                    var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                    for (var i = 0; i < numberOfBullets; i++) {
                        if (s.params.paginationBulletRender) {
                            paginationHTML += s.params.paginationBulletRender(s, i, s.params.bulletClass);
                        }
                        else {
                            paginationHTML += '<' + s.params.paginationElement+' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
                        }
                    }
                    s.paginationContainer.html(paginationHTML);
                    s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
                    if (s.params.paginationClickable && s.params.a11y && s.a11y) {
                        s.a11y.initPagination();
                    }
                }
                if (s.params.paginationType === 'fraction') {
                    if (s.params.paginationFractionRender) {
                        paginationHTML = s.params.paginationFractionRender(s, s.params.paginationCurrentClass, s.params.paginationTotalClass);
                    }
                    else {
                        paginationHTML =
                            '<span class="' + s.params.paginationCurrentClass + '"></span>' +
                            ' / ' +
                            '<span class="' + s.params.paginationTotalClass+'"></span>';
                    }
                    s.paginationContainer.html(paginationHTML);
                }
                if (s.params.paginationType === 'progress') {
                    if (s.params.paginationProgressRender) {
                        paginationHTML = s.params.paginationProgressRender(s, s.params.paginationProgressbarClass);
                    }
                    else {
                        paginationHTML = '<span class="' + s.params.paginationProgressbarClass + '"></span>';
                    }
                    s.paginationContainer.html(paginationHTML);
                }
                if (s.params.paginationType !== 'custom') {
                    s.emit('onPaginationRendered', s, s.paginationContainer[0]);
                }
            }
        };
        /*=========================
          Common update method
          ===========================*/
        s.update = function (updateTranslate) {
            if (!s) return;
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updateProgress();
            s.updatePagination();
            s.updateClasses();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            function forceSetTranslate() {
                var translate = s.rtl ? -s.translate : s.translate;
                newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
            }
            if (updateTranslate) {
                var translated, newTranslate;
                if (s.controller && s.controller.spline) {
                    s.controller.spline = undefined;
                }
                if (s.params.freeMode) {
                    forceSetTranslate();
                    if (s.params.autoHeight) {
                        s.updateAutoHeight();
                    }
                }
                else {
                    if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                        translated = s.slideTo(s.slides.length - 1, 0, false, true);
                    }
                    else {
                        translated = s.slideTo(s.activeIndex, 0, false, true);
                    }
                    if (!translated) {
                        forceSetTranslate();
                    }
                }
            }
            else if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
        };
        
        /*=========================
          Resize Handler
          ===========================*/
        s.onResize = function (forceUpdatePagination) {
            //Breakpoints
            if (s.params.breakpoints) {
                s.setBreakpoint();
            }
        
            // Disable locks on resize
            var allowSwipeToPrev = s.params.allowSwipeToPrev;
            var allowSwipeToNext = s.params.allowSwipeToNext;
            s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;
        
            s.updateContainerSize();
            s.updateSlidesSize();
            if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            if (s.controller && s.controller.spline) {
                s.controller.spline = undefined;
            }
            var slideChangedBySlideTo = false;
            if (s.params.freeMode) {
                var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
        
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
            }
            else {
                s.updateClasses();
                if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                    slideChangedBySlideTo = s.slideTo(s.slides.length - 1, 0, false, true);
                }
                else {
                    slideChangedBySlideTo = s.slideTo(s.activeIndex, 0, false, true);
                }
            }
            if (s.params.lazyLoading && !slideChangedBySlideTo && s.lazy) {
                s.lazy.load();
            }
            // Return locks after resize
            s.params.allowSwipeToPrev = allowSwipeToPrev;
            s.params.allowSwipeToNext = allowSwipeToNext;
        };
        
        /*=========================
          Events
          ===========================*/
        
        //Define Touch Events
        s.touchEventsDesktop = {start: 'mousedown', move: 'mousemove', end: 'mouseup'};
        if (window.navigator.pointerEnabled) s.touchEventsDesktop = {start: 'pointerdown', move: 'pointermove', end: 'pointerup'};
        else if (window.navigator.msPointerEnabled) s.touchEventsDesktop = {start: 'MSPointerDown', move: 'MSPointerMove', end: 'MSPointerUp'};
        s.touchEvents = {
            start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : s.touchEventsDesktop.start,
            move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : s.touchEventsDesktop.move,
            end : s.support.touch || !s.params.simulateTouch ? 'touchend' : s.touchEventsDesktop.end
        };
        
        
        // WP8 Touch Events Fix
        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
            (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
        }
        
        // Attach/detach events
        s.initEvents = function (detach) {
            var actionDom = detach ? 'off' : 'on';
            var action = detach ? 'removeEventListener' : 'addEventListener';
            var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
            var target = s.support.touch ? touchEventsTarget : document;
        
            var moveCapture = s.params.nested ? true : false;
        
            //Touch Events
            if (s.browser.ie) {
                touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                target[action](s.touchEvents.end, s.onTouchEnd, false);
            }
            else {
                if (s.support.touch) {
                    var passiveListener = s.touchEvents.start === 'touchstart' && s.support.passiveListener && s.params.passiveListeners ? {passive: true, capture: false} : false;
                    touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, passiveListener);
                    touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                    touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, passiveListener);
                }
                if ((params.simulateTouch && !s.device.ios && !s.device.android) || (params.simulateTouch && !s.support.touch && s.device.ios)) {
                    touchEventsTarget[action]('mousedown', s.onTouchStart, false);
                    document[action]('mousemove', s.onTouchMove, moveCapture);
                    document[action]('mouseup', s.onTouchEnd, false);
                }
            }
            window[action]('resize', s.onResize);
        
            // Next, Prev, Index
            if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                s.nextButton[actionDom]('click', s.onClickNext);
                if (s.params.a11y && s.a11y) s.nextButton[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                s.prevButton[actionDom]('click', s.onClickPrev);
                if (s.params.a11y && s.a11y) s.prevButton[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.pagination && s.params.paginationClickable) {
                s.paginationContainer[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
                if (s.params.a11y && s.a11y) s.paginationContainer[actionDom]('keydown', '.' + s.params.bulletClass, s.a11y.onEnterKey);
            }
        
            // Prevent Links Clicks
            if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', s.preventClicks, true);
        };
        s.attachEvents = function () {
            s.initEvents();
        };
        s.detachEvents = function () {
            s.initEvents(true);
        };
        
        /*=========================
          Handle Clicks
          ===========================*/
        // Prevent Clicks
        s.allowClick = true;
        s.preventClicks = function (e) {
            if (!s.allowClick) {
                if (s.params.preventClicks) e.preventDefault();
                if (s.params.preventClicksPropagation && s.animating) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
        };
        // Clicks
        s.onClickNext = function (e) {
            e.preventDefault();
            if (s.isEnd && !s.params.loop) return;
            s.slideNext();
        };
        s.onClickPrev = function (e) {
            e.preventDefault();
            if (s.isBeginning && !s.params.loop) return;
            s.slidePrev();
        };
        s.onClickIndex = function (e) {
            e.preventDefault();
            var index = $(this).index() * s.params.slidesPerGroup;
            if (s.params.loop) index = index + s.loopedSlides;
            s.slideTo(index);
        };
        
        /*=========================
          Handle Touches
          ===========================*/
        function findElementInEvent(e, selector) {
            var el = $(e.target);
            if (!el.is(selector)) {
                if (typeof selector === 'string') {
                    el = el.parents(selector);
                }
                else if (selector.nodeType) {
                    var found;
                    el.parents().each(function (index, _el) {
                        if (_el === selector) found = selector;
                    });
                    if (!found) return undefined;
                    else return selector;
                }
            }
            if (el.length === 0) {
                return undefined;
            }
            return el[0];
        }
        s.updateClickedSlide = function (e) {
            var slide = findElementInEvent(e, '.' + s.params.slideClass);
            var slideFound = false;
            if (slide) {
                for (var i = 0; i < s.slides.length; i++) {
                    if (s.slides[i] === slide) slideFound = true;
                }
            }
        
            if (slide && slideFound) {
                s.clickedSlide = slide;
                s.clickedIndex = $(slide).index();
            }
            else {
                s.clickedSlide = undefined;
                s.clickedIndex = undefined;
                return;
            }
            if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
                var slideToIndex = s.clickedIndex,
                    realIndex,
                    duplicatedSlides,
                    slidesPerView = s.params.slidesPerView === 'auto' ? s.currentSlidesPerView() : s.params.slidesPerView;
                if (s.params.loop) {
                    if (s.animating) return;
                    realIndex = parseInt($(s.clickedSlide).attr('data-swiper-slide-index'), 10);
                    if (s.params.centeredSlides) {
                        if ((slideToIndex < s.loopedSlides - slidesPerView/2) || (slideToIndex > s.slides.length - s.loopedSlides + slidesPerView/2)) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + s.params.slideDuplicateClass + ')').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                    else {
                        if (slideToIndex > s.slides.length - slidesPerView) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + s.params.slideDuplicateClass + ')').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                }
                else {
                    s.slideTo(slideToIndex);
                }
            }
        };
        
        var isTouched,
            isMoved,
            allowTouchCallbacks,
            touchStartTime,
            isScrolling,
            currentTranslate,
            startTranslate,
            allowThresholdMove,
            // Form elements to match
            formElements = 'input, select, textarea, button, video',
            // Last click time
            lastClickTime = Date.now(), clickTimeout,
            //Velocities
            velocities = [],
            allowMomentumBounce;
        
        // Animating Flag
        s.animating = false;
        
        // Touches information
        s.touches = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
        };
        
        // Touch handlers
        var isTouchEvent, startMoving;
        s.onTouchStart = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            isTouchEvent = e.type === 'touchstart';
            if (!isTouchEvent && 'which' in e && e.which === 3) return;
            if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
                s.allowClick = true;
                return;
            }
            if (s.params.swipeHandler) {
                if (!findElementInEvent(e, s.params.swipeHandler)) return;
            }
        
            var startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            var startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        
            // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
            if(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold) {
                return;
            }
        
            isTouched = true;
            isMoved = false;
            allowTouchCallbacks = true;
            isScrolling = undefined;
            startMoving = undefined;
            s.touches.startX = startX;
            s.touches.startY = startY;
            touchStartTime = Date.now();
            s.allowClick = true;
            s.updateContainerSize();
            s.swipeDirection = undefined;
            if (s.params.threshold > 0) allowThresholdMove = false;
            if (e.type !== 'touchstart') {
                var preventDefault = true;
                if ($(e.target).is(formElements)) preventDefault = false;
                if (document.activeElement && $(document.activeElement).is(formElements)) {
                    document.activeElement.blur();
                }
                if (preventDefault) {
                    e.preventDefault();
                }
            }
            s.emit('onTouchStart', s, e);
        };
        
        s.onTouchMove = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (isTouchEvent && e.type === 'mousemove') return;
            if (e.preventedByNestedSwiper) {
                s.touches.startX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                s.touches.startY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                return;
            }
            if (s.params.onlyExternal) {
                // isMoved = true;
                s.allowClick = false;
                if (isTouched) {
                    s.touches.startX = s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.startY = s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                    touchStartTime = Date.now();
                }
                return;
            }
            if (isTouchEvent && s.params.touchReleaseOnEdges && !s.params.loop) {
                if (!s.isHorizontal()) {
                    // Vertical
                    if (
                        (s.touches.currentY < s.touches.startY && s.translate <= s.maxTranslate()) ||
                        (s.touches.currentY > s.touches.startY && s.translate >= s.minTranslate())
                        ) {
                        return;
                    }
                }
                else {
                    if (
                        (s.touches.currentX < s.touches.startX && s.translate <= s.maxTranslate()) ||
                        (s.touches.currentX > s.touches.startX && s.translate >= s.minTranslate())
                        ) {
                        return;
                    }
                }
            }
            if (isTouchEvent && document.activeElement) {
                if (e.target === document.activeElement && $(e.target).is(formElements)) {
                    isMoved = true;
                    s.allowClick = false;
                    return;
                }
            }
            if (allowTouchCallbacks) {
                s.emit('onTouchMove', s, e);
            }
            if (e.targetTouches && e.targetTouches.length > 1) return;
        
            s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        
            if (typeof isScrolling === 'undefined') {
                var touchAngle;
                if (s.isHorizontal() && s.touches.currentY === s.touches.startY || !s.isHorizontal() && s.touches.currentX === s.touches.startX) {
                    isScrolling = false;
                }
                else {
                    touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
                    isScrolling = s.isHorizontal() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
                }
            }
            if (isScrolling) {
                s.emit('onTouchMoveOpposite', s, e);
            }
            if (typeof startMoving === 'undefined' && s.browser.ieTouch) {
                if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
                    startMoving = true;
                }
            }
            if (!isTouched) return;
            if (isScrolling)  {
                isTouched = false;
                return;
            }
            if (!startMoving && s.browser.ieTouch) {
                return;
            }
            s.allowClick = false;
            s.emit('onSliderMove', s, e);
            e.preventDefault();
            if (s.params.touchMoveStopPropagation && !s.params.nested) {
                e.stopPropagation();
            }
        
            if (!isMoved) {
                if (params.loop) {
                    s.fixLoop();
                }
                startTranslate = s.getWrapperTranslate();
                s.setWrapperTransition(0);
                if (s.animating) {
                    s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
                }
                if (s.params.autoplay && s.autoplaying) {
                    if (s.params.autoplayDisableOnInteraction) {
                        s.stopAutoplay();
                    }
                    else {
                        s.pauseAutoplay();
                    }
                }
                allowMomentumBounce = false;
                //Grab Cursor
                if (s.params.grabCursor && (s.params.allowSwipeToNext === true || s.params.allowSwipeToPrev === true)) {
                    s.setGrabCursor(true);
                }
            }
            isMoved = true;
        
            var diff = s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
        
            diff = diff * s.params.touchRatio;
            if (s.rtl) diff = -diff;
        
            s.swipeDirection = diff > 0 ? 'prev' : 'next';
            currentTranslate = diff + startTranslate;
        
            var disableParentSwiper = true;
            if ((diff > 0 && currentTranslate > s.minTranslate())) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
            }
            else if (diff < 0 && currentTranslate < s.maxTranslate()) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
            }
        
            if (disableParentSwiper) {
                e.preventedByNestedSwiper = true;
            }
        
            // Directions locks
            if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
                currentTranslate = startTranslate;
            }
            if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
                currentTranslate = startTranslate;
            }
        
        
            // Threshold
            if (s.params.threshold > 0) {
                if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        s.touches.startX = s.touches.currentX;
                        s.touches.startY = s.touches.currentY;
                        currentTranslate = startTranslate;
                        s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                        return;
                    }
                }
                else {
                    currentTranslate = startTranslate;
                    return;
                }
            }
        
            if (!s.params.followFinger) return;
        
            // Update active index in free mode
            if (s.params.freeMode || s.params.watchSlidesProgress) {
                s.updateActiveIndex();
            }
            if (s.params.freeMode) {
                //Velocity
                if (velocities.length === 0) {
                    velocities.push({
                        position: s.touches[s.isHorizontal() ? 'startX' : 'startY'],
                        time: touchStartTime
                    });
                }
                velocities.push({
                    position: s.touches[s.isHorizontal() ? 'currentX' : 'currentY'],
                    time: (new window.Date()).getTime()
                });
            }
            // Update progress
            s.updateProgress(currentTranslate);
            // Update translate
            s.setWrapperTranslate(currentTranslate);
        };
        s.onTouchEnd = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (allowTouchCallbacks) {
                s.emit('onTouchEnd', s, e);
            }
            allowTouchCallbacks = false;
            if (!isTouched) return;
            //Return Grab Cursor
            if (s.params.grabCursor && isMoved && isTouched  && (s.params.allowSwipeToNext === true || s.params.allowSwipeToPrev === true)) {
                s.setGrabCursor(false);
            }
        
            // Time diff
            var touchEndTime = Date.now();
            var timeDiff = touchEndTime - touchStartTime;
        
            // Tap, doubleTap, Click
            if (s.allowClick) {
                s.updateClickedSlide(e);
                s.emit('onTap', s, e);
                if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    clickTimeout = setTimeout(function () {
                        if (!s) return;
                        if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                            s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                        }
                        s.emit('onClick', s, e);
                    }, 300);
        
                }
                if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    s.emit('onDoubleTap', s, e);
                }
            }
        
            lastClickTime = Date.now();
            setTimeout(function () {
                if (s) s.allowClick = true;
            }, 0);
        
            if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
        
            var currentPos;
            if (s.params.followFinger) {
                currentPos = s.rtl ? s.translate : -s.translate;
            }
            else {
                currentPos = -currentTranslate;
            }
            if (s.params.freeMode) {
                if (currentPos < -s.minTranslate()) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                else if (currentPos > -s.maxTranslate()) {
                    if (s.slides.length < s.snapGrid.length) {
                        s.slideTo(s.snapGrid.length - 1);
                    }
                    else {
                        s.slideTo(s.slides.length - 1);
                    }
                    return;
                }
        
                if (s.params.freeModeMomentum) {
                    if (velocities.length > 1) {
                        var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();
        
                        var distance = lastMoveEvent.position - velocityEvent.position;
                        var time = lastMoveEvent.time - velocityEvent.time;
                        s.velocity = distance / time;
                        s.velocity = s.velocity / 2;
                        if (Math.abs(s.velocity) < s.params.freeModeMinimumVelocity) {
                            s.velocity = 0;
                        }
                        // this implies that the user stopped moving a finger then released.
                        // There would be no events with distance zero, so the last event is stale.
                        if (time > 150 || (new window.Date().getTime() - lastMoveEvent.time) > 300) {
                            s.velocity = 0;
                        }
                    } else {
                        s.velocity = 0;
                    }
                    s.velocity = s.velocity * s.params.freeModeMomentumVelocityRatio;
        
                    velocities.length = 0;
                    var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                    var momentumDistance = s.velocity * momentumDuration;
        
                    var newPosition = s.translate + momentumDistance;
                    if (s.rtl) newPosition = - newPosition;
                    var doBounce = false;
                    var afterBouncePosition;
                    var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                    if (newPosition < s.maxTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition + s.maxTranslate() < -bounceAmount) {
                                newPosition = s.maxTranslate() - bounceAmount;
                            }
                            afterBouncePosition = s.maxTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.maxTranslate();
                        }
                    }
                    else if (newPosition > s.minTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition - s.minTranslate() > bounceAmount) {
                                newPosition = s.minTranslate() + bounceAmount;
                            }
                            afterBouncePosition = s.minTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.minTranslate();
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        var j = 0,
                            nextSlide;
                        for (j = 0; j < s.snapGrid.length; j += 1) {
                            if (s.snapGrid[j] > -newPosition) {
                                nextSlide = j;
                                break;
                            }
        
                        }
                        if (Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
                            newPosition = s.snapGrid[nextSlide];
                        } else {
                            newPosition = s.snapGrid[nextSlide - 1];
                        }
                        if (!s.rtl) newPosition = - newPosition;
                    }
                    //Fix duration
                    if (s.velocity !== 0) {
                        if (s.rtl) {
                            momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
                        }
                        else {
                            momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        s.slideReset();
                        return;
                    }
        
                    if (s.params.freeModeMomentumBounce && doBounce) {
                        s.updateProgress(afterBouncePosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            if (!s || !allowMomentumBounce) return;
                            s.emit('onMomentumBounce', s);
        
                            s.setWrapperTransition(s.params.speed);
                            s.setWrapperTranslate(afterBouncePosition);
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        });
                    } else if (s.velocity) {
                        s.updateProgress(newPosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        if (!s.animating) {
                            s.animating = true;
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        }
        
                    } else {
                        s.updateProgress(newPosition);
                    }
        
                    s.updateActiveIndex();
                }
                if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                    s.updateProgress();
                    s.updateActiveIndex();
                }
                return;
            }
        
            // Find current slide
            var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
            for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
                if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                    if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                    }
                }
                else {
                    if (currentPos >= s.slidesGrid[i]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                    }
                }
            }
        
            // Find current slide size
            var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
        
            if (timeDiff > s.params.longSwipesMs) {
                // Long touches
                if (!s.params.longSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
        
                }
                if (s.swipeDirection === 'prev') {
                    if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
                }
            }
            else {
                // Short swipes
                if (!s.params.shortSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    s.slideTo(stopIndex + s.params.slidesPerGroup);
        
                }
                if (s.swipeDirection === 'prev') {
                    s.slideTo(stopIndex);
                }
            }
        };
        /*=========================
          Transitions
          ===========================*/
        s._slideTo = function (slideIndex, speed) {
            return s.slideTo(slideIndex, speed, true, true);
        };
        s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (typeof slideIndex === 'undefined') slideIndex = 0;
            if (slideIndex < 0) slideIndex = 0;
            s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
            if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;
        
            var translate = - s.snapGrid[s.snapIndex];
            // Stop autoplay
            if (s.params.autoplay && s.autoplaying) {
                if (internal || !s.params.autoplayDisableOnInteraction) {
                    s.pauseAutoplay(speed);
                }
                else {
                    s.stopAutoplay();
                }
            }
            // Update progress
            s.updateProgress(translate);
        
            // Normalize slideIndex
            if(s.params.normalizeSlideIndex){
                for (var i = 0; i < s.slidesGrid.length; i++) {
                    if (- Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)) {
                        slideIndex = i;
                    }
                }
            }
        
            // Directions locks
            if (!s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate()) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate()) {
                if ((s.activeIndex || 0) !== slideIndex ) return false;
            }
        
            // Update Index
            if (typeof speed === 'undefined') speed = s.params.speed;
            s.previousIndex = s.activeIndex || 0;
            s.activeIndex = slideIndex;
            s.updateRealIndex();
            if ((s.rtl && -translate === s.translate) || (!s.rtl && translate === s.translate)) {
                // Update Height
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
                s.updateClasses();
                if (s.params.effect !== 'slide') {
                    s.setWrapperTranslate(translate);
                }
                return false;
            }
            s.updateClasses();
            s.onTransitionStart(runCallbacks);
        
            if (speed === 0 || s.browser.lteIE9) {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(0);
                s.onTransitionEnd(runCallbacks);
            }
            else {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(speed);
                if (!s.animating) {
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        if (!s) return;
                        s.onTransitionEnd(runCallbacks);
                    });
                }
        
            }
        
            return true;
        };
        
        s.onTransitionStart = function (runCallbacks) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
            if (s.lazy) s.lazy.onTransitionStart();
            if (runCallbacks) {
                s.emit('onTransitionStart', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeStart', s);
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextStart', s);
                    }
                    else {
                        s.emit('onSlidePrevStart', s);
                    }
                }
        
            }
        };
        s.onTransitionEnd = function (runCallbacks) {
            s.animating = false;
            s.setWrapperTransition(0);
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.lazy) s.lazy.onTransitionEnd();
            if (runCallbacks) {
                s.emit('onTransitionEnd', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeEnd', s);
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextEnd', s);
                    }
                    else {
                        s.emit('onSlidePrevEnd', s);
                    }
                }
            }
            if (s.params.history && s.history) {
                s.history.setHistory(s.params.history, s.activeIndex);
            }
            if (s.params.hashnav && s.hashnav) {
                s.hashnav.setHash();
            }
        
        };
        s.slideNext = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
        };
        s._slideNext = function (speed) {
            return s.slideNext(true, speed, true);
        };
        s.slidePrev = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
        };
        s._slidePrev = function (speed) {
            return s.slidePrev(true, speed, true);
        };
        s.slideReset = function (runCallbacks, speed, internal) {
            return s.slideTo(s.activeIndex, speed, runCallbacks);
        };
        
        s.disableTouchControl = function () {
            s.params.onlyExternal = true;
            return true;
        };
        s.enableTouchControl = function () {
            s.params.onlyExternal = false;
            return true;
        };
        
        /*=========================
          Translate/transition helpers
          ===========================*/
        s.setWrapperTransition = function (duration, byController) {
            s.wrapper.transition(duration);
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTransition(duration);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTransition(duration);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTransition(duration);
            }
            if (s.params.control && s.controller) {
                s.controller.setTransition(duration, byController);
            }
            s.emit('onSetTransition', s, duration);
        };
        s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
            var x = 0, y = 0, z = 0;
            if (s.isHorizontal()) {
                x = s.rtl ? -translate : translate;
            }
            else {
                y = translate;
            }
        
            if (s.params.roundLengths) {
                x = round(x);
                y = round(y);
            }
        
            if (!s.params.virtualTranslate) {
                if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
                else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
            }
        
            s.translate = s.isHorizontal() ? x : y;
        
            // Check if we need to update progress
            var progress;
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            if (translatesDiff === 0) {
                progress = 0;
            }
            else {
                progress = (translate - s.minTranslate()) / (translatesDiff);
            }
            if (progress !== s.progress) {
                s.updateProgress(translate);
            }
        
            if (updateActiveIndex) s.updateActiveIndex();
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTranslate(s.translate);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTranslate(s.translate);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTranslate(s.translate);
            }
            if (s.params.control && s.controller) {
                s.controller.setTranslate(s.translate, byController);
            }
            s.emit('onSetTranslate', s, s.translate);
        };
        
        s.getTranslate = function (el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;
        
            // automatic axis detection
            if (typeof axis === 'undefined') {
                axis = 'x';
            }
        
            if (s.params.virtualTranslate) {
                return s.rtl ? -s.translate : s.translate;
            }
        
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                curTransform = curStyle.transform || curStyle.webkitTransform;
                if (curTransform.split(',').length > 6) {
                    curTransform = curTransform.split(', ').map(function(a){
                        return a.replace(',','.');
                    }).join(', ');
                }
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }
        
            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }
            if (s.rtl && curTransform) curTransform = -curTransform;
            return curTransform || 0;
        };
        s.getWrapperTranslate = function (axis) {
            if (typeof axis === 'undefined') {
                axis = s.isHorizontal() ? 'x' : 'y';
            }
            return s.getTranslate(s.wrapper[0], axis);
        };
        
        /*=========================
          Observer
          ===========================*/
        s.observers = [];
        function initObserver(target, options) {
            options = options || {};
            // create an observer instance
            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            var observer = new ObserverFunc(function (mutations) {
                mutations.forEach(function (mutation) {
                    s.onResize(true);
                    s.emit('onObserverUpdate', s, mutation);
                });
            });
        
            observer.observe(target, {
                attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
                childList: typeof options.childList === 'undefined' ? true : options.childList,
                characterData: typeof options.characterData === 'undefined' ? true : options.characterData
            });
        
            s.observers.push(observer);
        }
        s.initObservers = function () {
            if (s.params.observeParents) {
                var containerParents = s.container.parents();
                for (var i = 0; i < containerParents.length; i++) {
                    initObserver(containerParents[i]);
                }
            }
        
            // Observe container
            initObserver(s.container[0], {childList: false});
        
            // Observe wrapper
            initObserver(s.wrapper[0], {attributes: false});
        };
        s.disconnectObservers = function () {
            for (var i = 0; i < s.observers.length; i++) {
                s.observers[i].disconnect();
            }
            s.observers = [];
        };
        /*=========================
          Loop
          ===========================*/
        // Create looped slides
        s.createLoop = function () {
            // Remove duplicated slides
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
        
            var slides = s.wrapper.children('.' + s.params.slideClass);
        
            if(s.params.slidesPerView === 'auto' && !s.params.loopedSlides) s.params.loopedSlides = slides.length;
        
            s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
            s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
            if (s.loopedSlides > slides.length) {
                s.loopedSlides = slides.length;
            }
        
            var prependSlides = [], appendSlides = [], i;
            slides.each(function (index, el) {
                var slide = $(this);
                if (index < s.loopedSlides) appendSlides.push(el);
                if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
                slide.attr('data-swiper-slide-index', index);
            });
            for (i = 0; i < appendSlides.length; i++) {
                s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
            for (i = prependSlides.length - 1; i >= 0; i--) {
                s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
        };
        s.destroyLoop = function () {
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
            s.slides.removeAttr('data-swiper-slide-index');
        };
        s.reLoop = function (updatePosition) {
            var oldIndex = s.activeIndex - s.loopedSlides;
            s.destroyLoop();
            s.createLoop();
            s.updateSlidesSize();
            if (updatePosition) {
                s.slideTo(oldIndex + s.loopedSlides, 0, false);
            }
        
        };
        s.fixLoop = function () {
            var newIndex;
            //Fix For Negative Oversliding
            if (s.activeIndex < s.loopedSlides) {
                newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
            //Fix For Positive Oversliding
            else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
                newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
        };
        /*=========================
          Append/Prepend/Remove Slides
          ===========================*/
        s.appendSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.append(slides[i]);
                }
            }
            else {
                s.wrapper.append(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
        };
        s.prependSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            var newActiveIndex = s.activeIndex + 1;
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.prepend(slides[i]);
                }
                newActiveIndex = s.activeIndex + slides.length;
            }
            else {
                s.wrapper.prepend(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            s.slideTo(newActiveIndex, 0, false);
        };
        s.removeSlide = function (slidesIndexes) {
            if (s.params.loop) {
                s.destroyLoop();
                s.slides = s.wrapper.children('.' + s.params.slideClass);
            }
            var newActiveIndex = s.activeIndex,
                indexToRemove;
            if (typeof slidesIndexes === 'object' && slidesIndexes.length) {
                for (var i = 0; i < slidesIndexes.length; i++) {
                    indexToRemove = slidesIndexes[i];
                    if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                    if (indexToRemove < newActiveIndex) newActiveIndex--;
                }
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
            else {
                indexToRemove = slidesIndexes;
                if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex--;
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
        
            if (s.params.loop) {
                s.createLoop();
            }
        
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            if (s.params.loop) {
                s.slideTo(newActiveIndex + s.loopedSlides, 0, false);
            }
            else {
                s.slideTo(newActiveIndex, 0, false);
            }
        
        };
        s.removeAllSlides = function () {
            var slidesIndexes = [];
            for (var i = 0; i < s.slides.length; i++) {
                slidesIndexes.push(i);
            }
            s.removeSlide(slidesIndexes);
        };
        

        /*=========================
          Effects
          ===========================*/
        s.effects = {
            fade: {
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var offset = slide[0].swiperSlideOffset;
                        var tx = -offset;
                        if (!s.params.virtualTranslate) tx = tx - s.translate;
                        var ty = 0;
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                        }
                        var slideOpacity = s.params.fade.crossFade ?
                                Math.max(1 - Math.abs(slide[0].progress), 0) :
                                1 + Math.min(Math.max(slide[0].progress, -1), 0);
                        slide
                            .css({
                                opacity: slideOpacity
                            })
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
        
                    }
        
                },
                setTransition: function (duration) {
                    s.slides.transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var eventTriggered = false;
                        s.slides.transitionEnd(function () {
                            if (eventTriggered) return;
                            if (!s) return;
                            eventTriggered = true;
                            s.animating = false;
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            flip: {
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var progress = slide[0].progress;
                        if (s.params.flip.limitRotation) {
                            progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        }
                        var offset = slide[0].swiperSlideOffset;
                        var rotate = -180 * progress,
                            rotateY = rotate,
                            rotateX = 0,
                            tx = -offset,
                            ty = 0;
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                            rotateX = -rotateY;
                            rotateY = 0;
                        }
                        else if (s.rtl) {
                            rotateY = -rotateY;
                        }
        
                        slide[0].style.zIndex = -Math.abs(Math.round(progress)) + s.slides.length;
        
                        if (s.params.flip.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                        }
        
                        slide
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var eventTriggered = false;
                        s.slides.eq(s.activeIndex).transitionEnd(function () {
                            if (eventTriggered) return;
                            if (!s) return;
                            if (!$(this).hasClass(s.params.slideActiveClass)) return;
                            eventTriggered = true;
                            s.animating = false;
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            cube: {
                setTranslate: function () {
                    var wrapperRotate = 0, cubeShadow;
                    if (s.params.cube.shadow) {
                        if (s.isHorizontal()) {
                            cubeShadow = s.wrapper.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.wrapper.append(cubeShadow);
                            }
                            cubeShadow.css({height: s.width + 'px'});
                        }
                        else {
                            cubeShadow = s.container.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.container.append(cubeShadow);
                            }
                        }
                    }
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var slideAngle = i * 90;
                        var round = Math.floor(slideAngle / 360);
                        if (s.rtl) {
                            slideAngle = -slideAngle;
                            round = Math.floor(-slideAngle / 360);
                        }
                        var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        var tx = 0, ty = 0, tz = 0;
                        if (i % 4 === 0) {
                            tx = - round * 4 * s.size;
                            tz = 0;
                        }
                        else if ((i - 1) % 4 === 0) {
                            tx = 0;
                            tz = - round * 4 * s.size;
                        }
                        else if ((i - 2) % 4 === 0) {
                            tx = s.size + round * 4 * s.size;
                            tz = s.size;
                        }
                        else if ((i - 3) % 4 === 0) {
                            tx = - s.size;
                            tz = 3 * s.size + s.size * 4 * round;
                        }
                        if (s.rtl) {
                            tx = -tx;
                        }
        
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                        }
        
                        var transform = 'rotateX(' + (s.isHorizontal() ? 0 : -slideAngle) + 'deg) rotateY(' + (s.isHorizontal() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                        if (progress <= 1 && progress > -1) {
                            wrapperRotate = i * 90 + progress * 90;
                            if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
                        }
                        slide.transform(transform);
                        if (s.params.cube.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                        }
                    }
                    s.wrapper.css({
                        '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
                    });
        
                    if (s.params.cube.shadow) {
                        if (s.isHorizontal()) {
                            cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
                        }
                        else {
                            var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                            var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                            var scale1 = s.params.cube.shadowScale,
                                scale2 = s.params.cube.shadowScale / multiplier,
                                offset = s.params.cube.shadowOffset;
                            cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
                        }
                    }
                    var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
                    s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (s.isHorizontal() ? 0 : wrapperRotate) + 'deg) rotateY(' + (s.isHorizontal() ? -wrapperRotate : 0) + 'deg)');
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.cube.shadow && !s.isHorizontal()) {
                        s.container.find('.swiper-cube-shadow').transition(duration);
                    }
                }
            },
            coverflow: {
                setTranslate: function () {
                    var transform = s.translate;
                    var center = s.isHorizontal() ? -transform + s.width / 2 : -transform + s.height / 2;
                    var rotate = s.isHorizontal() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
                    var translate = s.params.coverflow.depth;
                    //Each slide offset from center
                    for (var i = 0, length = s.slides.length; i < length; i++) {
                        var slide = s.slides.eq(i);
                        var slideSize = s.slidesSizesGrid[i];
                        var slideOffset = slide[0].swiperSlideOffset;
                        var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;
        
                        var rotateY = s.isHorizontal() ? rotate * offsetMultiplier : 0;
                        var rotateX = s.isHorizontal() ? 0 : rotate * offsetMultiplier;
                        // var rotateZ = 0
                        var translateZ = -translate * Math.abs(offsetMultiplier);
        
                        var translateY = s.isHorizontal() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
                        var translateX = s.isHorizontal() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;
        
                        //Fix for ultra small values
                        if (Math.abs(translateX) < 0.001) translateX = 0;
                        if (Math.abs(translateY) < 0.001) translateY = 0;
                        if (Math.abs(translateZ) < 0.001) translateZ = 0;
                        if (Math.abs(rotateY) < 0.001) rotateY = 0;
                        if (Math.abs(rotateX) < 0.001) rotateX = 0;
        
                        var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        
                        slide.transform(slideTransform);
                        slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                        if (s.params.coverflow.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                            if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                        }
                    }
        
                    //Set correct perspective for IE10
                    if (s.browser.ie) {
                        var ws = s.wrapper[0].style;
                        ws.perspectiveOrigin = center + 'px 50%';
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                }
            }
        };

        /*=========================
          Images Lazy Loading
          ===========================*/
        s.lazy = {
            initialImageLoaded: false,
            loadImageInSlide: function (index, loadInDuplicate) {
                if (typeof index === 'undefined') return;
                if (typeof loadInDuplicate === 'undefined') loadInDuplicate = true;
                if (s.slides.length === 0) return;
        
                var slide = s.slides.eq(index);
                var img = slide.find('.' + s.params.lazyLoadingClass + ':not(.' + s.params.lazyStatusLoadedClass + '):not(.' + s.params.lazyStatusLoadingClass + ')');
                if (slide.hasClass(s.params.lazyLoadingClass) && !slide.hasClass(s.params.lazyStatusLoadedClass) && !slide.hasClass(s.params.lazyStatusLoadingClass)) {
                    img = img.add(slide[0]);
                }
                if (img.length === 0) return;
        
                img.each(function () {
                    var _img = $(this);
                    _img.addClass(s.params.lazyStatusLoadingClass);
                    var background = _img.attr('data-background');
                    var src = _img.attr('data-src'),
                        srcset = _img.attr('data-srcset'),
                        sizes = _img.attr('data-sizes');
                    s.loadImage(_img[0], (src || background), srcset, sizes, false, function () {
                        if (background) {
                            _img.css('background-image', 'url("' + background + '")');
                            _img.removeAttr('data-background');
                        }
                        else {
                            if (srcset) {
                                _img.attr('srcset', srcset);
                                _img.removeAttr('data-srcset');
                            }
                            if (sizes) {
                                _img.attr('sizes', sizes);
                                _img.removeAttr('data-sizes');
                            }
                            if (src) {
                                _img.attr('src', src);
                                _img.removeAttr('data-src');
                            }
        
                        }
        
                        _img.addClass(s.params.lazyStatusLoadedClass).removeClass(s.params.lazyStatusLoadingClass);
                        slide.find('.' + s.params.lazyPreloaderClass + ', .' + s.params.preloaderClass).remove();
                        if (s.params.loop && loadInDuplicate) {
                            var slideOriginalIndex = slide.attr('data-swiper-slide-index');
                            if (slide.hasClass(s.params.slideDuplicateClass)) {
                                var originalSlide = s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');
                                s.lazy.loadImageInSlide(originalSlide.index(), false);
                            }
                            else {
                                var duplicatedSlide = s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
                                s.lazy.loadImageInSlide(duplicatedSlide.index(), false);
                            }
                        }
                        s.emit('onLazyImageReady', s, slide[0], _img[0]);
                    });
        
                    s.emit('onLazyImageLoad', s, slide[0], _img[0]);
                });
        
            },
            load: function () {
                var i;
                var slidesPerView = s.params.slidesPerView;
                if (slidesPerView === 'auto') {
                    slidesPerView = 0;
                }
                if (!s.lazy.initialImageLoaded) s.lazy.initialImageLoaded = true;
                if (s.params.watchSlidesVisibility) {
                    s.wrapper.children('.' + s.params.slideVisibleClass).each(function () {
                        s.lazy.loadImageInSlide($(this).index());
                    });
                }
                else {
                    if (slidesPerView > 1) {
                        for (i = s.activeIndex; i < s.activeIndex + slidesPerView ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        s.lazy.loadImageInSlide(s.activeIndex);
                    }
                }
                if (s.params.lazyLoadingInPrevNext) {
                    if (slidesPerView > 1 || (s.params.lazyLoadingInPrevNextAmount && s.params.lazyLoadingInPrevNextAmount > 1)) {
                        var amount = s.params.lazyLoadingInPrevNextAmount;
                        var spv = slidesPerView;
                        var maxIndex = Math.min(s.activeIndex + spv + Math.max(amount, spv), s.slides.length);
                        var minIndex = Math.max(s.activeIndex - Math.max(spv, amount), 0);
                        // Next Slides
                        for (i = s.activeIndex + slidesPerView; i < maxIndex; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                        // Prev Slides
                        for (i = minIndex; i < s.activeIndex ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        var nextSlide = s.wrapper.children('.' + s.params.slideNextClass);
                        if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());
        
                        var prevSlide = s.wrapper.children('.' + s.params.slidePrevClass);
                        if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index());
                    }
                }
            },
            onTransitionStart: function () {
                if (s.params.lazyLoading) {
                    if (s.params.lazyLoadingOnTransitionStart || (!s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded)) {
                        s.lazy.load();
                    }
                }
            },
            onTransitionEnd: function () {
                if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
                    s.lazy.load();
                }
            }
        };
        

        /*=========================
          Scrollbar
          ===========================*/
        s.scrollbar = {
            isTouched: false,
            setDragPosition: function (e) {
                var sb = s.scrollbar;
                var x = 0, y = 0;
                var translate;
                var pointerPosition = s.isHorizontal() ?
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageX : e.pageX || e.clientX) :
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageY : e.pageY || e.clientY) ;
                var position = (pointerPosition) - sb.track.offset()[s.isHorizontal() ? 'left' : 'top'] - sb.dragSize / 2;
                var positionMin = -s.minTranslate() * sb.moveDivider;
                var positionMax = -s.maxTranslate() * sb.moveDivider;
                if (position < positionMin) {
                    position = positionMin;
                }
                else if (position > positionMax) {
                    position = positionMax;
                }
                position = -position / sb.moveDivider;
                s.updateProgress(position);
                s.setWrapperTranslate(position, true);
            },
            dragStart: function (e) {
                var sb = s.scrollbar;
                sb.isTouched = true;
                e.preventDefault();
                e.stopPropagation();
        
                sb.setDragPosition(e);
                clearTimeout(sb.dragTimeout);
        
                sb.track.transition(0);
                if (s.params.scrollbarHide) {
                    sb.track.css('opacity', 1);
                }
                s.wrapper.transition(100);
                sb.drag.transition(100);
                s.emit('onScrollbarDragStart', s);
            },
            dragMove: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
                sb.setDragPosition(e);
                s.wrapper.transition(0);
                sb.track.transition(0);
                sb.drag.transition(0);
                s.emit('onScrollbarDragMove', s);
            },
            dragEnd: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                sb.isTouched = false;
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.dragTimeout);
                    sb.dragTimeout = setTimeout(function () {
                        sb.track.css('opacity', 0);
                        sb.track.transition(400);
                    }, 1000);
        
                }
                s.emit('onScrollbarDragEnd', s);
                if (s.params.scrollbarSnapOnRelease) {
                    s.slideReset();
                }
            },
            draggableEvents: (function () {
                if ((s.params.simulateTouch === false && !s.support.touch)) return s.touchEventsDesktop;
                else return s.touchEvents;
            })(),
            enableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).on(sb.draggableEvents.start, sb.dragStart);
                $(target).on(sb.draggableEvents.move, sb.dragMove);
                $(target).on(sb.draggableEvents.end, sb.dragEnd);
            },
            disableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).off(s.draggableEvents.start, sb.dragStart);
                $(target).off(s.draggableEvents.move, sb.dragMove);
                $(target).off(s.draggableEvents.end, sb.dragEnd);
            },
            set: function () {
                if (!s.params.scrollbar) return;
                var sb = s.scrollbar;
                sb.track = $(s.params.scrollbar);
                if (s.params.uniqueNavElements && typeof s.params.scrollbar === 'string' && sb.track.length > 1 && s.container.find(s.params.scrollbar).length === 1) {
                    sb.track = s.container.find(s.params.scrollbar);
                }
                sb.drag = sb.track.find('.swiper-scrollbar-drag');
                if (sb.drag.length === 0) {
                    sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                    sb.track.append(sb.drag);
                }
                sb.drag[0].style.width = '';
                sb.drag[0].style.height = '';
                sb.trackSize = s.isHorizontal() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;
        
                sb.divider = s.size / s.virtualSize;
                sb.moveDivider = sb.divider * (sb.trackSize / s.size);
                sb.dragSize = sb.trackSize * sb.divider;
        
                if (s.isHorizontal()) {
                    sb.drag[0].style.width = sb.dragSize + 'px';
                }
                else {
                    sb.drag[0].style.height = sb.dragSize + 'px';
                }
        
                if (sb.divider >= 1) {
                    sb.track[0].style.display = 'none';
                }
                else {
                    sb.track[0].style.display = '';
                }
                if (s.params.scrollbarHide) {
                    sb.track[0].style.opacity = 0;
                }
            },
            setTranslate: function () {
                if (!s.params.scrollbar) return;
                var diff;
                var sb = s.scrollbar;
                var translate = s.translate || 0;
                var newPos;
        
                var newSize = sb.dragSize;
                newPos = (sb.trackSize - sb.dragSize) * s.progress;
                if (s.rtl && s.isHorizontal()) {
                    newPos = -newPos;
                    if (newPos > 0) {
                        newSize = sb.dragSize - newPos;
                        newPos = 0;
                    }
                    else if (-newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize + newPos;
                    }
                }
                else {
                    if (newPos < 0) {
                        newSize = sb.dragSize + newPos;
                        newPos = 0;
                    }
                    else if (newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize - newPos;
                    }
                }
                if (s.isHorizontal()) {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
                    }
                    else {
                        sb.drag.transform('translateX(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.width = newSize + 'px';
                }
                else {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
                    }
                    else {
                        sb.drag.transform('translateY(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.height = newSize + 'px';
                }
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.timeout);
                    sb.track[0].style.opacity = 1;
                    sb.timeout = setTimeout(function () {
                        sb.track[0].style.opacity = 0;
                        sb.track.transition(400);
                    }, 1000);
                }
            },
            setTransition: function (duration) {
                if (!s.params.scrollbar) return;
                s.scrollbar.drag.transition(duration);
            }
        };

        /*=========================
          Controller
          ===========================*/
        s.controller = {
            LinearSpline: function (x, y) {
                this.x = x;
                this.y = y;
                this.lastIndex = x.length - 1;
                // Given an x value (x2), return the expected y2 value:
                // (x1,y1) is the known point before given value,
                // (x3,y3) is the known point after given value.
                var i1, i3;
                var l = this.x.length;
        
                this.interpolate = function (x2) {
                    if (!x2) return 0;
        
                    // Get the indexes of x1 and x3 (the array indexes before and after given x2):
                    i3 = binarySearch(this.x, x2);
                    i1 = i3 - 1;
        
                    // We have our indexes i1 & i3, so we can calculate already:
                    // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
                    return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
                };
        
                var binarySearch = (function() {
                    var maxIndex, minIndex, guess;
                    return function(array, val) {
                        minIndex = -1;
                        maxIndex = array.length;
                        while (maxIndex - minIndex > 1)
                            if (array[guess = maxIndex + minIndex >> 1] <= val) {
                                minIndex = guess;
                            } else {
                                maxIndex = guess;
                            }
                        return maxIndex;
                    };
                })();
            },
            //xxx: for now i will just save one spline function to to
            getInterpolateFunction: function(c){
                if(!s.controller.spline) s.controller.spline = s.params.loop ?
                    new s.controller.LinearSpline(s.slidesGrid, c.slidesGrid) :
                    new s.controller.LinearSpline(s.snapGrid, c.snapGrid);
            },
            setTranslate: function (translate, byController) {
               var controlled = s.params.control;
               var multiplier, controlledTranslate;
               function setControlledTranslate(c) {
                    // this will create an Interpolate function based on the snapGrids
                    // x is the Grid of the scrolled scroller and y will be the controlled scroller
                    // it makes sense to create this only once and recall it for the interpolation
                    // the function does a lot of value caching for performance
                    translate = c.rtl && c.params.direction === 'horizontal' ? -s.translate : s.translate;
                    if (s.params.controlBy === 'slide') {
                        s.controller.getInterpolateFunction(c);
                        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
                        // but it did not work out
                        controlledTranslate = -s.controller.spline.interpolate(-translate);
                    }
        
                    if(!controlledTranslate || s.params.controlBy === 'container'){
                        multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                        controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();
                    }
        
                    if (s.params.controlInverse) {
                        controlledTranslate = c.maxTranslate() - controlledTranslate;
                    }
                    c.updateProgress(controlledTranslate);
                    c.setWrapperTranslate(controlledTranslate, false, s);
                    c.updateActiveIndex();
               }
               if (s.isArray(controlled)) {
                   for (var i = 0; i < controlled.length; i++) {
                       if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                           setControlledTranslate(controlled[i]);
                       }
                   }
               }
               else if (controlled instanceof Swiper && byController !== controlled) {
        
                   setControlledTranslate(controlled);
               }
            },
            setTransition: function (duration, byController) {
                var controlled = s.params.control;
                var i;
                function setControlledTransition(c) {
                    c.setWrapperTransition(duration, s);
                    if (duration !== 0) {
                        c.onTransitionStart();
                        c.wrapper.transitionEnd(function(){
                            if (!controlled) return;
                            if (c.params.loop && s.params.controlBy === 'slide') {
                                c.fixLoop();
                            }
                            c.onTransitionEnd();
        
                        });
                    }
                }
                if (s.isArray(controlled)) {
                    for (i = 0; i < controlled.length; i++) {
                        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                            setControlledTransition(controlled[i]);
                        }
                    }
                }
                else if (controlled instanceof Swiper && byController !== controlled) {
                    setControlledTransition(controlled);
                }
            }
        };

        /*=========================
          Hash Navigation
          ===========================*/
        s.hashnav = {
            onHashCange: function (e, a) {
                var newHash = document.location.hash.replace('#', '');
                var activeSlideHash = s.slides.eq(s.activeIndex).attr('data-hash');
                if (newHash !== activeSlideHash) {
                    s.slideTo(s.wrapper.children('.' + s.params.slideClass + '[data-hash="' + (newHash) + '"]').index());
                }
            },
            attachEvents: function (detach) {
                var action = detach ? 'off' : 'on';
                $(window)[action]('hashchange', s.hashnav.onHashCange);
            },
            setHash: function () {
                if (!s.hashnav.initialized || !s.params.hashnav) return;
                if (s.params.replaceState && window.history && window.history.replaceState) {
                    window.history.replaceState(null, null, ('#' + s.slides.eq(s.activeIndex).attr('data-hash') || ''));
                } else {
                    var slide = s.slides.eq(s.activeIndex);
                    var hash = slide.attr('data-hash') || slide.attr('data-history');
                    document.location.hash = hash || '';
                }
            },
            init: function () {
                if (!s.params.hashnav || s.params.history) return;
                s.hashnav.initialized = true;
                var hash = document.location.hash.replace('#', '');
                if (!hash) return;
                var speed = 0;
                for (var i = 0, length = s.slides.length; i < length; i++) {
                    var slide = s.slides.eq(i);
                    var slideHash = slide.attr('data-hash') || slide.attr('data-history');
                    if (slideHash === hash && !slide.hasClass(s.params.slideDuplicateClass)) {
                        var index = slide.index();
                        s.slideTo(index, speed, s.params.runCallbacksOnInit, true);
                    }
                }
                if (s.params.hashnavWatchState) s.hashnav.attachEvents();
            },
            destroy: function () {
                if (s.params.hashnavWatchState) s.hashnav.attachEvents(true);
            }
        };

        /*=========================
          History Api with fallback to Hashnav
          ===========================*/
        s.history = {
            init: function () {
                if (!s.params.history) return;
                if (!window.history || !window.history.pushState) {
                    s.params.history = false;
                    s.params.hashnav = true;
                    return;
                }
                s.history.initialized = true;
                this.paths = this.getPathValues();
                if (!this.paths.key && !this.paths.value) return;
                this.scrollToSlide(0, this.paths.value, s.params.runCallbacksOnInit);
                if (!s.params.replaceState) {
                    window.addEventListener('popstate', this.setHistoryPopState);
                }
            },
            setHistoryPopState: function() {
                s.history.paths = s.history.getPathValues();
                s.history.scrollToSlide(s.params.speed, s.history.paths.value, false);
            },
            getPathValues: function() {
                var pathArray = window.location.pathname.slice(1).split('/');
                var total = pathArray.length;
                var key = pathArray[total - 2];
                var value = pathArray[total - 1];
                return { key: key, value: value };
            },
            setHistory: function (key, index) {
                if (!s.history.initialized || !s.params.history) return;
                var slide = s.slides.eq(index);
                var value = this.slugify(slide.attr('data-history'));
                if (!window.location.pathname.includes(key)) {
                    value = key + '/' + value;
                }
                if (s.params.replaceState) {
                    window.history.replaceState(null, null, value);
                } else {
                    window.history.pushState(null, null, value);
                }
            },
            slugify: function(text) {
                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
            },
            scrollToSlide: function(speed, value, runCallbacks) {
                if (value) {
                    for (var i = 0, length = s.slides.length; i < length; i++) {
                        var slide = s.slides.eq(i);
                        var slideHistory = this.slugify(slide.attr('data-history'));
                        if (slideHistory === value && !slide.hasClass(s.params.slideDuplicateClass)) {
                            var index = slide.index();
                            s.slideTo(index, speed, runCallbacks);
                        }
                    }
                } else {
                    s.slideTo(0, speed, runCallbacks);
                }
            }
        };

        /*=========================
          Keyboard Control
          ===========================*/
        function handleKeyboard(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var kc = e.keyCode || e.charCode;
            // Directions locks
            if (!s.params.allowSwipeToNext && (s.isHorizontal() && kc === 39 || !s.isHorizontal() && kc === 40)) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && (s.isHorizontal() && kc === 37 || !s.isHorizontal() && kc === 38)) {
                return false;
            }
            if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
                return;
            }
            if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
                return;
            }
            if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
                var inView = false;
                //Check that swiper should be inside of visible area of window
                if (s.container.parents('.' + s.params.slideClass).length > 0 && s.container.parents('.' + s.params.slideActiveClass).length === 0) {
                    return;
                }
                var windowScroll = {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                };
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var swiperOffset = s.container.offset();
                if (s.rtl) swiperOffset.left = swiperOffset.left - s.container[0].scrollLeft;
                var swiperCoord = [
                    [swiperOffset.left, swiperOffset.top],
                    [swiperOffset.left + s.width, swiperOffset.top],
                    [swiperOffset.left, swiperOffset.top + s.height],
                    [swiperOffset.left + s.width, swiperOffset.top + s.height]
                ];
                for (var i = 0; i < swiperCoord.length; i++) {
                    var point = swiperCoord[i];
                    if (
                        point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
                        point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight
                    ) {
                        inView = true;
                    }
        
                }
                if (!inView) return;
            }
            if (s.isHorizontal()) {
                if (kc === 37 || kc === 39) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if ((kc === 39 && !s.rtl) || (kc === 37 && s.rtl)) s.slideNext();
                if ((kc === 37 && !s.rtl) || (kc === 39 && s.rtl)) s.slidePrev();
            }
            else {
                if (kc === 38 || kc === 40) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if (kc === 40) s.slideNext();
                if (kc === 38) s.slidePrev();
            }
        }
        s.disableKeyboardControl = function () {
            s.params.keyboardControl = false;
            $(document).off('keydown', handleKeyboard);
        };
        s.enableKeyboardControl = function () {
            s.params.keyboardControl = true;
            $(document).on('keydown', handleKeyboard);
        };
        

        /*=========================
          Mousewheel Control
          ===========================*/
        s.mousewheel = {
            event: false,
            lastScrollTime: (new window.Date()).getTime()
        };
        if (s.params.mousewheelControl) {
            /**
             * The best combination if you prefer spinX + spinY normalization.  It favors
             * the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
             * 'wheel' event, making spin speed determination impossible.
             */
            s.mousewheel.event = (navigator.userAgent.indexOf('firefox') > -1) ?
                'DOMMouseScroll' :
                isEventSupported() ?
                    'wheel' : 'mousewheel';
        }
        
        function isEventSupported() {
            var eventName = 'onwheel';
            var isSupported = eventName in document;
        
            if (!isSupported) {
                var element = document.createElement('div');
                element.setAttribute(eventName, 'return;');
                isSupported = typeof element[eventName] === 'function';
            }
        
            if (!isSupported &&
                document.implementation &&
                document.implementation.hasFeature &&
                    // always returns true in newer browsers as per the standard.
                    // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
                document.implementation.hasFeature('', '') !== true ) {
                // This is the only way to test support for the `wheel` event in IE9+.
                isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
            }
        
            return isSupported;
        }
        
        function handleMousewheel(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var delta = 0;
            var rtlFactor = s.rtl ? -1 : 1;
        
            var data = normalizeWheel( e );
        
            if (s.params.mousewheelForceToAxis) {
                if (s.isHorizontal()) {
                    if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = data.pixelX * rtlFactor;
                    else return;
                }
                else {
                    if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = data.pixelY;
                    else return;
                }
            }
            else {
                delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? - data.pixelX * rtlFactor : - data.pixelY;
            }
        
            if (delta === 0) return;
        
            if (s.params.mousewheelInvert) delta = -delta;
        
            if (!s.params.freeMode) {
                if ((new window.Date()).getTime() - s.mousewheel.lastScrollTime > 60) {
                    if (delta < 0) {
                        if ((!s.isEnd || s.params.loop) && !s.animating) {
                            s.slideNext();
                            s.emit('onScroll', s, e);
                        }
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                    else {
                        if ((!s.isBeginning || s.params.loop) && !s.animating) {
                            s.slidePrev();
                            s.emit('onScroll', s, e);
                        }
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                }
                s.mousewheel.lastScrollTime = (new window.Date()).getTime();
        
            }
            else {
                //Freemode or scrollContainer:
                var position = s.getWrapperTranslate() + delta * s.params.mousewheelSensitivity;
                var wasBeginning = s.isBeginning,
                    wasEnd = s.isEnd;
        
                if (position >= s.minTranslate()) position = s.minTranslate();
                if (position <= s.maxTranslate()) position = s.maxTranslate();
        
                s.setWrapperTransition(0);
                s.setWrapperTranslate(position);
                s.updateProgress();
                s.updateActiveIndex();
        
                if (!wasBeginning && s.isBeginning || !wasEnd && s.isEnd) {
                    s.updateClasses();
                }
        
                if (s.params.freeModeSticky) {
                    clearTimeout(s.mousewheel.timeout);
                    s.mousewheel.timeout = setTimeout(function () {
                        s.slideReset();
                    }, 300);
                }
                else {
                    if (s.params.lazyLoading && s.lazy) {
                        s.lazy.load();
                    }
                }
                // Emit event
                s.emit('onScroll', s, e);
        
                // Stop autoplay
                if (s.params.autoplay && s.params.autoplayDisableOnInteraction) s.stopAutoplay();
        
                // Return page scroll on edge positions
                if (position === 0 || position === s.maxTranslate()) return;
            }
        
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }
        s.disableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            var target = s.container;
            if (s.params.mousewheelEventsTarged !== 'container') {
                target = $(s.params.mousewheelEventsTarged);
            }
            target.off(s.mousewheel.event, handleMousewheel);
            return true;
        };
        
        s.enableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            var target = s.container;
            if (s.params.mousewheelEventsTarged !== 'container') {
                target = $(s.params.mousewheelEventsTarged);
            }
            target.on(s.mousewheel.event, handleMousewheel);
            return true;
        };
        
        /**
         * Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
         * complicated, thus this doc is long and (hopefully) detailed enough to answer
         * your questions.
         *
         * If you need to react to the mouse wheel in a predictable way, this code is
         * like your bestest friend. * hugs *
         *
         * As of today, there are 4 DOM event types you can listen to:
         *
         *   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
         *   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
         *   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
         *   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
         *
         * So what to do?  The is the best:
         *
         *   normalizeWheel.getEventType();
         *
         * In your event callback, use this code to get sane interpretation of the
         * deltas.  This code will return an object with properties:
         *
         *   spinX   -- normalized spin speed (use for zoom) - x plane
         *   spinY   -- " - y plane
         *   pixelX  -- normalized distance (to pixels) - x plane
         *   pixelY  -- " - y plane
         *
         * Wheel values are provided by the browser assuming you are using the wheel to
         * scroll a web page by a number of lines or pixels (or pages).  Values can vary
         * significantly on different platforms and browsers, forgetting that you can
         * scroll at different speeds.  Some devices (like trackpads) emit more events
         * at smaller increments with fine granularity, and some emit massive jumps with
         * linear speed or acceleration.
         *
         * This code does its best to normalize the deltas for you:
         *
         *   - spin is trying to normalize how far the wheel was spun (or trackpad
         *     dragged).  This is super useful for zoom support where you want to
         *     throw away the chunky scroll steps on the PC and make those equal to
         *     the slow and smooth tiny steps on the Mac. Key data: This code tries to
         *     resolve a single slow step on a wheel to 1.
         *
         *   - pixel is normalizing the desired scroll delta in pixel units.  You'll
         *     get the crazy differences between browsers, but at least it'll be in
         *     pixels!
         *
         *   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
         *     should translate to positive value zooming IN, negative zooming OUT.
         *     This matches the newer 'wheel' event.
         *
         * Why are there spinX, spinY (or pixels)?
         *
         *   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
         *     with a mouse.  It results in side-scrolling in the browser by default.
         *
         *   - spinY is what you expect -- it's the classic axis of a mouse wheel.
         *
         *   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
         *     probably is by browsers in conjunction with fancy 3D controllers .. but
         *     you know.
         *
         * Implementation info:
         *
         * Examples of 'wheel' event if you scroll slowly (down) by one step with an
         * average mouse:
         *
         *   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
         *   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
         *   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
         *   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
         *   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
         *
         * On the trackpad:
         *
         *   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
         *   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
         *
         * On other/older browsers.. it's more complicated as there can be multiple and
         * also missing delta values.
         *
         * The 'wheel' event is more standard:
         *
         * http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
         *
         * The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
         * deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
         * backward compatibility with older events.  Those other values help us
         * better normalize spin speed.  Example of what the browsers provide:
         *
         *                          | event.wheelDelta | event.detail
         *        ------------------+------------------+--------------
         *          Safari v5/OS X  |       -120       |       0
         *          Safari v5/Win7  |       -120       |       0
         *         Chrome v17/OS X  |       -120       |       0
         *         Chrome v17/Win7  |       -120       |       0
         *                IE9/Win7  |       -120       |   undefined
         *         Firefox v4/OS X  |     undefined    |       1
         *         Firefox v4/Win7  |     undefined    |       3
         *
         */
        function normalizeWheel( /*object*/ event ) /*object*/ {
            // Reasonable defaults
            var PIXEL_STEP = 10;
            var LINE_HEIGHT = 40;
            var PAGE_HEIGHT = 800;
        
            var sX = 0, sY = 0,       // spinX, spinY
                pX = 0, pY = 0;       // pixelX, pixelY
        
            // Legacy
            if( 'detail' in event ) {
                sY = event.detail;
            }
            if( 'wheelDelta' in event ) {
                sY = -event.wheelDelta / 120;
            }
            if( 'wheelDeltaY' in event ) {
                sY = -event.wheelDeltaY / 120;
            }
            if( 'wheelDeltaX' in event ) {
                sX = -event.wheelDeltaX / 120;
            }
        
            // side scrolling on FF with DOMMouseScroll
            if( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
                sX = sY;
                sY = 0;
            }
        
            pX = sX * PIXEL_STEP;
            pY = sY * PIXEL_STEP;
        
            if( 'deltaY' in event ) {
                pY = event.deltaY;
            }
            if( 'deltaX' in event ) {
                pX = event.deltaX;
            }
        
            if( (pX || pY) && event.deltaMode ) {
                if( event.deltaMode === 1 ) {          // delta in LINE units
                    pX *= LINE_HEIGHT;
                    pY *= LINE_HEIGHT;
                } else {                             // delta in PAGE units
                    pX *= PAGE_HEIGHT;
                    pY *= PAGE_HEIGHT;
                }
            }
        
            // Fall-back if spin cannot be determined
            if( pX && !sX ) {
                sX = (pX < 1) ? -1 : 1;
            }
            if( pY && !sY ) {
                sY = (pY < 1) ? -1 : 1;
            }
        
            return {
                spinX: sX,
                spinY: sY,
                pixelX: pX,
                pixelY: pY
            };
        }

        /*=========================
          Parallax
          ===========================*/
        function setParallaxTransform(el, progress) {
            el = $(el);
            var p, pX, pY;
            var rtlFactor = s.rtl ? -1 : 1;
        
            p = el.attr('data-swiper-parallax') || '0';
            pX = el.attr('data-swiper-parallax-x');
            pY = el.attr('data-swiper-parallax-y');
            if (pX || pY) {
                pX = pX || '0';
                pY = pY || '0';
            }
            else {
                if (s.isHorizontal()) {
                    pX = p;
                    pY = '0';
                }
                else {
                    pY = p;
                    pX = '0';
                }
            }
        
            if ((pX).indexOf('%') >= 0) {
                pX = parseInt(pX, 10) * progress * rtlFactor + '%';
            }
            else {
                pX = pX * progress * rtlFactor + 'px' ;
            }
            if ((pY).indexOf('%') >= 0) {
                pY = parseInt(pY, 10) * progress + '%';
            }
            else {
                pY = pY * progress + 'px' ;
            }
        
            el.transform('translate3d(' + pX + ', ' + pY + ',0px)');
        }
        s.parallax = {
            setTranslate: function () {
                s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    setParallaxTransform(this, s.progress);
        
                });
                s.slides.each(function () {
                    var slide = $(this);
                    slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function () {
                        var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                        setParallaxTransform(this, progress);
                    });
                });
            },
            setTransition: function (duration) {
                if (typeof duration === 'undefined') duration = s.params.speed;
                s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    var el = $(this);
                    var parallaxDuration = parseInt(el.attr('data-swiper-parallax-duration'), 10) || duration;
                    if (duration === 0) parallaxDuration = 0;
                    el.transition(parallaxDuration);
                });
            }
        };
        

        /*=========================
          Zoom
          ===========================*/
        s.zoom = {
            // "Global" Props
            scale: 1,
            currentScale: 1,
            isScaling: false,
            gesture: {
                slide: undefined,
                slideWidth: undefined,
                slideHeight: undefined,
                image: undefined,
                imageWrap: undefined,
                zoomMax: s.params.zoomMax
            },
            image: {
                isTouched: undefined,
                isMoved: undefined,
                currentX: undefined,
                currentY: undefined,
                minX: undefined,
                minY: undefined,
                maxX: undefined,
                maxY: undefined,
                width: undefined,
                height: undefined,
                startX: undefined,
                startY: undefined,
                touchesStart: {},
                touchesCurrent: {}
            },
            velocity: {
                x: undefined,
                y: undefined,
                prevPositionX: undefined,
                prevPositionY: undefined,
                prevTime: undefined
            },
            // Calc Scale From Multi-touches
            getDistanceBetweenTouches: function (e) {
                if (e.targetTouches.length < 2) return 1;
                var x1 = e.targetTouches[0].pageX,
                    y1 = e.targetTouches[0].pageY,
                    x2 = e.targetTouches[1].pageX,
                    y2 = e.targetTouches[1].pageY;
                var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                return distance;
            },
            // Events
            onGestureStart: function (e) {
                var z = s.zoom;
                if (!s.support.gestures) {
                    if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
                        return;
                    }
                    z.gesture.scaleStart = z.getDistanceBetweenTouches(e);
                }
                if (!z.gesture.slide || !z.gesture.slide.length) {
                    z.gesture.slide = $(this);
                    if (z.gesture.slide.length === 0) z.gesture.slide = s.slides.eq(s.activeIndex);
                    z.gesture.image = z.gesture.slide.find('img, svg, canvas');
                    z.gesture.imageWrap = z.gesture.image.parent('.' + s.params.zoomContainerClass);
                    z.gesture.zoomMax = z.gesture.imageWrap.attr('data-swiper-zoom') || s.params.zoomMax ;
                    if (z.gesture.imageWrap.length === 0) {
                        z.gesture.image = undefined;
                        return;
                    }
                }
                z.gesture.image.transition(0);
                z.isScaling = true;
            },
            onGestureChange: function (e) {
                var z = s.zoom;
                if (!s.support.gestures) {
                    if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
                        return;
                    }
                    z.gesture.scaleMove = z.getDistanceBetweenTouches(e);
                }
                if (!z.gesture.image || z.gesture.image.length === 0) return;
                if (s.support.gestures) {
                    z.scale = e.scale * z.currentScale;
                }
                else {
                    z.scale = (z.gesture.scaleMove / z.gesture.scaleStart) * z.currentScale;
                }
                if (z.scale > z.gesture.zoomMax) {
                    z.scale = z.gesture.zoomMax - 1 + Math.pow((z.scale - z.gesture.zoomMax + 1), 0.5);
                }
                if (z.scale < s.params.zoomMin) {
                    z.scale =  s.params.zoomMin + 1 - Math.pow((s.params.zoomMin - z.scale + 1), 0.5);
                }
                z.gesture.image.transform('translate3d(0,0,0) scale(' + z.scale + ')');
            },
            onGestureEnd: function (e) {
                var z = s.zoom;
                if (!s.support.gestures) {
                    if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2) {
                        return;
                    }
                }
                if (!z.gesture.image || z.gesture.image.length === 0) return;
                z.scale = Math.max(Math.min(z.scale, z.gesture.zoomMax), s.params.zoomMin);
                z.gesture.image.transition(s.params.speed).transform('translate3d(0,0,0) scale(' + z.scale + ')');
                z.currentScale = z.scale;
                z.isScaling = false;
                if (z.scale === 1) z.gesture.slide = undefined;
            },
            onTouchStart: function (s, e) {
                var z = s.zoom;
                if (!z.gesture.image || z.gesture.image.length === 0) return;
                if (z.image.isTouched) return;
                if (s.device.os === 'android') e.preventDefault();
                z.image.isTouched = true;
                z.image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                z.image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            },
            onTouchMove: function (e) {
                var z = s.zoom;
                if (!z.gesture.image || z.gesture.image.length === 0) return;
                s.allowClick = false;
                if (!z.image.isTouched || !z.gesture.slide) return;
        
                if (!z.image.isMoved) {
                    z.image.width = z.gesture.image[0].offsetWidth;
                    z.image.height = z.gesture.image[0].offsetHeight;
                    z.image.startX = s.getTranslate(z.gesture.imageWrap[0], 'x') || 0;
                    z.image.startY = s.getTranslate(z.gesture.imageWrap[0], 'y') || 0;
                    z.gesture.slideWidth = z.gesture.slide[0].offsetWidth;
                    z.gesture.slideHeight = z.gesture.slide[0].offsetHeight;
                    z.gesture.imageWrap.transition(0);
                    if (s.rtl) z.image.startX = -z.image.startX;
                    if (s.rtl) z.image.startY = -z.image.startY;
                }
                // Define if we need image drag
                var scaledWidth = z.image.width * z.scale;
                var scaledHeight = z.image.height * z.scale;
        
                if (scaledWidth < z.gesture.slideWidth && scaledHeight < z.gesture.slideHeight) return;
        
                z.image.minX = Math.min((z.gesture.slideWidth / 2 - scaledWidth / 2), 0);
                z.image.maxX = -z.image.minX;
                z.image.minY = Math.min((z.gesture.slideHeight / 2 - scaledHeight / 2), 0);
                z.image.maxY = -z.image.minY;
        
                z.image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                z.image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        
                if (!z.image.isMoved && !z.isScaling) {
                    if (s.isHorizontal() &&
                        (Math.floor(z.image.minX) === Math.floor(z.image.startX) && z.image.touchesCurrent.x < z.image.touchesStart.x) ||
                        (Math.floor(z.image.maxX) === Math.floor(z.image.startX) && z.image.touchesCurrent.x > z.image.touchesStart.x)
                        ) {
                        z.image.isTouched = false;
                        return;
                    }
                    else if (!s.isHorizontal() &&
                        (Math.floor(z.image.minY) === Math.floor(z.image.startY) && z.image.touchesCurrent.y < z.image.touchesStart.y) ||
                        (Math.floor(z.image.maxY) === Math.floor(z.image.startY) && z.image.touchesCurrent.y > z.image.touchesStart.y)
                        ) {
                        z.image.isTouched = false;
                        return;
                    }
                }
                e.preventDefault();
                e.stopPropagation();
        
                z.image.isMoved = true;
                z.image.currentX = z.image.touchesCurrent.x - z.image.touchesStart.x + z.image.startX;
                z.image.currentY = z.image.touchesCurrent.y - z.image.touchesStart.y + z.image.startY;
        
                if (z.image.currentX < z.image.minX) {
                    z.image.currentX =  z.image.minX + 1 - Math.pow((z.image.minX - z.image.currentX + 1), 0.8);
                }
                if (z.image.currentX > z.image.maxX) {
                    z.image.currentX = z.image.maxX - 1 + Math.pow((z.image.currentX - z.image.maxX + 1), 0.8);
                }
        
                if (z.image.currentY < z.image.minY) {
                    z.image.currentY =  z.image.minY + 1 - Math.pow((z.image.minY - z.image.currentY + 1), 0.8);
                }
                if (z.image.currentY > z.image.maxY) {
                    z.image.currentY = z.image.maxY - 1 + Math.pow((z.image.currentY - z.image.maxY + 1), 0.8);
                }
        
                //Velocity
                if (!z.velocity.prevPositionX) z.velocity.prevPositionX = z.image.touchesCurrent.x;
                if (!z.velocity.prevPositionY) z.velocity.prevPositionY = z.image.touchesCurrent.y;
                if (!z.velocity.prevTime) z.velocity.prevTime = Date.now();
                z.velocity.x = (z.image.touchesCurrent.x - z.velocity.prevPositionX) / (Date.now() - z.velocity.prevTime) / 2;
                z.velocity.y = (z.image.touchesCurrent.y - z.velocity.prevPositionY) / (Date.now() - z.velocity.prevTime) / 2;
                if (Math.abs(z.image.touchesCurrent.x - z.velocity.prevPositionX) < 2) z.velocity.x = 0;
                if (Math.abs(z.image.touchesCurrent.y - z.velocity.prevPositionY) < 2) z.velocity.y = 0;
                z.velocity.prevPositionX = z.image.touchesCurrent.x;
                z.velocity.prevPositionY = z.image.touchesCurrent.y;
                z.velocity.prevTime = Date.now();
        
                z.gesture.imageWrap.transform('translate3d(' + z.image.currentX + 'px, ' + z.image.currentY + 'px,0)');
            },
            onTouchEnd: function (s, e) {
                var z = s.zoom;
                if (!z.gesture.image || z.gesture.image.length === 0) return;
                if (!z.image.isTouched || !z.image.isMoved) {
                    z.image.isTouched = false;
                    z.image.isMoved = false;
                    return;
                }
                z.image.isTouched = false;
                z.image.isMoved = false;
                var momentumDurationX = 300;
                var momentumDurationY = 300;
                var momentumDistanceX = z.velocity.x * momentumDurationX;
                var newPositionX = z.image.currentX + momentumDistanceX;
                var momentumDistanceY = z.velocity.y * momentumDurationY;
                var newPositionY = z.image.currentY + momentumDistanceY;
        
                //Fix duration
                if (z.velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - z.image.currentX) / z.velocity.x);
                if (z.velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - z.image.currentY) / z.velocity.y);
                var momentumDuration = Math.max(momentumDurationX, momentumDurationY);
        
                z.image.currentX = newPositionX;
                z.image.currentY = newPositionY;
        
                // Define if we need image drag
                var scaledWidth = z.image.width * z.scale;
                var scaledHeight = z.image.height * z.scale;
                z.image.minX = Math.min((z.gesture.slideWidth / 2 - scaledWidth / 2), 0);
                z.image.maxX = -z.image.minX;
                z.image.minY = Math.min((z.gesture.slideHeight / 2 - scaledHeight / 2), 0);
                z.image.maxY = -z.image.minY;
                z.image.currentX = Math.max(Math.min(z.image.currentX, z.image.maxX), z.image.minX);
                z.image.currentY = Math.max(Math.min(z.image.currentY, z.image.maxY), z.image.minY);
        
                z.gesture.imageWrap.transition(momentumDuration).transform('translate3d(' + z.image.currentX + 'px, ' + z.image.currentY + 'px,0)');
            },
            onTransitionEnd: function (s) {
                var z = s.zoom;
                if (z.gesture.slide && s.previousIndex !== s.activeIndex) {
                    z.gesture.image.transform('translate3d(0,0,0) scale(1)');
                    z.gesture.imageWrap.transform('translate3d(0,0,0)');
                    z.gesture.slide = z.gesture.image = z.gesture.imageWrap = undefined;
                    z.scale = z.currentScale = 1;
                }
            },
            // Toggle Zoom
            toggleZoom: function (s, e) {
                var z = s.zoom;
                if (!z.gesture.slide) {
                    z.gesture.slide = s.clickedSlide ? $(s.clickedSlide) : s.slides.eq(s.activeIndex);
                    z.gesture.image = z.gesture.slide.find('img, svg, canvas');
                    z.gesture.imageWrap = z.gesture.image.parent('.' + s.params.zoomContainerClass);
                }
                if (!z.gesture.image || z.gesture.image.length === 0) return;
        
                var touchX, touchY, offsetX, offsetY, diffX, diffY, translateX, translateY, imageWidth, imageHeight, scaledWidth, scaledHeight, translateMinX, translateMinY, translateMaxX, translateMaxY, slideWidth, slideHeight;
        
                if (typeof z.image.touchesStart.x === 'undefined' && e) {
                    touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
                    touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
                }
                else {
                    touchX = z.image.touchesStart.x;
                    touchY = z.image.touchesStart.y;
                }
        
                if (z.scale && z.scale !== 1) {
                    // Zoom Out
                    z.scale = z.currentScale = 1;
                    z.gesture.imageWrap.transition(300).transform('translate3d(0,0,0)');
                    z.gesture.image.transition(300).transform('translate3d(0,0,0) scale(1)');
                    z.gesture.slide = undefined;
                }
                else {
                    // Zoom In
                    z.scale = z.currentScale = z.gesture.imageWrap.attr('data-swiper-zoom') || s.params.zoomMax;
                    if (e) {
                        slideWidth = z.gesture.slide[0].offsetWidth;
                        slideHeight = z.gesture.slide[0].offsetHeight;
                        offsetX = z.gesture.slide.offset().left;
                        offsetY = z.gesture.slide.offset().top;
                        diffX = offsetX + slideWidth/2 - touchX;
                        diffY = offsetY + slideHeight/2 - touchY;
        
                        imageWidth = z.gesture.image[0].offsetWidth;
                        imageHeight = z.gesture.image[0].offsetHeight;
                        scaledWidth = imageWidth * z.scale;
                        scaledHeight = imageHeight * z.scale;
        
                        translateMinX = Math.min((slideWidth / 2 - scaledWidth / 2), 0);
                        translateMinY = Math.min((slideHeight / 2 - scaledHeight / 2), 0);
                        translateMaxX = -translateMinX;
                        translateMaxY = -translateMinY;
        
                        translateX = diffX * z.scale;
                        translateY = diffY * z.scale;
        
                        if (translateX < translateMinX) {
                            translateX =  translateMinX;
                        }
                        if (translateX > translateMaxX) {
                            translateX = translateMaxX;
                        }
        
                        if (translateY < translateMinY) {
                            translateY =  translateMinY;
                        }
                        if (translateY > translateMaxY) {
                            translateY = translateMaxY;
                        }
                    }
                    else {
                        translateX = 0;
                        translateY = 0;
                    }
                    z.gesture.imageWrap.transition(300).transform('translate3d(' + translateX + 'px, ' + translateY + 'px,0)');
                    z.gesture.image.transition(300).transform('translate3d(0,0,0) scale(' + z.scale + ')');
                }
            },
            // Attach/Detach Events
            attachEvents: function (detach) {
                var action = detach ? 'off' : 'on';
        
                if (s.params.zoom) {
                    var target = s.slides;
                    var passiveListener = s.touchEvents.start === 'touchstart' && s.support.passiveListener && s.params.passiveListeners ? {passive: true, capture: false} : false;
                    // Scale image
                    if (s.support.gestures) {
                        s.slides[action]('gesturestart', s.zoom.onGestureStart, passiveListener);
                        s.slides[action]('gesturechange', s.zoom.onGestureChange, passiveListener);
                        s.slides[action]('gestureend', s.zoom.onGestureEnd, passiveListener);
                    }
                    else if (s.touchEvents.start === 'touchstart') {
                        s.slides[action](s.touchEvents.start, s.zoom.onGestureStart, passiveListener);
                        s.slides[action](s.touchEvents.move, s.zoom.onGestureChange, passiveListener);
                        s.slides[action](s.touchEvents.end, s.zoom.onGestureEnd, passiveListener);
                    }
        
                    // Move image
                    s[action]('touchStart', s.zoom.onTouchStart);
                    s.slides.each(function (index, slide){
                        if ($(slide).find('.' + s.params.zoomContainerClass).length > 0) {
                            $(slide)[action](s.touchEvents.move, s.zoom.onTouchMove);
                        }
                    });
                    s[action]('touchEnd', s.zoom.onTouchEnd);
        
                    // Scale Out
                    s[action]('transitionEnd', s.zoom.onTransitionEnd);
                    if (s.params.zoomToggle) {
                        s.on('doubleTap', s.zoom.toggleZoom);
                    }
                }
            },
            init: function () {
                s.zoom.attachEvents();
            },
            destroy: function () {
                s.zoom.attachEvents(true);
            }
        };

        /*=========================
          Plugins API. Collect all and init all plugins
          ===========================*/
        s._plugins = [];
        for (var plugin in s.plugins) {
            var p = s.plugins[plugin](s, s.params[plugin]);
            if (p) s._plugins.push(p);
        }
        // Method to call all plugins event/method
        s.callPlugins = function (eventName) {
            for (var i = 0; i < s._plugins.length; i++) {
                if (eventName in s._plugins[i]) {
                    s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        };

        /*=========================
          Events/Callbacks/Plugins Emitter
          ===========================*/
        function normalizeEventName (eventName) {
            if (eventName.indexOf('on') !== 0) {
                if (eventName[0] !== eventName[0].toUpperCase()) {
                    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
                }
                else {
                    eventName = 'on' + eventName;
                }
            }
            return eventName;
        }
        s.emitterEventListeners = {
        
        };
        s.emit = function (eventName) {
            // Trigger callbacks
            if (s.params[eventName]) {
                s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
            var i;
            // Trigger events
            if (s.emitterEventListeners[eventName]) {
                for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                    s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
            // Trigger plugins
            if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        };
        s.on = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
            s.emitterEventListeners[eventName].push(handler);
            return s;
        };
        s.off = function (eventName, handler) {
            var i;
            eventName = normalizeEventName(eventName);
            if (typeof handler === 'undefined') {
                // Remove all handlers for such event
                s.emitterEventListeners[eventName] = [];
                return s;
            }
            if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
            for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                if(s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1);
            }
            return s;
        };
        s.once = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            var _handler = function () {
                handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                s.off(eventName, _handler);
            };
            s.on(eventName, _handler);
            return s;
        };

        // Accessibility tools
        s.a11y = {
            makeFocusable: function ($el) {
                $el.attr('tabIndex', '0');
                return $el;
            },
            addRole: function ($el, role) {
                $el.attr('role', role);
                return $el;
            },
        
            addLabel: function ($el, label) {
                $el.attr('aria-label', label);
                return $el;
            },
        
            disable: function ($el) {
                $el.attr('aria-disabled', true);
                return $el;
            },
        
            enable: function ($el) {
                $el.attr('aria-disabled', false);
                return $el;
            },
        
            onEnterKey: function (event) {
                if (event.keyCode !== 13) return;
                if ($(event.target).is(s.params.nextButton)) {
                    s.onClickNext(event);
                    if (s.isEnd) {
                        s.a11y.notify(s.params.lastSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.nextSlideMessage);
                    }
                }
                else if ($(event.target).is(s.params.prevButton)) {
                    s.onClickPrev(event);
                    if (s.isBeginning) {
                        s.a11y.notify(s.params.firstSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.prevSlideMessage);
                    }
                }
                if ($(event.target).is('.' + s.params.bulletClass)) {
                    $(event.target)[0].click();
                }
            },
        
            liveRegion: $('<span class="' + s.params.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>'),
        
            notify: function (message) {
                var notification = s.a11y.liveRegion;
                if (notification.length === 0) return;
                notification.html('');
                notification.html(message);
            },
            init: function () {
                // Setup accessibility
                if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                    s.a11y.makeFocusable(s.nextButton);
                    s.a11y.addRole(s.nextButton, 'button');
                    s.a11y.addLabel(s.nextButton, s.params.nextSlideMessage);
                }
                if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                    s.a11y.makeFocusable(s.prevButton);
                    s.a11y.addRole(s.prevButton, 'button');
                    s.a11y.addLabel(s.prevButton, s.params.prevSlideMessage);
                }
        
                $(s.container).append(s.a11y.liveRegion);
            },
            initPagination: function () {
                if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
                    s.bullets.each(function () {
                        var bullet = $(this);
                        s.a11y.makeFocusable(bullet);
                        s.a11y.addRole(bullet, 'button');
                        s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
                    });
                }
            },
            destroy: function () {
                if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove();
            }
        };
        

        /*=========================
          Init/Destroy
          ===========================*/
        s.init = function () {
            if (s.params.loop) s.createLoop();
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.enableDraggable();
                }
            }
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                if (!s.params.loop) s.updateProgress();
                s.effects[s.params.effect].setTranslate();
            }
            if (s.params.loop) {
                s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);
            }
            else {
                s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
                if (s.params.initialSlide === 0) {
                    if (s.parallax && s.params.parallax) s.parallax.setTranslate();
                    if (s.lazy && s.params.lazyLoading) {
                        s.lazy.load();
                        s.lazy.initialImageLoaded = true;
                    }
                }
            }
            s.attachEvents();
            if (s.params.observer && s.support.observer) {
                s.initObservers();
            }
            if (s.params.preloadImages && !s.params.lazyLoading) {
                s.preloadImages();
            }
            if (s.params.zoom && s.zoom) {
                s.zoom.init();
            }
            if (s.params.autoplay) {
                s.startAutoplay();
            }
            if (s.params.keyboardControl) {
                if (s.enableKeyboardControl) s.enableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.enableMousewheelControl) s.enableMousewheelControl();
            }
            // Deprecated hashnavReplaceState changed to replaceState for use in hashnav and history
            if (s.params.hashnavReplaceState) {
                s.params.replaceState = s.params.hashnavReplaceState;
            }
            if (s.params.history) {
                if (s.history) s.history.init();
            }
            if (s.params.hashnav) {
                if (s.hashnav) s.hashnav.init();
            }
            if (s.params.a11y && s.a11y) s.a11y.init();
            s.emit('onInit', s);
        };
        
        // Cleanup dynamic styles
        s.cleanupStyles = function () {
            // Container
            s.container.removeClass(s.classNames.join(' ')).removeAttr('style');
        
            // Wrapper
            s.wrapper.removeAttr('style');
        
            // Slides
            if (s.slides && s.slides.length) {
                s.slides
                    .removeClass([
                      s.params.slideVisibleClass,
                      s.params.slideActiveClass,
                      s.params.slideNextClass,
                      s.params.slidePrevClass
                    ].join(' '))
                    .removeAttr('style')
                    .removeAttr('data-swiper-column')
                    .removeAttr('data-swiper-row');
            }
        
            // Pagination/Bullets
            if (s.paginationContainer && s.paginationContainer.length) {
                s.paginationContainer.removeClass(s.params.paginationHiddenClass);
            }
            if (s.bullets && s.bullets.length) {
                s.bullets.removeClass(s.params.bulletActiveClass);
            }
        
            // Buttons
            if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
            if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
        
            // Scrollbar
            if (s.params.scrollbar && s.scrollbar) {
                if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr('style');
                if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr('style');
            }
        };
        
        // Destroy
        s.destroy = function (deleteInstance, cleanupStyles) {
            // Detach evebts
            s.detachEvents();
            // Stop autoplay
            s.stopAutoplay();
            // Disable draggable
            if (s.params.scrollbar && s.scrollbar) {
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.disableDraggable();
                }
            }
            // Destroy loop
            if (s.params.loop) {
                s.destroyLoop();
            }
            // Cleanup styles
            if (cleanupStyles) {
                s.cleanupStyles();
            }
            // Disconnect observer
            s.disconnectObservers();
        
            // Destroy zoom
            if (s.params.zoom && s.zoom) {
                s.zoom.destroy();
            }
            // Disable keyboard/mousewheel
            if (s.params.keyboardControl) {
                if (s.disableKeyboardControl) s.disableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.disableMousewheelControl) s.disableMousewheelControl();
            }
            // Disable a11y
            if (s.params.a11y && s.a11y) s.a11y.destroy();
            // Delete history popstate
            if (s.params.history && !s.params.replaceState) {
                window.removeEventListener('popstate', s.history.setHistoryPopState);
            }
            if (s.params.hashnav && s.hashnav)  {
                s.hashnav.destroy();
            }
            // Destroy callback
            s.emit('onDestroy');
            // Delete instance
            if (deleteInstance !== false) s = null;
        };
        
        s.init();
        

    
        // Return swiper instance
        return s;
    };
    

    /*==================================================
        Prototype
    ====================================================*/
    Swiper.prototype = {
        isSafari: (function () {
            var ua = window.navigator.userAgent.toLowerCase();
            return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
        })(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent),
        isArray: function (arr) {
            return Object.prototype.toString.apply(arr) === '[object Array]';
        },
        /*==================================================
        Browser
        ====================================================*/
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1),
            lteIE9: (function() {
                // create temporary DIV
                var div = document.createElement('div');
                // add content to tmp DIV which is wrapped into the IE HTML conditional statement
                div.innerHTML = '<!--[if lte IE 9]><i></i><![endif]-->';
                // return true / false value based on what will browser render
                return div.getElementsByTagName('i').length === 1;
            })()
        },
        /*==================================================
        Devices
        ====================================================*/
        device: (function () {
            var ua = window.navigator.userAgent;
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
            return {
                ios: ipad || iphone || ipod,
                android: android
            };
        })(),
        /*==================================================
        Feature Detection
        ====================================================*/
        support: {
            touch : (window.Modernizr && Modernizr.touch === true) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),
    
            transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),
    
            flexbox: (function () {
                var div = document.createElement('div').style;
                var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
                for (var i = 0; i < styles.length; i++) {
                    if (styles[i] in div) return true;
                }
            })(),
    
            observer: (function () {
                return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
            })(),
    
            passiveListener: (function () {
                var supportsPassive = false;
                try {
                    var opts = Object.defineProperty({}, 'passive', {
                        get: function() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener('testPassiveListener', null, opts);
                } catch (e) {}
                return supportsPassive;
            })(),
    
            gestures: (function () {
                return 'ongesturestart' in window;
            })()
        },
        /*==================================================
        Plugins
        ====================================================*/
        plugins: {}
    };
    

    /*===========================
    Dom7 Library
    ===========================*/
    var Dom7 = (function () {
        var Dom7 = function (arr) {
            var _this = this, i = 0;
            // Create array-like object
            for (i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }
            _this.length = arr.length;
            // Return collection with methods
            return this;
        };
        var $ = function (selector, context) {
            var arr = [], i = 0;
            if (selector && !context) {
                if (selector instanceof Dom7) {
                    return selector;
                }
            }
            if (selector) {
                // String
                if (typeof selector === 'string') {
                    var els, tempParent, html = selector.trim();
                    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                        var toCreate = 'div';
                        if (html.indexOf('<li') === 0) toCreate = 'ul';
                        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                        if (html.indexOf('<tbody') === 0) toCreate = 'table';
                        if (html.indexOf('<option') === 0) toCreate = 'select';
                        tempParent = document.createElement(toCreate);
                        tempParent.innerHTML = selector;
                        for (i = 0; i < tempParent.childNodes.length; i++) {
                            arr.push(tempParent.childNodes[i]);
                        }
                    }
                    else {
                        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                            // Pure ID selector
                            els = [document.getElementById(selector.split('#')[1])];
                        }
                        else {
                            // Other selectors
                            els = (context || document).querySelectorAll(selector);
                        }
                        for (i = 0; i < els.length; i++) {
                            if (els[i]) arr.push(els[i]);
                        }
                    }
                }
                // Node/element
                else if (selector.nodeType || selector === window || selector === document) {
                    arr.push(selector);
                }
                //Array of elements or instance of Dom
                else if (selector.length > 0 && selector[0].nodeType) {
                    for (i = 0; i < selector.length; i++) {
                        arr.push(selector[i]);
                    }
                }
            }
            return new Dom7(arr);
        };
        Dom7.prototype = {
            // Classes and attriutes
            addClass: function (className) {
                if (typeof className === 'undefined') {
                    return this;
                }
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.add(classes[i]);
                    }
                }
                return this;
            },
            removeClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.remove(classes[i]);
                    }
                }
                return this;
            },
            hasClass: function (className) {
                if (!this[0]) return false;
                else return this[0].classList.contains(className);
            },
            toggleClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        this[j].classList.toggle(classes[i]);
                    }
                }
                return this;
            },
            attr: function (attrs, value) {
                if (arguments.length === 1 && typeof attrs === 'string') {
                    // Get attr
                    if (this[0]) return this[0].getAttribute(attrs);
                    else return undefined;
                }
                else {
                    // Set attrs
                    for (var i = 0; i < this.length; i++) {
                        if (arguments.length === 2) {
                            // String
                            this[i].setAttribute(attrs, value);
                        }
                        else {
                            // Object
                            for (var attrName in attrs) {
                                this[i][attrName] = attrs[attrName];
                                this[i].setAttribute(attrName, attrs[attrName]);
                            }
                        }
                    }
                    return this;
                }
            },
            removeAttr: function (attr) {
                for (var i = 0; i < this.length; i++) {
                    this[i].removeAttribute(attr);
                }
                return this;
            },
            data: function (key, value) {
                if (typeof value === 'undefined') {
                    // Get value
                    if (this[0]) {
                        var dataKey = this[0].getAttribute('data-' + key);
                        if (dataKey) return dataKey;
                        else if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) return this[0].dom7ElementDataStorage[key];
                        else return undefined;
                    }
                    else return undefined;
                }
                else {
                    // Set value
                    for (var i = 0; i < this.length; i++) {
                        var el = this[i];
                        if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
                        el.dom7ElementDataStorage[key] = value;
                    }
                    return this;
                }
            },
            // Transforms
            transform : function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            },
            transition: function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            },
            //Events
            on: function (eventName, targetSelector, listener, capture) {
                function handleLiveEvent(e) {
                    var target = e.target;
                    if ($(target).is(targetSelector)) listener.call(target, e);
                    else {
                        var parents = $(target).parents();
                        for (var k = 0; k < parents.length; k++) {
                            if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                        }
                    }
                }
                var events = eventName.split(' ');
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof targetSelector === 'function' || targetSelector === false) {
                        // Usual events
                        if (typeof targetSelector === 'function') {
                            listener = arguments[1];
                            capture = arguments[2] || false;
                        }
                        for (j = 0; j < events.length; j++) {
                            this[i].addEventListener(events[j], listener, capture);
                        }
                    }
                    else {
                        //Live events
                        for (j = 0; j < events.length; j++) {
                            if (!this[i].dom7LiveListeners) this[i].dom7LiveListeners = [];
                            this[i].dom7LiveListeners.push({listener: listener, liveListener: handleLiveEvent});
                            this[i].addEventListener(events[j], handleLiveEvent, capture);
                        }
                    }
                }
    
                return this;
            },
            off: function (eventName, targetSelector, listener, capture) {
                var events = eventName.split(' ');
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof targetSelector === 'function' || targetSelector === false) {
                            // Usual events
                            if (typeof targetSelector === 'function') {
                                listener = arguments[1];
                                capture = arguments[2] || false;
                            }
                            this[j].removeEventListener(events[i], listener, capture);
                        }
                        else {
                            // Live event
                            if (this[j].dom7LiveListeners) {
                                for (var k = 0; k < this[j].dom7LiveListeners.length; k++) {
                                    if (this[j].dom7LiveListeners[k].listener === listener) {
                                        this[j].removeEventListener(events[i], this[j].dom7LiveListeners[k].liveListener, capture);
                                    }
                                }
                            }
                        }
                    }
                }
                return this;
            },
            once: function (eventName, targetSelector, listener, capture) {
                var dom = this;
                if (typeof targetSelector === 'function') {
                    targetSelector = false;
                    listener = arguments[1];
                    capture = arguments[2];
                }
                function proxy(e) {
                    listener(e);
                    dom.off(eventName, targetSelector, proxy, capture);
                }
                dom.on(eventName, targetSelector, proxy, capture);
            },
            trigger: function (eventName, eventData) {
                for (var i = 0; i < this.length; i++) {
                    var evt;
                    try {
                        evt = new window.CustomEvent(eventName, {detail: eventData, bubbles: true, cancelable: true});
                    }
                    catch (e) {
                        evt = document.createEvent('Event');
                        evt.initEvent(eventName, true, true);
                        evt.detail = eventData;
                    }
                    this[i].dispatchEvent(evt);
                }
                return this;
            },
            transitionEnd: function (callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;
                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            },
            // Sizing/Styles
            width: function () {
                if (this[0] === window) {
                    return window.innerWidth;
                }
                else {
                    if (this.length > 0) {
                        return parseFloat(this.css('width'));
                    }
                    else {
                        return null;
                    }
                }
            },
            outerWidth: function (includeMargins) {
                if (this.length > 0) {
                    if (includeMargins)
                        return this[0].offsetWidth + parseFloat(this.css('margin-right')) + parseFloat(this.css('margin-left'));
                    else
                        return this[0].offsetWidth;
                }
                else return null;
            },
            height: function () {
                if (this[0] === window) {
                    return window.innerHeight;
                }
                else {
                    if (this.length > 0) {
                        return parseFloat(this.css('height'));
                    }
                    else {
                        return null;
                    }
                }
            },
            outerHeight: function (includeMargins) {
                if (this.length > 0) {
                    if (includeMargins)
                        return this[0].offsetHeight + parseFloat(this.css('margin-top')) + parseFloat(this.css('margin-bottom'));
                    else
                        return this[0].offsetHeight;
                }
                else return null;
            },
            offset: function () {
                if (this.length > 0) {
                    var el = this[0];
                    var box = el.getBoundingClientRect();
                    var body = document.body;
                    var clientTop  = el.clientTop  || body.clientTop  || 0;
                    var clientLeft = el.clientLeft || body.clientLeft || 0;
                    var scrollTop  = window.pageYOffset || el.scrollTop;
                    var scrollLeft = window.pageXOffset || el.scrollLeft;
                    return {
                        top: box.top  + scrollTop  - clientTop,
                        left: box.left + scrollLeft - clientLeft
                    };
                }
                else {
                    return null;
                }
            },
            css: function (props, value) {
                var i;
                if (arguments.length === 1) {
                    if (typeof props === 'string') {
                        if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
                    }
                    else {
                        for (i = 0; i < this.length; i++) {
                            for (var prop in props) {
                                this[i].style[prop] = props[prop];
                            }
                        }
                        return this;
                    }
                }
                if (arguments.length === 2 && typeof props === 'string') {
                    for (i = 0; i < this.length; i++) {
                        this[i].style[props] = value;
                    }
                    return this;
                }
                return this;
            },
    
            //Dom manipulation
            each: function (callback) {
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i], i, this[i]);
                }
                return this;
            },
            html: function (html) {
                if (typeof html === 'undefined') {
                    return this[0] ? this[0].innerHTML : undefined;
                }
                else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].innerHTML = html;
                    }
                    return this;
                }
            },
            text: function (text) {
                if (typeof text === 'undefined') {
                    if (this[0]) {
                        return this[0].textContent.trim();
                    }
                    else return null;
                }
                else {
                    for (var i = 0; i < this.length; i++) {
                        this[i].textContent = text;
                    }
                    return this;
                }
            },
            is: function (selector) {
                if (!this[0]) return false;
                var compareWith, i;
                if (typeof selector === 'string') {
                    var el = this[0];
                    if (el === document) return selector === document;
                    if (el === window) return selector === window;
    
                    if (el.matches) return el.matches(selector);
                    else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
                    else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
                    else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
                    else {
                        compareWith = $(selector);
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                }
                else if (selector === document) return this[0] === document;
                else if (selector === window) return this[0] === window;
                else {
                    if (selector.nodeType || selector instanceof Dom7) {
                        compareWith = selector.nodeType ? [selector] : selector;
                        for (i = 0; i < compareWith.length; i++) {
                            if (compareWith[i] === this[0]) return true;
                        }
                        return false;
                    }
                    return false;
                }
    
            },
            index: function () {
                if (this[0]) {
                    var child = this[0];
                    var i = 0;
                    while ((child = child.previousSibling) !== null) {
                        if (child.nodeType === 1) i++;
                    }
                    return i;
                }
                else return undefined;
            },
            eq: function (index) {
                if (typeof index === 'undefined') return this;
                var length = this.length;
                var returnIndex;
                if (index > length - 1) {
                    return new Dom7([]);
                }
                if (index < 0) {
                    returnIndex = length + index;
                    if (returnIndex < 0) return new Dom7([]);
                    else return new Dom7([this[returnIndex]]);
                }
                return new Dom7([this[index]]);
            },
            append: function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        while (tempDiv.firstChild) {
                            this[i].appendChild(tempDiv.firstChild);
                        }
                    }
                    else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].appendChild(newChild[j]);
                        }
                    }
                    else {
                        this[i].appendChild(newChild);
                    }
                }
                return this;
            },
            prepend: function (newChild) {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (typeof newChild === 'string') {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                        }
                        // this[i].insertAdjacentHTML('afterbegin', newChild);
                    }
                    else if (newChild instanceof Dom7) {
                        for (j = 0; j < newChild.length; j++) {
                            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                        }
                    }
                    else {
                        this[i].insertBefore(newChild, this[i].childNodes[0]);
                    }
                }
                return this;
            },
            insertBefore: function (selector) {
                var before = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (before.length === 1) {
                        before[0].parentNode.insertBefore(this[i], before[0]);
                    }
                    else if (before.length > 1) {
                        for (var j = 0; j < before.length; j++) {
                            before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                        }
                    }
                }
            },
            insertAfter: function (selector) {
                var after = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (after.length === 1) {
                        after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                    }
                    else if (after.length > 1) {
                        for (var j = 0; j < after.length; j++) {
                            after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                        }
                    }
                }
            },
            next: function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    }
                    else {
                        if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
                        else return new Dom7([]);
                    }
                }
                else return new Dom7([]);
            },
            nextAll: function (selector) {
                var nextEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.nextElementSibling) {
                    var next = el.nextElementSibling;
                    if (selector) {
                        if($(next).is(selector)) nextEls.push(next);
                    }
                    else nextEls.push(next);
                    el = next;
                }
                return new Dom7(nextEls);
            },
            prev: function (selector) {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    }
                    else {
                        if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
                        else return new Dom7([]);
                    }
                }
                else return new Dom7([]);
            },
            prevAll: function (selector) {
                var prevEls = [];
                var el = this[0];
                if (!el) return new Dom7([]);
                while (el.previousElementSibling) {
                    var prev = el.previousElementSibling;
                    if (selector) {
                        if($(prev).is(selector)) prevEls.push(prev);
                    }
                    else prevEls.push(prev);
                    el = prev;
                }
                return new Dom7(prevEls);
            },
            parent: function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    if (selector) {
                        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                    }
                    else {
                        parents.push(this[i].parentNode);
                    }
                }
                return $($.unique(parents));
            },
            parents: function (selector) {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    var parent = this[i].parentNode;
                    while (parent) {
                        if (selector) {
                            if ($(parent).is(selector)) parents.push(parent);
                        }
                        else {
                            parents.push(parent);
                        }
                        parent = parent.parentNode;
                    }
                }
                return $($.unique(parents));
            },
            find : function (selector) {
                var foundElements = [];
                for (var i = 0; i < this.length; i++) {
                    var found = this[i].querySelectorAll(selector);
                    for (var j = 0; j < found.length; j++) {
                        foundElements.push(found[j]);
                    }
                }
                return new Dom7(foundElements);
            },
            children: function (selector) {
                var children = [];
                for (var i = 0; i < this.length; i++) {
                    var childNodes = this[i].childNodes;
    
                    for (var j = 0; j < childNodes.length; j++) {
                        if (!selector) {
                            if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                        }
                        else {
                            if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                        }
                    }
                }
                return new Dom7($.unique(children));
            },
            remove: function () {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
                }
                return this;
            },
            add: function () {
                var dom = this;
                var i, j;
                for (i = 0; i < arguments.length; i++) {
                    var toAdd = $(arguments[i]);
                    for (j = 0; j < toAdd.length; j++) {
                        dom[dom.length] = toAdd[j];
                        dom.length++;
                    }
                }
                return dom;
            }
        };
        $.fn = Dom7.prototype;
        $.unique = function (arr) {
            var unique = [];
            for (var i = 0; i < arr.length; i++) {
                if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
            }
            return unique;
        };
    
        return $;
    })();
    

    /*===========================
     Get Dom libraries
     ===========================*/
    var swiperDomPlugins = ['jQuery', 'Zepto', 'Dom7'];
    for (var i = 0; i < swiperDomPlugins.length; i++) {
    	if (window[swiperDomPlugins[i]]) {
    		addLibraryPlugin(window[swiperDomPlugins[i]]);
    	}
    }
    // Required DOM Plugins
    var domLib;
    if (typeof Dom7 === 'undefined') {
    	domLib = window.Dom7 || window.Zepto || window.jQuery;
    }
    else {
    	domLib = Dom7;
    }

    /*===========================
    Add .swiper plugin from Dom libraries
    ===========================*/
    function addLibraryPlugin(lib) {
        lib.fn.swiper = function (params) {
            var firstInstance;
            lib(this).each(function () {
                var s = new Swiper(this, params);
                if (!firstInstance) firstInstance = s;
            });
            return firstInstance;
        };
    }
    
    if (domLib) {
        if (!('transitionEnd' in domLib.fn)) {
            domLib.fn.transitionEnd = function (callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;
                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            };
        }
        if (!('transform' in domLib.fn)) {
            domLib.fn.transform = function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            };
        }
        if (!('transition' in domLib.fn)) {
            domLib.fn.transition = function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            };
        }
        if (!('outerWidth' in domLib.fn)) {
            domLib.fn.outerWidth = function (includeMargins) {
                if (this.length > 0) {
                    if (includeMargins)
                        return this[0].offsetWidth + parseFloat(this.css('margin-right')) + parseFloat(this.css('margin-left'));
                    else
                        return this[0].offsetWidth;
                }
                else return null;
            };
        }
    }

    window.Swiper = Swiper;
})();
/*===========================
Swiper AMD Export
===========================*/
if (true)
{
    module.exports = window.Swiper;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Swiper;
    });
}
//# sourceMappingURL=maps/swiper.js.map


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// require('lib-flexible');
window.addEventListener('load', function () {
  __webpack_require__(3);
  setTimeout(function () {
    document.getElementById('loading').classList.add('hide');
  }, 500);
});

/***/ })
/******/ ]);