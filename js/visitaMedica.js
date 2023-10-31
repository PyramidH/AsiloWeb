const apiUrlInternos = 'http://malvarado-001-site1.atempurl.com/api/CitaMedica';
const apiUrlVisita = 'http://malvarado-001-site1.atempurl.com/api/VisitaMedicas';

const pacientes_list = document.getElementById('pacientes-list');
var txtDiagnostico = document.getElementById('diagnostico');
var txtMedicamento = document.getElementById('medicamento');
var txtCantidad = document.getElementById('cantidad');
var txtTiempo = document.getElementById('tiempo');
var txtObservaciones = document.getElementById('observaciones');
var txtId = document.getElementById('id');
var txtPaciente = document.getElementById('paciente');

async function cargarListaPacientes() {
    try {
        const response = await fetch(`${apiUrlInternos}/Lista`);
        const data = await response.json();
        if (response.status === 200) {
            pacientes_list.innerHTML = '';
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
            table.appendChild(tableHeader);
            const tableBody = document.createElement('tbody');
            data.response.forEach(cita => {
                var medico = "";
                if (cita.idMedicoNavigation != null) {
                    var medico = cita.idMedicoNavigation.nombre + " " + cita.idMedicoNavigation.apellido;
                }
                var medicoLoged = localStorage.getItem("nombre");
                if (medico == medicoLoged && cita.estado == 'Asignada') {
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
                    var paciente = cita.idInternoNavigation.nombre + " " + cita.idInternoNavigation.apellido;
                    row.innerHTML = `
                        <td>${cita.idCita}</td>
                        <td>${fechaFormateada}</td>
                        <td>${cita.motivo}</td>
                        <td>${paciente}</td>
                        <td>
                        <button type="button" class="btn btn-primary" onclick="ActivarControles(${cita.idCita + ",'" + paciente + "'"})">Atender</button>
                        <button class="btn btn-cancel" onclick="denegarCita(${cita.idCita})">Denegar</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                    table.appendChild(tableBody);
                    pacientes_list.appendChild(table);
                }
            });
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de citas:', error);
    }
}

function ActivarControles(id, paciente) {
    txtDiagnostico.disabled = false;
    txtMedicamento.disabled = false;
    txtCantidad.disabled = false;
    txtTiempo.disabled = false;
    txtObservaciones.disabled = false;
    txtId.value = id;
    txtPaciente.value = paciente;
}
function limpiarFormulario(id, paciente) {
    txtDiagnostico.disabled = true;
    txtMedicamento.disabled = true;
    txtCantidad.disabled = true;
    txtTiempo.disabled = true;
    txtObservaciones.disabled = true;
    txtId.value = "";
    txtPaciente.value = "";
    txtDiagnostico.value = "";
    txtMedicamento.value = "";
    txtCantidad.value = "";
    txtTiempo.value = "";
    txtObservaciones.value = "";
}

async function guardarVisita(event) {
    event.preventDefault();
    var cantidad = parseInt(txtCantidad.value);
    var idCita = parseInt(txtId.value);
    const visita = {
        diagnostico: txtDiagnostico.value,
        medicamento: txtMedicamento.value,
        cantidad: cantidad,
        tiempo: txtTiempo.value,
        observaciones: txtObservaciones.value,
        idCita: idCita
    };
    let apiUrlEndpoint = `${apiUrlVisita}/Guardar`;
    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visita)
        });
        const data = await response.json();
        if (response.status === 200) {
            limpiarFormulario();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar el Interno:', error);
    }
    //Editar el estado de la Cita
    const cita = {
        idCita: idCita,
        estado: "Atendida"
    };
    let apiUrlEndpoint1 = `${apiUrlInternos}/Editar`;
    try {
        const response = await fetch(apiUrlEndpoint1, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cita)
        });
        const data = await response.json();
    } catch (error) {
        console.error('Error al actualizar la cita:', error);
    }
    cargarListaPacientes();
}
document.getElementById('registrarVisita').addEventListener('submit', guardarVisita);

