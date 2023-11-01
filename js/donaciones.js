const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Donaciones'; // Reemplaza con la URL de tu API

const internList = document.getElementById('Donaciones-list');

// Función para cargar la lista de productos Interno
async function cargarListaDonaciones() {
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
                    <th>Tipo de Donación</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(donaciones => {
                const row = document.createElement('tr');
                const fechaNacimiento = new Date(donaciones.fecha);
                const fechaSolo = fechaNacimiento.toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${donaciones.idDonacion}</td>
                    <td>${donaciones.tipoDonante}</td>
                    <td>${donaciones.monto}</td>
                    <td>${fechaSolo}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarDonacion(${donaciones.idDonacion})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarDonacion(${donaciones.idDonacion})">Eliminar</button>
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
        console.error('Error al cargar la lista de productos:', error);
    }
}

async function GuardarDonacion(event) {
    event.preventDefault();

    const GuardarEn = {
        tipoDonante: document.getElementById("tipoDonante").value,
        monto: document.getElementById("monto").value,
        fecha: document.getElementById("fecha").value
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
                cargarListaDonaciones();
                limpiarFormulario();
            }
         else {
                console.error('Error en la respuesta de la API:', data.mensaje);
            }
        } catch (error) {
            console.error('Error al guardar el enfermero:', error);
        }

}

function limpiarFormulario() {
    document.getElementById('tipoDonante').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('fecha').value = '';
}


async function eliminarDonacion(idDonacion) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idDonacion}`;
    const id = { idDonacion: idDonacion}
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
            cargarListaDonaciones();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar donacion:', error);
    }
}

function editarDonacion(id) {
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
        actualizarDonacion(id);
    };
    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaDonaciones();
    };
}

async function actualizarDonacion(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const donacion = {
        idDonacion: celdas[0].querySelector('input').value,
        tipoDonante: celdas[1].querySelector('input').value,
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
            body: JSON.stringify(donacion)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaDonaciones();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar al donacion:', error);
    }
}

document.getElementById('RegistrarDonacion').addEventListener('submit', GuardarDonacion);