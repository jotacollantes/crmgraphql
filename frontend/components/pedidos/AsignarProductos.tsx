import Select, { MultiValue } from 'react-select'

import { useQuery,gql } from '@apollo/client'
import { OBTENER_PRODUCTOS } from '@/pages/productos'
import { Producto } from '@/interfaces'
import { useState, useEffect } from 'react'
import { usePedido } from '@/hooks/usePedido'


const AsignarProductos = () => {
  //State local
  const [productosSeleccionados, setProductosSeleccionados] = useState([])
  const {data,loading,error}=useQuery(OBTENER_PRODUCTOS)
  const {addProducto}=usePedido()
  //console.log(loading)
  //console.log(data)


  const seleccionarProducto=(producto:any)=>{
    setProductosSeleccionados(producto)
  }
  useEffect(() => {
    
    //TODO añadir al reducer cada vez que el state local cambia 
    //console.log(productosSeleccionados)
    addProducto(productosSeleccionados)
  }, [productosSeleccionados])
  
  if(loading){
    
    return (<h1>Cargando....</h1>)
  }

  const {obtenerProductos: productos}=data
  return (
<>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona o busca los productos</p>
      <Select

      //EL select se alimenta del array que se encuentra en options
      options={productos}
      isMulti={true}
      onChange={(producto)=>{seleccionarProducto(producto)}}
      //Vara usar los nombres de los campos de la BD en lugar de value y labe que son los nombres por defecto de los campos en el select
      getOptionValue={(producto:Producto)=>producto.id}
      getOptionLabel={(producto:Producto)=>`${producto.nombre} - ${[producto.existencia]} Unidades`}
        placeholder={'Seleccione los producto'}
        noOptionsMessage={()=>"No hay productos"}
      /></>
  )
}

export default AsignarProductos