//Framework to route our project
const hapi = require('hapi'); 
const path = require('path');

//Framework to use MongoDB
const mongoose = require('mongoose');
//Import Painting
const Painting = require('./models/Painting');
//GraphQl packages
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');
/* swagger section */
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = hapi.server({
	port: 	4000,
	host: 'localhost'
});

const init = async() => {

	//Start the service for documentation with Swagger
	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: 'Paintings API Documentation',
					version: Pack.version
				}
			}
		}
	]);

	//Services of the API
	server.route([
		//Get CSS files
		{  
		  method: 'GET',
		  path: '/css/{file*}',
		  handler: {
		    directory: { 
		      path: './css'
		    }
		  }
		},
		//Get fonts files
		{  
		  method: 'GET',
		  path: '/fonts/{file*}',
		  handler: {
		    directory: { 
		      path: './fonts'
		    }
		  }
		},
		//Get JS files
		{  
		  method: 'GET',
		  path: '/js/{file*}',
		  handler: {
		    directory: { 
		      path: './js'
		    }
		  }
		},
		{
			method: 'GET',
			path: '/',
			handler: function(request, reply){
				//Instead of a H1, we return static file with inert
				//return `<h1>My modern API </h1>`;
				return reply.file(path.join(__dirname, './index.html'));
			}
		},
		{
			method: 'GET',
			path: '/api/v1/paintings',
			//Section for Swagger
			config: {
				description: 'Get all the paintings',
				tags: ['api', 'v1', 'painting']
			},
			handler: function(request, reply){
				return Painting.find();
			}
		},
		{
			method: 'POST',
			path: '/api/v1/paintings',
			//Section for Swagger
			config: {
				description: 'Save a specific painting by ID.',
				tags: ['api', 'v1', 'painting']
			},
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
	
	//Register the GraphQL API
	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}
	});

	await server.register({
		plugin: graphqlHapi,
		options: {
			path: '/graphql',
			graphqlOptions: {
				schema
			},
			route: {
				cors: true
			}
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

process.on('unHandledRejection', (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});

init();