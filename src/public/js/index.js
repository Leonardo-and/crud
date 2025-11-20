/** biome-ignore-all lint/correctness/noUnusedVariables: needed */

function showToast(message, type) {
	const toastContainer =
		document.querySelector('.toast-container') || createToastContainer()
	const toastId = `toast-${Date.now()}`

	const toastHTML = `
		<div class="toast align-items-center text-bg-${type === 'error' ? 'danger' : 'success'}"
			role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
			<div class="d-flex">
				<div class="toast-body">${message}</div>
				<button type="button" class="btn-close btn-close-white me-2 m-auto"
					data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
		</div>
	`

	toastContainer.insertAdjacentHTML('beforeend', toastHTML)
	const toastElement = document.getElementById(toastId)
	const toast = new bootstrap.Toast(toastElement, {
		autohide: true,
		delay: 3000,
	})
	toast.show()

	toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove())
}

function createToastContainer() {
	const container = document.createElement('div')
	container.className = 'toast-container position-fixed top-0 end-0 p-3'
	document.body.appendChild(container)
	return container
}

function handleError(error, message = 'Ocorreu um erro') {
	console.error(message, error)
	showToast(`${message}: ${error.message}. Tente novamente.`, 'error')
}

async function deleteUser(id) {
	try {
		const response = await fetch(`/users/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		})

		const data = await response.json()

		if (!response.ok && data.error) {
			throw new Error(data.message)
		}

		const row = document.querySelector(`tr[data-id="${id}"]`)

		if (row) {
			row.style.opacity = '0'
			row.style.transition = 'opacity 0.3s ease'
			setTimeout(() => {
				row.remove()
				checkEmptyTable()
			}, 300)
		}

		showToast('Usuário deletado com sucesso', 'success')
	} catch (error) {
		handleError(error, 'Erro ao deletar usuário')
	}
}

async function updateUser(event, id) {
	event.preventDefault()

	const formData = new FormData(event.target)

	const userData = {
		firstName: formData.get('firstName').trim(),
		lastName: formData.get('lastName').trim(),
		email: formData.get('email').trim(),
		birth: formData.get('birth'),
	}

	try {
		const response = await fetch(`/users/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData),
		})

		const data = await response.json()

		if (!response.ok && data.error) {
			throw new Error(data.message)
		}

		const modal = bootstrap.Modal.getInstance(
			document.getElementById(`modal-${id}`),
		)
		modal.hide()

		updateTableRow(id, userData)
		showToast('Usuário atualizado com sucesso.', 'success')
	} catch (error) {
		handleError(error, 'Erro ao atualizar usuário')
	}
}

async function createUser(event) {
	event.preventDefault()

	const formData = new FormData(event.target)
	const userData = {
		firstName: formData.get('firstName').trim(),
		lastName: formData.get('lastName').trim(),
		email: formData.get('email').trim(),
		birth: formData.get('birth'),
	}

	try {
		const response = await fetch('/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData),
		})

		const result = await response.json()

		if (!response.ok && result.error) {
			throw new Error(result.message)
		}

		const user = result.data.user

		const modal = bootstrap.Modal.getInstance(
			document.getElementById('modal-create'),
		)
		modal.hide()

		addUserToTable(user)
		event.target.reset()
		showToast('Usuário cadastrado com sucesso', 'success')
	} catch (error) {
		handleError(error, 'Erro ao cadastrar usuário')
	}
}

function updateTableRow(id, userData) {
	const row = document.querySelector(`tr[data-id="${id}"]`)
	if (!row) return

	const cells = row.querySelectorAll('td')

	if (userData.firstName) {
		cells[0].textContent = userData.firstName
	}

	if (userData.lastName) {
		cells[1].textContent = userData.lastName
	}

	if (userData.email) {
		cells[2].textContent = userData.email
	}

	if (userData.birth) {
		cells[3].textContent = new Intl.DateTimeFormat('pt-BR', {
			timeZone: 'UTC',
		}).format(new Date(userData.birth))
	}

	row.style.backgroundColor = '#d1ecf1'
	setTimeout(() => {
		row.style.backgroundColor = ''
		row.style.transition = 'background-color 0.5s ease'
	}, 100)
}

