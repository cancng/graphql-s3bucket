const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const getSlug = require('speakingurl');

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

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: 'AKIAJLI66R77XQIUVFHA',
    secretAccessKey: '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',
  },
});

const resolvers = {
  Query: {
    hello: () => 'deneme 👋',
  },
  Mutation: {
    uploadFile: async (_, args) => {
      const file = await args.file;
      const { createReadStream, filename } = file;
      const fileStream = createReadStream();
      const params = {
        ACL: 'public-read',
        Bucket: 'interaktifis-test-bucket',
        Key: `${new Date().getTime()}-${getSlug(filename, {
          custom: {
            '.': '.',
          },
        })}`,
        Body: fileStream,
      };
      const result = await s3.upload(params).promise();
      console.log('result ', result);
      return {
        url: result.Location,
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

app.listen({ port: 4000 }, () => {
  console.log('🚀 Server ready at http://localhost:4000');
});
