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
       //console.log(req.headers)
       const token=req.headers['authorization']
       if(token){
        try {
            //En caso de que envien el bearer hay que eliminarlo:
            // const usuario =utils.verifyToken(token.replace('Bearer ',''),process.env.SECRET_KEY)
            //console.log({token})
            const usuario =utils.verifyToken(token,process.env.SECRET_KEY)
            //console.log({usuario})
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