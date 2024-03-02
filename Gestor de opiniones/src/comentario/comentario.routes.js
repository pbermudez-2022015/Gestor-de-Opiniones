import express from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { save, update, deleteU } from './comentario.controller.js'

const api = express.Router();

//Rutas Privadas

api.post('/save', [validateJwt], save)
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteU)

export default api