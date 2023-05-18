import { Cliente, PedidoState, Producto } from "@/interfaces";

export type PedidoActionType =
  | {
      type: "SELECCIONAR_CLIENTE";
      payload: Cliente;
    }
  | {
      type: "SELECCIONAR_PRODUCTO";
      payload: Producto[]
    }
  | {
      type: "CANTIDAD_PRODUCTOS";
      payload: Producto
    }
    | {
      type: "ACTUALIZAR_TOTAL";
      
    };
export const pedidoReducer = (state: PedidoState, action: PedidoActionType): PedidoState => {
  switch (action.type) {
    case "SELECCIONAR_CLIENTE":
      return {
        ...state,
        cliente: action.payload
      };
    //break;
    case "SELECCIONAR_PRODUCTO" :
      return {
        ...state,
        productos: action.payload
      }
    case 'CANTIDAD_PRODUCTOS' :
      return {
        ...state,
        productos: state.productos.map((producto)=>{
          if(producto.id ===action.payload.id ){
            //Si el id del producto que estoy iterando es igual al id del producto que viene en el payload, reemplazo el producto iterado en el array por el producto que viene en el payload
            return action.payload 
          }
          else {
            //Caso contrario mantengo el mismo producto iterado
            return producto
          }

        })
      }
    case 'ACTUALIZAR_TOTAL' :
      return {
        ...state,
        total: state.productos.reduce((nuevoTotal,item)=>nuevoTotal+(item.precio * item.cantidad),0)
      }
    

    default:
      return state;
  }
};
