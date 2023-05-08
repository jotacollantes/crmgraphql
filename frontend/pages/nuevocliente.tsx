import Layout from "@/components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { OBTENER_CLIENTES_VENDEDOR } from ".";

const NUEVO_CLIENTE = gql`
  mutation Mutation($input: ClienteInput) {
    nuevoCliente(input: $input) {
      vendedor
      telefono
      nombre
      id
      empresa
      email
      creado
      apellido
    }
  }
`;

const NuevoCliente = () => {
  const [mensajeState, setMensajeState] = useState<any>(null);
  const router = useRouter();


  const [nuevoCliente] = useMutation(NUEVO_CLIENTE)
  //la pagina nuevocliente no guarda en cache la informacion que tiene la pagina /clientes
  //En el cache de nuevocliente no tiene en cache el segmento obtenerClientesPorVendedor que si esta en /clientes

  //!Cannot destructure property 'obtenerClientesPorVendedor' of 'cache.readQuery(...)' as it is null.

  /*
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE,
    {
          //Manejo del cache oara no volver a cargar la pagina desde el servidor
          update(cache,{data:{nuevoCliente}}){
            //Obtener el objeto de cache que deseamos actualizar
            const {obtenerClientesPorVendedor}=cache.readQuery<any>({query: OBTENER_CLIENTES_VENDEDOR})

            //Reescribimos el cache sin mutarlo (el cache nunca se debe de modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES_VENDEDOR,
                //Especificamos que segmento del cache vamos actualizar
                data:{
                    //Tomamos una copiua de lo que hay en cache ...obtenerClientesPorVendedor y añadimos al array el nuevo cliente nuevoCliente
                    obtenerClientesPorVendedor:[...obtenerClientesPorVendedor,nuevoCliente]
                }
            })

          }
    });
  */
    
  
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      telefono: "",
    }, //Las validaciones son antes del onSubmit(), yup previene el submit
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      apellido: Yup.string().required("El apellido es obligatorio"),
      empresa: Yup.string().required("Empresa es obligatorio"),
      email: Yup.string()
        .email("Formato de correo no es valido")
        .required("El correo es obligatorio"),
      //Telefono es opcional
    }),
    onSubmit: async (values) => {
      //console.log(values)
      const { nombre, apellido, empresa, email, telefono } = values;
      console.log({ email });
      try {
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono,
            },
          },
        });
        //console.log(data);
        setMensajeState('Cliente registrado exitosamente')
        setTimeout(() => {
            setMensajeState(null)
            router.push('/')
        }, 3000);
      } catch (error: any) {
             //console.log(error.message)
             setMensajeState(error.message)
             //Para quitar el mensaje de error de la pantalla
             setTimeout(() => {
               setMensajeState(null)
             }, 3000);
      }
    },
  });
  return (
    <Layout>
      {mensajeState && (
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
          <p>{mensajeState}</p>
        </div>
      )}
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
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
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.nombre && formik.errors.nombre && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.nombre}</p>
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
                value={formik.values.apellido}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.apellido && formik.errors.apellido && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.apellido}</p>
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
                value={formik.values.empresa}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.empresa && formik.errors.empresa && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.empresa}</p>
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
                htmlFor="telefono"
              >
                Telefono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="telefono"
                type="tel"
                placeholder="Telefono"
                value={formik.values.telefono}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value={"Registrar Cliente"}
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoCliente;
