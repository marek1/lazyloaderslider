Plain Vanilla Javascript Slider with Lazy loading and adaptive images

Features :
- Images are lazy loaded (that means only the image that is displayed)
- Images are loaded in the appropriate size (window width) 
- Leap Motion Controller (can be enabled , and works if hardware is present)

Structure : 
- images/ contains images used by the application
- script/ contains slider.js
- style/ contains reset.css and slider.css 
- lib/ contains the Leap Motion Controller Library
- index.html contains the markup and initialization of the slider

Change initialization parameter
- width 
  it takes the width of the window by default, 
  but can be set to a fixed width, i.e. 960 (without pixel)
  
- ratio , i.e. 16:9 like so
  ratioWidth : 16, 
  ratioHeight : 9 

- Image object, like so :
  images {
	1: 'your-url/images/your-image-url-to-first-image'
	2: 'your-url/images/your-image-url-to-second-image'
  }
  or if hosted at cloudinary (it send the width parameter)
  images {
	1 : 'http://res.cloudinary.com/xxx/image/upload/c_scale,w_'+(width)+'/xxx/first-image.jpg',
	2 : 'http://res.cloudinary.com/xxx/image/upload/c_scale,w_'+(width)+'/xxx/second-image.jpg'
  }
  or locally like so
  images {
	1: 'your-folder/your-image-url-to-first-image'
	2: 'your-folder/your-image-url-to-second-image'
  }

