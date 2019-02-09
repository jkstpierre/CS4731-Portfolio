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

Once the program has been started, one can load in a .ply file by clicking the "Browse" button below the canvas. After a model has been loaded,
