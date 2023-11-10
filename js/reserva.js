const apiUrl = 'http://localhost:5176/api/TablaReservasHotel';

const reservaList = document.getElementById('reserva-list');

async function cargarListaReserva() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            reservaList.innerHTML = '';
            const table = document.createElement('table');
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Fecha de Entrada</th>
                    <th>Fecha de Salida</th>
                    <th># Habitacion</th>
                    <th>Nombre Completo</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);
            const tableBody = document.createElement('tbody');
            data.response.forEach(reserva => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', reserva.reservationId);
                const fechaEntrada = new Date(reserva.checkInDate);
                const fechaESolo = fechaEntrada.toISOString().split('T')[0];
                const fechaSalida = new Date(reserva.checkOutDate);
                const fechaSSolo = fechaSalida.toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${reserva.reservationId}</td>
                    <td>${fechaESolo}</td>
                    <td>${fechaSSolo}</td>
                    <td>${reserva.roomNumber}</td>
                    <td>${reserva.guestName}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarReserva(${reserva.reservationId})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarReserva(${reserva.reservationId})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            table.appendChild(tableBody);
            reservaList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Internos:', error);
    }
}

async function guardarReserva(event) {
    event.preventDefault();
    const reserva = {
        checkInDate: document.getElementById('fechaE').value,
        checkOutDate: document.getElementById('fechaS').value,
        roomNumber: parseInt(document.getElementById('cuarto').value),
        guestName: document.getElementById('nombre').value,
    };

    let apiUrlEndpoint = `${apiUrl}/Guardar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaReserva();
            limpiarFormulario();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar el Interno:', error);
    }
}

async function eliminarReserva(ReservationId) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${ReservationId}`;
    const id = { reservationId: ReservationId }
    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaReserva();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar el Interno:', error);
    }
}

function limpiarFormulario() {
    document.getElementById('fechaE').value = '';
    document.getElementById('fechaS').value = '';
    document.getElementById('cuarto').value = '';
    document.getElementById('nombre').value = '';
}

function editarReserva(id) {
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    celdas.forEach(function (celda, index) {
        if (index < celdas.length - 1) {
            const valorOriginal = celda.innerText;
            if (index != 0) {
                celda.innerHTML = `<input type="text" style='width:100%' value="${valorOriginal}">`;
            }
        }
    });

    const btnEditar = fila.querySelector('button.btn-primary');
    btnEditar.textContent = 'Guardar';
    btnEditar.classList.remove("btn-primary");
    btnEditar.classList.add("btn-save");
    btnEditar.onclick = function () {
        actualizar(id);
    };
    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaReserva();
    };
}

async function actualizar(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const reserva = {
        ReservationId: parseInt(id),
        checkInDate: celdas[1].querySelector('input').value,
        checkOutDate: celdas[2].querySelector('input').value,
        roomNumber: celdas[3].querySelector('input').value,
        guestName: celdas[4].querySelector('input').value,
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaReserva();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar el Interno:', error);
    }
}

document.getElementById('registrarReserva').addEventListener('submit', guardarReserva); 
