const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Internos'; // Reemplaza con la URL de tu API

const internList = document.getElementById('Intern-list');

async function cargarListaInternos() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            internList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>F. Nacim.</th>
                    <th>Gen</th>
                    <th>Telefono</th>
                    <th>C. Emer.</th>
                    <th>Num. Emer.</th>
                    <th>Email</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');
            data.response.forEach(internos => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', internos.idInterno);
                const fechaNacimiento = new Date(internos.fechaNacimiento);
                const fechaSolo = fechaNacimiento.toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${internos.idInterno}</td>
                    <td>${internos.nombre}</td>
                    <td>${internos.apellido}</td>
                    <td>${fechaSolo}</td>
                    <td>${internos.genero}</td>
                    <td>${internos.telefono}</td>
                    <td>${internos.contactoEmergencia}</td>
                    <td>${internos.numContactoEmergencia}</td>
                    <td>${internos.email}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarInterno(${internos.idInterno})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarInterno(${internos.idInterno})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            internList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Internos:', error);
    }
}

async function guardarInterno(event) {
    event.preventDefault();
    const interno = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        contactoEmergencia: document.getElementById('conEmergencia').value,
        numContactoEmergencia: document.getElementById('numEmergencia').value,
        email: document.getElementById('email').value,
        genero: document.getElementById('genero').value,
        fechaNacimiento: document.getElementById('fecha').value
    };

    let apiUrlEndpoint = `${apiUrl}/Guardar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(interno)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaInternos();
            limpiarFormulario();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar el Interno:', error);
    }
}

async function eliminarInterno(idInterno) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idInterno}`;
    const id = { idInterno: idInterno }
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
            cargarListaInternos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar el Interno:', error);
    }
}

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('conEmergencia').value = '';
    document.getElementById('numEmergencia').value = '';
    document.getElementById('email').value = '';
    document.getElementById('genero').checked = false;
    document.getElementById('fecha').value = '';
}

function editarInterno(id) {
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    celdas.forEach(function (celda, index) {
        if (index < celdas.length - 1) {
            const valorOriginal = celda.innerText;
            celda.innerHTML = `<input type="text" style='width:100%' value="${valorOriginal}">`;
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
        cargarListaInternos();
    };
}

async function actualizar(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const interno = {
        idInterno: celdas[0].querySelector('input').value,
        nombre: celdas[1].querySelector('input').value,
        apellido: celdas[2].querySelector('input').value,
        fechaNacimiento: celdas[3].querySelector('input').value,
        genero: celdas[4].querySelector('input').value,
        telefono: celdas[5].querySelector('input').value,
        contactoEmergencia: celdas[6].querySelector('input').value,
        numContactoEmergencia: celdas[7].querySelector('input').value,
        email: celdas[8].querySelector('input').value
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(interno)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaInternos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar el Interno:', error);
    }
}

document.getElementById('registrarInterno').addEventListener('submit', guardarInterno);

