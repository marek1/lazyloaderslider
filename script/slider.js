/*
 * Lazy loading slider
 * Author : Marek
 */
( function(slider, undefined) {

		/*
		 *
		 * New : create slides depending on images to be loaded
		 */
		var slides = 0, image_sources = [], JavaScript = {
			load : function(src, callback) {
				var script = document.createElement('script'), loaded;
				script.setAttribute('src', src);
				if (callback) {
					script.onreadystatechange = script.onload = function() {
						if (!loaded) {
							callback();
						}
						loaded = true;
					};
				}
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		};

		var insertImagesIntoDom = function() {

			for (var key in slider.options.images) {
				if (slider.options.images.hasOwnProperty(key)) {

					/*
					 * Push into image array
					 * for lazy loading
					 */

					var imageSrc = slider.options.images[key];
					image_sources.push(imageSrc);

					var newLiFirstClass = '';
					if (slides < 1) {
						newLiFirstClass = 'sliderPagintaioncurrent';
					}

					var div = createDomElement('div', [{
						type : 'class',
						name : 'oneStorySlide'
					}, {
						type : 'id',
						name : 'slide_' + slides
					}]), newLi = createDomElement('li', [{
						type : 'class',
						name : newLiFirstClass
					}], '<a href="#slide_' + slides + '"></a>'), newImg = createDomElement('img', [{
						type : 'data-src',
						name : imageSrc
					}, {
						type : 'id',
						name : 'img_' + slides
					}]);

					document.getElementById('slider_control').appendChild(div).appendChild(newImg);
					document.getElementById('sliderPagination').appendChild(newLi);

					slides++;
				}
			}
		};

		var createDomElement = function(element, attributes, innerhtml) {
			var elem = document.createElement(element);
			for (var i = 0; i < attributes.length; i++) {
				elem.setAttribute(attributes[i].type, attributes[i].name);
			}
			if (innerhtml) {
				elem.innerHTML = innerhtml;
			}
			return elem;
		};

		var checkUrl = function() {

			var url = window.location.toString();
			if (url.indexOf('#') != -1) {
				return parseInt(url.substring(url.length - 1, url.length), 10);
			} else {
				return 0;
			}
		};

		var changeUrl = function(param) {
			var url = window.location.toString();
			if (url.indexOf('#') == -1) {
				location.href = location.href + param;
			}
		};

		var imageLoaded = function(no) {
			console.log('node : ', document.getElementById('img_' + no));
			var node = document.getElementById('img_' + no), w = 'undefined' != typeof node.clientWidth ? node.clientWidth : node.offsetWidth, h = 'undefined' != typeof node.clientHeight ? node.clientHeight : node.offsetHeight;
			return w + h > 0 ? true : false;
		};

		var retrieveImg = function(no) {
			if (document.getElementById('img_' + no) && document.getElementById('img_' + no).getAttribute('src') === null) {

				document.getElementById('img_' + no).setAttribute('src', image_sources[no]);
				document.getElementById('loader').style.visibility = 'visible';
				var loaded = false;

				loaded = imageLoaded(no);

				askIfImagesLoaded = function() {
					console.log('loading...');
					loaded = imageLoaded(no);
					if (!loaded) {
						setTimeout(askIfImagesLoaded, 1000);
					} else {
						document.getElementById('loader').style.visibility = 'hidden';
					}
				};

				askIfImagesLoaded();
			}
		};

		var updatePrevButton = function(no) {
			var href = no - 1 >= 0 ? no - 1 : slides - 1;
			document.getElementById('sliderPrev').setAttribute('href', '#slide_' + href);

		};

		var updateNextButton = function(no) {
			var href = no + 1 < slides ? no + 1 : 0;
			document.getElementById('sliderNext').setAttribute('href', '#slide_' + href);
		};

		var updateToggles = function(no) {
			/*
			 * sometimes the first item in UL array is a Textnode
			 */
			for (var i = 0; i <= slides; i++) {
				if (document.getElementById('sliderPagination').childNodes[i].nodeName == "LI") {
					document.getElementById('sliderPagination').childNodes[i].classList.remove('sliderPagintaioncurrent');
					if (document.getElementById('sliderPagination').childNodes[i].childNodes[0].hash === ("#slide_" + no)) {
						document.getElementById('sliderPagination').childNodes[i].classList.add('sliderPagintaioncurrent');
					}
				}
			}
		};

		var doSlideAction = function() {
			setTimeout(function() {
				var no = checkUrl();
				console.log('length of image_sources', image_sources.length);
				if (no <= image_sources.length) {
					updatePrevButton(no);
					updateNextButton(no);
					updateToggles(no);
					retrieveImg(no);
				} else {
					showError();
				}
			}, 100);
		};

		var showError = function() {
			document.getElementById('error').style.display = 'block';
		};

		var initEventHandler = function() {

			document.getElementById('sliderPrev').onclick = function() {
				doSlideAction();
			};
			document.getElementById('sliderNext').onclick = function() {
				doSlideAction();
			};
			document.getElementById('sliderPagination').onclick = function(event) {
				doSlideAction();
			};

			/*
			 * enable Leap Controller
			 */
			document.getElementById('enableLeap').onclick = function() {
				/*
				 * Feedback
				 */
				var elem = document.getElementById('enableLeap'), 
				parent = elem.parentNode;
				elem.remove();
				parent.innerHTML = "enabling";
				/*
				 * insert canvas into DOM
				 */
				var canvas = createDomElement('canvas', [{
					type : 'id',
					name : 'canvas'
				}]);
				document.getElementsByTagName("body")[0].appendChild(canvas);
				/*
				 * load scripts
				 */
				JavaScript.load("lib/leap.min.js", function() {
					JavaScript.load("min/leapcontroller.min.js", function() {
						parent.innerHTML = "Swipe by moving hands slowly over Leap Controller unit (left to right or vice versa)";
					});
				});

			};

		};

		slider.init = function(options) {

			slider.options = options || {};

			insertImagesIntoDom();

			if (checkUrl() === 0) {
				changeUrl('#slide_0');
			}

			doSlideAction();

			initEventHandler();

		};

	}(window.slider = window.slider || {}));

