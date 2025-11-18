import { z } from 'zod'
import { User } from '../../models/user.js'

const deleteUserParamsSchema = z.object({
	id: z.cuid2(),
})

export async function deleteUserController(request, response) {
	const { id } = deleteUserParamsSchema.parse(request.params)

	const user = await User.findByPk(id)

	if (!user) {
		return response.status(404).json({
			data: null,
			message: 'Usuário não encontrado',
			error: true
		})
	}

	await User.destroy({
		where: { id },
	})

	return response.status(200).json({
		data: null,
		message: null,
		error: false,
	})
}
