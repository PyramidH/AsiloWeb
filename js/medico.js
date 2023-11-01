const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Medicos'; // Reemplaza con la URL de tu API

const internList = document.getElementById('medico-list');

// Función para cargar la lista de Medicos
async function cargarListaMedicos() {
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
                    <th>Especialidad</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(medicos => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${medicos.idMedico}</td>
                    <td>${medicos.nombre}</td>
                    <td>${medicos.apellido}</td>
                    <td>${medicos.especialidad}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarMedico(${medicos.idMedico})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarMedico(${medicos.idMedico})">Eliminar</button>
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
        console.error('Error al cargar la lista de medicos:', error);
    }
}

async function GuardarMedico(event) {
    event.preventDefault();

    const medico = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        especialidad: document.getElementById("especialidad").value
    };

    let apiUrlEndpoint = `${apiUrl}/Guardar`;


        try {
            const response = await fetch(apiUrlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medico)

            });
            const data = await response.json();

            if (response.status == '200') {
                cargarListaMedicos();
                limpiarFormulario();
            }
         else {
                console.error('Error en la respuesta de la API:', data.mensaje);
            }
        } catch (error) {
            console.error('Error al guardar el medico:', error);
        }

}

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('especialidad').value = '';
}


async function eliminarMedico(idMedico) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idMedico}`;
    const id = { idMedico: idMedico}
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
            cargarListaMedicos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar medico:', error);
    }
}

function editarMedico(id) {
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
        actualizarMedico(id);
    };
    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaMedicos();
    };
}

async function actualizarMedico(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const medico = {
        idMedico: celdas[0].querySelector('input').value,
        nombre: celdas[1].querySelector('input').value,
        apellido: celdas[2].querySelector('input').value,
        especialidad: celdas[3].querySelector('input').value
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medico)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaMedicos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar al medico:', error);
    }
}

document.getElementById('RegistrarMedico').addEventListener('submit', GuardarMedico);





