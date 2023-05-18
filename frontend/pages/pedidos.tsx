import Layout from "@/components/Layout";
import { ListadoPedidos } from "@/components/pedidos/ListadoPedidos";

import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import React from "react";

export const OBTENER_PEDIDOS_POR_VENDEDOR = gql`
  query ObtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        precio
        nombre
      }
      total
      cliente {
        id
        nombre
        apellido
        email
        telefono
        }
      vendedor
      fecha
      estado
    }
  }
`;

const Pedidos = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS_POR_VENDEDOR);

  if (loading) {
    return "Cargando...";
  }

  const { obtenerPedidosVendedor } = data;
  //console.log(obtenerPedidosVendedor)
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
      <Link href={"/nuevopedido"} legacyBehavior>
        <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
          Nuevo Pedido
        </a>
      </Link>
      {obtenerPedidosVendedor.length > 0 ? (
        obtenerPedidosVendedor.map((pedido: any, ix: number) => {
          return <ListadoPedidos key={ix} pedido={pedido} />;
        })
      ) : (
        <p className="mt-5 text-center text-2xl">No Tiene Pedidos</p>
      )}  
    </Layout>
  );
};

export default Pedidos;
