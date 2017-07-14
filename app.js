const express = require('express');

//Lets you build dynamic templates, loads hbs module
const hbs = require('hbs');

//Lets you write to files (fs = file system)
const fs = require('fs');

const os = require('os');
const username = os.userInfo().username;

//proccess.env has access to every environment variable on the computer (check them on terminal by typing 'env')
//Sets port the value of environment variable generated by heroku PORT;
//If the variable has no value, its set to 3000
const port = process.env.PORT || 3000;

var app = express();

//Register the path to partials templates for hbs
hbs.registerPartials(__dirname + '/views/partials');

//Registers the function getFullYear to be used inside any template
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

//Registers a function that receives a string and return it all uppercase to be used inside any template
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//Assigns 'hbs' to value 'view engine' on the app settings table
app.set('view engine', 'hbs');

//Registers a middleware function
app.use((request, response, next) => {
  var time = new Date().toString();
  var logString = `${time}: ${request.method} ${request.url}`;

  console.log(logString);

  //Creates a server.log file and append all logs to it
  fs.appendFile('server.log', logString + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

//If not commented, requests won't get past this method. Because 'next' is not getting called
// app.use((request, response) => {
//   response.render('maintenance.hbs');
// });

//Takes the absolute path to the folder 'public'
//This way, typing localhost:3000/help.html will load our html file from 'public'
app.use(express.static(__dirname + '/public'));

app.get('/about', (request, response) => {

  //'views' is the default directory that ExpressJS uses for templates
  //'render' loads .hbs files from 'views folder' passing arguments through a json (optional)
  response.render('about.hbs', {
    pageTitle : 'About'
  });
});

app.get('/', (request, response) => {
  response.render('home.hbs', {
    pageTitle : 'Home',
    welcomeMessage : 'Welcome to this thing, ' + username
  });
})

app.get('/projects', (request, response) => {
  response.render('projects.hbs', {
    pageTitle : 'Portfolio'
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
