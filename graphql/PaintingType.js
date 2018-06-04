const graphql = require('graphql');
//Deconstructing object
const { GraphQLObjectType, GraphQLString } = graphql;

const PaintingType = new GraphQLObjectType({
    name: 'Painting',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        techniques: { type: new graphql.GraphQLList(GraphQLString) }
    })
});

module.exports = PaintingType;