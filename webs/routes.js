var users = require('./controllers/users')

var jsonfile = require('jsonfile')
const bcrypt = require('bcrypt');

const FILE = 'data.json'

module.exports = (app) => {

	// when we get a request to requestLocation, do something
	let requestLocation = '/name/:name';

	// handling my request
	let handleRequest = (request, response) => {
		// get my json from the file
		jsonfile.readFile(FILE, function(err, obj) {
			// deal with the request 
			let name = request.params.name;
			// obj is the podedex json file

			//console.dir(obj["fooo"])
			// send something back
			response.send(obj);
		});
	  //response.render('home', context );
	};

	app.get(requestLocation, handleRequest);

	app.post('/animals',(request, response) => {

		let postrequest = request.body;

		// read the data file
	    jsonfile.readFile(FILE, (err, obj) => {
	    	console.log( "OBJ", obj );

	    	// add animal
	    	obj.animals.push( postrequest );


	    	// start writing
	    	jsonfile.writeFile(FILE, obj, (err) => {

	    		// after I finish writing
				response.send( "done" ); 
	    	});



	    });

		console.log( "post request:",postrequest );
	});

	app.get('/animals/new', (request, response) => {
		response.render('newform');
	});

	app.get('/animals/:name', (request, response) => {

	    jsonfile.readFile(FILE, (err, obj) => {
	    	console.log( "OBJ", obj );
	    	let foundAnimal = null;

	    	for( let i=0; i<obj.animals.length; i++){
	    		animal = obj.animals[i];
	    		if( animal.name == request.params.name ){
	    			foundAnimal = animal;
	    		}
	    	}

	    	if( foundAnimal == null){

		    	response.send( "not found" );
	    	}else{
		    	response.send( foundAnimal );
		    }
		});
	});

	app.get('/animals/edit/:name', (request, response) => {


	    jsonfile.readFile(FILE, (err, obj) => {
	    	console.log( "OBJ", obj );
	    	let foundAnimal = null;

	    	for( let i=0; i<obj.animals.length; i++){
	    		animal = obj.animals[i];
	    		if( animal.name == request.params.name ){
	    			foundAnimal = animal;
	    		}
	    	}

	    	if( foundAnimal == null){

		    	response.send( "not found" );
	    	}else{
			    response.render('edit', foundAnimal);
		    }
		});
	});



	app.put('/animals/:name',(request, response) => {
		console.log( request.body)


		// read the data file
	    jsonfile.readFile(FILE, (err, obj) => {

	    	// find animal
		    for( let i=0; i<obj.animals.length; i++){
	    		animal = obj.animals[i];
	    		if( animal.name == request.params.name ){
	    			// if we find it, change it
	    			obj.animals[i].weight = request.body.weight;
	    		}
	    	}

	    	// start writing
	    	jsonfile.writeFile(FILE, obj, (err) => {

	    		// after I finish writing
				response.send( "done" ); 
	    	});



	    });
	});

	app.get('/', (request, response) => {


	    jsonfile.readFile(FILE, (err, obj) => {
	        console.log( "OBJ", obj );
	        obj.loggedin = request.cookies['logged_in'];

	        response.render('home', obj);
	    });


	});

	app.get('/monkey', (request, response) =>{

	    var visits = request.cookies['visits'];

	    if( visits === undefined ){
	        visits = 1;

	    }else{
	        visits++;
	    }

	    // set cookie
	    response.cookie('visits', visits);
	    response.cookie('banana', 'monkey');

	    response.send("visited " + visits + " times." )
	})

	app.get('/animals/:name/delete', (request, response) => {

	    jsonfile.readFile(FILE, (err, obj) => {
	        console.log( "OBJ", obj );
	        let foundAnimal = null;

	        for( let i=0; i<obj.animals.length; i++){
	            animal = obj.animals[i];
	            if( animal.name == request.params.name ){
	                foundAnimal = animal;
	            }
	        }

	        if( foundAnimal == null){

	            response.send( "not found" );
	        }else{
	            response.render('delete', foundAnimal);
	        }
	    });

	});

	app.delete('/animals/:name/delete', (request, response) => {

	    // read the data file
	    jsonfile.readFile(FILE, (err, obj) => {

	        // find animal
	        for( let i=0; i<obj.animals.length; i++){
	            animal = obj.animals[i];
	            if( animal.name == request.params.name ){
	                // if we find it, change it
	                // this is the thing we want to delete
	                //obj.animals[i]
	                obj.animals.splice(i, 1);
	            }
	        }

	        // start writing
	        jsonfile.writeFile(FILE, obj, (err) => {

	            // after I finish writing
	            response.send( "done" ); 
	        });



	    });
	});

	app.get('/users/new', (request, response) => {
	    response.render('register');
	});

	app.post('/users', (request, response) => {


	    jsonfile.readFile(FILE, (err, obj) => {

	        bcrypt.hash(request.body.password, 1, (err, hash) => {

	            let user = {
	                password: hash,
	                email: request.body.email
	            };

	            obj.users.push(user);

	            jsonfile.writeFile(FILE, obj, (err) => {

	                response.cookie('logged_in', 'true');

	                // after I finish writing
	                response.send( "done" ); 
	            });

	        });
	    });

	});

	app.get('/users/login', (request, response) => {
	    response.render('login');
	});


	app.post('/users/login', (request, response) => {

	    if( request.cookies['logged_in'] == 'true'){
	        //redirect
	        response.redirect(301, '/');
	        return;
	    }

	    let plainTextPassword = request.body.password;
	    let email = request.body.email;
	    let dbUser = null;


	    jsonfile.readFile(FILE, (err, obj) => {

	        for( let i=0; i<obj.users.length; i++){
	            user = obj.users[i];
	            if( user.email == email ){
	                dbUser = user;
	            }
	        }

	        if( dbUser ){

	            bcrypt.compare(plainTextPassword, dbUser.password, (err, result) => {
	                if( result === true ){
	                    // we verified the user

	                    response.cookie('logged_in', 'true');
	                    response.redirect('/');
	                    return;
	                }else{
	                    // password is not the same
	                    response.send("password not same");
	                }
	            });

	        }else{
	            response.send('no email found');
	            //respond with couldnt find email
	        }
	    });
	 

	});

	app.delete('/users/logout', users.logout );
};