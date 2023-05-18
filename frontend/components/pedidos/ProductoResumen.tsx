import { usePedido } from '@/hooks/usePedido'
import { Producto } from '@/interfaces'
import React, { useEffect, useState } from 'react'
interface Props{
    producto: Producto
}
export const ProductoResumen = ({producto}:Props) => {
     const {cantidadProductos,actualizarTotal}=usePedido()
     const [cantidad , setCantidad] = useState(0)
    const {nombre,precio}= producto

    useEffect(() => {
      actualizarCantidad()
      actualizarTotal()
    }, [cantidad])
    
    const actualizarCantidad=()=>
    {
      //Añadimos la nueva propiedad al objeto Producto
      const nuevoProducto={...producto,cantidad:cantidad}
      cantidadProductos(nuevoProducto)
    }
  return (
    <div className='md:flex md:justify-between md:items-center mt-5'>
        <div className='md:w-2/4 mb-2 md:mb-0'>
                <p className='text-sm'>{nombre}</p>
                <p> $ {precio}</p>
        </div>
        <input
        type="number"
        placeholder='cantidad'
        className='shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outlined-none focus:shadow-outlined md:ml-4'
      onChange={(e)=>setCantidad(Number(e.target.value))}
      value={cantidad}
        />
        
    </div>
  )
}

