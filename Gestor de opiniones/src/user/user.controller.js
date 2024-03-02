'use strict' //Modo estricto

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'USER'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // "identifier" puede ser el correo electrónico o el nombre de usuario
        // Validar que el usuario exista (busca por correo electrónico o nombre de usuario)
        let user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        // Verificar que el usuario exista y que la contraseña coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            };
            // Generar Token
            let token = await generateJwt(loggedUser);
            // Responder al usuario
            return res.send({ message: `Welcome ${loggedUser.name}`, token, loggedUser });
        }
        return res.status(404).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error to login' });
    }
}

export const update = async (req, res) => {
    try {
        // Obtener el id del usuario a actualizar
        const { id } = req.params;
        // Obtener los datos a actualizar
        let data = req.body;

        // Verificar si se proporciona la contraseña antigua y la nueva contraseña
        if (data.oldPassword && data.newPassword) {
            // Encontrar el usuario en la base de datos
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Verificar si la contraseña antigua coincide con la contraseña almacenada en la base de datos
            const passwordMatch = (data.oldPassword === user.password);
            if (!passwordMatch) {
                return res.status(401).send({ message: 'Old password is incorrect' });
            }

            // Almacenar la nueva contraseña en la base de datos junto con otros datos a actualizar
            data.password = data.newPassword;
            data.newPassword = undefined;
            data.oldPassword = undefined;
        } else if (!data.newPassword) {
            return res.status(400).send({ message: 'New password is required for update' });
        }

        // Actualizar (BD)
        let updatedUser = await User.findOneAndUpdate(
            { _id: id }, // ID del usuario a actualizar
            data,
            // Datos que se van a actualizar
            { new: true } // Devolver el objeto actualizado
        );

        // Validar la actualización
        if (!updatedUser) {
            return res.status(401).send({ message: 'User not found and not updated' });
        }

        // Responder al usuario
        return res.send({ message: 'User updated successfully', updatedUser });
    } catch (err) {
        console.error(err);
        if (err.keyValue && err.keyValue.username) {
            return res.status(400).send({ message: `Username ${err.keyValue.username} is already taken` });
        }
        return res.status(500).send({ message: 'Error updating account' });
    }
};








export const deleteU = async (req, res) => {
    try {
        // Siempre responder con un mensaje de error indicando que la eliminación de usuarios no está permitida
        return res.status(403).send({ message: 'User deletion is not allowed' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}
