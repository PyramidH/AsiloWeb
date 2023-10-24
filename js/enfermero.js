const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

const EnferList = document.getElementById('enfermero-list');


// Función para cargar la lista de enfermeros
async function cargarListaEnfermeros() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();
        //console.log(data);

        if (response.status === 200) {
            // Limpiar la lista
            EnferList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');
            table.classList.add('table', 'table-success' , 'table-striped', 'table-bordered', 'table-hover');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de los enfermeros
            const tableBody = document.createElement('tbody');
            data.response.forEach(enfermero => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', enfermero.idEnfermero);
                row.innerHTML = `
                    <td>${enfermero.idEnfermero}</td>
                    <td>${enfermero.nombre}</td>
                    <td>${enfermero.apellido}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarEnfermero(${enfermero.idEnfermero})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarEnfermero(${enfermero.idEnfermero})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            EnferList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de enfermeros:', error);
    }
}

async function GuardarEnfermero(event) { 
    event.preventDefault();

    const GuardarEn = {
        nombre: document.getElementById("nombreenfer").value,
        apellido: document.getElementById("apellidoenfer").value
    };

    let apiUrlEndpoint = `${apiUrl}/Guardar`;
        
        
        try {
            const response = await fetch(apiUrlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(GuardarEn)
                
            });
            const data = await response.json();

            if (response.status == '200') {
                cargarListaEnfermeros();
                limpiarFormularioEnfermero();
            }
         else {
                console.error('Error en la respuesta de la API:', data.mensaje);
            }
        } catch (error) {
            console.error('Error al guardar el enfermero:', error);
        }
    }


    

async function eliminarEnfermero(idEnfermero) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idEnfermero}`;
    const id = { idEnfermero: idEnfermero}
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
            cargarListaEnfermeros();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar al enfermero:', error);
    }
}

function limpiarFormularioEnfermero() {
    document.getElementById('nombreenfer').value = '';
    document.getElementById('apellidoenfer').value = '';
}

function editarEnfermero(id) {
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
        actualizarEnfermero(id);
    };
    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaEnfermeros();
    };
}

async function actualizarEnfermero(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const enfermero = {
        idEnfermero: celdas[0].querySelector('input').value,
        nombre: celdas[1].querySelector('input').value,
        apellido: celdas[2].querySelector('input').value
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enfermero)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaEnfermeros();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar al enfermero:', error);
    }
}

document.getElementById('RegistrarEnfermero').addEventListener('submit', GuardarEnfermero);
