/*
 * Slider
 * Author : Marek
 */
( function(leapcontroller, undefined) {

		var canvas = document.getElementById('canvas');

		//Making sure we have the proper aspect ratio for our canvas
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		var c = canvas.getContext('2d');

		// Save the canvas width and canvas height
		// as easily accesible variables
		var width = canvas.width;
		var height = canvas.height;

		var controller = new Leap.Controller({
			enableGestures : true
		});

		controller.on('connect', function() {

			console.log('Successfully connected.');

		});

		controller.on('gesture', function(gesture) {
			//console.log(gesture);
			if (gesture.type === 'swipe') {
				handleSwipe(gesture);
			}
		});

		function handleSwipe(swipe) {
			var startFrameID;
			if (swipe.state === 'stop') {
				if (swipe.direction[0] > 0) {
					//this means that the swipe is to the right direction
					//console.log('right');
					console.log('next? : ,', document.getElementById('sliderNext').href);
					//console.log('window.slider.doSlideAction() :',window.slider.doSlideAction);
					window.location.href = document.getElementById('sliderNext').href;
					window.slider.doSlideAction();
				} else {
					//this means that the swipe is to the left direction
					console.log('prev? : ,', document.getElementById('sliderPrev').href);
					//console.log('window.slider.doSlideAction() :',window.slider.doSlideAction);
					window.location.href = document.getElementById('sliderPrev').href;
					window.slider.doSlideAction();
				}
			}
		}


		controller.connect();

	}(window.leapcontroller = window.leapcontroller || {}));
