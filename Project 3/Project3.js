/*
  CS 4731 Project 3
  Author: Joseph St. Pierre
  Year: 2019
*/

// Window dimensions
const width = 600;    // 600 pixels wide
const height = 600;   // 600 pixels high

// OpenGL references
var gl = null;
var shader = null;
var cube_vbo = null;      // Cube vertex buffer
var cube_nbo = null;
var sphere_vbo = null;    // Sphere vertex buffer
var sphere_nbo = null;    // Sphere normal buffer
var cube_ebo = null;      // Cube element array buffer
var sphere_ebo = null;    // Sphere element array buffer
var wire_vbo = null;
var flat_shading = true;  // Flat shading on by default

// Lighting
var light_position = vec4(1.0, 1.0, 1.0, 0.0);
var light_ambient = vec4(0.2, 0.2, 0.2, 1.0);
var light_diffuse = vec4(1.0, 1.0, 1.0, 1.0);
var light_specular = vec4(1.0, 1.0, 1.0, 1.0);

var material_diffuse = vec4(0.1, 0.1, 0.1, 1.0);
var material_specular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 20.0;

// OpenGL models

// Vertices of the cube model
var cube_vertices = [
// Front face             
-1.0, -1.0,  1.0, 1.0,    
1.0, -1.0,  1.0, 1.0,     
1.0,  1.0,  1.0, 1.0,    
-1.0,  1.0,  1.0, 1.0,    

// Back face
-1.0, -1.0, -1.0, 1.0,    
-1.0,  1.0, -1.0, 1.0,    
1.0,  1.0, -1.0, 1.0,    
1.0, -1.0, -1.0, 1.0,     

// Top face
-1.0,  1.0, -1.0, 1.0,    
-1.0,  1.0,  1.0, 1.0,    
1.0,  1.0,  1.0, 1.0,     
1.0,  1.0, -1.0, 1.0,     

// Bottom face
-1.0, -1.0, -1.0, 1.0,    
1.0, -1.0, -1.0, 1.0,     
1.0, -1.0,  1.0, 1.0,     
-1.0, -1.0,  1.0, 1.0,    

// Right face
1.0, -1.0, -1.0, 1.0,     
1.0,  1.0, -1.0, 1.0,     
1.0,  1.0,  1.0, 1.0,     
1.0, -1.0,  1.0, 1.0,     

// Left face
-1.0, -1.0, -1.0, 1.0,    
-1.0, -1.0,  1.0, 1.0,    
-1.0,  1.0,  1.0, 1.0,    
-1.0,  1.0, -1.0, 1.0     
];

var cube_normals = [
  // Front
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 1.0, 0.0,
  0.0, 0.0, 1.0, 0.0,

  // Back
  0.0, 0.0, -1.0, 0.0,
  0.0, 0.0, -1.0, 0.0,
  0.0, 0.0, -1.0, 0.0,
  0.0, 0.0, -1.0, 0.0,

  // Top
  0.0, 1.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,
  0.0, 1.0, 0.0, 0.0,

  // Bottom
  0.0, -1.0, 0.0, 0.0,
  0.0, -1.0, 0.0, 0.0,
  0.0, -1.0, 0.0, 0.0,
  0.0, -1.0, 0.0, 0.0,

  // Right
  1.0, 0.0, 0.0, 0.0,
  1.0, 0.0, 0.0, 0.0,
  1.0, 0.0, 0.0, 0.0,
  1.0, 0.0, 0.0, 0.0,

  // Left
  -1.0, 0.0, 0.0, 0.0,
  -1.0, 0.0, 0.0, 0.0,
  -1.0, 0.0, 0.0, 0.0,
  -1.0, 0.0, 0.0, 0.0,
];

// Indices of the cube model
var cube_indices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];

var wire_vertices = [
  0.0, 0.0, 0.0, 1.0, 
  0.0, 1.0, 0.0, 1.0
];

var sphere_subdivisions = 4;

