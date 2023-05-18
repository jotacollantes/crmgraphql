import { PedidoContext } from "@/context/pedidos"
import { useContext } from "react"


//Creamos este custom hook para poder usar el Auth context
export const usePedido=()=>{
    return useContext(PedidoContext)
}