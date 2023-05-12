import Layout from "@/components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import { ErrorMessage, Formik } from "formik";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import * as Yup from "yup";

interface Producto {
  creado: string;
  existencia: number;
  id: string;
  nombre: "monitores 24 pulgadas";
  precio: number;
}
const OBTENER_PRODUCTO_ID = gql`
  query Query($input: IdProductInput) {
    obtenerProductoPorId(input: $input) {
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;

const ACTUALIZA_PRODUCTO_ID = gql`
  mutation ActualizaProducto($id: ID!, $input: ProductoInput) {
    actualizaProducto(id: $id, input: $input) {
      nombre
      existencia
      precio
      creado
      id
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const { query } = router;
  //console.log(query.id)

  const { data, loading, error } = useQuery(OBTENER_PRODUCTO_ID, {
    variables: {
      input: {
        id: query.id,
      },
    },
  });
  //console.log(loading)
  //console.log(data)
  const [actualizaProducto] = useMutation(ACTUALIZA_PRODUCTO_ID);
  if (loading) {
    return <h1>Cargando...</h1>;
  }

  //El state data siempre se tiene que leer despues del loading
  if (!data) {
    return <h1>Accion no permitida</h1>;
  }

  //!Por regla general de los hooks si en el primer renderizado se ejecutaron 2 hooks en el segundo no se puede agregar otro hook por ese motivo tampoco puedo usar el hook useFormik

  const { obtenerProductoPorId } = data;

  const schemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre del producto es obligatorio"),
    existencia: Yup.number()
      .required("Cantidad es obligatorio")
      .positive("No se aceptan numeros negativos")
      .integer("La existencia debe de ser numeros enteros"),
    precio: Yup.number()
      .required("Precio es obligatorio")
      .positive("No se aceptan numeros negativos"),
  });

  const actualizarInfoProductos = async (valores: Producto) => {
    //console.log(valores);
    const { nombre, existencia, precio } = valores;

    try {
      const { data } = await actualizaProducto({
        variables: {
          id: query.id,
          input: {
            nombre,
            existencia,
            precio,
          },
        },
      });
      Swal.fire(
        "Producto Actualizado",
        "El producto ha sido actualizado",
        "success"
      );
      router.push("/productos");
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            enableReinitialize
            initialValues={obtenerProductoPorId}
            validationSchema={schemaValidation}
            onSubmit={(valores) => {
              actualizarInfoProductos(valores);
              //console.log(valores)
            }}
          >
            {(props) => {
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
                      placeholder="Nombre de Producto"
                      value={props.values.nombre}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}

                  {props.touched.nombre && props.errors.nombre && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {/* <p>{props.errors.nombre}</p> */}
                      <ErrorMessage name="nombre" />
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
                      value={props.values.existencia}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}

                  {props.touched.existencia && props.errors.existencia && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {/* <p>{props.errors.existencia}</p> */}
                      <ErrorMessage name="existencia" />
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
                      value={props.values.precio}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>

                  {/* Para mostrar el mensaje de error cuando el usuario se cambia de input y este esta vacio */}

                  {props.touched.precio && props.errors.precio && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      {/* <p>{props.errors.precio}</p> */}
                      <ErrorMessage name="precio" />
                    </div>
                  )}
                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    value={"Agregar nuevo producto"}
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarProducto;
