import { join } from 'node:path'
import express from 'express'
import morgan from 'morgan'
import { usersRoutes } from './controllers/users/users.routes.js'
import { errorHandler } from './middlewares/error-handler.js'

export const app = express()

app.use(morgan('dev'))
app.use(express.json())

const dirname = import.meta.dirname

app.set('view engine', 'ejs')
app.set('views', join(dirname, 'views'))

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'))
app.use('/bootstrap', express.static('node_modules/bootstrap-icons/font'))
app.use(express.static(join(dirname, 'public')))

app.use(usersRoutes)

app.use(errorHandler)
