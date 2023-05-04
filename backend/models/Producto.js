import mongoose from "mongoose";

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    existencia: {
        type :Number,
        require: true,
        trim: true
    },
    precio: {
        type :Number,
        require: true,
        trim: true
    },

    creado:{
        type: Date,
        default: Date.now()
    }
    
})
//Creamos un indice de tipo text para las busquedas por nombre de producto, necesario para el operador $text
ProductoSchema.index({nombre:'text'});
export const Producto= mongoose.model('Producto',ProductoSchema)