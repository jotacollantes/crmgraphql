import Layout from "@/components/Layout"
import { ClientesPorVendedorResponse } from "@/interfaces/clientesPorVendedor"
import {useQuery,gql} from '@apollo/client'
import { ObtenerClientesPorVendedor } from '../interfaces/clientesPorVendedor';
import TableClients from "@/components/clients/TableClients";


const OBTENER_CLIENTES_VENDEDOR =gql`
query ObtenerClientesPorVendedor {
  obtenerClientesPorVendedor {
    id
    nombre
    apellido
    empresa
    email
    vendedor
  }
}`

const Home=()=> {
  //COnsulta de apollo
  //const {data,loading,error}=useQuery<ClientesPorVendedorResponse>(OBTENER_CLIENTES_VENDEDOR)
  const {data,loading,error}=useQuery(OBTENER_CLIENTES_VENDEDOR)
  //console.log({loading})
  console.log({data})
  //const {obtenerClientesPorVendedor} =data!
  //console.log(obtenerClientesPorVendedor)

  if(loading){
    
    return (<h1>Cargando....</h1>)
  }

  
 
  return (
  <div>
    <Layout>
    <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>

    <TableClients clientes={data?.obtenerClientesPorVendedor}  />
    </Layout>
  </div>
  )
}
export default Home