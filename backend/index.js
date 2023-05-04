import {ApolloServer} from 'apollo-server'
import { typeDefs } from './db/schema.js';
import { resolvers } from './db/resolvers.js';
import * as dotenv from 'dotenv'
import {conectarDB} from './config/db.js'
import {utils} from './helpers/utils.js'
dotenv.config()

conectarDB()

const server= new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=>{
        
       const token=req.headers['authorization']
       if(token){
        try {
            const usuario =utils.verifyToken(token,process.env.SECRET_KEY)
            return usuario
        } catch (error) {
            throw new Error('Token Invalido')
        }
       }
    },
    introspection: true

})
//Arrancar servidor
server.listen().then((obj)=>console.log(`Escuchando en el url ${obj.url}`))