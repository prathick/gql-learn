const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const users = [
  { id: 1, username: 'Prathic', messageIds: [1, 2] },
  { id: 2, username: 'Prashanth', messageIds: [2] },
  { id: 3, username: 'Advay', messageIds: [1] },
  { id: 4, username: 'Avyaan', messageIds: [1] },
  { id: 5, username: 'Deepika', messageIds: [2] }
];

const messages = [
  { id: 1, message: 'Hello world', userId: 1 },
  { id: 2, message: 'Good Morning', userId: 2 }
];

const schema = gql`
  type Query {
    users: [User]
    user(id: Int!): User
    me: User

    messages: [Message!]
    message(id: Int!): Message
    character: Charater!
  }

  type User {
    id: Int!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: Int!
    message: String!
    user: User!
  }

  interface Charater {
    id: String!
    name: String!
  }

  type Small implements Charater {
    id: String!,
    name: String!,
    age: Int!
  }
 
`;

const resolvers = {
  Query: {
    users: () => {
      return users;
    },
    user: (parent, { id }) => {
      const currentUser = users.filter(user => user.id === id);
      return currentUser[0];
    },
    me: (parent, args, { me }) => {
      return me;
    },
    messages: () => messages,
    message: (parent, { id }) => {
      const currentMessage = messages.filter(messages => messages.id === id);
      return currentMessage[0];
    },
    character: () => {
      return {id: '1', name: 'string', age: 1}
    }
  },
  User: {
    messages: ({ messageIds }) => {
      return messageIds.map(id => {
        const currentMessage = messages.filter(message => message.id === id);
        return currentMessage[0];
      });
    }
  },
  Message: {
    user: ({ userId }) => {
      const currentUser = users.filter(user => user.id === userId);
      return currentUser[0];
    }
  },
  Charater: {
    __resolveType (obj, context, info){ 
      console.log(obj);
      if(obj.age) return "Small"
      return null;
    }
  }
};
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[0]
  }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, () => {
  console.log('Sever running on 3000');
});
