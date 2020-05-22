const  express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const log = console.log;

const schema = buildSchema(`
    type Query{
        users: [User!]!
        user(id: ID!): User
        messages: [Message!]!
    }
    type Mutation{
        addUser(name: String!, email: String): User
    }
    type User{
        id: ID!
        email: String!
        name: String
        avatarUrl: String
        messages: [Message!]!
    }
    type Message {
        id: ID!
        body: String!
        author: User!
        createdAt: String!
      }
`); 
const app = express();

const database = {
    users: [
        {id: '1', email: 'zelalem.antigegn@gmail.com', name: 'Zelalem', avatarUrl: 'https://gravatar.com/...'},
        {id: '2', email: 'gizachew.chanie@gmail.com', name: 'Gizchew', avatarUrl: 'https://gravatar.com/...'},
        {id: '3', email: 'serke.addis@gmail.com', name: 'Serkalem', avatarUrl: 'https://gravatar.com/...'},
        {id: '4', email: 'geremew.tarekegn@gmail.com', name: 'Geremew', avatarUrl: 'https://gravatar.com/...'},
        {id: '5', email: 'birtukan.mekdesa@gmail.com', name: 'Birtukan', avatarUrl: 'https://gravatar.com/...'},
    ],
    messages: [
        { id: '1', userId: '1', body: 'Hello', createdAt: Date.now() },
        { id: '2', userId: '2', body: 'Hi', createdAt: Date.now() },
        { id: '3', userId: '1', body: 'What\'s up?', createdAt: Date.now() }
      ]
}

class User {
    constructor (user) {
      Object.assign(this, user)
    }
  
    get messages () {
      return database.messages.filter(message => message.userId === this.id)
    }
  }

  class Message{
      constructor(message){
          Object.assign(this, message)
      }
      getUser(){
          return database.users.find(user => user.id === this.userId)
      }
  }

const rootValue = {
    users:() => database.users.map(user => new User(user)),
    messages: () => database.messages.map(message => new Message(message)),
    user: ({id})=> {
        database.users.find(user => user.id === id)
        return user && new User(user);
       },
    addUser: ({name, email}) => {
        const user = {
            id: database.users.length,
            name: name,
            email: email  
        }
        database.users.push(user)
        return user
    }
};
app.use('/graphql', graphqlHTTP({
     schema,
     rootValue,
     graphiql: true
    
}))

app.listen(8980, () => log('Listening on 8980'))
