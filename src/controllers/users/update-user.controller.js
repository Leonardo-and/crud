import { z } from 'zod'
import { User } from '../../models/user.js'

const updateUserBodySchema = z.object({
	firstName: z
		.string()
		.min(3, { error: 'Nome deve ter no mínimo 3 caracteres' })
		.or(z.literal('').transform(() => undefined))
		.optional(),
	lastName: z
		.string()
		.min(3, { error: 'Nome deve ter no mínimo 3 caracteres' })
		.or(z.literal('').transform(() => undefined))
		.optional(),
	birth: z.iso.date({ error: 'Data de nascimento inválida' }).optional(),
	email: z.email({ error: 'E-mail inválido' }).optional(),
})

const updateUserParamsSchema = z.object({
	id: z.cuid2(),
})

export async function updateUserController(request, response) {
	const data = updateUserBodySchema.parse(request.body)

	const { id } = updateUserParamsSchema.parse(request.params)

	const user = await User.findByPk(id)

	if (!user) {
		return response.status(404).json({
			data: null,
			message: 'Usuário não encontrado',
			error: true,
		})
	}

	await User.update(data, {
		where: { id },
	})

	return response.status(200).json({
		data: null,
		message: null,
		error: false,
	})
}
