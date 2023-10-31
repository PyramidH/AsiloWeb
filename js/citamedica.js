const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/CitaMedica';
const apiUrlInternos = 'http://malvarado-001-site1.atempurl.com/api/Internos';
const apiUrlMedicos = 'http://malvarado-001-site1.atempurl.com/api/Medicos';
const apiUrlEnfermeros = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

const CitaList = document.getElementById('cita-list');
const CitaList_a = document.getElementById('cita-list-a');
const cmbMedicos = document.getElementById('medicos');



// Función para cargar la lista de citas
async function cargarListaCitas() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();
        if (response.status === 200) {
            CitaList.innerHTML = '';
            CitaList_a.innerHTML = '';
            const table = document.createElement('table');
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Fecha y Hora</th>
                    <th>Motivo</th>
                    <th>Interno</th>
                    <th>Opciones</th>
                </tr>
            `;

            const table_a = document.createElement('table');
            const tableHeader_a = document.createElement('thead');
            tableHeader_a.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Horario</th>
                    <th>Interno</th>
                    <th>Medico E.</th>
                    <th>Enfermero</th>
                    <th>Costo</th>
                    <th>Opciones</th>
                </tr>
            `;

            table.appendChild(tableHeader);
            table_a.appendChild(tableHeader_a);

            const tableBody = document.createElement('tbody');
            const tableBody_a = document.createElement('tbody');
            data.response.forEach(cita => {
                if (cita.estado == 'Solicitud') {
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
                        <td>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="botonFooter(${cita.idCita})">Asignar</button>
                        <button class="btn btn-cancel" onclick="denegarCita(${cita.idCita})">Denegar</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                    table.appendChild(tableBody);
                    CitaList.appendChild(table);
                }
                if (cita.estado == 'Asignada') {
                    const row = document.createElement('tr');
                    row.setAttribute('data-id', cita.idCita);
                    var fechaOriginal = cita.fechaHora;
                    var fecha = new Date(fechaOriginal);
                    var dia = fecha.getDate();
                    var mes = fecha.getMonth() + 1;
                    var año = fecha.getFullYear();
                    var hora = fecha.getHours().toString();
                    var minutos = fecha.getMinutes().toString();
                    var fechaFormateada = dia + "-" + mes + "-" + año + " " + hora + ":" + minutos;
                    row.innerHTML = `
                        <td>${cita.idCita}</td>
                        <td>${fechaFormateada}</td>
                        <td>${cita.idInternoNavigation.nombre + cita.idInternoNavigation.apellido}</td>
                        <td>${cita.idMedicoNavigation.nombre + " " + cita.idMedicoNavigation.apellido}</td>
                        <td>${cita.idEnfermeroNavigation.nombre + " " + cita.idEnfermeroNavigation.apellido}</td>
                        <td>Q ${cita.costo}</td>
                        <td>
                        <button class="btn btn-primary" onclick="editarCita(${cita.idCita})">Editar</button>
                        <button class="btn btn-cancel" onclick="eliminarCita(${cita.idCita})">Eliminar</button>
                        </td>
                    `;
                    tableBody_a.appendChild(row);
                    table_a.appendChild(tableBody_a);
                    CitaList_a.appendChild(table_a);
                }
            });
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de citas:', error);
    }
}

async function botonFooter(id) {
    var modal_footer = document.getElementById('modal-footer');
    modal_footer.innerHTML = '';
    var botonAsignar = document.createElement('button');
    botonAsignar.type = 'submit';
    botonAsignar.className = 'btn btn-primary';
    botonAsignar.textContent = 'Asignar';
    botonAsignar.setAttribute("onclick", "asignarCita(" + id + ")");
    botonAsignar.setAttribute('data-dismiss', 'modal');
    var botonCancelar = document.createElement('button');
    botonCancelar.type = 'button';
    botonCancelar.className = 'btn btn-secondary';
    botonCancelar.textContent = 'Cancelar';
    botonCancelar.setAttribute('data-dismiss', 'modal');
    modal_footer.appendChild(botonAsignar);
    modal_footer.appendChild(botonCancelar);
}

async function denegarCita(idCita) {
    event.preventDefault();
    const cita = {
        idCita: idCita,
        estado: "Denegada"
    };
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

function editarCita(id) {
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    celdas.forEach(function (celda, index) {
        if (index < celdas.length - 1) {
            const valorOriginal = celda.innerText;
            if (index == 1) {
                celda.innerHTML = `<input type="date" style='width:100%' value="${valorOriginal}"><input type="time" style='width:100%' value="${valorOriginal}">`;
            }
            if (index == 3) {
                celda.innerHTML = '';
                var cmbMedicoUPD = cmbMedicos.cloneNode(true);
                for (var i = 0; i < cmbMedicoUPD.options.length; i++) {
                    var option = cmbMedicoUPD.options[i];
                    if (option.text == "Medico") {
                        option.selected = false;
                    }
                    if (option.text == valorOriginal) {
                        option.selected = true;
                    }
                }
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
        idCita: celdas[0].querySelector('input').value,
        fechaHora: celdas[1].querySelector('input').value,
        motivo: celdas[2].querySelector('input').value,
        costo: celdas[3].querySelector('input').value,
        idInterno: celdas[4].querySelector('select').value,
        idMedico: celdas[5].querySelector('select').value,
        idEnfermero: celdas[6].querySelector('select').value
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

async function asignarCita(id) {
    event.preventDefault();
    var datetime = document.getElementById('fecha').value + 'T' + document.getElementById('hora').value;
    const cita = {
        idCita: id,
        fechaHora: datetime,
        idMedico: document.getElementById('medicos').value,
        costo: document.getElementById('costo').value,
        estado: "Asignada"
    };
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

document.getElementById('AsignarCita').addEventListener('submit', asignarCita);

async function cargarSelectMedico() {

    try {
        const response = await fetch(`${apiUrlMedicos}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            data.response.forEach(medico => {
                var cmbOption = document.createElement("option");
                cmbOption.text = medico.nombre + " " + medico.apellido + " - " + medico.especialidad;
                cmbOption.value = medico.idMedico;
                cmbMedicos.add(cmbOption);
            });

        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Internos:', error);
    }

}
