/*
 * Slider
 * Author : Marek
 */
( function(slider, undefined) {

		/*
		 *
		 * New : create slides depending on images to be loaded
		 */
		var slides = 0, image_sources = [];

		slider.insertImagesIntoDom = function(){

			for (var key in slider.options.images) {
				if (slider.options.images.hasOwnProperty(key)) {

					/*
					 * Push into image array
					 * for lazy loading
					 */

					var imageSrc = slider.options.images[key];
					image_sources.push(imageSrc);

					var div = document.createElement("div"), 
					divClassName = 'oneStorySlide', 
					image = document.createElement("img"), 
					newLi = document.createElement("LI"), 
					newLiFirstClass = 'sliderPagintaioncurrent';

					div.setAttribute('class', divClassName);
					div.setAttribute('id', 'slide_' + slides);
					image.setAttribute('data-src', imageSrc);
					image.setAttribute('id', 'img_' + slides);
					if (slides < 1) {
						newLi.setAttribute('class', newLiFirstClass);
					}
					newLi.innerHTML = '<a href="#slide_' + slides + '"></a>';

					document.getElementById('slider_control').appendChild(div).appendChild(image);
					document.getElementById('sliderPagination').appendChild(newLi);

					slides++;
				}
			}
		};

		slider.checkUrl = function() {
	
			var url = window.location.toString();
			if (url.indexOf('#') != -1) {
				return parseInt(url.substring(url.length - 1, url.length),10);
			} else {
				return 0;
			}
		};
		
		slider.changeUrl = function(param){
			var url = window.location.toString();
			if(url.indexOf('#') == -1) {
				location.href=location.href+param;
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
					function askIfImagesLoaded() {
						console.log('loading...');
						loaded = slider.imageLoaded(no);
						if (!loaded) {
							setTimeout(askIfImagesLoaded, 1000);
						} else {
							console.log('loaded');
							document.getElementById('loader').style.display = 'none';
						}
					}
	
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
				console.log('length of image_sources',image_sources.length);
				if (no <= image_sources.length){
					slider.updatePrevButton(no);
					slider.updateNextButton(no);
					slider.updateToggles(no);
					slider.retrieveImg(no);
				}else{
					slider.showError();
				}
			}, 100);
		};
		
		slider.showError = function(){
			document.getElementById('error').style.display = 'block';
		};
		
		slider.resizeImages = function(){
			/*
			 * always window height
			 */
			var height= window.innerWidth,
			ratio= 1*(100-(slider.options.paddingInPercent*2))/100,
			newWidth = parseFloat(height)*ratio;
			/*
			 * set images to 100% window width (- padding)
			 */
			for (var i=0; i<image_sources.length;i++){
				document.getElementById('img_'+i).style.width = parseInt(newWidth,10) + "px";
			}
			/*
			 * set slider to 100% window height
			 */
			document.getElementsByClassName('slider')[0].style.height = height + "px";
			
		};
		
		slider.initEventHandler = function(){

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
				slider.resizeImages();
			};
			
		};	
		
		slider.init = function(options) {

			slider.options = options || {};
			
			slider.insertImagesIntoDom();
			
			if (slider.checkUrl()===0){
				slider.changeUrl('#slide_0');
			}
			
			slider.doSlideAction();

			slider.initEventHandler();
			
			slider.resizeImages();
			
			
		};

}(window.slider = window.slider || {})); 

