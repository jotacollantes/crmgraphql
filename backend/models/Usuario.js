import mongoose from "mongoose";

const UsuarioSchema = mongoose.Schema({
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
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    creado:{
        type: Date,
        default: Date.now()
    }
    
})

export const Usuario= mongoose.model('Usuario',UsuarioSchema)