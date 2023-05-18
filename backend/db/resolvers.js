import { Usuario, Producto, Cliente,Pedido } from "../models/index.js"
import { utils } from "../helpers/utils.js"

export const resolvers = {
    Query: {

        obtenerUsuario: (_, {  },ctx) => {
            // const usuarioId = utils.verifyToken(token, process.env.SECRET_KEY)
            // console.log(usuarioId)
            // return usuarioId
            return ctx
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find()
                return productos
            } catch (error) {
                console.log(error)
            }

        },
        obtenerProductoPorId: async (_, { input }) => {
            const { id } = input

            const producto = await Producto.findById(id)
            if (!producto) {
                throw new Error('Producto no existe')
            }

            return producto

        },
        obtenerClientes: async () => {
            try {
                const clientes = await Cliente.find()
                return clientes
            } catch (error) {
                console.log(error)
            }

        },
        obtenerClientesPorVendedor: async (_, { }, ctx) => {
            try {
                const clientes = await Cliente.find({ vendedor: ctx.id.toString() })
                //const clientes = await Cliente.find({ vendedor: ctx.id })
                return clientes
            } catch (error) {
                console.log(error)
            }

        },
        obtenerCliente: async (_, { id }, ctx) => {
            try {
                const cliente = await Cliente.findById(id)
                if (!cliente) {
                    throw new Error('Cliente no existe');
                }
                // Se usa el toString porque el id en el modelo viene con ObjectId('sdfsdfsdfsdf')
                if (cliente.vendedor.toString() !== ctx.id) {

                    throw new Error('No estas autorizado para ver este cliente');
                }
                return cliente
            } catch (error) {
                console.log(error)
            }

        },
        obtenerPedidos:  async()=>{
            try {
                const pedidos =await Pedido.find()
                return pedidos
            } catch (error) {
                console.log((error))
            }
             
        },
        obtenerPedidosVendedor: async(_,{},ctx)=>{
            try {
                //Con populate traemos los datos del modelo cliente, en el modelo Pedido tenemos registro el ID del cliente
                const pedidos = await Pedido.find({vendedor:ctx.id}).populate('cliente')
                //console.log(pedidos)
                return pedidos
            } catch (error) {
                console.log(error)
            }
        },
        obtenerPedidoEspecifico: async(_,{id},ctx)=>{
            //console.log(id)
            //Verificar si pedido existe
            const pedido = await Pedido.findById(id)
            if(!pedido){
                throw new Error('Pedido no existe')
            }
            //Validar si es el vendedor autorizado
            if(pedido.vendedor.toString() !==ctx.id){
                throw new Error('No estas autorizado para ver este cliente');
            }
            //Retornar Resultado
            
            return pedido

        },
        obtenerPedidosPorEstado:async(_,{estado},ctx)=>{
            
            try {
                const pedidos =await Pedido.find({vendedor:ctx.id,estado:estado})
                return pedidos
            } catch (error) {
                console.log(error)
            }

        },
        mejoresClientes: async()=>{
            const clientes = await Pedido.aggregate([
                //Primer Paso: El filtro
                {$match: {estado:"COMPLETADO"}},
                //Segundo Paso: La agrupacion por el campo cliente
                {$group:{
                    _id:"$cliente",
                    //Operador de acumulacion
                    total:{$sum:"$total"}
                }},
                //EL join para poder mostrar los datos del cliente
                {
                    $lookup: {
                      //Nombre de la coleccion donde se hace el Join
                      from: 'clientes',
                      //Campo clave de la coleccion pedidos
                      localField: '_id',
                      //Campo foraneo de la coleccion clientes
                      foreignField: '_id',
                      //Nombre del array con el output de los resultados
                      as: 'cliente'
                    }
                },
                 //Los 3 primeros clientes
                 {
                    $limit:3
                },
                //EL sort
                {
                    $sort:{total:-1}
                }
            ])
            return clientes
        },
        mejoresVendedores: async()=>{
            const vendedores = await Pedido.aggregate([
                //Primer Paso: El filtro
                {$match: {estado:"COMPLETADO"}},
                //Segundo Paso: La agrupacion por el campo vendedor
                {$group:{
                    _id:"$vendedor",
                    //Operador de acumulacion
                    total:{$sum:"$total"}
                }},
                //EL join para poder mostrar los datos del cliente
                {
                    $lookup: {
                      //Nombre de la coleccion donde se hace el Join
                      from: 'usuarios',
                      //Campo clave de la coleccion pedidos
                      localField: '_id',
                      //Campo foraneo de la coleccion usuarios
                      foreignField: '_id',
                      //Nombre del array con el output de los resultados
                      as: 'vendedor'
                    }
                },
                //Los 3 primeros vendedores
                {
                    $limit:3
                },
                //EL sort
                {
                    $sort:{total:-1}
                }
            ])
        },
        buscarProductos: async(_,{texto},ctx)=>{
            //Para usar el operador $text es necesario crear un indice en el modelo Producto de tipo text. $search buscara los productos que contenga el valor contenido en texto por ejemplo "Monitor"
            const productos =await Producto.find({$text:{$search: texto}}).limit(10)
            return productos
        }

    },
    Mutation: {
        nuevoUsuario: async (_, { input }, ctx) => {
            //console.log(input)
            const { email, password } = input

            //Revisar si el usuario esta registrado
            const existeUsuario = await Usuario.findOne({ email: email })
            if (existeUsuario) {
                throw new Error('El usuario ya existe')
            }
            try {

                const usuario = new Usuario(input)
                //encriptar la clave
                usuario.password = await utils.Hash(password)
                await usuario.save()
                return usuario
            } catch (error) {
                console.log(error)
            }

        },
        autenticarUsuario: async (_, { input }) => {
            //Validar si el Usuario Existe
            const { email, password } = input

            const usuarioExiste = await Usuario.findOne({ email: email })
            if (!usuarioExiste) {
                throw new Error('Usuario no existe')
            }
            //Comparar passwords
            if (!utils.verifyPassword(password, usuarioExiste.password)) {
                throw new Error('Contraseña invalidad')
            }
            //Generar JWT
            return {
                token: utils.JWT(usuarioExiste, process.env.SECRET_KEY, '24h')
            }

        },
        nuevoProducto: async (_, { input }) => {
            const { nombre, existencia, precio } = input

            // Verificar si el producto ya existe.
            const productoExiste = await Producto.findOne({ nombre: nombre })
            if (productoExiste) {
                throw new Error('Producto ya existe')
            }
            // crear producto
            try {
                const producto = new Producto(input)
                await producto.save()
                return producto
            } catch (error) {
                console.log(error)
            }

        },
        actualizaProducto: async (_, { id, input }) => {

            let producto = await Producto.findById(id)
            if (!producto) {
                throw new Error('Producto no existe')
            }
            try {

                //producto = await Producto.findOneAndUpdate(id, input, { new: true })
                producto = await Producto.findByIdAndUpdate(id, input, { new: true })

                return producto
            } catch (error) {
                console.log(error)
            }
        },
        eliminarProducto: async (_, { id }) => {
            const producto = await Producto.findById(id)
            if (!producto) {
                throw new Error('Producto no existe')
            }
            try {
                await Producto.findByIdAndDelete(id)
                //return "Producto Eliminado"
                return {
                    id: id,
                    mensaje: "Producto eliminado"
                }
            } catch (error) {
                console.log(error)
            }

        },
        nuevoCliente: async (_, { input }, ctx) => {
            const { email } = input
            const clienteExiste = await Cliente.findOne({ email: email })
            if (clienteExiste) {
                throw new Error('Cliente ya existe')
            }

            const clienteNuevo = new Cliente(input)
            clienteNuevo.vendedor = ctx.id


            try {

                const resultado = await clienteNuevo.save()
                return resultado
            } catch (error) {
                console.log(error)
            }
        },
        actualizarCliente: async (_, { id, input }, ctx) => {
            let cliente = await Cliente.findById(id)
            if (!cliente) {
                throw new Error('Cliente no existe')
            }


            if (cliente.vendedor.toString() !== ctx.id) {

                throw new Error('No estas autorizado para actualizar este cliente');
            }

            cliente = await Cliente.findByIdAndUpdate(id, input, { new: true })
            return cliente
        },
        eliminarCliente: async(_,{id},ctx)=>{
            //BUscar Cliente
            let cliente= await Cliente.findById(id)
            if(!cliente){
                throw new Error('Cliente no existe')
            }

            //Validar vendedor
            if (cliente.vendedor.toString() !== ctx.id){
              throw new Error('No esta autorizado para eliminar este usuario')
            }

            //BorrarCliente.
            try {
                await Cliente.findByIdAndDelete(id)
                //return "Cliente Eliminado"
                //console.log(id)
                return {id: id,mensaje: "Cliente eliminado"}
               
            } catch (error) {
                console.log(error)
            }
            
        },
        nuevoPedido: async(_,{input},ctx)=>{
            // input PedidoInput{
            //     pedido: [PedidoProductoInput]
            //     total:Float!
            //     cliente:ID!
            //     estado: EstadoPedido
            // }
            
        
        // input PedidoProductoInput{
        //     #id del producto
        //     id: ID,
        //     cantidad:Int
        // }
            
            //Verificar si cliente existe o no
            const {cliente}=input
            
            let clienteExiste= await Cliente.findById(cliente)
            if(!clienteExiste){
                throw new Error('Cliente no existe')
            }
            //Verificar si el cliente es del vendedor
            
            if(clienteExiste.vendedor.toString() !== ctx.id){
                throw new Error('No esta autorizado para generar este pedido')
            }
            //Revisar que el stock este disponible
            console.log(input.pedido)
            for (const item of input.pedido) {
                const producto = await Producto.findById(item.id)
                if(item.cantidad > producto.existencia){
                    throw new Error(`Cantidad de productos solicitados no disponible en: ${producto.nombre}`)
                }
                else {
                    //Actualizamos la existencia
                    producto.existencia =producto.existencia - item.cantidad
                    await producto.save()
                }
            }
            

            //Crear un nuevo Pedido
            const nuevoPedido= new Pedido(input)
            //Asignarle un vendedor
            nuevoPedido.vendedor=ctx.id
            //Guardarlo en la base de dato
            const resultado =await nuevoPedido.save()
            return resultado
        },

        actualizarPedido: async(_,{id,input},ctx)=>
        {
   
             
             const {cliente: clienteId,pedido}= input
            //Validar si pedido existe
            let pedidoExiste = await Pedido.findById(id)

            if (!pedidoExiste) {
                throw new Error('Pedido no existe')
            }
            
            //Validar si el cliente Existe.
            const clienteExiste = await Cliente.findById(clienteId)
            if(!clienteExiste){
                throw new Error('Cliente no existe')
            }

            //Validar si el pedido pertenece al vendedor conectado
            if(pedidoExiste.vendedor.toString() !==ctx.id){
                throw new Error('No esta autorizado para generar este pedido')
            }
            //Revisar el Stock
            //Si viene el pedido en el input
            if (pedido){
                for await(const item of pedido) {
                    let producto = await Producto.findById(item.id)
                    if(item.cantidad > producto.existencia ){
                        throw new Error('Cantidad de productos solicitados no disponible')
                    }
                    else {
                        producto.existencia=producto.existencia - item.cantidad
                        await producto.save
                    }
                }
            }

            //Guardar el Pedido
            const resultado = await Pedido.findByIdAndUpdate(id,input,{new:true})
            return resultado
        },
        eliminarPedido: async(_,{id},ctx)=>{
            
            const pedidoExiste =await Pedido.findById(id)
            if(!pedidoExiste){
                throw new Error('Pedido no existe')
            }

            if (pedidoExiste.vendedor.toString() !== ctx.id){
                throw new Error('No estas autorizado para eliminar el pedido')
            }
            try {
                await Pedido.findByIdAndDelete(id)
                //return "Pedido Eliminado"
                return {
                    id : id,
                    mensaje: "Pedido Eliminado"
                }

            } catch (error) {
                console.log(error)
            }
            
        }


    }
}