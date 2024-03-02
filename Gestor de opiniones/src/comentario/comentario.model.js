import { Schema, model } from 'mongoose';

const comentarioSchema = Schema({
    opinion: {
        type: String,
        required: true
    },
    ComentarioDe: {
        type: Schema.Types.ObjectId,
        ref: 'publiacion',
        required: true
    }
}, {
    versionKey: false
})

export default model('comentario', comentarioSchema)