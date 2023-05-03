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

export const Producto= mongoose.model('Producto',ProductoSchema)