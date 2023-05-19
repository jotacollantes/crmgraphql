import Layout from "@/components/Layout";
import AsignarCliente from "@/components/pedidos/AsignarCliente";
import AsignarProductos from "@/components/pedidos/AsignarProductos";
import ResumenPedido from "@/components/pedidos/ResumenPedido";
import { Total } from "@/components/pedidos/Total";
import { usePedido } from "@/hooks/usePedido";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { OBTENER_PEDIDOS_POR_VENDEDOR } from "./pedidos";

const NUEVO_PEDIDO = gql`
  mutation Mutation($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
      estado
      total
      vendedor
      fecha
      pedido {
        id
        cantidad
        precio
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
        }
    }
  }
`;

const NuevoPedido = () => {
  const { cliente, productos, total } = usePedido();
  const [mensaje, setMensaje] = useState<any>(null);
  const router = useRouter();

  
  //Mutation para crear nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    //! La salida de nuevoPedido debe de tener el mismo esquema de salida de obtenerPedidosVendedor: [Pedido] para que haya consistencia al momento de actualizar el cache
    update(cache, { data: { nuevoPedido } }) {
      //console.log(nuevoPedido)
      const { obtenerPedidosVendedor } = cache.readQuery<any>({
        query: OBTENER_PEDIDOS_POR_VENDEDOR,
      });
      cache.writeQuery({
        query: OBTENER_PEDIDOS_POR_VENDEDOR,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      });
    },
  });

  const validarPedido = () => {
    //Array.prototype.every()
    //Determina si todos los elementos en el array satisfacen una condición.

    //return (productos.every((producto)=>producto.cantidad >0) && total > 0  && cliente.id) ? "" : "opacity-50 cursor-not-allowed"

    if (
      productos.length > 0 &&
      productos.every((producto) => producto.cantidad > 0) &&
      cliente.id &&
      total > 0
    )
      return "";
    else return "opacity-50 cursor-not-allowed";
  };

  const crearNuevoPedido = async () => {
    //NEcesito excluir algunos campos del objeto producto porque segun la firma del esquema para elk input de nuevo pedido solo se necesita el id del producto y la cantidad solicitada por el cliente
    const nuevoArrayProductos = productos.map((producto) => {
      return {
        id: producto.id,
        cantidad: producto.cantidad,
        nombre: producto.nombre,
        precio: producto.precio,
      };
    });

    //console.log(total)
    //console.log(cliente.id)
    //console.log(nuevoArrayProductos)

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            total: total,
            cliente: cliente.id,
            //PENDIENTE es valor por Default
            //estado: "PENDIENTE",
            pedido: nuevoArrayProductos,
          },
        },
      });
      //console.log(data)
      Swal.fire("Correcto", "Pedido Creado Correctamente", "success");
      router.push("/pedidos");
    } catch (error: any) {
      console.log(error.message)
      setMensaje(error.message);
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>

      {mensaje && (
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          <p>{mensaje}</p>
        </div>
      )}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />
          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
            onClick={crearNuevoPedido}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};
export default NuevoPedido;
