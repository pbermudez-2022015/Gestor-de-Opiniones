import express from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { test, register, login, update, deleteU } from './user.controller.js';

const api = express.Router();

//rutas Publicas
api.post('/register', register)
api.post('/login', login)

//Rutas Privadas
api.put('/update/:id', [validateJwt], update)
api.delete('/delete/:id', [validateJwt], deleteU)
api.get('/test', [validateJwt], test)
export default api