var sphere_va = vec4(0.0, 0.0, -1.0, 1.0);
var sphere_vb = vec4(0.0, 0.942809, 0.333333, 1.0);
var sphere_vc = vec4(-0.816497, -0.471405, 0.333333, 1.0);
var sphere_vd = vec4(0.816497, -0.471405, 0.333333, 1.0);

// Sphere has no vertices or indices to start with
var sphere_vertices = [];
var sphere_normals = [];
var sphere_indices = [];

function triangle(a, b, c) {
  var start_index = sphere_vertices.length; // Get start index

  // Add sphere vertices
  sphere_vertices.push(a);
  sphere_vertices.push(b);
  sphere_vertices.push(c);

  // Add sphere normals
  sphere_normals.push(a[0],a[1], a[2], 0.0);
  sphere_normals.push(b[0],b[1], b[2], 0.0);
  sphere_normals.push(c[0],c[1], c[2], 0.0);

  // Add the indices for element drawing
  sphere_indices.push(start_index + 0);
  sphere_indices.push(start_index + 1);
  sphere_indices.push(start_index + 2);
}

function divideTriangle(a, b, c, count) {
  if ( count > 0 ) {
    var ab = mix( a, b, 0.5);
    var ac = mix( a, c, 0.5);
    var bc = mix( b, c, 0.5);

    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);

    divideTriangle( a, ab, ac, count - 1 );
    divideTriangle( ab, b, bc, count - 1 );
    divideTriangle( bc, c, ac, count - 1 );
    divideTriangle( ab, bc, ac, count - 1 );
  }
  else {
    triangle( a, b, c );
  }
}

function tetrahedron(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}

function handleKeyPress(e) {
  var key = e.which || e.keyCode; // Get key press

  if (key == "p".charCodeAt(0)) {
    // Increase spotlight cut off angle
    materialShininess += 1.0;
  }

  else if (key == "i".charCodeAt(0)) {
    // Decrease spotlight cut off angle
    materialShininess -= 1.0;
  }

  else if (key == "m".charCodeAt(0)) {
    // Use smooth shading Gouraud method
    shader.SetUniformFloat("use_light", 0.0);
  }

  else if (key == "n".charCodeAt(0)) {
    // Use flat shading
    shader.SetUniformFloat("use_light", 1.0);
  }
}

function trimTheta(theta) {
  if (theta >= 360)
    theta -= 360;

  return theta;
}

// Cube 1 consts
const cube1_position = vec4(0.0, 2.0, 0.0, 1.0);  // Centered at origin
const cube1_color = vec4(1.0, 0.0, 0.0, 1.0);
const cube1_speed = 30;   // 30 degrees per second 
var   cube1_theta = 0.0;

// Cube 2 consts
const cube2_position = vec4(2.5, -3.5, 0.0, 1.0); // Relative to parent cube1
const cube2_color = vec4(0.0, 0.5, 0.2, 1.0);
const cube2_speed = -60;   // -15 degrees per second
var   cube2_theta = 60.0; // Starts at 60 degrees theta

// Cube 3 consts
const cube3_position = vec4(2.5, -3.5, 0.0, 1.0); // Relative to parent cube2
const cube3_color = vec4(0.4, 0.4, 0.4, 1.0);
const cube3_speed = 60;
var   cube3_theta = 0.0;

// Sphere 1 consts
const sphere1_position = vec4(-2.5, -3.5, 0.0, 1.0);
const sphere1_color = vec4(0.9, 0.5, 0.3, 1.0);
const sphere1_speed = 60;
var   sphere1_theta = 0.0;

// Sphere 2 consts
const sphere2_position = vec4(-2.5, -3.5, 0.0, 1.0);
const sphere2_color = vec4(0.3, 0.5, 0.9, 1.0);
const sphere2_speed = -45;
var   sphere2_theta = 0.0;

// Sphere 3 consts
const sphere3_position = vec4(0.0, -3.5, 0.0, 1.0);
const sphere3_color = vec4(0.5, 0.2, 0.7, 1.0);
const sphere3_speed = 45;
var   sphere3_theta = 0.0;

