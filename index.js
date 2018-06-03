//Framework to route our project
const hapi = require('hapi'); 
//Framework to use MongoDB
const mongoose = require('mongoose');
const server = hapi.server({
	port: 	4000,
	host: 'localhost'
});

const init = async() => {
	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply){
			return `<h1>My modern API </h1>`
		}
	});
	await server.start();
	console.log(`Server running at: ${server.info.uri} `);
};

//Connection with MLab
mongoose.connect('mongodb://admin:eff.006R@ds245210.mlab.com:45210/powerful-api-raul');
mongoose.connection.once('open', () => {
	console.log('Connected to databse');
});

init();