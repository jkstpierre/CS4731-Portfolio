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
var polylines = [[]];

var create_new_polyline = false;

// Handle mouse clicks during draw mode
function handleMouseClick(e) {
  if (filemode == false) {
    var rect = gl.canvas.getBoundingClientRect();

    // Get mouse x y
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    // Add to polyline
    if (x >= 0 && x < 600 && y >= 0 && y < 600) {
      // Accept up to 100 vertices per polyline
      if (polylines[polylines.length - 1].length == 100 || create_new_polyline == true) {
        polylines.push([]);
        create_new_polyline = false;
      }

      // Add vertex to polyline
      polylines[polylines.length - 1].push([x, y]);
    }

    console.log(x);
    console.log(y);
  }
}

function handleKeyPress(e) {
  var key = e.which || e.keyCode;

  if (key == "f".charCodeAt(0)) {
    fileInterface();
  }

  else if (key == "d".charCodeAt(0)) {
    drawInterface();
  }

  else if (key == "c".charCodeAt(0)) {
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

  else if (key == "b".charCodeAt(0)) {
    create_new_polyline = true; // Set the flag
  }

  console.log("Filemode: " + filemode);
  console.log(color);
}

function handleKeyRelease(e) {
  var key = e.which || e.keyCode;

  if (key == "b".charCodeAt(0))
    create_new_polyline = false;
}

// Draws the Drawing Mode Interface
function drawInterface() {
  filemode = false;

  // Set identity matrix
  shader.SetUniformMat4("projection_matrix", ortho(0.0, 600.0, 600.0, 0.0, 0.0, 1.0));

  // Empty the polylines array
  polylines = [[]];

  document.getElementById("mode").innerHTML = "Draw Mode";
  document.getElementById("input_div").style.visibility = "hidden";
}

// Draws the File Upload Mode Interface
function fileInterface() {
  filemode = true;

  // Empty the polylines array
  polylines = [[]];

  document.getElementById("mode").innerHTML = "File Mode";
  document.getElementById("input_div").style.visibility = "visible";
}

// Draws the polylines using OpenGL
function drawPolylines() {
  for(var i = 0; i < polylines.length; i++) {
    var line = polylines[i];

    // Bind the vbo for drawing
    vbo.Bind();

    // If only one vertex in polyline, then it is a point
    if (line.length == 1) {
      vbo.FillData(line, gl.STATIC_DRAW);

      gl.drawArrays(gl.POINTS, 0, line.length);
    }
    else if (line.length > 1) {
      vbo.FillData(line, gl.STATIC_DRAW);

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

      // Set identity matrix
      shader.SetUniformMat4("projection_matrix", ortho(0.0, 600.0, 0.0, 600.0, 0.0, 1.0));

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
        else if(entry.length == 4) {
          // File wants us to set projection matrix
          shader.SetUniformMat4("projection_matrix", 
            ortho(parseFloat(entry[0]), parseFloat(entry[2]), parseFloat(entry[3]), parseFloat(entry[1]), 0, 1)
          );
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

	// Initialize shaders
  shader = new GL_Shader(window, "Scene_Shader", "scene_vertex_shader", "scene_fragment_shader");
  shader.Use(); // Use the shader

  fileInterface();

  // Add input handling
  document.addEventListener("click", handleMouseClick, false);
  document.addEventListener("keypress", handleKeyPress, false);
  document.addEventListener("keyup", handleKeyRelease, false);
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
