const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/GastosOperativos';

const gastosOperativosList = document.getElementById('gastosOperativos-list');


// Función para cargar la lista de gastos Operativos
async function cargarListaGastosOperativos() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();
        //console.log(data);

        if (response.status === 200) {
            // Limpiar la lista
            gastosOperativosList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');
            
            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de gastos operativos
            const tableBody = document.createElement('tbody');
            data.response.forEach(gastosOperativos => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', gastosOperativos.idGasto);
                const fechaGastos = new Date(gastosOperativos.fecha);
                const fechaGastosOperativos = fechaGastos.toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${gastosOperativos.idGasto}</td>
                    <td>${gastosOperativos.descripcion}</td>
                    <td>${gastosOperativos.monto}</td>
                    <td>${fechaGastosOperativos}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarGasto(${gastosOperativos.idGasto})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarGasto(${gastosOperativos.idGasto})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            gastosOperativosList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de gasto Operativo:', error);
    }
}

async function GuardarGastos(event) { 
    event.preventDefault();

    const guardarGastos = {
        descripcion: document.getElementById("descripcion").value,
        monto: document.getElementById("montoGasto").value,
        fecha: document.getElementById("fechaGasto").value
    };

    let apiUrlEndpoint = `${apiUrl}/Guardar`;
        
        
        try {
            const response = await fetch(apiUrlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(guardarGastos)
                
            });
            const data = await response.json();

            if (response.status == '200') {
                cargarListaGastosOperativos();
                limpiarFormularioGastos();
            }
         else {
                console.error('Error en la respuesta de la API:', data.mensaje);
            }
        } catch (error) {
            console.error('Error al guardar el gasto operativo:', error);
        }
    }


    

async function eliminarGasto(idGasto) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idGasto}`;
    const id = { idGasto: idGasto}
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
            cargarListaGastosOperativos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar al gasto operativo:', error);
    }
}

function limpiarFormularioGastos() {
    document.getElementById('descripcion').value = '';
    document.getElementById('monto').value = '';
}

function editarGasto(id) {
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
        actualizarGastos(id);
    };
    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaGastosOperativos();
    };
}

async function actualizarGastos(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const gasto = {
        idGasto: celdas[0].querySelector('input').value,
        descripcion: celdas[1].querySelector('input').value,
        monto: celdas[2].querySelector('input').value,
        fecha: celdas[3].querySelector('input').value
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gasto)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaGastosOperativos();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar al Gastos Operativos:', error);
    }
}

document.getElementById('RegistrarGastosOperativos').addEventListener('submit', GuardarGastos);
