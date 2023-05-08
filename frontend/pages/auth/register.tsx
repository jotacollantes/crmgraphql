import Layout from "@/components/Layout";
import { RespuestaUsuarioNuevo } from "@/interfaces/usuario";
import { gql, useQuery,useMutation } from "@apollo/client";
import { useFormik } from "formik";
import React, { ReactElement, useState } from "react";
import * as Yup from 'yup'
import {useRouter} from 'next/router'

const NUEVOUSARIO=gql`
mutation NuevoUsuario($input: UsuarioInput) {
  nuevoUsuario(input: $input) {
    apellido
    creado
    email
    id
    nombre
  }
}
`

const Register = () => {
  //Obtener productos de graphql
  //const {loading,data,error} =useQuery(QUERY)
  //Loading cambia de true a false como un state
  //console.log(loading)
  //console.log(data)
  //console.log(error)

   const [mensajeState, setMensajeState] = useState<any>(null)
   const router=useRouter()
  // se obtiene el nombre del mutation
  const [nuevoUsuario] =useMutation<RespuestaUsuarioNuevo>(NUEVOUSARIO)
  const formik=useFormik({
    initialValues:  {
      nombre:'',
      apellido:'',
      email:'',
      password:''
    },
    //Las validaciones son antes del onSubmit(), yup previene el submit
    validationSchema:Yup.object({
      nombre : Yup.string().required('El nombre es obligatorio'),
      apellido : Yup.string().required('El apellido es obligatorio'),
      email : Yup.string().email('Formato de correo no es valido')
                 .required('El correo es obligatorio'),
      password: Yup.string().required('Password es obligatorio')
                    .min(6,'El password debe de ser 6 caracteres o mas')
    }),

    onSubmit: async (values) => {
      //alert(JSON.stringify(values, null, 2));

      //Valores obtenidos en los input del formulario
      const {nombre,apellido,email,password}=values
      try {
        //Usamos el nombre del mutation devuelto por useMutation(NUEVOUSARIO)

        //Obtengo la respuesta desde el servidor
        const {data}= await nuevoUsuario({
          variables:{
            input: {
              apellido,
              email,
              nombre,
              password
            }
          }
        })

        //Usuario creado correctamente
        //console.log(data)
        setMensajeState(`Se creo el usuario ${data?.nuevoUsuario.email}`)
        setTimeout(() => {
          setMensajeState(null)
          router.push('/auth/login')
        }, 3000);
      } catch (error:any) {
        
        //console.log(error.message)
        setMensajeState(error.message)
        //Para quitar el mensaje de error de la pantalla
        setTimeout(() => {
          setMensajeState(null)
        }, 3000);
      }
    },
  })

  return (
    <Layout>
      {
      mensajeState && (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
               <p>{mensajeState}</p>
             </div>
      
        )
      }
      <h1 className="text-center text-2xl text-white font-light">Crear Cuenta</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                Nombre
              </label>
              <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
              id='nombre'
              type="text"
              placeholder="Nombre Usuario"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {(formik.touched.nombre && formik.errors.nombre)
            && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.nombre}</p>
                </div>
            )
            }
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                Apellido
              </label>
              <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
              id='apellido'
              type="text"
              placeholder="Apellido Usuario"
              value={formik.values.apellido}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.apellido && formik.errors.apellido
            ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.apellido}</p>
                </div>
            )
            : null
          }
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
              id='email'
              type="email"
              placeholder="Email Usuario"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {(formik.touched.email && formik.errors.email)
            && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.email}</p>
                </div>
            )
            
          }
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
              id='password'
              type="password"
              placeholder="password Usuario"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              />
            </div>
              {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
              {(formik.touched.password && formik.errors.password)
            && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.password}</p>
                </div>
            )
            
          }
            <input
            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
            type="submit"
            value='Registrar Usuario'
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
