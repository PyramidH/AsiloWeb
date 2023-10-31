const apiUrlInternos = 'http://malvarado-001-site1.atempurl.com/api/CitaMedica';
const pacientes_list = document.getElementById('pacientes-list');

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
                if (medico == medicoLoged) {
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
                        <button type="button" class="btn btn-primary" onclick="botonFooter(${cita.idCita})">Atender</button>
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