import { apolloClient } from "@/config/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";

apolloClient

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
    </ApolloProvider>
      
  )
  

};
export default App;