function addUserToTable(user) {
	const tbody = document.querySelector('tbody')
	const emptyRow = tbody.querySelector('td[colspan]')

	if (emptyRow) {
		emptyRow.parentElement.remove()
	}

	const row = tbody.insertRow(0)
	row.setAttribute('data-id', user.id)
	row.style.opacity = '0'

	const th = document.createElement('th')
	th.scope = 'row'
	th.textContent = user.id
	row.appendChild(th)

	row.insertCell(1).textContent = user.firstName
	row.insertCell(2).textContent = user.lastName
	row.insertCell(3).textContent = user.email
	row.insertCell(4).textContent = new Intl.DateTimeFormat('pt-BR', {
		timeZone: 'UTC',
	}).format(new Date(user.birth))

	const actionsCell = row.insertCell(5)
	actionsCell.innerHTML = createActionButtons(user)

	setTimeout(() => {
		row.style.transition = 'opacity 0.5s ease'
		row.style.opacity = '1'
	}, 10)
}

function createActionButtons(user) {
	return `
		<button type="button" class="btn btn-primary btn-sm me-1"
			data-bs-toggle="modal" data-bs-target="#modal-${user.id}">
			<i class="bi bi-pencil-square"></i>
		</button>
		<button type="button" class="btn btn-danger btn-sm"
			data-bs-toggle="modal" data-bs-target="#modal-delete-${user.id}">
			<i class="bi bi-trash3"></i>
		</button>
		${createUpdateModal(user)}
		${createDeleteModal(user.id)}
	`
}

function createUpdateModal(user) {
	return `
		<div class="modal fade" id="modal-${user.id}" tabindex="-1" aria-labelledby="modalLabel-${user.id}" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Editar usuário</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
					</div>
					<div class="modal-body">
						<form id="updateForm-${user.id}" onsubmit="updateUser(event, '${user.id}')">
							<div class="mb-3">
								<label for="firstName-${user.id}" class="form-label">Nome *</label>
								<input type="text" class="form-control" name="firstName" id="firstName-${user.id}"
									value="${user.firstName}" placeholder="Nome" minlength="1" required>
							</div>
							<div class="mb-3">
								<label for="lastName-${user.id}" class="form-label">Sobrenome</label>
								<input type="text" class="form-control" name="lastName" id="lastName-${user.id}"
									value="${user.lastName}" placeholder="Sobrenome">
							</div>
							<div class="mb-3">
								<label for="email-${user.id}" class="form-label">Email *</label>
								<input type="email" class="form-control" name="email" id="email-${user.id}"
									value="${user.email}" placeholder="Email" required>
							</div>
							<div class="mb-3">
								<label for="birth-${user.id}" class="form-label">Data de nascimento *</label>
								<input type="date" class="form-control" name="birth" id="birth-${user.id}"
									value="${user.birth}" required>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
						<button type="submit" class="btn btn-primary" form="updateForm-${user.id}">Salvar</button>
					</div>
				</div>
			</div>
		</div>
	`
}

function createDeleteModal(id) {
	return `
		<div class="modal fade" id="modal-delete-${id}" tabindex="-1" aria-labelledby="modalLabel-delete-${id}" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Excluir usuário</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
					</div>
					<div class="modal-body">
						<p class="text-muted">Você tem certeza que deseja excluir esse usuário? Essa ação é irreversível.</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
						<button type="button" class="btn btn-danger" data-bs-dismiss="modal"
							onclick="deleteUser('${id}')">Deletar</button>
					</div>
				</div>
			</div>
		</div>
	`
}

function checkEmptyTable() {
	const tbody = document.querySelector('tbody')
	if (tbody.querySelectorAll('tr').length === 0) {
		const row = tbody.insertRow()
		const cell = row.insertCell()
		cell.colSpan = 6
		cell.textContent = 'Nenhum usuário cadastrado'
		cell.className = 'text-center text-muted'
	}
}
