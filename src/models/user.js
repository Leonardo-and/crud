import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import { createId } from '../lib/cuid.js'

export const User = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			defaultValue: () => createId(),
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		birth: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
	},
	{
		tableName: 'users',
		timestamps: true,
	},
)
