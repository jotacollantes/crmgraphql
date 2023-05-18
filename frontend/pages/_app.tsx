import { apolloClient } from "@/config/apolloClient";
import PedidoProvider from "@/context/pedidos/PedidoProvider";
import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <PedidoProvider>
        <Component {...pageProps} />
      </PedidoProvider>
        
    </ApolloProvider>
      
  )
  

};
export default App;
