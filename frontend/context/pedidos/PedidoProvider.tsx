import React, { useReducer } from "react";

import { PedidoContext, pedidoReducer } from "./";
import { Cliente, PedidoState, Producto } from "@/interfaces";

interface Props {
  children: JSX.Element | JSX.Element[];
}

//Inicializamos
const initialState: PedidoState = {
  cliente: {
    id: "",
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    vendedor: "",
  }, 
  productos: [],
  total: 0,
};

const PedidoProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(pedidoReducer, initialState);

  const addCliente =(cliente:Cliente) =>{
    //console.log(cliente)
    dispatch({type: 'SELECCIONAR_CLIENTE',payload: cliente})
  }
  const addProducto=(productoSeleccionados:Producto[])=>{
    let nuevoState
    
    if(state.productos.length > 0)
    {
      //Tomar el segundo arreglo y fusionarlo con el primero ya que react select resetea el elemento anterio creandolo con los valores de la base de datos y ya no incluye la propiedad cantidad
      nuevoState=productoSeleccionados.map((producto)=>{
        const nuevoObjeto=state.productos.find((productoState)=>productoState.id===producto.id)
        return {
          //producto no incluye el campo cantidad, nuevoObjeto incluye el campo cantidad porque es del state anterior
            ...producto,...nuevoObjeto
        }
      })
    }
    else{
       nuevoState= productoSeleccionados
    }
    dispatch({type:'SELECCIONAR_PRODUCTO',payload: nuevoState})

  }

  //Modifica las cantidades de los productos
  const cantidadProductos=(nuevoProducto:Producto)=>{
    //console.log('desde provider: ',nuevoProducto)
    dispatch({type:'CANTIDAD_PRODUCTOS',payload:nuevoProducto})
  }

  const actualizarTotal=()=>{
    //console.log('calculando')
    dispatch({type:'ACTUALIZAR_TOTAL'})
  }

  return (
    <PedidoContext.Provider value={{ ...state,addCliente,addProducto,cantidadProductos,actualizarTotal }}>
      {children}
    </PedidoContext.Provider>
  );
};
export default PedidoProvider;
