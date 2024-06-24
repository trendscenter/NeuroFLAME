export const typeDefs = `
  type Query {
    hello: String
  }
  
  type Mutation {
   connectAsUser: String
   setMountDir(consortiumId: String, mountDir: String): Boolean
  }
`