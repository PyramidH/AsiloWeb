const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/CuotaMensual'; // Reemplaza con la URL de tu API
const apiUrlInternos = 'http://malvarado-001-site1.atempurl.com/api/Internos';

const cuotaMensualList = document.getElementById('Cuota Mensual-list');
const cmbInternoscm = document.getElementById('internoscm');


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
                    <th>Nombre del Interno</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de cuota mensual
            const tableBody = document.createElement('tbody');
            data.response.forEach(CuotaMensual => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', CuotaMensual.idCuota);
                const fechacuota = new Date(CuotaMensual.fecha);
                const fechafinal= fechacuota.toISOString().split('T')[0];
                /*var fechaoriginal = CuotaMensual.fecha;
                var fechacm = new Date(fechaoriginal);
                var dia = fechacm.getDate();
                var mes = fechacm.getMonth();
                var año = fechacm.getFullYear();
                var fechafinal = dia + "-" + mes + "-" + año; */

                row.innerHTML = `
                    <td>${CuotaMensual.idCuota}</td>
                    <td>${CuotaMensual.idInternoNavigation.nombre + " " + CuotaMensual.idInternoNavigation.apellido}</td>
                    <td>${CuotaMensual.monto}</td>
                    <td>${fechafinal}</td>
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
        idInterno: document.getElementById('internoscm').value,
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
    document.getElementById('internoscm').value = '';
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
            if(index == 1){
                celda.innerHTML = '';
                    var cmbInternosUPDcm = cmbInternoscm.cloneNode(true);
                    for (var i = 0; i < cmbInternosUPDcm.options.length; i++) {
                        var option = cmbInternosUPDcm.options[i];
                        if (option.text == "interno") {
                            option.selected = false;
                        }
                        if (option.text == valorOriginal) {
                            option.selected = true;
                        }
                    }
                    celda.appendChild(cmbInternosUPDcm);
            }if(index == 3){
                celda.innerHTML = `<input type="date" style='width:100%' value="${valorOriginal}">`;
            }
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

async function actualizarCuotaMensual(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const cuota = {
        idCuota: celdas[0].querySelector('input').value,
        idInterno: celdas[1].querySelector('select').value,
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

async function cargarSelectInterno() {

    try {
        const response = await fetch(`${apiUrlInternos}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            data.response.forEach(interno => {
                var cmbOption = document.createElement("option");
                cmbOption.text = interno.nombre + " " + interno.apellido;
                cmbOption.value = interno.idInterno;
                cmbInternoscm.add(cmbOption);
            });

        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Internos:', error);
    }

}