/*
 * Slider
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

		slider.insertImagesIntoDom = function() {

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

					var div = slider.createDomElement('div', [{
						type : 'class',
						name : 'oneStorySlide'
					}, {
						type : 'id',
						name : 'slide_' + slides
					}]), newLi = slider.createDomElement('li', [{
						type : 'class',
						name : newLiFirstClass
					}], '<a href="#slide_' + slides + '"></a>'), newImg = slider.createDomElement('img', [{
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

		slider.createDomElement = function(element, attributes, innerhtml) {
			var elem = document.createElement(element);
			for (var i = 0; i < attributes.length; i++) {
				elem.setAttribute(attributes[i].type, attributes[i].name);
			}
			if (innerhtml) {
				elem.innerHTML = innerhtml;
			}
			return elem;
		};

		slider.checkUrl = function() {

			var url = window.location.toString();
			if (url.indexOf('#') != -1) {
				return parseInt(url.substring(url.length - 1, url.length), 10);
			} else {
				return 0;
			}
		};

		slider.changeUrl = function(param) {
			var url = window.location.toString();
			if (url.indexOf('#') == -1) {
				location.href = location.href + param;
			}
		};

		slider.imageLoaded = function(no) {
			var node = document.getElementById('img_' + no);
			var w = 'undefined' != typeof node.clientWidth ? node.clientWidth : node.offsetWidth;
			var h = 'undefined' != typeof node.clientHeight ? node.clientHeight : node.offsetHeight;
			return w + h > 0 ? true : false;
		};

		slider.retrieveImg = function(no) {
			if (document.getElementById('img_' + no) && document.getElementById('img_' + no).getAttribute('src') === null) {

				document.getElementById('img_' + no).setAttribute('src', image_sources[no]);

				document.getElementById('loader').style.display = 'block';

				var loaded = false;

				loaded = slider.imageLoaded(no);
				
				askIfImagesLoaded = function() {
					console.log('loading...');
					loaded = slider.imageLoaded(no);
					if (!loaded) {
						setTimeout(askIfImagesLoaded, 1000);
					} else {
						console.log('loaded');
						document.getElementById('loader').style.display = 'none';
					}
				};

				askIfImagesLoaded();
			}
		};

		slider.updatePrevButton = function(no) {
			var href = no - 1 >= 0 ? no - 1 : slides - 1;
			document.getElementById('sliderPrev').setAttribute('href', '#slide_' + href);

		};

		slider.updateNextButton = function(no) {
			var href = no + 1 < slides ? no + 1 : 0;
			document.getElementById('sliderNext').setAttribute('href', '#slide_' + href);
		};

		slider.updateToggles = function(no) {
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

		slider.doSlideAction = function() {
			setTimeout(function() {
				var no = slider.checkUrl();
				console.log('length of image_sources', image_sources.length);
				if (no <= image_sources.length) {
					slider.updatePrevButton(no);
					slider.updateNextButton(no);
					slider.updateToggles(no);
					slider.retrieveImg(no);
				} else {
					slider.showError();
				}
			}, 100);
		};

		slider.showError = function() {
			document.getElementById('error').style.display = 'block';
		};

		slider.resizeImages = function() {
			/*
			 * NEW : RATIO
			 */
			var windowWidth = window.innerWidth, paddingRatio = 1 * (100 - (slider.options.paddingInPercent * 2)) / 100, 
			windowHeight = window.innerHeight, 
			calculatedImageHeight = (((windowWidth * paddingRatio) * slider.options.ratioHeight) / slider.options.ratioWidth),
			imageHeight = (calculatedImageHeight + 250) > windowHeight ? (windowHeight - 250) :  calculatedImageHeight;
			

			for (var i = 0; i < image_sources.length; i++) {
				document.getElementById('img_' + i).style.height = parseInt(imageHeight, 10) + "px";
			}
			document.getElementsByClassName('container')[0].style.height = (imageHeight / paddingRatio) + 50 + "px";
			document.getElementsByClassName('slider')[0].style.height = imageHeight + "px";
		};

		slider.initEventHandler = function() {

			document.getElementById('sliderPrev').onclick = function() {
				slider.doSlideAction();
			};
			document.getElementById('sliderNext').onclick = function() {
				slider.doSlideAction();
			};
			document.getElementById('sliderPagination').onclick = function(event) {
				slider.doSlideAction();
			};

			/*
			 * add event listener for window resize
			 */
			window.onresize = function() {
				console.log('resizing');
				slider.resizeImages();
			};

			/*
			 * enable Leap Controller
			 */
			document.getElementById('enableLeap').onclick = function() {
				/*
				 * Feedback
				 */
				var elem = document.getElementById('enableLeap'), parent = elem.parentNode;
				elem.remove();
				parent.innerHTML = "enabling";
				/*
				 * insert canvas into DOM
				 */
				var canvas = slider.createDomElement('canvas', [{
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

			slider.insertImagesIntoDom();

			if (slider.checkUrl() === 0) {
				slider.changeUrl('#slide_0');
			}

			slider.doSlideAction();

			slider.initEventHandler();

			slider.resizeImages();

		};

	}(window.slider = window.slider || {}));

