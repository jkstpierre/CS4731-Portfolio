# CS4731 Projects Documentation

## Overview 

Each project has its own specific project folder wherein all the code
specific to that project exists as well as where the .html file for loading the 
program into a browser is located. Each project is dependent on the files
located in lib so be sure not to change the relative path between the lib folder
and each of the project folders. Inside the lib folder are the three files provided by
the instructor for this course in addition to a custom "toolkit" of my own 
to further abstract the OpenGL code.

## Project 1

Inside the "Project 1" folder exists the Project1.html and Project1.js files.
To run the program, simply click on Project1.html and it will automatically
be loaded into your browser of choice. Additionally there is a data folder
which contains the .dat files to be loaded in for viewing.

There are two modes that the program can be in: File mode or Draw mode. In File mode,
the user can upload .dat files for rendering using polylines. In Draw mode, the user can 
draw their own shapes. To enable File mode press "f" during runtime; to enable Draw mode press "d" 
during runtime. Additionally the colors of the polylines can be changed at anytime by pressing "c" to cycle
between {black, red, green, blue}. Lastly in Draw mode, the user can force the creation of new polylines
by pressing "b".

## Project 2

Inside the "Project 2" folder exists the Project2.html and Project2.js files. To run the program, simply click on Project2.html and it will 
automatically be loaded into your browser of choice. Additionally, there is a data folder which contains the .ply models to be loaded in for viewing.

Once the program has been started, one can load in a .ply file by clicking the "Browse" button below the canvas. After a model has been loaded, it 
will appear on screen. The keyboard control layout is as follows:

"X" - Move the model along the positive x axis
"C" - Move the model along the negative x axis
"Y" - Move the model along the positive y axis
"U" - Move the model along the negative y axis
"Z" - Move the model along the positive z axis
"A" - Move the model along the negative z axis
"R" - Rotate the model around the x axis
"B" - Toggle the pulsing animation of the model (interpolating each polygon's position by its surface normal)

## Project 3

Inside the "Project 3" folder exists the Project3.html and Project3.js files. To run the program, simply click on Project3.html and it will 
automatically be loaded into your browser of choice.

Once the program has been started, an animated model will appear that contains 3 cubes and 3 spheres connected hierarchically with each other.
Unfortunately I was unable to complete anything besides the flat shading lighting so if the user switches to Gouraud lighting the scene will simply
appear fully lit.

The controls are:
"n" - Enable flat shading (on by default)
"m" - Enable Gouraud shading (unimplemented)
"p" - Increase spotlight cutoff angle
"i" - Decrease spotlight cutoff angle

No .ply files are in use, program is entirely self contained.

The spotlight's location is directly by the user's
eye and is focused at the animated object

## Project 4

Inside the "Project 4" folder exists the Project4.html and Project4.js files. To run the program, simply click on Project4.html and it will 
automatically be loaded into your browser of choice.

Once the program has been started, an animated model will appear that contains 3 cubes and 3 spheres connected hierarchically with each other. Additionally, a background
containing a grassy floor and 2 stone walls will be visible. 
Unfortunately I was unable to implement shadow mapping properly and ultimately
removed it from the project as it was breaking the code; however, the keyboard
controls for shadow mapping are still operational.

In addition to the controls from Project 3:
"a" - Toggles shadow mapping
"b" - Toggle textures
"c" - Toggle reflection (is equivalent to toggling cubemapping at the moment)
"d" - Toggle refraction (wasnt able to implement this)

No .ply files are in use, program is entirely self contained.

The spotlight's location is directly by the user's
eye as in the Project 3 and is focused at the animated object
