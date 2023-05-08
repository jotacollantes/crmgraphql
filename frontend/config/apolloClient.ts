import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import fetch from "node-fetch";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
  //fetch
});

//Add an authorization header to every HTTP request by chaining together Apollo Links.
const authLink = setContext((_, { headers }) => {
  
  //Leer localStorage
  const token = localStorage.getItem("token") || null;
  //if(!token){
  //console.log('no hay token')
  //Redireccionar a /auth/login
  //}
  if (token) {
    return {
      headers: {
        //Hacemos spread de los headers actuales
        ...headers,
        //Agregamos nuestro propio header
        //authorization: token ? `Bearer ${token}` : "",
        authorization: token,
      },
    };
  } else {
    return {
      headers: {
        //Hacemos spread de los headers actuales
        ...headers,
      },
    };
  }
});
export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  //chaining authLinl together Apollo Links
  link: authLink.concat(httpLink),
});
