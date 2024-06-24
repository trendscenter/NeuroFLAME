export const typeDefs = `
  type Query {
    hello: String
  }
  
  type Mutation {
   connectAsUser: String
   setMountDir(consortiumId: String): Boolean
  }
`