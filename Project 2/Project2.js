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

// A model is an array of polygons
var model = [];

// Contains the surface normals for the model
var normals = [];

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

// Parse a given .ply model file
function parseModelFile(e) {

}

// Application loop function (is called every frame)
function onLoop() {
  requestAnimationFrame(onLoop);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear the color buffer

  if (pulsing == true) {
    theta += Math.PI / 60.0;
  }

  // Keep theta in range of 0 - 2PI
  if (theta > 2.0 * Math.PI) 
    theta -= 2.0 * Math.PI;
  
  shader.Use(); // Enable shader program
  shader.SetUniformFloat("theta", theta); // Update theta in shader program
}

// Main program function
function main() {
  // Create a new OpenGL window
  var window = new GL_Window("CS 4731 Project 2", width, height);
  gl = window.GetContext();   // Get OpenGL context from the window

  // Append the window to the canvas binding point in our html document
  document.getElementById("canvas_binding_point").appendChild(window.GetCanvas());
  
  // Create new Shader program
  shader = new GL_Shader(window, "Scene_Shader", "scene_vertex_shader", "scene_fragment_shader");
  shader.Use();   // Enable our shader

  // Enable keyboard events
  document.addEventListener("keypress", handleKeyPress, false);
  
  // Enable file input
  document.getElementById("file_input").addEventListener('change', parseModelFile, false);

  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);

  // Set projection matrix

  

  onLoop();
}