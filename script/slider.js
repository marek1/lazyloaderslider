/*
 * Slider
 * Author : Marek
 */
(function( slider, undefined ) {
	
	/*
	 * OLD : reading in all the slides & images from DOM 
	 * var slides = document.getElementsByClassName('oneStorySlide');
	 * var images = slides[0].getElementsByTagName('img').length;
	
	 * 
	 * New : create slides depending on images to be loaded
	*/
	var slides=0,
	image_sources=[];
	
	slider.whichSlide = function(){
		
		var url = window.location.toString();
		if (url.indexOf('#slide')!=-1){
			return parseInt(url.substring(url.length-1,url.length));	
		}else{
			return null;
		}
		
	};

	slider.imageLoaded = function(no) {
		var node = document.getElementById('img_'+no);
	    var w = 'undefined' != typeof node.clientWidth ? node.clientWidth : node.offsetWidth;
	    var h = 'undefined' != typeof node.clientHeight ? node.clientHeight : node.offsetHeight;
	    return w+h > 0 ? true : false;
	};
	
	slider.retrieveImg = function(no){
		if (document.getElementById('img_'+no).getAttribute('src')===null){
			
			document.getElementById('img_'+no).setAttribute('src',image_sources[no]);
			
			document.getElementById('loader').style.display='block';
			
			var loaded=false;
			
			loaded = slider.imageLoaded(no);
			function askIfImagesLoaded(){
				console.log('loading...');
				loaded = slider.imageLoaded(no);
				if (!loaded){
					setTimeout(askIfImagesLoaded, 1000);
				}else{
					console.log('loaded');
					document.getElementById('loader').style.display='none';
				}
			}
			askIfImagesLoaded();
			
			
		}
	};
	
	slider.updatePrevButton = function(no){
		var href = no-1>=0 ? no - 1 : slides - 1;
		document.getElementById('sliderPrev').setAttribute('href','#slide_'+href);
		
	};
	
	slider.updateNextButton = function(no){
		var href = no+1<slides ? no + 1 : 0;
		document.getElementById('sliderNext').setAttribute('href','#slide_'+href);
	};
	
	slider.updateToggles = function(no){
		/*
		 * sometimes the first item in UL array is a Textnode
		 */
		for (var i=0; i<=slides; i++){
			if (document.getElementById('sliderPagination').childNodes[i].nodeName == "LI") {
				document.getElementById('sliderPagination').childNodes[i].classList.remove('sliderPagintaioncurrent');
				if(document.getElementById('sliderPagination').childNodes[i].childNodes[0].hash===("#slide_"+no)){
					document.getElementById('sliderPagination').childNodes[i].classList.add('sliderPagintaioncurrent');
				}
			}
		}
	};

	slider.showSlide = function(no){
		document.getElementById('slide_'+no).style.zIndex=1;
	};

	slider.doSlideAction = function(){
		var that=this;
		setTimeout(function(){
			var no = that.whichSlide();
			
			if (no==null){
				that.updatePrevButton(0);
				that.updateNextButton(0);
				that.updateToggles(0);
				that.retrieveImg(0);
				that.showSlide(0);
			}else{
				that.updatePrevButton(no);
				that.updateNextButton(no);
				that.updateToggles(no);
				that.retrieveImg(no);
			}
		},100);
	};

	
	slider.init = function(options){
		
		options = options || {};

		
		for(var key in options.images) {
		  if(options.images.hasOwnProperty(key)) {
		  	
				/*
				 * Push into image array
				 * for lazy loading
				 */		  	
				
				var imageSrc =  options.images[key];
				image_sources.push(imageSrc);
		    	
		    	
		    	var div = document.createElement("div"),
		    	divClassName = 'oneStorySlide',
		    	image = document.createElement("img"),
		    	newLi = document.createElement("LI"),
		    	newLiFirstClass = 'sliderPagintaioncurrent';
		    	
		    	div.setAttribute('class', divClassName);
		    	div.setAttribute('id', 'slide_'+slides);
		    	div.style.padding=options.padding+"px";
		    	image.setAttribute('data-src', imageSrc);
		    	
		    	image.setAttribute('id', 'img_'+slides);
		    	if(slides<1){
		    		newLi.setAttribute('class', newLiFirstClass);
		    	}
		    	newLi.innerHTML='<a href="#slide_'+slides+'"></a>';
		    	
		    	document.getElementById('slider_control').appendChild(div).appendChild(image);
		    	document.getElementById('sliderPagination').appendChild(newLi);
		    	
		    	
				document.getElementById('loader').style.padding=options.padding+"px";
		    	
		    	slides++;
		  }
		}
		
			
		
		if (options.width && parseInt(options.width)>0){
			console.log('set width : ',options.width);
			document.getElementsByClassName('slider')[0].style.width=options.width+"px";
			document.getElementById('slider_control').style.width=options.width+"px";
		}
		if (options.height && parseInt(options.height)>0){
			console.log('set height : ',options.height);
			document.getElementsByClassName('slider')[0].style.height=options.height+"px";
			document.getElementById('slider_control').style.height=options.height+"px";
		}


		this.doSlideAction();
		
		var that=this;
		document.getElementById('sliderPrev').onclick=function(){
			that.doSlideAction();
		};
		document.getElementById('sliderNext').onclick=function(){
			that.doSlideAction();
		};
		document.getElementById('sliderPagination').onclick=function(event){
			that.doSlideAction();
		};	
	};

}( window.slider = window.slider || {}));
