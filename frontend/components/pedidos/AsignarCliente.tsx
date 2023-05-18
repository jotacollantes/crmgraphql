import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import { useQuery,gql } from '@apollo/client'
import { OBTENER_CLIENTES_VENDEDOR } from '@/pages'

import { Cliente } from '@/interfaces'
import { usePedido } from '@/hooks/usePedido'



// const clientes = [
//   { id: '1', nombre: 'tito' },
//   { id: '2', nombre: 'jota' },
//   { id: '3', nombre: 'panchis' }
// ]
const AsignarCliente = () => {
  const [cliente, setCliente] = useState<any>([])
  const {data,loading,error} = useQuery(OBTENER_CLIENTES_VENDEDOR)
  const {addCliente}=usePedido()
  
//console.log(data)
//console.log(loading)
//console.log(error)
  useEffect(() => {
    addCliente(cliente)
  }, [cliente])
  
  const seleccionarCliente=(cliente:Cliente)=>{
      setCliente(cliente)
  }

  if(loading){
    
    return (<h1>Cargando....</h1>)
  }

  const {obtenerClientesPorVendedor: clientes}=data
  
  return (
  
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>
      <Select

      //EL select se alimenta del array que se encuentra en options
      options={clientes}
      //isMulti={true}
      onChange={(cliente:any)=>{seleccionarCliente(cliente)}}
      //Vara usar los nombres de los campos de la BD en lugar de value y labe que son los nombres por defecto de los campos en el select
      getOptionValue={(cliente:Cliente)=>cliente.id}
      getOptionLabel={(cliente:Cliente)=>cliente.nombre}
        placeholder={'Seleccione el cliente'}
        noOptionsMessage={()=>"No hay resultados"}
      /></>
    
      
  )
}

export default AsignarCliente