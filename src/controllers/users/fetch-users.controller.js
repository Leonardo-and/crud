import { User } from '../../models/user.js'

export async function fetchUsersController(_, response) {
	const users = await User.findAll({
		order: [
			['createdAt', 'DESC']
		]
	})

	return response.render('index', { users })
}
