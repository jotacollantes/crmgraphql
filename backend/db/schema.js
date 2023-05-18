import {gql} from 'apollo-server'

export const typeDefs=gql`

type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
},
type Cliente {
    id: ID
    nombre: String
    apellido: String
    email: String
    empresa: String
    telefono: String
    vendedor: ID
    creado: String
}
type ClienteEliminado{
    id:ID,
    mensaje:String
}
type Token {
    token: String
}

type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
    creado: String
}

type ProductoEliminado{
    id:ID,
    mensaje:String
}
type Pedido {
    id:ID
    pedido:[PedidoGrupo]
    total: Float
    #cliente:ID, ahora la propiedad cliente en el pedido tiene el type Cliente
    cliente: Cliente
    vendedor:ID
    fecha: String
    #Enum EstadoPedido
    estado: EstadoPedido
}
type PedidoGrupo {
 #id del producto
 id: ID,
 cantidad:Int,
 nombre:String,
 precio: Float
}

type TopCliente {
    total: Float,
    #Se define como array porque el lookup de mongo al momento del join devuelve un array
    cliente:[Cliente]
}

type TopVendedor {
    total: Float,
    #Se define como array porque el lookup de mongo al momento del join devuelve un array
    vendedor: [Usuario]
}
input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
}

input ClienteInput {
    nombre: String!
    apellido: String!
    email: String!
    empresa: String!
    telefono: String
}

input AuthInput{
    email: String!
    password: String!
}

input ProductoInput{
    nombre: String!
    existencia : Int!
    precio: Float!
}
input IdProductInput{
    id: ID!
}

input PedidoInput{
    pedido: [PedidoProductoInput]
    total:Float
    cliente:ID
    # EstadoPedido es un ENUM
    estado: EstadoPedido
}
input PedidoProductoInput{
    #id del producto
    id: ID,
    cantidad:Int,
    nombre:String,
    precio: Float
}

input EstadoInput{
    # EstadoPedido es un ENUM
    estado: EstadoPedido
}
enum EstadoPedido{
    PENDIENTE
    COMPLETADO
    CANCELADO
}
type RespuestaEliminar{
    id:ID,
    mensaje:String
    }
    
type Query {
    #Usuarios
    # obtenerUsuario(token: String!): Usuario,
    obtenerUsuario: Usuario,
    
    #Productos
    # No recibe argumentos por ende va sin ()
    obtenerProductos:[Producto],
    obtenerProductoPorId(input:IdProductInput):Producto,

    #Clientes
    obtenerClientes: [Cliente],
    obtenerClientesPorVendedor: [Cliente],
    obtenerCliente(id:ID!): Cliente,

    # Pedidos
    obtenerPedidos: [Pedido],
    obtenerPedidosVendedor: [Pedido],
    obtenerPedidoEspecifico(id:ID!): Pedido,
    obtenerPedidosPorEstado(estado:String!):[Pedido],

    #Busquedas avanzadas
    mejoresClientes:[TopCliente],
    mejoresVendedores:[TopVendedor]
    buscarProductos(texto:String!):[Producto]
    
}


type Mutation {
    # Usarios
    nuevoUsuario(input: UsuarioInput): Usuario,
    autenticarUsuario(input: AuthInput): Token,

    # Productos
    nuevoProducto(input: ProductoInput): Producto,
    actualizaProducto(id:ID!,input: ProductoInput): Producto,
    eliminarProducto(id:ID!): ProductoEliminado,

    # Clientes
    nuevoCliente(input: ClienteInput): Cliente,
    actualizarCliente(id:ID!,input:ClienteInput): Cliente
    #eliminarCliente(id:ID!):String
    eliminarCliente(id:ID!):ClienteEliminado

    # Pedidos
    nuevoPedido(input: PedidoInput):Pedido
    actualizarPedido(id:ID!,input: PedidoInput):Pedido
    #eliminarPedido(id:ID!):String
    eliminarPedido(id:ID!):RespuestaEliminar
}
`