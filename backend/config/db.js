import mongoose from "mongoose";

export const conectarDB= async()=>{

    try {
        await mongoose.connect(process.env.DB_MONGO,
            {
                useNewUrlParser:true,
                useUnifiedTopology:true,
                
            }
        )
        console.log('DB Conectada')
    } catch (error) {
        console.log('hubo un error')
        //throw new Error(error)
        //Detiene el proceso
        process.exit(1)
    }
}