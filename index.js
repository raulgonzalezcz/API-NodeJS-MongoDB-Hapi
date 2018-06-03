//Framework to route our project
const hapi = require('hapi'); 
//Framework to use MongoDB
const mongoose = require('mongoose');
//Import Painting
const Painting = require('./models/Painting');
const server = hapi.server({
	port: 	4000,
	host: 'localhost'
});

const init = async() => {
	server.route([
	{
		method: 'GET',
		path: '/',
		handler: function(request, reply){
			return `<h1>My modern API </h1>`;
		}
	},
	{
		method: 'GET',
		path: '/api/v1/paintings',
		handler: function(request, reply){
			return Painting.find();
		}
	},
	{
		method: 'POST',
		path: '/api/v1/paintings',
		handler: function(request, reply){
			const {name, url, techniques} = request.payload;
			const painting = new Painting({
				name,
				url,
				techniques
			});
			return painting.save();
		}
	}
	]);
	await server.start();
	console.log(`Server running at: ${server.info.uri} `);
};

//Connection with MLab
mongoose.connect('mongodb://admin:eff.006R@ds245210.mlab.com:45210/powerful-api-raul');
mongoose.connection.once('open', () => {
	console.log('Connected to databse');
});

init();