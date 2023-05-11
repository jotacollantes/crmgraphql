import Layout from '@/components/Layout'
import TableProducts from '@/components/products/TableProducts'
import { useQuery,gql} from '@apollo/client'
import Link from 'next/link'
import React from 'react'

export const OBTENER_PRODUCTOS=gql`query obtenerProductos {
  obtenerProductos {
    creado
    existencia
    id
    precio
    nombre
  }
}`
const Productos = () => {
  const {data,loading,error}=useQuery(OBTENER_PRODUCTOS)
  //console.log(loading)
  //console.log(data)
    // Es necesario usar el loading antes de usar el data del useQuery
    if(loading){
    
      return (<h1>Cargando....</h1>)
    }
  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Productos</h1>
        <Link href={'/nuevoproducto'} legacyBehavior>
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
            Nuevo Producto
          </a>
        </Link>
        <TableProducts products={data?.obtenerProductos}  />
      </Layout>
  )
}

export default Productos