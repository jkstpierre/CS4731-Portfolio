/*
	CS4731 Project 1
	Author: Joseph St. Pierre
	Year: 2019
*/

var gl = null;      // Handle to the OpenGL context
var shader = null;  // Handle to the shader program
var vbo = null;     // Handle to the Vertex Buffer Object

var filemode = true;  // Track if we are in filemode or drawmode
var color = "black";  // What color are we currently drawing with

// The polylines array contains all the polylines (arrays of 2d points)
var polylines = [];

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
    fileInterface();
  }

  if (key == "d".charCodeAt(0)) {
    drawInterface();
  }

  if (key == "c".charCodeAt(0)) {
    if (color == "black") {
      color = "red";
      shader.SetUniformVec4("color", [1.0, 0.0, 0.0, 1.0]);
    }
    else if (color == "red") {
      color = "green";
      shader.SetUniformVec4("color", [0.0, 1.0, 0.0, 1.0]);
    }
    else if (color == "green") {
      color = "blue";
      shader.SetUniformVec4("color", [0.0, 0.0, 1.0, 1.0]);
    }
    else {
      color = "black"
      shader.SetUniformVec4("color", [0.0, 0.0, 0.0, 1.0]);
    }
  }

  console.log("Filemode: " + filemode);
  console.log(color);
}

// Draws the Drawing Mode Interface
function drawInterface() {
  filemode = false;

  document.getElementById("mode").innerHTML = "Draw Mode";
  document.getElementById("input_div").style.visibility = "hidden";
}

// Draws the File Upload Mode Interface
function fileInterface() {
  filemode = true;

  document.getElementById("mode").innerHTML = "File Mode";
  document.getElementById("input_div").style.visibility = "visible";
}

function drawPolylines() {
  for(var i = 0; i < polylines.length; i++) {
    var line = polylines[i];

    if (line.length > 0) {
      vbo.Bind();
      vbo.FillData(flatten(line), gl.STATIC_DRAW);

      gl.drawArrays(gl.LINE_STRIP, 0, line.length);
    }
  }
}

function drawLoop() {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);  // Clear the color buffer

  drawPolylines();

  requestAnimationFrame(drawLoop);
}

// Parse uploaded .dat files
function parseDatFile(e) {
  var file = e.target.files[0]; // Get the file
  
  var reader = new FileReader();

  reader.onload = (function(file_object) {
    return function(evt) {
      data = evt.target.result;
      data = data.split("\n");

      // Destroy the polylines

      polylines = [];

      // Parse the file

      for (var i = 1; i < data.length; i++) {
        var line = data[i];

        var entry = line.split(' ');
        entry = entry.filter(function (e1) {
          return e1 != "";
        });

        //console.log(entry);
        
        if (entry.length == 1) {
          // File wants us to make new polyline
          polylines.push([]); // Add a new polyline
        }
        else if(entry.length == 2) {
          // File wants us to add to the last polyline
          polylines[polylines.length - 1].push([parseFloat(entry[0]), parseFloat(entry[1])]);
        }
      }
    }
  })(file);

  reader.readAsText(file);
}

function main() {
  var window = new GL_Window("My first WebGL program", 600, 600);
  gl = window.GetContext();

  document.getElementById("canvas_binding_point").appendChild(window.GetCanvas());
  fileInterface();

	// Initialize shaders
  shader = new GL_Shader(window, "Scene_Shader", "scene_vertex_shader", "scene_fragment_shader");
  shader.Use(); // Use the shader
  
  console.log("It works!");

  // Add input handling
  document.addEventListener("click", handleMouseClick, false);
  document.addEventListener("keypress", handleKeyPress, false);
  document.getElementById("file_input").addEventListener('change', parseDatFile, false);

  // Setup vertex buffer
  vbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);
  vbo.Bind(); // Bind the VBO to the Array Buffer binding point

  // Tell OpenGL how to process the vbo data in the shader program
  shader.SetAttributePointer("vertex_position", 2, gl.FLOAT, false, 0, 0);

  // Setup default uniforms
  shader.SetUniformVec4("color", [0.0,0.0,0.0,1.0]);  // Set color to black

  // Initialize drawing loop
  drawLoop();
}
