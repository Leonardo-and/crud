import { z } from 'zod'
import { User } from '../../models/user.js'

const createUserBodySchema = z.object({
	firstName: z
		.string()
		.min(3, { error: 'Nome deve ter no mínimo 3 caracteres' }),
	lastName: z
		.string()
		.min(3, { error: 'Sobrenome deve ter no mínimo 3 caracteres' }),
	email: z.email({ error: 'E-mail inválido ou faltando' }),
	birth: z.iso.date({ error: 'Data de nascimento inválido ou faltando' }),
})

export async function createUserController(request, response) {
	const { birth, email, firstName, lastName } = createUserBodySchema.parse(
		request.body,
	)

	const today = new Date()

	const birthDate = new Date(birth)

	if (birthDate > today) {
		return response.status(400).json({
			data: null,
			error: true,
			message: 'Data de nascimento não pode estar no futuro',
		})
	}

	const userAlreadyExists = await User.findOne({
		where: {
			email,
		},
	})

	if (userAlreadyExists) {
		return response.status(400).json({
			data: null,
			message: 'Usuário já existe',
			error: true,
		})
	}

	const user = await User.create({
		firstName,
		lastName,
		email,
		birth,
	})

	return response.status(201).json({
		data: { user },
		error: false,
		message: null,
	})
}
