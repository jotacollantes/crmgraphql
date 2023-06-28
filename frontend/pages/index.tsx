import Layout from "@/components/Layout"
import { ClientesPorVendedorResponse } from "@/interfaces/clientesPorVendedor"
import {useQuery,gql} from '@apollo/client'
import { ObtenerClientesPorVendedor } from '../interfaces/clientesPorVendedor';
import TableClients from "@/components/clients/TableClients";
import { useRouter } from "next/router";
import Link from "next/link";

export const OBTENER_CLIENTES_VENDEDOR =gql`
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
  const router=useRouter()
  const {data,loading,error}=useQuery(OBTENER_CLIENTES_VENDEDOR)
//console.log({loading})
//console.log({data})
//console.log({error})

  if(error){
    return router.push('/auth/login')
  }
  // Es necesario usar el loading antes de usar el data del useQuery
  if(loading){
    
    return (<h1>Cargando....</h1>)
  }

  if(!localStorage.getItem("token"))
  {
    //console.log('entro')
    return router.push('/auth/login')
    }


  if(!data.obtenerClientesPorVendedor){
    //console.log('entro')
    return router.push('/auth/login')
    }
 
  return (
  <div>
    <Layout>
    <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
    <Link href={'/nuevocliente'} legacyBehavior>
      <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">Nuevo Cliente</a>
    </Link>
     
    <TableClients clientes={data?.obtenerClientesPorVendedor}  />
    </Layout>
  </div>
  )
}
export default Home