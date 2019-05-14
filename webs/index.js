const bodyParser = require('body-parser');

// require the express library
const express = require('express');
const handlebars = require('express-handlebars');

const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')




// create an instance of the library app server
const app = express()

const FILE = 'data.json'

/* 
	express configs
	==========================================
	==========================================
	==========================================
	==========================================
	==========================================
	==========================================
*/

app.use(bodyParser.json());

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'))

app.use(cookieParser())


app.engine('handlebars', handlebars());

// this line sets handlebars to be the default view engine
app.set('view engine', 'handlebars')


/* 
	==========================================
	==========================================
	==========================================
	==========================================
	==========================================
	==========================================
*/

let routesFunction = require('./routes');

routesFunction(app);

// same as
//require('./routes')(app);


app.listen(3000);
console.log("starting server");