import { Sequelize } from 'sequelize'
import { env } from './env.js'

export const sequelize = new Sequelize({
	username: env.DB_USER,
	database: env.DB_NAME,
	password: env.DB_PASSWORD,
	host: env.DB_HOST,
	dialect: 'mysql',
	logging: false
})

async function connect() {
	try {
		await sequelize.authenticate()
		console.log('Successfully connected to MySQL')
		await sequelize.sync()
	} catch (error) {
		console.error('Cannot connect to database: ', error)
	}
}

connect()
