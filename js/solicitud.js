const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/CitaMedica';
const apiUrlInternos = 'http://malvarado-001-site1.atempurl.com/api/Internos';
const apiUrlMedicos = 'http://malvarado-001-site1.atempurl.com/api/Medicos';
const apiUrlEnfermeros = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

const CitaList = document.getElementById('cita-list');
const cmbInternos = document.getElementById('internos');
const cmbEnfermeros = document.getElementById('enfermeros');

async function cargarListaCitas() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();
        if (response.status === 200) {
            CitaList.innerHTML = '';
            const table = document.createElement('table');
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Fecha y Hora</th>
                    <th>Motivo</th>
                    <th>Interno</th>
                    <th>Enfermero</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);
            const tableBody = document.createElement('tbody');
            data.response.forEach(cita => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', cita.idCita);
                var fechaOriginal = cita.fechaHora;
                var fecha = new Date(fechaOriginal);
                var dia = fecha.getDate();
                var mes = fecha.getMonth() + 1;
                var año = fecha.getFullYear();
                var hora = fecha.getHours().toString();
                var minutos = fecha.getMinutes().toString().padStart(2, '0');
                var fechaFormateada = dia + "-" + mes + "-" + año + " " + hora + ":" + minutos;
                row.innerHTML = `
                    <td>${cita.idCita}</td>
                    <td>${fechaFormateada}</td>
                    <td>${cita.motivo}</td>
                    <td>${cita.idInternoNavigation.nombre + " " + cita.idInternoNavigation.apellido}</td>
                    <td>${cita.idEnfermeroNavigation.nombre + " " + cita.idEnfermeroNavigation.apellido}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarCita(${cita.idCita})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarCita(${cita.idCita})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            table.appendChild(tableBody);
            CitaList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de citas:', error);
    }
}

async function guardarSolicitud(event) {
    event.preventDefault();
    var fechaHoraActual = new Date();
    var fechaHoraISO = fechaHoraActual.toISOString();

    var motivo = document.getElementById("especialidad").value + " - " + document.getElementById('motivo').value;
    const interno = {
        fechaHora: fechaHoraISO,
        idInterno: document.getElementById('internos').value,
        idEnfermero: document.getElementById('enfermeros').value,
        motivo: motivo,
        estado: "Solicitud",
        costo: "0"
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
            limpiarFormulario();
            cargarListaCitas();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar el Interno:', error);
    }
}

function limpiarFormulario() {
    document.getElementById('internos').value = '';
    document.getElementById('enfermeros').value = '';
    document.getElementById('motivo').value = '';
}

async function eliminarCita(idCita) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idCita}`;
    const id = { idCita: idCita }
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
            cargarListaCitas();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar la cita', error);
    }
}

function editarCita(id) {
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    celdas.forEach(function (celda, index) {
        if (index < celdas.length - 1) {
            const valorOriginal = celda.innerText;
            switch (index) {
                case 2:
                    celda.innerHTML = `<input type="text" class="form-control" style='width:100%' value="${valorOriginal}">`;
                    break;
                case 3:
                    celda.innerHTML = '';
                    var cmbInternosUPD = cmbInternos.cloneNode(true);
                    for (var i = 0; i < cmbInternosUPD.options.length; i++) {
                        var option = cmbInternosUPD.options[i];
                        if (option.text == "interno") {
                            option.selected = false;
                        }
                        if (option.text == valorOriginal) {
                            option.selected = true;
                        }
                    }
                    celda.appendChild(cmbInternosUPD);
                    break;
                case 4:
                    celda.innerHTML = '';
                    var cmbEnfermeroUPD = cmbEnfermeros.cloneNode(true);
                    for (var i = 0; i < cmbEnfermeroUPD.options.length; i++) {
                        var option = cmbEnfermeroUPD.options[i];
                        if (option.text == "enfermero") {
                            option.selected = false;
                        }
                        if (option.text == valorOriginal) {
                            option.selected = true;
                        }
                    }
                    celda.appendChild(cmbEnfermeroUPD);
                    break;
            }
        }
    });
    const btnEditar = fila.querySelector('button.btn-primary');
    btnEditar.textContent = 'Guardar';
    btnEditar.classList.remove("btn-primary");
    btnEditar.classList.add("btn-save");
    btnEditar.onclick = function () {
        actualizarcita(id);
    };
    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaCitas();
    };
}

async function actualizarcita(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const cita = {
        idCita: id,
        motivo: celdas[2].querySelector('input').value,
        idInterno: celdas[3].querySelector('select').value,
        idEnfermero: celdas[4].querySelector('select').value
    };

    console.log(cita);
    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cita)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaCitas();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar la cita:', error);
    }
}


async function cargarSelectInterno() {

    try {
        const response = await fetch(`${apiUrlInternos}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            data.response.forEach(interno => {
                var cmbOption = document.createElement("option");
                cmbOption.text = interno.nombre + " " + interno.apellido;
                cmbOption.value = interno.idInterno;
                cmbInternos.add(cmbOption);
            });

        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Internos:', error);
    }

}

async function cargarSelectEnfermero() {

    try {
        const response = await fetch(`${apiUrlEnfermeros}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            data.response.forEach(enfermero => {
                var cmbOption = document.createElement("option");
                cmbOption.text = enfermero.nombre + " " + enfermero.apellido;
                cmbOption.value = enfermero.idEnfermero;
                cmbEnfermeros.add(cmbOption);
            });

        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Internos:', error);
    }

}

document.getElementById('RegistrarSolicitud').addEventListener('submit', guardarSolicitud);