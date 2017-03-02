<!--
The MIT License (MIT)

Copyright (c) 2015 Kevin Abas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-->	

# BTS2
This is the Open Source repository for the University of California Santa Cruz's new bus tracking system.

The website is built using the Single Page Application Javascript framework called AngularJS. Also Grunt and Bower are used as tools
to better optimize dependency management and code optimization scripts. Tools like JShint are automatically run by Grunt.

##To Build:
In the root directory of the repo run: <br>
<code> bower install </code> <br>

<code> grunt build  </code> <br>
This will create the deployable files in the /dist directory. If you generate any errors during the build, you might need to update your generators. Run <code> yo </code> and select upgrade generators.

##To Test:
Change into the /app directory (or /dist directory after building) and run:<br>
<code> grunt serve </code> <br>
A local nodeJS server will be run and you can see the app at http://localhost:9000

##What Does What
- AngularJS is acting as the front end UI layer
- A Go app acts an API to pull live data from the campus shuttles with GPS devices.
- A MySQL DB is used to store information about the shuttles, routes and hardware.
- bts.ucsc.edu is a SmartOS VM running the API and web layers.
- bts-dev.ucsc.edu is a dev VM.
- bts-mysql.ucsc.edu is the DB server.
- There is (was) an Android app available in the store.
- An iOS app was never released but might make a good project.

