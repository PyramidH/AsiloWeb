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
            table.classList.add('table', 'table-success', 'table-striped', 'table-bordered', 'table-hover');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>F. Nacimiento</th>
                    <th>Gen</th>
                    <th>Telefono</th>
                    <th>C. Emergencia</th>
                    <th>Num. Emergencia</th>
                    <th>Email</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');
            data.response.forEach(internos => {
                const row = document.createElement('tr');
                const fechaNacimiento = new Date(internos.fechaNacimiento);
                const fechaSolo = fechaNacimiento.toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${internos.idInterno}</td>
                    <td>${internos.nombre + " " + internos.apellido}</td>
                    <td>${fechaSolo}</td>
                    <td>${internos.genero}</td>
                    <td>${internos.telefono}</td>
                    <td>${internos.contactoEmergencia}</td>
                    <td>${internos.numContactoEmergencia}</td>
                    <td>${internos.email}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarInterno (${internos.idInterno})">Editar</button>
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

document.getElementById('registrarInterno').addEventListener('submit', guardarInterno);

