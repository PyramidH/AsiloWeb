const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/CitaMedica';
const apiUrlInternos = 'http://malvarado-001-site1.atempurl.com/api/Internos';
const apiUrlMedicos = 'http://malvarado-001-site1.atempurl.com/api/Medicos';
const apiUrlEnfermeros = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

const CitaList = document.getElementById('cita-list');
const cmbInternos = document.getElementById('internos');
const cmbMedicos = document.getElementById('medicos');
const cmbEnfermeros = document.getElementById('enfermeros');


// Función para cargar la lista de citas
async function cargarListaCitas() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();
        //console.log(data);
        if (response.status === 200) {
            // Limpiar la lista
            CitaList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Fecha y Hora</th>
                    <th>Motivo</th>
                    <th>Costo</th>
                    <th>Interno</th>
                    <th>Médico</th>
                    <th>Enfermero</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de citas
            const tableBody = document.createElement('tbody');
            data.response.forEach(cita => {
                const row = document.createElement('tr');
                const fechaCita = new Date(cita.fechaHora);
                const fechacita1 = fechaCita.toISOString().split('T')[0];
                row.setAttribute('data-id', cita.idCita);
                row.innerHTML = `
                    <td>${cita.idCita}</td>
                    <td>${fechacita1}</td>
                    <td>${cita.motivo}</td>
                    <td>${cita.costo}</td>
                    <td>${cita.idInternoNavigation.nombre + " " + cita.idInternoNavigation.apellido}</td>
                    <td>${cita.idMedicoNavigation.nombre + " " + cita.idMedicoNavigation.apellido}</td> 
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

async function guardarcita(event) {
    event.preventDefault();
    const cita = {
        fechahora: document.getElementById('fechacita').value,
        motivo: document.getElementById('motivo').value,
        costo: document.getElementById('costo').value,
        idInterno: document.getElementById('internos').value,
        idMedico: document.getElementById('medicos').value,
        idEnfermero: document.getElementById('enfermeros').value                
    };
    //console.log(cita);
    let apiUrlEndpoint = `${apiUrl}/Guardar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cita)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaCitas();
            limpiarFormulario();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar el Interno:', error);
    }
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

function limpiarFormulario() {
    document.getElementById('fechacita').value = '';
    document.getElementById('internos').value = '';
    document.getElementById('medicos').value = '';
    document.getElementById('enfermeros').value = '';
    document.getElementById('costo').value = '';
    document.getElementById('motivo').value = '';
}

function editarCita(id) {
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    celdas.forEach(function (celda, index) {
        if (index < celdas.length - 1) {
            const valorOriginal = celda.innerText;
            celda.innerHTML = `<input type="text" style='width:100%' value="${valorOriginal}">`;
            if(index == 1){
                celda.innerHTML = `<input type="date" style='width:100%' value="${valorOriginal}">`;
                }
            if(index == 4){
                celda.innerHTML = '';
                celda.appendChild(cmbInternos.cloneNode(true));
                }
            if(index == 5){
                celda.innerHTML = '';
                celda.appendChild(cmbMedicos.cloneNode(true));
                }
            if(index == 6){
                celda.innerHTML = '';
                celda.appendChild(cmbEnfermeros.cloneNode(true));
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

document.getElementById('RegistrarCita').addEventListener('submit', guardarcita);


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

async function cargarSelectMedico() {

    try {
        const response = await fetch(`${apiUrlMedicos}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            data.response.forEach(medico => {
                var cmbOption = document.createElement("option");
                cmbOption.text = medico.nombre + " " + medico.apellido;
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
