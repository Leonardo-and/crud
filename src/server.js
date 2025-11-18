import { app } from './app.js'
import { env } from './lib/env.js'

app.listen(env.PORT, (error) => {
	if (error) {
		console.error(error)
		process.exit(1)
	}

	console.log(`Server running at http://localhost:${env.PORT}`)
})
