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
var vertex_count = 0;
var poly_count = 0;

// Theta value to send to shader for mesh pulsing
var theta = 0.0;

// Trackers
var pulsing = false;
var x_pos_trans = false;
var x_neg_trans = false;
var y_pos_trans = false;
var y_neg_trans = false;
var z_pos_trans = false;
var z_neg_trans = false;
var x_rotate = false;

// Model position and rotation
var model_offset = [0.0, 0.0, 0.0];
var model_rotation = 0.0;

// Bounding box
var max_box = [0.0, 0.0, 0.0];
var min_box = [0.0, 0.0, 0.0];

// FUNCTIONS //

// This function handles key presses
function handleKeyPress(e) {
  var key = e.which || e.keyCode; // Get key press

  // Toggle pulsing
  if (key == "b".charCodeAt(0)) {
    pulsing = !pulsing;
  }

  // Toggle positive x translation
  else if (key == "x".charCodeAt(0)) {
    if (x_neg_trans | x_pos_trans | y_pos_trans | y_neg_trans | z_pos_trans | z_neg_trans) {
      x_neg_trans = false;
      x_pos_trans = false;

      y_pos_trans = false;
      y_neg_trans = false;

      z_pos_trans = false;
      z_neg_trans = false
    }
    else
      x_pos_trans = true;
  }

  // Toggle negative x translation
  else if (key == "c".charCodeAt(0)) {
    if (x_neg_trans | x_pos_trans | y_pos_trans | y_neg_trans | z_pos_trans | z_neg_trans) {
      x_neg_trans = false;
      x_pos_trans = false;

      y_pos_trans = false;
      y_neg_trans = false;

      z_pos_trans = false;
      z_neg_trans = false
    }
    else
      x_neg_trans = true;
  }

  // Toggle positive y translation
  else if (key == "y".charCodeAt(0)) {
    if (x_neg_trans | x_pos_trans | y_pos_trans | y_neg_trans | z_pos_trans | z_neg_trans) {
      x_neg_trans = false;
      x_pos_trans = false;

      y_pos_trans = false;
      y_neg_trans = false;

      z_pos_trans = false;
      z_neg_trans = false
    }
    else
      y_pos_trans = true;
  }

  // Toggle negative y translation
  else if (key == "u".charCodeAt(0)) {
    if (x_neg_trans | x_pos_trans | y_pos_trans | y_neg_trans | z_pos_trans | z_neg_trans) {
      x_neg_trans = false;
      x_pos_trans = false;

      y_pos_trans = false;
      y_neg_trans = false;

      z_pos_trans = false;
      z_neg_trans = false
    }
    else
      y_neg_trans = true;
  }

  // Toggle positive z translation
  else if (key == "z".charCodeAt(0)) {
    if (x_neg_trans | x_pos_trans | y_pos_trans | y_neg_trans | z_pos_trans | z_neg_trans) {
      x_neg_trans = false;
      x_pos_trans = false;

      y_pos_trans = false;
      y_neg_trans = false;

      z_pos_trans = false;
      z_neg_trans = false
    }
    else
      z_pos_trans = true;
  }

  // Toggle negative z translation
  else if (key == "a".charCodeAt(0)) {
    if (x_neg_trans | x_pos_trans | y_pos_trans | y_neg_trans | z_pos_trans | z_neg_trans) {
      x_neg_trans = false;
      x_pos_trans = false;

      y_pos_trans = false;
      y_neg_trans = false;

      z_pos_trans = false;
      z_neg_trans = false
    }
    else
      z_neg_trans = true;
  }

  else if (key == "r".charCodeAt(0)) {
    x_rotate = !x_rotate;
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

  // Compute magnitude for normalization
  var magnitude = Math.sqrt(
    (normal[0] * normal[0]) +
    (normal[1] * normal[1]) + 
    (normal[2] * normal[2])
  );

  // Normalize the vector
  normal[0] /= magnitude;
  normal[1] /= magnitude
  normal[2] /= magnitude

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
      max_box = [0.0, 0.0, 0.0];
      min_box = [0.0, 0.0, 0.0];

      vertex_count = 0;
      poly_count = 0;

      // An array to store vertices (xyz)
      var vertices = [];
      
      // Track if first vertex or not
      var first_vertex = true;

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

          var v1 = parseFloat(line[0]);
          var v2 = parseFloat(line[1]);
          var v3 = parseFloat(line[2]);

          // Add the vertex
          vertices.push([v1, v2, v3]);
          
          // If this is first vertex
          if (first_vertex) {
            max_box = [v1, v2, v3];
            min_box = [v1, v2, v3];

            first_vertex = false;
          }
          else {
            // Compute bounding box vertices

            if (max_box[0] < v1)
              max_box[0] = v1;
            if (max_box[1] < v2)
              max_box[1] = v2;
            if (max_box[2] < v3)
              max_box[2] = v3;
              
            if (min_box[0] > v1)
              min_box[0] = v1;
            if (min_box[1] > v2)
              min_box[1] = v2;
            if (min_box[2] > v3)
              min_box[2] = v3;
          }
        }
        
        // Read in a polygon
        else if (line.length == 4) {
          console.log("Loading a polygon");
          
          // Get the 3 vertices of the triangle
          var v1 = vertices[parseInt(line[1])];
          var v2 = vertices[parseInt(line[2])];
          var v3 = vertices[parseInt(line[3])];

          // Compute surface normal
          var normal = computeSurfaceNormal([v3, v1, v2]);
        
          // Push vertices and normals into the model
          model.push(
            [v1, normal, v2, normal, v3, normal]
          );
        }
      }

      // The center of the object
      var midpoint = [(max_box[0] + min_box[0]) / 2.0, (max_box[1] + min_box[1]) / 2.0, (max_box[2] + min_box[2]) / 2.0];

      // Z distance from camera to object
      var z_distance = max_box[2] * 6;

      var fov_angle = 2 * Math.atan2((max_box[1] - min_box[1]), 2 * z_distance);  // Compute field of view
      fov_angle = 180.0 * fov_angle / Math.PI;    // Convert to degrees

      console.log(fov_angle);

      shader.Use();

      // Set default projection matrix
      shader.SetUniformMat4("projection_matrix", perspective(fov_angle, width / height, 0.1, 10000.0));

      // Set default view matrix
      shader.SetUniformMat4("view_matrix", lookAt([midpoint[0], midpoint[1], z_distance], midpoint, [0.0, 1.0, 0.0]));

      // Reset pulsing
      pulsing = false;

      // Reset theta
      theta = 0.0;
      
      // Reset offset and rotation
      model_offset = [0.0, 0.0, 0.0];
      model_rotation = 0.0;

      // Reset movement trackers
      x_pos_trans = false;
      x_neg_trans = false;
      y_pos_trans = false;
      y_neg_trans = false;
      z_pos_trans = false;
      z_neg_trans = false;
      x_rotate = false;

      console.log(model);
      console.log(max_box);
      console.log(min_box);
    }
  })(file);

  reader.readAsText(file);
}

