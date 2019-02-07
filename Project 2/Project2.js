/*
  CS 4731 Project 2
  Author: Joseph St. Pierre
  Year: 2019
*/

// GLOBAL DECLARATIONS //

// Dimensions
const width = 600;
const height = 600;

// OpenGL references
var gl = null;    // Handle to the OpenGL context
var shader = null;  // Handle to the GLSL shader program
var vbo = null;   // Handle to the Vertex Buffer Object

// A model is an array of vertices and surface normals
var model = [];

// Theta value to send to shader for mesh pulsing
var theta = 0.0;

// Trackers
var pulsing = false;

// Matrices
var projection = null;    // Handle to the projection matrix
var view = null;          // Handle to the view matrix
var model = null;         // Handle to the model matrix

// FUNCTIONS //

// This function handles key presses
function handleKeyPress(e) {
  var key = e.which || e.keyCode; // Get key press

  // Toggle pulsing
  if (key == "b".charCodeAt(0)) {
    pulsing = !pulsing;
  }
}

// Compute a polygon's surface normal using Newell's Method
function computeSurfaceNormal(poly) {
  var normal = [0.0, 0.0, 0.0];

  for (var i = 0; i < poly.length; i++){
    var curr = poly[i];
    var next = poly[(i + 1) % poly.length];

    normal[0] += (curr[1] - next[1]) * (curr[2] + next[2]);
    normal[1] += (curr[2] - next[2]) * (curr[0] + next[0]);
    normal[2] += (curr[0] - next[0]) * (curr[1] + next[1]);
  }

  // Compute sum for normalization
  var sum = normal[0] + normal[1] + normal[2];

  // Normalize the vector
  for (var i = 0; i < normal.length; i++) {
    normal[0] /= sum;
    normal[1] /= sum;
    normal[2] /= sum;
  }

  // Return our surface normal
  return normal;
}


// Parse a given .ply model file
function parseModelFile(e) {
  var file = e.target.files[0]; // Get the file
  
  var reader = new FileReader();

  // Read the data
  reader.onload = (function(file_object) {
    return function(evt) {
      data = evt.target.result;
      data = data.split("\n");

      // Destroy the model
      model = [];

      // Temp vars
      var vertex_count = 0;
      var poly_count = 0;

      // An array to store vertices (xyz)
      var vertices = [];

      // Parse the file

      // Read file line by line
      for (var i = 0; i < data.length; i++) {
        var line = data[i].trim().split(' ');   //  Grab and split the line
        // Remove junk data
        line = line.filter(function (e1) {
          return e1 != "";
        });
        
        // Do nothing if empty line
        if (line.length == 0) {
          console.log("Skipping empty line...");
          continue;
        }

        // Check for header line
        else if (i == 0 && line[0] != "ply") {
          console.log("Error: File does not have ply header!");
          break;
        } 
        
        else if (i == 0) {
          console.log("File is valid.");
        }
        
        // Skip format line
        else if (line[0] == "format") {
          console.log("Skipping format line...");
          continue;
        }

        // Skip property line
        else if (line[0] == "property") {
          console.log("Skipping property line...");
          continue;
        }
        
        // Skip end_header line
        else if (line[0] == "end_header") {
          console.log("Skipping end_header line...");
          continue;
        }
        
        // Get number of vertices
        else if (line[0] == "element" && line[1] == "vertex") {
          vertex_count = parseInt(line[2]);
          console.log("Vertex Count: ", vertex_count);
        }

        // Get number of polygons
        else if (line[0] == "element" && line[1] == "face") {
          poly_count = parseInt(line[2]);
          console.log("Polygon Count: ", poly_count);
        }
        
        // Read in a vertex
        else if (line.length == 3) {
          console.log("Loading a vertex");

          // Add the vertex
          vertices.push([parseFloat(line[0]), parseFloat(line[1]), parseFloat(line[2])]);
        }
        
        // Read in a polygon
        else if (line.length == 4) {
          console.log("Loading a polygon");
          
          // Get the 3 vertices of the triangle
          var v1 = vertices[parseInt(line[1])];
          var v2 = vertices[parseInt(line[2])];
          var v3 = vertices[parseInt(line[3])];

          // Compute surface normal
          var normal = computeSurfaceNormal([v1, v2, v3]);
        
          // Push vertices and normals into the model
          model.push(
            [v1, normal, v2, normal, v3, normal]
          );
        }
      }
    }
  })(file);

  reader.readAsText(file);
}

// Application loop function (is called every frame)
function onLoop() {
  requestAnimationFrame(onLoop);

  if (model && model.length > 0) {
    console.log("Reading model into VBO...");
    
    vbo.Bind();   // Bind the VBO data
    vbo.FillData(model, gl.STATIC_DRAW);  // Fill the VBO with the model data
    
    model = [];   // Clear the model data since its all on the GPU
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear the color buffer

  if (pulsing == true) {
    theta += Math.PI / 60.0;
  }

  // Keep theta in range of 0 - 2PI
  if (theta > 2.0 * Math.PI) 
    theta -= 2.0 * Math.PI;
  
  shader.SetUniformFloat("theta", theta); // Update theta in shader program
}

// Main program function
function main() {
  // Create a new OpenGL window
  var window = new GL_Window("CS 4731 Project 2", width, height);
  gl = window.GetContext();   // Get OpenGL context from the window

  // Append the window to the canvas binding point in our html document
  document.getElementById("canvas_binding_point").appendChild(window.GetCanvas());

  // Enable keyboard events
  document.addEventListener("keypress", handleKeyPress, false);
  
  // Enable file input
  document.getElementById("file_input").addEventListener('change', parseModelFile, false);

  // Create new Shader program
  shader = new GL_Shader(window, "Scene_Shader", "scene_vertex_shader", "scene_fragment_shader");
  shader.Use();   // Enable our shader

  // Create a new VBO
  vbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);
  vbo.Bind(); // Bind the VBO

  // Tell OpenGL where in the VBO each vertex position and normal is located
  shader.SetAttributePointer("vertex_position", 3, gl.FLOAT, false, 6 * 4, 0);
  shader.SetAttributePointer("vertex_normal", 3, gl.FLOAT, false, 6 * 4, 3 * 4);

  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);

  // Set projection matrix

  // Set view matrix

  // Set model matrix

  // Set fragment color to white
  shader.SetUniformVec4("fragment_color", [1.0, 1.0, 1.0, 1.0]);

  onLoop();
}