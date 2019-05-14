// everything in users object required in routes.js
module.exports = {
	logout: (request, response)=> {

	    response.clearCookie("logged_in");

	    response.redirect(301, '/');
	}


};