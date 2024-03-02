'use strict'

import Comentario from './comentario.model.js'

export const save = async (req, res) => {
    try {
        let data = req.body
        let comentario = new Comentario(data)
        await comentario.save()
        return res.send({ message: 'I make a comentario' })
    } catch (err) {
        console.error.err
        return res.status(500).send({ message: 'Error Saving Comentario' })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updatedComentario = await Comentario.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );
        if (!updatedComentario) return res.status(401).send({ message: 'Comentario not found' })
        return res.send({ message: 'Updated Comentario', updatedComentario })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating Comentario' })
    }
}

export const deleteU = async (req, res) => {
    try {
        // Obtener el Id
        let { id } = req.params;
        // Verificar si se proporcionó un token en el encabezado de la solicitud
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ message: 'Authorization token is missing' });
        }
        // Verificar el token para asegurarse de que sea válido y obtener el usuario asociado
        const decoded = jwt.verify(token, '@KeySecreta@');
        if (!decoded || !decoded.userId) {
            return res.status(401).send({ message: 'Invalid or expired token' });
        }
        // Validar si el usuario asociado con el token tiene permiso para eliminar el Comentario
        if (decoded.userId !== id) {
            return res.status(403).send({ message: 'You are not authorized to delete this Comentario' });
        }
        // Eliminar el Comentario
        let deletedComentario = await Comentario.findOneAndDelete({ _id: id });
        // Verificar que se eliminó
        if (!deletedComentario) {
            return res.status(404).send({ message: 'Comentario not found or not deleted' });
        }
        // Responder
        return res.status(200).send({ message: 'Comentario deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting Comentario' });
    }
}
