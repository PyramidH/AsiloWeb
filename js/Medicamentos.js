const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Medicamentos'; // Reemplaza con la URL de tu API
const medicamentosList = document.getElementById('Medicamentos-list');

// Función para cargar la lista de medicamentos
async function cargarListaMedicamentos() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            medicamentosList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');
            table.classList.add('table', 'table-success', 'table-striped', 'table-bordered', 'table-hover');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Costo</th>
                    <th>Existencia</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de medicamentos
            const tableBody = document.createElement('tbody');
            data.response.forEach(medicamento => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${medicamento.idMedicamento}</td>
                    <td>${medicamento.nombre}</td>
                    <td>${medicamento.descripcion}</td>
                    <td>${medicamento.costo}</td>
                    <td>${medicamento.stock}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editarMedicamento(${medicamento.idMedicamento})">Editar</button>
                        <button class="btn btn-cancel" onclick="eliminarMedicamento(${medicamento.idMedicamento})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            medicamentosList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de medicamentos:', error);
    }
}

// Función para guardar cambios en un medicamento
async function guardarMedicamento() {
    const medicamento = {
        id: document.getElementById('ID').value,
        nombre: document.getElementById('Nombre').value,
        descripcion: document.getElementById('Descripcion').value,
        costo: document.getElementById('Costo').value,
        Existencia: document.getElementById('Existencia').value
    };

    let apiUrlEndpoint = `${apiUrl}/Guardar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicamento)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaMedicamentos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar el medicamento:', error);
    }
}

// Función para eliminar un medicamento
async function eliminarMedicamento(idMedicamento) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idMedicamento}`;
    const id = { idMedicamento: idMedicamento };
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
            cargarListaMedicamentos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar el medicamento:', error);
    }
}

// Función para editar un medicamento
function editarMedicamento(idMedicamento) {
    const fila = document.querySelector(`tr[data-id="${idMedicamento}"]`);
    const celdas = fila.querySelectorAll('td');

    // Itera sobre las celdas y reemplaza el texto con campos de entrada
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
        actualizar(idMedicamento);
    };

    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaMedicamentos();
    };
}

async function actualizar(idMedicamento) {
    const fila = document.querySelector(`tr[data-id="${idMedicamento}"]`);
    const celdas = fila.querySelectorAll('td');
    const medicamento = {
        idMedicamento: celdas[0].querySelector('input').value,
        nombre: celdas[1].querySelector('input').value,
        descripcion: celdas[2].querySelector('input').value,
        costo: celdas[3].querySelector('input').value,
        Existencia: celdas[4].querySelector('input').value
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application.json'
            },
            body: JSON.stringify(medicamento)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaMedicamentos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar el medicamento:', error);
    }
}

document.getElementById('registrarMedicamento').addEventListener('submit', function(event) {
    event.preventDefault();
    guardarMedicamento();
});

// Cargar la lista de medicamentos al cargar la página
cargarListaMedicamentos();
