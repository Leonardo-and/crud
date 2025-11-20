import { ZodError } from 'zod'

export function errorHandler(error, _request, response, _next) {
	if (error instanceof ZodError) {
		return response.status(400).json({
			data: null,
			error: true,
			message: error.issues[0].message,
		})
	}

	console.error(error)

	return response.status(500).json({
		data: null,
		message: 'Erro interno do servidor',
		error: true,
	})
}
