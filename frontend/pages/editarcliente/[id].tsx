import React from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useQuery,useMutation,gql } from '@apollo/client'
import { ErrorMessage, Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { OBTENER_CLIENTES_VENDEDOR } from '..'


interface Cliente{
  nombre:string
  apellido:string
  email:string
  empresa:string
  telefono?:string
}

const OBTENER_CLIENTE_ID=gql`
query Query($id: ID!) {
  obtenerCliente(id: $id) {
    id
    nombre
    apellido
    empresa
    email
    telefono
    vendedor
  }
}
`
const ACTUALIZAR_CLIENTE_ID=gql`mutation Mutation($id: ID!, $input: ClienteInput) {
  actualizarCliente(id: $id, input: $input) {
    id
    nombre
    apellido
    email
    empresa
    vendedor
  }
}`

const EditarCliente = () => {
    const router=useRouter()
    const {query} = router
    //console.log(query)

    const {loading,data,error}=useQuery(OBTENER_CLIENTE_ID,{variables: {id: query.id}})
    //Actualizar el cliente
    
    const [actualizarCliente]=useMutation(ACTUALIZAR_CLIENTE_ID,{
      update(cache, { data: { actualizarCliente } }  ){

        //Obtener una copia del cache
        const {obtenerClientesPorVendedor}=cache.readQuery<any>({query: OBTENER_CLIENTES_VENDEDOR})

        //FILTRAMOS LOS CLIENTES EXCLUYENDO EL CLIENTE QUE SE ESTA MODIFICANDO PARA LUEGO SUMARLE EL CLIENTE CON LOS DATOS actualizados
        const clientsCached= obtenerClientesPorVendedor.filter((cliente:any)=>cliente.id !==actualizarCliente.id)


        //Reescribir el cache
        cache.writeQuery({
          query: OBTENER_CLIENTES_VENDEDOR,
          //Que segmento del cache vamos a actualizar
          data:{
            
            obtenerClientesPorVendedor: [
              //insertamos los clientes en cache menos el cliente que se actualizao 
              ...clientsCached,
              //Añadimos el cliente que se actualizo con los nuevos datos
              actualizarCliente
            ]
          }
        })
      }
    })
  

    //Esquema de validacion
    const schemaValidation=Yup.object({
        nombre: Yup.string().required("El nombre es obligatorio"),
        apellido: Yup.string().required("El apellido es obligatorio"),
        empresa: Yup.string().required("Empresa es obligatorio"),
        email: Yup.string()
          .email("Formato de correo no es valido")
          .required("El correo es obligatorio"),
        //Telefono es opcional
      })

    //Siempre hay que esperar a que se actualice el estado loading de useQuerynpara poder tener acceso al estado data
    if (loading) {
        return (<h1>Cargando...</h1>)
    }

    //!Por regla general de los hooks si en el primer renderizado se ejecutaron 2 hooks en el segundo no se puede agregar otro hook por ese motivo tampoco puedo usar el hook useFormik

    const {obtenerCliente}=data
    //console.log(obtenerCliente)
    //Modificar el cliente en la BD
    const actualizarDatosCliente =async (valores:Cliente)=>{
      const {nombre,apellido,empresa,email,telefono}=valores

      try {
        const { data } = await actualizarCliente({
          variables: {
            id: query.id,
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono,
            },
          },
        });
        

        Swal.fire(
          'Cliente Actualizado',
          //'Your file has been deleted.',
          'El cliente ha sido actualizado',
          'success')
        router.push('/')
      } catch (error) {
        
      }

    }
  return (
    <Layout>
        <h1>Editar cliente</h1>
        <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
            {/* En este caso el formulario ya va a estar precargados con los datos del cliente traidos desde la BD por lo tanto se va a usar el componente de formik y no el hook useFormik */}
            <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={(valores)=>{
                //console.log(valores)
                actualizarDatosCliente(valores)
                
            }}
            >
                {(props) =>{
                    //console.log(props)
                return (
                    <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={props.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="nombre"
                type="text"
                placeholder="Nombre de Usuario"
                value={props.values.nombre}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                name="nombre"
              />
            </div>

            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio. Para poder usar ErrorMessage es necesario definir el atributo name en el input */}

            {props.touched.nombre && props.errors.nombre && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {/* <p>{props.errors.nombre}</p>  */}
                
                <ErrorMessage name="nombre" component='span'/>
                               
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Apellido
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="apellido"
                type="text"
                placeholder="Apellido de Usuario"
                value={props.values.apellido}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                name="apellido"
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio. Para poder usar ErrorMessage es necesario definir el atributo name en el input */}

            {props.touched.apellido && props.errors.apellido && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {/* <p>{props.errors.apellido}</p> */}
                <ErrorMessage name="apellido" />
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="empresa"
              >
                Empresa
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="empresa"
                type="text"
                placeholder="Empresa"
                value={props.values.empresa}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                name="empresa"
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio. Para poder usar ErrorMessage es necesario definir el atributo name en el input */}

            {props.touched.empresa && props.errors.empresa && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {/* <p>{props.errors.empresa}</p> */}
                <ErrorMessage name="empresa" />
              </div>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="email"
                type="email"
                placeholder="Email de Usuario"
                value={props.values.email}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                name="email"
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio. Para poder usar ErrorMessage es necesario definir el atributo name en el input */}

            {props.touched.email && props.errors.email && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                {/* <p>{props.errors.email}</p> */}
                <ErrorMessage name="email" />
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="telefono"
              >
                Telefono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="telefono"
                type="tel"
                placeholder="Telefono"
                value={props.values.telefono}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                name="telefono"
              />
            </div>
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value={"Editar Cliente"}
            />
          </form>
                )
                }}
                
            </Formik>

          
        </div>
      </div>

    </Layout>
    
  )
}

export default EditarCliente