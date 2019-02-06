/*
  CS4731 WebGL Toolkit
  Author: Joseph St. Pierre
  Year: 2019
*/

/*
  The WebGL Toolkit is my personal collection of data structures and helper functions for creating 
  OpenGL web applications
*/

// GL_WINDOW //

/**
 * The GL_Window class creates a new OpenGL context and drawing space
 */
class GL_Window {
  constructor(name, width, height) {
    var canvas = document.createElement('canvas');  // Build a new canvas
    canvas.id = name;
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = '2px solid #000000';

    /**
     * More window specs here
     */

    this.canvas = canvas; // Copy the window
    this.gl = WebGLUtils.setupWebGL(canvas);   // Setup OpenGL context

    // Check for errors
    if (!this.gl) {
      throw new Error("ERROR: Failed to initialize OpenGL!");
    }

    this.SetViewport(0, 0, width, height); // Set the default viewport here
  }

  GetContext() {
    return this.gl;
  }

  GetCanvas() {
    return this.canvas;
  }

  SetViewport(x, y, width, height) {
    this.gl.viewport(x, y, width, height);
  }

};

// GL_SHADER //

/**
 * The GL_Shader class is a wrapper for all OpenGL shader functionalities
 */
class GL_Shader {
  /**
   * Creates a new Shader object
   * @param {The window object for the shader} window
   * @param {The name of the Shader} name 
   * @param {The reference to the vertex shader} vertex_id 
   * @param {The reference to the fragment shader} fragment_id 
   */
  constructor(window, name, vertex_id, fragment_id) {
    this.name = name;   // The name of the shader
    this.gl = window.GetContext();       // Store reference to the context
    this.id = initShaders(window.GetContext(), vertex_id, fragment_id);  // Create shader program
  }

  // Use the Shader program for the draw call
  Use() {
    this.gl.useProgram(this.id);
  }

  /**
   * Set the attribute information for the currently bound GL_BufferObject
   * @param {The name of the attribute to describe} name 
   * @param {The size of the attribute (i.e.) number of elements} size 
   * @param {The data type of the attribute} type 
   * @param {Should OpenGL normalize the attribute data} normalized 
   * @param {The number of bytes until next occurance of the attribute} stride 
   * @param {Byte offset of the attribute} offset 
   */
  SetAttributePointer(name, size, type, normalized, stride, offset) {
    var position = this.gl.getAttribLocation(this.id, name);

    this.gl.vertexAttribPointer(
      position,
      size,
      type,
      normalized,
      stride,
      offset
    );

    this.gl.enableVertexAttribArray(position);
  }

  SetUniformFloat(name, value) {
    var location = this.gl.getUniformLocation(this.id, name);
    this.gl.uniform1f(location, value);
  }

  SetUniformVec4(name, value) {
    var location = this.gl.getUniformLocation(this.id, name);
    this.gl.uniform4fv(location, flatten(value));
  }

  SetUniformMat4(name, value) {
    var location = this.gl.getUniformLocation(this.id, name);
    this.gl.uniformMatrix4fv(location, false, flatten(value));
  }

};

// GL_VERTEX_ARRAY_OBJECT //

/**
 * The GL_VertexArrayObject is a rudimentary custom implementation of the functionality of a VAO
 */
class GL_VertexArrayObject {
  constructor(window) {
    this.gl = window.GetContext();
    this.buffers = [];
  }

  /**
   * Attach a buffer to the VAO
   * @param {The buffer to attach to the VAO} buffer
   */
  Attach(buffer) {
    this.buffers.push(buffer);
  }

  /**
   * Binds the VAO for rendering
   */
  Bind() {
    for (var i = 0; i < this.buffers.length; i++) {
      this.buffers[i].Bind(); // Bind each attached buffer for rendering
    }
  }

  /**
   * Unbinds the VAO
   */
  Unbind() {
    for (var i = 0; i < this.buffers.length; i++) {
      this.buffers[i].Unbind(); // Unbind each attached buffer
    }
  }

  /**
   * Enable a shader attribute for rendering
   * @param {The index of the shader attribute to enable} index 
   */
  EnableAttribute(index) {
    this.gl.enableVertexAttribArray(index);
  }

  /**
   * Tells OpenGL how to interpret attribute data
   * @param {The index of the attribute} index 
   * @param {The number of elements in the attribute} size 
   * @param {The data type of the attribute} type 
   * @param {Should the data be normalized from 0.0 to 1.0} normalized 
   * @param {Number of bytes until next attribute occurance} stride 
   * @param {Number of bytes until first attribute occurance} offset 
   */
  AttributePointer(index, size, type, normalized, stride, offset) {
    this.gl.vertexAttribPointer(
      index,  // The index of the attribute
      size,   // The number of elements in the attribute
      type,   // The data type of each element in the attribute
      normalized,   // Should the data be normalized from 0.0 to 1.0
      stride, // Number of bytes until next occurance of attribute
      offset  // Number of bytes until first occurance of attribute
    );
  }

};

// GL_BUFFER_OBJECT //

/**
 * The GL_BufferObject class is a wrapper for an OpenGL buffer object
 */
class GL_BufferObject {
  /**
   * Constructs a new GL_BufferObject
   * @param {The window handle} window 
   * @param {The binging point for the GL_BufferObject on the GPU} binding_point 
   */
  constructor(window, binding_point) {
    this.gl = window.GetContext();
    this.id = this.gl.createBuffer();
    this.binding_point = binding_point;
  }

  /**
   * Binds the BufferObject
   */
  Bind() {
    this.gl.bindBuffer(this.binding_point, this.id);
  }

  FillData(data, mode) {
    this.gl.bufferData(this.binding_point, flatten(data), mode);
  }

  /**
   * Unbinds the BufferObject
   */
  Unbind() {
    this.gl.bindBuffer(this.binding_point, null);
  }

};

// GL_CAMERA //

/**
 * The GL_Camera class handles the manipulation of the projection and view matrices
 */
class GL_Camera {

};