const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/CuotaMensual'; // Reemplaza con la URL de tu API
const cuotaMensualList = document.getElementById('Cuota Mensual-list');

// Función para cargar la lista de Cuota Mensual
async function cargarListaCuotaMensual() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            cuotaMensualList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>Id</th>
                    <th>IdInterno</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Descripcion</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de cuota mensual
            const tableBody = document.createElement('tbody');
            data.response.forEach(CuotaMensual => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', CuotaMensual.idCuota);
                row.innerHTML = `
                    <td>${CuotaMensual.idCuota}</td>
                    <td>${CuotaMensual.idInterno}</td>
                    <td>${CuotaMensual.monto}</td>
                    <td>${CuotaMensual.fecha}</td>
                    <td>${CuotaMensual.descripcion}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editarCuotaMensual(${CuotaMensual.idCuota})">Editar</button>
                        <button class="btn btn-cancel" onclick="eliminarCuotaMensual(${CuotaMensual.idCuota})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            cuotaMensualList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Cuota Mensual:', error);
    }
}


async function GuardarCuotaMensual(event) { 
    event.preventDefault();

    const CuotaMensual = {
        idInterno: document.getElementById('ID Interno').value,
        monto: document.getElementById('Monto').value,
        fecha: document.getElementById('Fecha').value,
        descripcion: document.getElementById('Descripcion').value
    };

    let apiUrlEndpoint = `${apiUrl}/Guardar`;
        
    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(CuotaMensual)
        });
        const data = await response.json();

        if (response.status === 200) {
            cargarListaCuotaMensual();
            limpiarFormularioCuotaMensual();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar la Cuota Mensual:', error);
    }
}

async function eliminarCuotaMensual(idCuotaMensual) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idCuotaMensual}`;
    const id = { idCuotaMensual: idCuotaMensual};
    
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
            cargarListaCuotaMensual();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar la Cuota Mensual:', error);
    }
}

function limpiarFormularioCuotaMensual() {
    document.getElementById('ID Interno').value = '';
    document.getElementById('Monto').value = '';
    document.getElementById('Fecha').value = '';
    document.getElementById('Descripcion').value = '';
}

function editarCuotaMensual(id) {
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
        actualizarCuotaMensual(id);
    };

    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaCuotaMensual();
    };
}

async function actualizarCuotaMensual(id, event) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const cuota = {
        idCuota: celdas[0].querySelector('input').value,
        idInterno: celdas[1].querySelector('input').value,
        monto: celdas[2].querySelector('input').value,
        fecha: celdas[3].querySelector('input').value,
        descripcion: celdas[4].querySelector('input').value
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cuota)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaCuotaMensual();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar Cuota Mensual:', error);
    }
}

document.getElementById('RegistrarCuotaMensual').addEventListener('submit', GuardarCuotaMensual);
