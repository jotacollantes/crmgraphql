import { OBTENER_PEDIDOS_POR_VENDEDOR } from "@/pages/pedidos";
import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Pedido = {
  id: string;
  cantidad: number;
  precio: number;
  nombre: string;
};
type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
};
interface Props {
  pedido: {
    id: string;
    pedido: Pedido[];
    total: number;
    //cliente: string;
    cliente: Cliente;
    vendedor: string;
    fecha: string;
    estado: string;
  };
}

const ACTUALIZAR_PEDIDO=gql`mutation ActualizarPedido($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      estado
    }
  }`

const ELIMINAR_PEDIDO=gql`mutation Mutation($id: ID!) {
    eliminarPedido(id: $id) {
        id
        mensaje
    }
  }`


//const OBTENER_PEDIDOS_POR_VENDEDOR = gql`
  //query ObtenerPedidosVendedor {
    //obtenerPedidosVendedor {
      //id
      //}
  //}
//`;

export const ListadoPedidos = ({ pedido }: Props) => {
  //console.log(pedido)
  const [estadoPedido, setEstadoPedido] = useState(pedido.estado);
  const [actualizarPedido]=useMutation(ACTUALIZAR_PEDIDO)
  const [eliminarPedido]=useMutation(ELIMINAR_PEDIDO,{
    update(cache,{data:{eliminarPedido}}){
        //console.log(eliminarPedido)
        const {obtenerPedidosVendedor}=cache.readQuery<any>({query: OBTENER_PEDIDOS_POR_VENDEDOR})
           cache.writeQuery({
            query: OBTENER_PEDIDOS_POR_VENDEDOR,
            data:{
                obtenerPedidosVendedor : obtenerPedidosVendedor.filter((pedido:any)=>pedido.id !== eliminarPedido.id)
            }
           }) 
    }
  })
  const [clase, setClase] = useState("");
  useEffect(() => {
    //if (estadoPedido) {
    setEstadoPedido(estadoPedido);
    //Para establecer el color del border top segun su estado
    clasePedido()
    //}
  }, [estadoPedido]);
  const clasePedido = () => {
    switch (estadoPedido) {
      case "PENDIENTE":
        setClase("border-yellow-500");

        break;
      case "COMPLETADO":
        setClase("border-green-500");

        break;
      case "CANCELADO":
        setClase("border-red-800");

        break;

      default:
        break;
    }
  };
  const cambiarEstadoPedido=async(e:React.ChangeEvent<HTMLSelectElement>)=>{
    //console.log(e.target.value)
    try {
        const {data}=await actualizarPedido({variables:{
            id:pedido.id,
            input:{
                estado: e.target.value,
                cliente: pedido.cliente.id
                  
            }
        }})
        
        //console.log(data.actualizarPedido.estado)
        setEstadoPedido(data.actualizarPedido.estado)    
    } catch (error:any) {
        console.log(error.message)
    }
    
  }

  const confirmarEliminarPedido=()=>{
    
        Swal.fire({
          title: 'Deseas eliminar a este Pedido?',
          text: "Esta accion no se puede reversar",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar',
          cancelButtonText:'No, cancelar',
       
        }).then(async (result) => {
          if (result.isConfirmed) {
            
             try {
              //Eliminar por ID
              const {data}=await eliminarPedido({
                variables:{
                  id: pedido.id
                }})
              //Mostrar Alerta
              //console.log(data)  
               Swal.fire(
              'Pedido eliminado!',
              //'Your file has been deleted.',
              data.eliminarPedido.mensaje,
              'success')
              
             } catch (error:any) {
              console.log(error.message)
             }
             
           
          }
        })
      
  }
  return (
    <div className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
      <div>
        <p className="font-bold text-gray-800">
          Cliente: {pedido.cliente.nombre} {pedido.cliente.apellido}
        </p>
        {pedido.cliente.email && (
          <p className="flex items-center my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
              />
            </svg>

            {pedido.cliente.email}
          </p>
        )}
        {pedido.cliente.telefono && (
          <p className="flex items-center my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>

            {pedido.cliente.telefono}
          </p>
        )}

        <h2 className="text-gray-800 font-bold mt-10">Estado del Pedido:</h2>
        <select
          className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
          value={estadoPedido}
          onChange={cambiarEstadoPedido}
        >
          <option value="COMPLETADO">COMPLETADO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className="text-gray-800 font-bold mt-2">Resumen del pedido</h2>
        {pedido.pedido.map((item, ix) => {
          return (
            <div key={ix} className="mt-4">
              <p className="text-sm text-gray-600">Producto: {item.nombre}</p>
              <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
            </div>
          );
        })}
        <p className="text-gray-800 mt-3 font-bold">
          Total a Pagar: <span>$ {pedido.total} </span>
        </p>
        <button className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
        onClick={confirmarEliminarPedido}
        >
          Eliminar Pedido
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 ml-4"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
