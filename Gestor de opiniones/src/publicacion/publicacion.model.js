import mongoose from "mongoose"

const publicacionSchema = mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },
    categoria:{
        type: String,
        required: true
    },
    texto:{
        type: String,
        required: true
    }

})

export default mongoose.model('publicacion', publicacionSchema)