import Layout from "@/components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { AuthInterfaceResponse } from "@/interfaces/auth";
import { useRouter } from "next/router";

const AUTH = gql`
  mutation AutenticarUsuario($input: AuthInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [mensajeState, setMensajeState] = useState<any>(null);
  const router=useRouter()
  const [autenticarUsuario] = useMutation<AuthInterfaceResponse>(AUTH);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    //Las validaciones son antes del onSubmit(), yup previene el submit
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Formato de correo no es valido")
        .required("El correo es obligatorio"),
      password: Yup.string()
        .required("Password es obligatorio")
        .min(6, "El password debe de ser 6 caracteres o mas"),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
      console.log(email,password)
      try {
        const { data } = await autenticarUsuario({
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      });
      console.log(data)
      //Login Correcto
        //console.log(data?.autenticarUsuario.token)
        setMensajeState('Autenticando...')
        const {token}=data?.autenticarUsuario!
        //Guardar token en localstorage
        localStorage.setItem('token',token)
        //Redireccionar vendedor a la pagina de clentes
        setTimeout(() => {
          setMensajeState(null)
          router.push('/')
        }, 3000);
        
      } catch (error:any) {
      console.log(error.message)
      setMensajeState(error.message)
      //Para quitar el mensaje de error de la pantalla
      setTimeout(() => {
        setMensajeState(null)
      }, 3000);
        
      }
      
      return;
    },
  });
  return (
    <Layout>
      {
      mensajeState && (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto ">
               <p>{mensajeState}</p>
             </div>
      
        )
      }
      <h1 className="text-center text-2xl text-white font-light">Login</h1>
      <div className="flex justify-center mt-5 border-2 border-white ">
        <div className="w-full max-w-sm">
          <form onSubmit={formik.handleSubmit} className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
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
                placeholder="Email Usuario"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.email && formik.errors.email && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.email}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="password"
                type="password"
                placeholder="password Usuario"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.password && formik.errors.password && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.password}</p>
              </div>
            )}
            <input
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
              type="submit"
              value="Iniciar Sesion"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default Login;