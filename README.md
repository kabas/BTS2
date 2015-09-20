# BTS2
This is the Open Source repository for the University of California Santa Cruz's new bus tracking system.

The website is built using the Single Page Application Javascript framework called AngularJS. Also Grunt and Bower are used as tools
to better optimize dependency management and code optimization scripts. Tools like JShint are automatically run by Grunt.

##To Build:
In the root directory of the repo run: <br>
<code> grunt build  </code> <br>
This will create the deployable files in the /dist directory.

##To Test:
Change into the /app directory (or /dist directory after building) and run:<br>
<code> grunt serve </code> <br>
A local nodeJS server will be run and you can see the app at http://localhost:9000
