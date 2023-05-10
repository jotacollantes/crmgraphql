import React from "react";
import Swal from 'sweetalert2'
import { gql,useMutation} from '@apollo/client';
import { useRouter } from 'next/router';
import { ObtenerClientesPorVendedor } from '../../interfaces/clientesPorVendedor';
import { OBTENER_CLIENTES_VENDEDOR } from "@/pages";


const ELIMINAR_CLIENTE=gql`mutation Mutation($id: ID!) {
  eliminarCliente(id: $id) {
    mensaje
    id
  }
}`
type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  empresa: string;
  email: string;
  vendedor: string;
};
interface Props {
  clientes: Cliente[];
}
const TableClients = ({ clientes }: Props) => {
  const router=useRouter()
  //const [eliminarCliente]=useMutation(ELIMINAR_CLIENTE)
  
  const [eliminarCliente]=useMutation(ELIMINAR_CLIENTE,{
    update(cache,data  ){
      //Obtener una copia del cache
      //console.log(data.data.eliminarCliente.id)
      const {obtenerClientesPorVendedor}=cache.readQuery<any>({query: OBTENER_CLIENTES_VENDEDOR})
      //Reescribir el cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
        //Que segmento del cache vamos a actualizar
        data:{
          obtenerClientesPorVendedor: obtenerClientesPorVendedor.filter((cliente:any)=>cliente.id !== data.data.eliminarCliente.id)
        }
      })
    }
  })
  
  const eliminarUsuario=(id:string)=>{
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
          //Eliminar por ID
          const {data}=await eliminarCliente({
            variables:{
              id: id
            }})
          //Mostrar Alerta
          
           Swal.fire(
          'Eliminado!',
          //'Your file has been deleted.',
          data.eliminarCliente.mensaje,
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
          <th className="w-1/5 py-2">Empresa</th>
          <th className="w-1/5 py-2">Email</th>
          <th className="w-1/5 py-2">Eliminar</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {clientes.map((cliente, ix: number) => {
          

          return (
            <tr key={ix}>
              <td className="border px-4 py-2">{`${cliente.nombre} ${cliente.apellido}`}</td>
              <td className="border px-4 py-2">{`${cliente.empresa}`}</td>
              <td className="border px-4 py-2">{`${cliente.email}`}</td>
              <td className="border px-4 py-2">
                <button
                className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                onClick={()=>eliminarUsuario(cliente.id)}
                >
                  Eliminar
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-4">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
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

export default TableClients;
