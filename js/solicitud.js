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
                    <th>Costo</th>
                    <th>Interno</th>
                    <th>Médico</th>
                    <th>Enfermero</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);
            const tableBody = document.createElement('tbody');
            data.response.forEach(cita => {
                const row = document.createElement('tr');
                const fechaCita = new Date(cita.fechaHora);
                const fechacita1 = fechaCita.toISOString().split('T')[0];
                var nomDoctor = "Pendiente"
                if (cita.idMedicoNavigation != null) {
                    nomDoctor = cita.idMedicoNavigation.nombre + " " + cita.idMedicoNavigation.apellido
                }
                row.setAttribute('data-id', cita.idCita);
                row.innerHTML = `
                    <td>${cita.idCita}</td>
                    <td>${fechacita1}</td>
                    <td>${cita.motivo}</td>
                    <td>${cita.costo}</td>
                    <td>${cita.idInternoNavigation.nombre + " " + cita.idInternoNavigation.apellido}</td>
                    <td>${nomDoctor}</td> 
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