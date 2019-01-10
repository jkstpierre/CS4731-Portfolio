/*
  CS4731 WebGL Toolkit
  Author: Joseph St. Pierre
  Year: 2019
*/

/*
  The WebGL Toolkit is a personal collection of data structures and helper functions for creating 
  OpenGL web applications
*/

// GL_WINDOW //

/**
 * The GL_Window class creates a new OpenGL context and drawing space
 */
class GL_Window {
  constructor(name, width, height) {
    var window = document.createElement('canvas');  // Build a new canvas
    window.id = name;
    window.width = width;
    window.height = height;

    /**
     * More window specs here
     */

    this.window = window; // Copy the window
    this.gl = WebGLUtils.setupWebGL(window);   // Setup OpenGL context

    // Check for errors
    if (!this.gl) {
      throw new Error("ERROR: Failed to initialize OpenGL!");
    }

    this.SetViewport(0, 0, width, height); // Set the default viewport here
  }

  GetContext() {
    return this.gl;
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
   * @param {The OpenGL context for the Shader} gl
   * @param {The name of the Shader} name 
   * @param {The reference to the vertex shader} vertex_id 
   * @param {The reference to the fragment shader} fragment_id 
   */
  constructor(gl, name, vertex_id, fragment_id) {
    this.name = name;   // The name of the shader
    this.gl = gl;       // Store reference to the context
    this.id = initShaders(gl, vertex_id, fragment_id);  // Create shader program
  }

  // Use the Shader program for the draw call
  Use() {
    this.gl.useProgram(this.id);
  }

};

// GL_VERTEX_ARRAY_OBJECT //

/**
 * The GL_VertexArrayObject is a rudimentary custom implementation of the functionality of a VAO
 */
class GL_VertexArrayObject {
  constructor(gl) {
    this.gl = gl;
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

};

// GL_BUFFER_OBJECT //

/**
 * The GL_BufferObject class is a wrapper for an OpenGL buffer object
 */
class GL_BufferObject {
  /**
   * Constructs a new GL_BufferObject
   * @param {The OpenGL context} gl 
   * @param {The binging point for the GL_BufferObject on the GPU} binding_point 
   */
  constructor(gl, binding_point) {
    this.id = gl.createBuffer();
    this.binding_point = binding_point;
    this.gl = gl;
  }

  /**
   * Binds the BufferObject
   */
  Bind() {
    this.gl.bindBuffer(this.binding_point, this.id);
  }

  /**
   * Unbinds the BufferObject
   */
  Unbind() {
    this.gl.bindBuffer(this.binding_point, null);
  }

};