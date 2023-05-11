import Layout from "@/components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

import { useRouter } from "next/router";
import { OBTENER_PRODUCTOS } from "./productos";
const NUEVO_PRODUCTO = gql`
  mutation Mutation($input: ProductoInput) {
    nuevoProducto(input: $input) {
      creado
      existencia
      id
      nombre
      precio
    }
  }
`;
const NuevoProducto = () => {
  //Para formularios vacios se usa el hook de formik
  const [nuevoProducto, { data, loading, error }] = useMutation(NUEVO_PRODUCTO, {
    //Manejo del cache oara no volver a cargar la pagina desde el servidor
    update(cache, { data: { nuevoProducto } }) {
      //Obtener el objeto de cache que deseamos actualizar

      const cachedData = cache.readQuery<any>({
        query: OBTENER_PRODUCTOS,
      });
      // comprobar si la consulta está en caché
      if (cachedData) {
        // reescribir el caché sin mutarlo
        cache.writeQuery({
          query: OBTENER_PRODUCTOS,
          data: {
            obtenerProductos: [
              ...cachedData.obtenerProductos,
              nuevoProducto,
            ],
          },
        });
      } else {
        // realizar una consulta al servidor para obtener los datos más actualizados
        // escribir los nuevos datos en caché
        //console.log('se reescribe el cache')
        cache.writeQuery({
          query: OBTENER_PRODUCTOS,
          data: {
            obtenerProductos: [
              ...data.obtenerProductos,
              nuevoProducto,
            ],
          },
        });
      }
    },
  }
    
    
    );
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      nombre: "",
      existencia: "",
      precio: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre del producto es obligatorio"),
      existencia: Yup.number()
        .required("Cantidad es obligatorio")
        .positive("No se aceptan numeros negativos")
        .integer("La existencia debe de ser numeros enteros"),
      precio: Yup.number()
        .required("Precio es obligatorio")
        .positive("No se aceptan numeros negativos"),
    }),
    onSubmit: async (valores) => {
      //console.log(valores)
      try {
        const { nombre, existencia, precio } = valores;
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              existencia,
              precio,
            },
          },
        });
        //console.log(data.nuevoProducto)

        //MOstrar alerta
        Swal.fire(
          "Creado",
          "Se creo producto correctamente",

          "success"
        );
        //Redireccionar a /productos
        router.push("/productos");
      } catch (error: any) {
        console.log(error.message);
      }
    },
  });
  return (
    <Layout>
      {/* <h1 className="text-2xl text-gray-800 font-light text-center"> */}
      <h1 className="text-2xl text-gray-800 font-light">
        Crear Nuevo Producto
      </h1>

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
                placeholder="Nombre de Producto"
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
                htmlFor="existencia"
              >
                Cantidad
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="existencia"
                type="number"
                placeholder="Cantidad"
                value={formik.values.existencia}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.existencia && formik.errors.existencia && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.existencia}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="precio"
              >
                Precio
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-online"
                id="precio"
                type="number"
                placeholder="Precio"
                value={formik.values.precio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}
            {formik.touched.precio && formik.errors.precio && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{formik.errors.precio}</p>
              </div>
            )}
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value={"Agregar nuevo producto"}
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoProducto;
