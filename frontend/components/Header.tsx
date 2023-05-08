import React from 'react'
import { useQuery ,gql} from '@apollo/client';
import { useRouter } from 'next/router';


const   OBTENERUSUARIO=gql`query ObtenerUsuario {
    obtenerUsuario{
      email
      id
      creado
      apellido
      nombre
    }
  }`
const Header = () => {
    const router=useRouter()
    const {loading,data,error}=useQuery(OBTENERUSUARIO)
    
    
   //console.log(data?.obtenerUsuario)
   
   // Es necesario usar el loading antes de usar el data del useQuery
   if (loading){
    return  <h1>Cargando...</h1>
   }

   if(!data.obtenerUsuario){
   router.push('/auth/login')
   }

const {nombre,apellido}=data?.obtenerUsuario
const cerrarSesion=()=>{
    localStorage.removeItem('token')
    router.push('/auth/login')
}
  return (
    <div className='flex justify-between mt-1'>
        <p className='mr-2'>
            {
                `Hola ${nombre} ${apellido}`
            }
        
                </p>
        <button
        type="button"
        className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
        onClick={cerrarSesion}
        >Cerrar Sesion
        </button>
    </div>
  )
}

export default Header