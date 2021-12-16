# color-ramp.js
easy creation, manipulation and access to color values in color gradients.

It is unfortunately not possible to access the colors in CSS color gradients. For a project I need to be able to animate the parameters of a color gradient and have a fast readout for the entire color ramp.

color-ramp.js contains the class ColorRamp which holds a collection of ColorStop objects. Changes to any ColorStop object such as position or color value causes the list of colors to be regenerated.

ColorRamp holds an internal canvas 100 x 1 pixels. A gradient is painted onto the canvas after which the canvas context is read using getImageData. Easy helper routines allow quick access to the color ramp at any position.


## Installation
Just include the javascript file in your project with the usual <script> tags.
  
## Usage
  
```
var colorRamp = new ColorRamp(()=>{
  handleOnChange();
});
  
colorRamp.addColorStop(0,'#000');
colorRamp.addColorStop(0.1,'#f0f');
colorRamp.addColorStop(0.15,'#ff0');
colorRamp.addColorStop(0.5,'#f00');
colorRamp.addColorStop(0.85,'#ff0');
colorRamp.addColorStop(0.9,'#f0f');
colorRamp.addColorStop(1,'#000');
```
  
![image](https://user-images.githubusercontent.com/1192916/146372038-f8460bb4-8414-4182-a9a8-4490a5a08bf7.png)

  To obtain a color value on the gradient you can call
  ```
  colorRamp.getColor(position);
  ```
  The position parameter ranges between 0 and 1 for the full color range.
  The return value is an array with the r,g,b values between 0 and 255.
  
  Alternativly you can call
  ```
  colorRamp.getCSSColor(position);
  ```
 In this case you get a ready to use css rgb color string back like 'rgb(71,34,208)'.
  
 
