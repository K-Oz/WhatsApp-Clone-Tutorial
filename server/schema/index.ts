import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import resolvers from './resolvers';

const typeDefs = importSchema(path.join(__dirname, 'typeDefs.graphql'));

export default makeExecutableSchema({ resolvers, typeDefs });