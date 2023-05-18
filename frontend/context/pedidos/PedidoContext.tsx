import { Cliente, Producto } from "@/interfaces";
import { createContext } from "react";


interface ContextProps {
 cliente:Cliente, //Un array de un solo objeto
 productos:Producto[],
 total: number,
 addCliente: (cliente: Cliente) => void
 addProducto: (producto: Producto[]) => void
 cantidadProductos: (nuevoProducto:Producto) => void
 actualizarTotal: () => void
  }
export const PedidoContext = createContext({} as ContextProps);