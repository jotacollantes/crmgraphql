import mongoose from "mongoose";

const ClienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellido: {
        type: String,
        require: true,
        trim: true
    },
    empresa: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    telefono: {
        type: String,
        require: false,
        trim: true
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Usuario'
    },

    creado:{
        type: Date,
        default: Date.now()
    }
    
})

export const Cliente= mongoose.model('Cliente',ClienteSchema)