// Application loop function (is called every frame)
function onLoop() {
  requestAnimationFrame(onLoop);

  // Handle clear color and depth buffer
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear the color buffer

  // Handle pulsing animation
  if (pulsing) {
    theta += Math.PI / 120.0;
  }

  // Keep theta in range of 0 - 2PI
  if (theta > 2.0 * Math.PI) 
    theta -= 2.0 * Math.PI;
  
  shader.SetUniformFloat("theta", theta); // Update theta in shader program

  if (x_pos_trans) {
    model_offset[0] += 1.0 / 60.0;
  }
  else if (x_neg_trans) {
    model_offset[0] -= 1.0 / 60.0;
  }
  else if (y_pos_trans) {
    model_offset[1] += 1.0 / 60.0;
  }
  else if (y_neg_trans) {
    model_offset[1] -= 1.0 / 60.0;
  }
  else if (z_pos_trans) {
    model_offset[2] += 1.0 / 60.0;
  }
  else if (z_neg_trans) {
    model_offset[2] -= 1.0 / 60.0;
  }

  // Rotate model if necessary
  if (x_rotate) {
    model_rotation += Math.PI / 120.0;
  }

  // Keep rotation in reasonable range
  if (model_rotation > 2.0 * Math.PI) 
    model_rotation -= 2.0 * Math.PI;

  // Translate model matrix
  let model_matrix = mult(translate(model_offset[0], model_offset[1], model_offset[2]), rotateX(180.0 * model_rotation / Math.PI));

  // Send model matrix to shader
  shader.SetUniformMat4("model_matrix", model_matrix);

  if (model && model.length > 0) {

    vbo.Bind();   // Bind the VBO data

    for (var i = 0; i < model.length; i++) {
      var poly = model[i];

      vbo.FillData(poly, gl.STATIC_DRAW);  // Fill the VBO with the model data

      // Draw the polygon
      gl.drawArrays(gl.LINE_LOOP, 0, 3);
    }
  }
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

  // Set default projection matrix
  shader.SetUniformMat4("projection_matrix", perspective(45, 1, 0.1, 10000.0));

  // Set default view matrix
  shader.SetUniformMat4("view_matrix", lookAt([2.0, 0.0, 10.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]));

  // Set default model matrix
  shader.SetUniformMat4("model_matrix", mat4());

  // Set fragment color to white
  shader.SetUniformVec4("fragment_color", [1.0, 1.0, 1.0, 1.0]);

  // Setup viewport
  gl.viewport(0, 0, width, height);

  onLoop();
}