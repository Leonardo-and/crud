import { Router } from 'express'
import { createUserController } from './create-user.controller.js'
import { deleteUserController } from './delete-user.controller.js'
import { fetchUsersController } from './fetch-users.controller.js'
import { updateUserController } from './update-user.controller.js'

export const usersRoutes = Router()

usersRoutes.post('/users', createUserController)
usersRoutes.delete('/users/:id', deleteUserController)
usersRoutes.get('/users', fetchUsersController)
usersRoutes.patch('/users/:id', updateUserController)