function drawModel() {
  const dt = 1.0 / 60.0;  // Timestep constant
  
  var model_matrix = null;

  var matrix_stack = new GL_MatrixStack();  // Create a new matrix stack

  // DRAW CUBES 

  shader.SetUniformFloat("wireframe", 0.0); // We are not drawing wires

  cube_vbo.Bind();

  // Tell shaders how to interpret cube vbo data
  shader.SetAttributePointer(
    "vertex_position", // Which attribute to bind to
    4,        // Number of elements per attribute (x, y , z, w)
    gl.FLOAT, // Elements are floating point numbers 
    gl.FALSE, // Do not normalize data
    0,        // 32 bytes to next attribute
    0         // No offset in buffer
  );

  cube_nbo.Bind();

  shader.SetAttributePointer(
    "vertex_normal",
    4,
    gl.FLOAT,
    gl.FALSE,
    0,
    0
  );

  cube_ebo.Bind();

  // LAYER 1

  // Compute cube 1 model matrix

  // Compute rotation
  cube1_theta += cube1_speed * dt;
  cube1_theta = trimTheta(cube1_theta);

  // Build model matrix
  model_matrix = mult(translate(cube1_position[0], cube1_position[1], cube1_position[2]), rotateY(cube1_theta));

  shader.SetUniformMat4("model_matrix", model_matrix);
  shader.SetUniformVec4("material_color", cube1_color);

  // Draw cube 1
  gl.drawElements(gl.TRIANGLES, cube_indices.length, gl.UNSIGNED_SHORT, 0);

  // Push model matrix to top of stack
  matrix_stack.Push(model_matrix);

  // LAYER 2

  // Compute cube 2 model matrix

  // Compute rotation
  cube2_theta += cube2_speed * dt;
  cube2_theta = trimTheta(cube2_theta);

  // Build model_matrix
  model_matrix = mult(translate(cube2_position[0], cube2_position[1], cube2_position[2]), rotateY(cube2_theta));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  // Add model matrix to stack
  matrix_stack.Push(model_matrix);
  
  // Set cube2 uniforms
  shader.SetUniformMat4("model_matrix", model_matrix);
  shader.SetUniformVec4("material_color", cube2_color);
  
  // Draw cube 2
  gl.drawElements(gl.TRIANGLES, cube_indices.length, gl.UNSIGNED_SHORT, 0);

  // LAYER 3

  // Compute cube 3 model matrix

  // Compute rotation
  cube3_theta += cube3_speed * dt;
  cube3_theta = trimTheta(cube3_theta);

  // Build model matrix
  model_matrix = mult(translate(cube3_position[0], cube3_position[1], cube3_position[2]), rotateY(cube3_theta));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  // Set cube3 uniforms
  shader.SetUniformMat4("model_matrix", model_matrix);
  shader.SetUniformVec4("material_color", cube3_color);

  // Draw cube3
  gl.drawElements(gl.TRIANGLES, cube_indices.length, gl.UNSIGNED_SHORT, 0);

  // Set model to sphere

  sphere_vbo.Bind();

  // Tell shaders how to interpret sphere vbo data
  shader.SetAttributePointer(
    "vertex_position", // Which attribute to bind to
    4,        // Number of elements per attribute (x, y , z, w)
    gl.FLOAT, // Elements are floating point numbers 
    gl.FALSE, // Do not normalize data
    0,        // Data is tightly packed
    0         // No offset in buffer
  );

  sphere_nbo.Bind();

  shader.SetAttributePointer( 
    "vertex_normal",
    4,
    gl.FLOAT,
    gl.FALSE,
    0,
    0
  );

  sphere_ebo.Bind();

  // Compute sphere 1 model matrix

  // Compute rotation
  sphere1_theta += sphere1_speed * dt;
  sphere1_theta = trimTheta(sphere1_theta);

  // Build model matrix
  model_matrix = mult(translate(sphere1_position[0], sphere1_position[1], sphere1_position[2]), rotateY(sphere1_theta));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  // Set sphere1 uniforms
  shader.SetUniformMat4("model_matrix", model_matrix);
  shader.SetUniformVec4("material_color", sphere1_color);

  // Draw sphere 1
  for( var i=0; i< sphere_indices.length; i+=3)
    gl.drawArrays( gl.TRIANGLES, i, 3 );

  // LAYER 2

  matrix_stack.Pop(); // Pop off a layer

  // Compute sphere 2 model matrix

  // Compute rotation
  sphere2_theta += sphere2_speed * dt;
  sphere2_theta = trimTheta(sphere2_theta);

  // Build model matrix
  model_matrix = mult(translate(sphere2_position[0], sphere2_position[1], sphere2_position[2]), rotateY(sphere2_theta));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  matrix_stack.Push(model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);
  shader.SetUniformVec4("material_color", sphere2_color);

  // Draw sphere 2
  for( var i=0; i< sphere_indices.length; i+=3)
    gl.drawArrays( gl.TRIANGLES, i, 3 );

  // LAYER 3

  // Compute sphere3 model matrix

  // Compute rotation
  sphere3_theta += sphere3_speed * dt;
  sphere3_theta = trimTheta(sphere3_theta);

  // Build model matrix
  model_matrix = mult(translate(sphere3_position[0], sphere3_position[1], sphere3_position[2]), rotateY(sphere3_theta));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);
  shader.SetUniformVec4("material_color", sphere3_color);

  // Draw sphere 3
  for( var i=0; i< sphere_indices.length; i+=3)
    gl.drawArrays( gl.TRIANGLES, i, 3 );
  
  // Pop to layer 2
  matrix_stack.Pop();

  // Draw wires

  // LAYER 2

  wire_vbo.Bind();  // Bind the wireframe vbo

  // Tell OpenGL how to read wireframe data
  shader.SetAttributePointer(
    "vertex_position", // Which attribute to bind to
    4,        // Number of elements per attribute (x, y , z, w)
    gl.FLOAT, // Elements are floating point numbers 
    gl.FALSE, // Do not normalize data
    0,        // Data is tightly packed
    0         // No offset in buffer
  );

  shader.SetUniformFloat("wireframe", 1.0); // We are now drawing wires

  model_matrix = scalem(1.0, -1.75, 1.0);
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);
  
  gl.drawArrays(gl.LINES, 0, 2);

  model_matrix = mult(translate(-2.5, -1.75, 0.0), scalem(1.0, -0.75, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);
  
  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  model_matrix = mult(translate(2.5, -1.75, 0.0), scalem(1.0, -0.75, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);
  
  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  // Draw horizontal beam
  model_matrix = mult(translate(0.0, -1.75, 0.0), rotateZ(-90));
  model_matrix = mult(model_matrix, scalem(1.0, 2.5, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  // Draw horizontal beam
  model_matrix = mult(translate(0.0, -1.75, 0.0), rotateZ(90));
  model_matrix = mult(model_matrix, scalem(1.0, 2.5, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  // LAYER 3

  model_matrix = mult(translate(cube2_position[0], cube2_position[1], cube2_position[2]), rotateY(cube2_theta));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);
  
  matrix_stack.Push(model_matrix);

  model_matrix = scalem(1.0, -1.75, 1.0);
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);
  
  gl.drawArrays(gl.LINES, 0, 2);

  model_matrix = mult(translate(-2.5, -1.75, 0.0), scalem(1.0, -0.75, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);
  
  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  model_matrix = mult(translate(2.5, -1.75, 0.0), scalem(1.0, -0.75, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);
  
  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  // Draw horizontal beam
  model_matrix = mult(translate(0.0, -1.75, 0.0), rotateZ(-90));
  model_matrix = mult(model_matrix, scalem(1.0, 2.5, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  // Draw horizontal beam
  model_matrix = mult(translate(0.0, -1.75, 0.0), rotateZ(90));
  model_matrix = mult(model_matrix, scalem(1.0, 2.5, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);

  gl.drawArrays(gl.LINES, 0, 2);

  // LAYER 2
  matrix_stack.Pop();

  model_matrix = mult(translate(sphere2_position[0], sphere2_position[1], sphere2_position[2]), rotateY(sphere2_theta));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);
  
  matrix_stack.Push(model_matrix);

  model_matrix = mult(translate(0.0, -1.0, 0.0), scalem(1.0, -1.5, 1.0));
  model_matrix = mult(matrix_stack.Peek(), model_matrix);

  shader.SetUniformMat4("model_matrix", model_matrix);
  
  gl.drawArrays(gl.LINES, 0, 2);
}

// Called every animation frame
function onLoop() {
  requestAnimationFrame(onLoop);

  // Set the clear color and clear color and depth buffers
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawModel();
}

function main() {
  // Create a new OpenGL window
  var window = new GL_Window("CS 4731 Project 2", width, height);
  gl = window.GetContext();   // Get OpenGL context from the window

  // Append the window to the canvas binding point in our html document
  document.getElementById("canvas_binding_point").appendChild(window.GetCanvas());

  // Enable keyboard events
  document.addEventListener("keypress", handleKeyPress, false);

  // Create new Shader program
  shader = new GL_Shader(window, "Scene_Shader", "scene_vertex_shader", "scene_fragment_shader");
  shader.Use();   // Enable our shader

  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);

  // Enable backface culling
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  // Generate sphere model
  tetrahedron(sphere_va, sphere_vb, sphere_vc, sphere_vd, sphere_subdivisions);

  // Create vbos and ebos

  // Create element array buffer for cube and sphere
  cube_ebo = new GL_BufferObject(window, gl.ELEMENT_ARRAY_BUFFER);
  cube_ebo.Bind();

  // Fill ebo with cube index data
  cube_ebo.FillRawData(new Uint16Array(cube_indices), gl.STATIC_DRAW);

  sphere_ebo = new GL_BufferObject(window, gl.ELEMENT_ARRAY_BUFFER);
  sphere_ebo.Bind();

  // Fill ebo with sphere index data
  sphere_ebo.FillRawData(new Uint16Array(sphere_indices), gl.STATIC_DRAW);

  // Unbind element buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // Create cube vertex buffer
  cube_vbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);
  cube_vbo.Bind();
  
  // Fill cube vbo with vertex data
  cube_vbo.FillData(cube_vertices, gl.STATIC_DRAW);
  
  // Create sphere vertex buffer
  sphere_vbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);
  sphere_vbo.Bind();

  // Fill sphere vbo with vertex data
  sphere_vbo.FillData(sphere_vertices, gl.STATIC_DRAW);

  // Create sphere normal buffer
  sphere_nbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);
  sphere_nbo.Bind();

  // Fill sphere nbo with normal data
  sphere_nbo.FillData(sphere_normals, gl.STATIC_DRAW);

  // Create cube normal buffer
  cube_nbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);
  cube_nbo.Bind();

  // Fill cube nbo with normal data
  cube_nbo.FillData(cube_normals, gl.STATIC_DRAW);

  // Create the wire vbo
  wire_vbo = new GL_BufferObject(window, gl.ARRAY_BUFFER);
  wire_vbo.Bind();

  wire_vbo.FillData(wire_vertices, gl.STATIC_DRAW);

  // Unbind the buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Setup our projection matrix
  shader.SetUniformMat4("projection_matrix", perspective(45, 1, 0.1, 10000.0));

  // Setup our view matrix
  shader.SetUniformMat4("view_matrix", lookAt([0.0, -2.0, 20.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]))

  // Setup our model matrix
  shader.SetUniformMat4("model_matrix", mat4());
  
  // Set the default fragment color
  shader.SetUniformVec4("material_color", vec4(1.0, 1.0, 1.0, 1.0));

  // Setup lighting

  var diffuse_product = mult(light_diffuse, material_diffuse);
  var specular_product = mult(light_specular, material_specular);
  
  shader.SetUniformVec4("diffuse_product", diffuse_product);
  shader.SetUniformVec4("specular_product", specular_product);
  shader.SetUniformVec4("light_ambient", light_ambient);
  shader.SetUniformVec4("light_pos", light_position);
  shader.SetUniformFloat("shininess", materialShininess);

  shader.SetUniformFloat("use_light", 1.0);

  onLoop();
}