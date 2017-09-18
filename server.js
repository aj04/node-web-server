const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let port = process.env.PORT || 3000;
let app = express();
console.log(`server started on port : ${port}`);
//register the partials for the views for hbs
hbs.registerPartials(__dirname + '/views/partials');

//handle bar looks for registered helpers for using the data
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

//hbs can use function to upper case in template use {{screamIt text}}
hbs.registerHelper('screamIt', (text) => {
   return text.toUpperCase();
});

//this set express to use view engine as hbs.
app.set('view engine', 'hbs');

//this helps to serve all the static content from public dir, for eg
// if you have html file name help.html then http://localhost:3000/help.html will be server easily
app.use(express.static(__dirname + '/public'));


app.use((req, res, next) => {
   let now = new Date().toString();
   let log = `${now} : ${req.method} ${req.url}`;

   console.log(log);
   fs.appendFile('server.log', log + '\n', (err) => {
       if(err) {
           console.log('error logging data in to file');
       }
   });
   next();
});

app.use((req, res, next) => {
   if(req.url === '/maintainance') {
       res.render('maintainance', {
           title : 'Maintainance Page',
           maintainMessage : 'The Site is under Maintainance'
       })
   } else {
       next();
   }

});

//this will set root of the app.
app.get('/', (request, response) => {
    //request and response are required parameters
    //response.send("<h1>hello Express</h1>");
    // response.send({
    //     name : 'Ajay',
    //     age: 28
    // });
    response.render('index', {
        title: 'Home Page',
        welcomeMessage : 'Welcome to the Home page'
    })
});

//Set up About Route like this using Express
app.get('/about', (req, res)=>{
    //res.send('About Page');
    res.render('about', {
        title : 'About Us Page using templates',
        content : 'this is About Page and content is send from Server.js file'
        //currentYear : 2017
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage : 'The is bad request'
    });
});

app.listen(port);