/*
	CS4731 Project 1
	Author: Joseph St. Pierre
	Year: 2019
*/

var gl = null;

var filemode = true;
var color = "black";

function handleMouseClick(e) {
  var x = e.clientX;
  var y = e.clientY;

  // Convert to OpenGL screen coordinates
  if (gl != null) {
    x = x / gl.canvas.width  *  2 - 1;
    y = y / gl.canvas.height * -2 + 1;
  }

  console.log(x);
  console.log(y);
}

function handleKeyPress(e) {
  var key = e.which || e.keyCode;

  if (key == "f".charCodeAt(0)) {
    filemode = true;
  }

  if (key == "d".charCodeAt(0)) {
    filemode = false;
  }

  if (key == "c".charCodeAt(0)) {
    if (color == "black")
      color = "red";
    else if (color == "red")
      color = "green";
    else if (color == "green")
      color = "blue";
    else
      color = "black"
  }

  console.log("Filemode: " + filemode);
  console.log(color);
}

function drawLoop() {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);  // Clear the color buffer



  requestAnimationFrame(drawLoop);
}

function main() {
  var window = new GL_Window("My first WebGL program", 600, 600);
  gl = window.GetContext();

	// Initialize shaders
  var shader = new GL_Shader(window, "Scene_Shader", "scene_vertex_shader", "scene_fragment_shader");
  shader.Use(); // Use the shader
  
  console.log("It works!");

  // Add input handling
  document.addEventListener("click", handleMouseClick, false);
  document.addEventListener("keypress", handleKeyPress, false);
  
  var vbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);

  // Can draw stuff here

  drawLoop();
}
