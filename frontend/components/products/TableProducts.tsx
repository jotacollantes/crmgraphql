import React from "react";

import { useRouter } from 'next/router';
import Swal from "sweetalert2";
import { gql,useMutation } from "@apollo/client";
import { OBTENER_PRODUCTOS } from "@/pages/productos";




type Producto = {
  id: string;
  nombre: string;
  existencia: string;
  precio: string;
  
};
interface Props {
  products: Producto[];
}

const ELIMINAR_PRODUCTO=gql`
mutation eliminarProducto($id: ID!) {
  eliminarProducto(id: $id)
  {
    mensaje
    id
  }
}`
const TableProducts = ({ products }: Props) => {
  const router=useRouter()
  const [eliminarProducto,{data,loading,error}]=useMutation(ELIMINAR_PRODUCTO,{
    update(cache,{data:{eliminarProducto}}  ){
      //console.log(data.data.eliminarProducto.id)
      //Obtener una copia del cache
      
      const {obtenerProductos}=cache.readQuery<any>({query: OBTENER_PRODUCTOS})
      //Reescribir el cache
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        //Que segmento del cache vamos a actualizar
        data:{
          obtenerProductos: obtenerProductos.filter((producto:any)=>producto.id !== eliminarProducto.id)
        }
      })
    }
  })

  

  const confirmarEliminarProducto=(id:string)=>{
    //console.log(id)
    Swal.fire({
      title: 'Deseas eliminar a este cliente?',
      text: "Esta accion no se puede reversar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText:'No, cancelar',
   
    }).then(async (result) => {
      if (result.isConfirmed) {
        //console.log('eliminando ',id)
         try {
         const {data}=await eliminarProducto({variables:{id:id}})
          //console.log(data)
          Swal.fire(
            'Producto eliminado!',
            //'Your file has been deleted.',
            data.eliminarProducto.mensaje,
            
            'success')
         } catch (error:any) {
          console.log(error.message)
         }
         
       
      }
    })

  }


  return (
    <table className="table-auto shadow-md mt-10 w-full w-lg">
      <thead className="bg-gray-800">
        <tr className="text-white">
          <th className="w-1/5 py-2">Nombre</th>
          <th className="w-1/5 py-2">Existencia</th>
          <th className="w-1/5 py-2">Precio</th>
          <th className="w-1/5 py-2">Eliminar</th>
          <th className="w-1/5 py-2">Editar</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {products.map((product, ix: number) => {
          

          return (
            <tr key={ix}>
              <td className="border px-4 py-2">{`${product.nombre}`}</td>
              <td className="border px-4 py-2">{`${product.existencia}`}</td>
              <td className="border px-4 py-2">{`$ ${product.precio}`}</td>
              <td className="border px-4 py-2">
                <button
                className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                onClick={()=>confirmarEliminarProducto(product.id)}
                >
                  Eliminar
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-4">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
</svg>

                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                //onClick={}
                >
                  Editar
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>


                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableProducts;
