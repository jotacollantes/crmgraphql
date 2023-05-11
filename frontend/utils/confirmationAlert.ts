import Swal from "sweetalert2"

interface Args{
    title:string,
    callback:()=>void
}
const confirmacion =({title,callback}:Args)=>{
    Swal.fire({
        //title: 'Deseas eliminar a este cliente?',
        title: title,
        text: "Esta accion no se puede reversar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText:'No, cancelar',
     
      }).then(async (result) => {
        if (result.isConfirmed) {
          //console.log('eliminando ',id)
           callback()
           
         
        }
      })
}
