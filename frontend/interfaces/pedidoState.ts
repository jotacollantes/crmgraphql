export interface PedidoState {
    cliente : Cliente,
    productos:Producto [],
    total:number
  }

export interface Cliente {
    id : string,
    nombre : string,
    apellido : string,
    empresa ?: string,
    email ?: string,
    vendedor ?: string,
}

export interface Producto {
  id : string,
  precio : number,
  nombre : string,
  existencia : number,
  cantidad : number //Campo para manejar la cantidad de productos solicitado por el vendedor
}


