import { PedidoContext } from '@/context/pedidos'
import { usePedido } from '@/hooks/usePedido'
import React, { useContext } from 'react'
import { ProductoResumen } from './ProductoResumen'



const ResumenPedido = () => {
    const {productos} =usePedido()
    //console.log(productos)
    
    return (
    <><p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Ajustar las cantidades del producto</p>
    
    {
    (productos.length >0)
    ? 
     (
         productos.map((producto,ix)=>{
              return (  <ProductoResumen key={ix} producto={producto}/>)
         })
     )
    :
    (
      <p className='mt-5 text-sm'>No hay productos</p>     
 )
    }
    </>
  )
}

export default ResumenPedido


