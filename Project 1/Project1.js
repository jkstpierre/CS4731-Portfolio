/*
	CS4731 Project 1
	Author: Joseph St. Pierre
	Year: 2019
*/

function main() {
  var window = new GL_Window("My first WebGL program", 400, 400);
  var gl = window.GetContext();

	// Initialize shaders
  var shader = new GL_Shader(gl, "Scene_Shader", "scene_vertex_shader", "scene_fragment_shader");
  shader.Use(); // Use the shader
  
  console.log("It works!");

  var vao = new GL_VertexArrayObject(gl);

  var vbo = new GL_BufferObject(gl, gl.ARRAY_BUFFER);

  vao.Attach(vbo);

  vao.Bind();

  // Can draw stuff here

  vao.Unbind();
}
