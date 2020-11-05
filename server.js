const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { generateRandomStr } = require('./utils');

const typeDefs = gql`
  type File {
    url: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hi 👋',
  },
  Mutation: {
    uploadFile: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const { ext } = path.parse(filename);
      const randomName = generateRandomStr(12) + ext;

      const stream = createReadStream();
      const pathName = path.join(__dirname, `/public/images/${randomName}`);
      await stream.pipe(fs.createWriteStream(pathName));
      return {
        url: `http://localhost:4000/images/${randomName}`,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const app = express();
app.use(cors({ origin: ['http://localhost:3000'] }));
server.applyMiddleware({ app });
app.use(express.static('public'));

app.listen({ port: 4000 }, () => {
  console.log('🚀 Server ready at http://localhost:4000');
});
