const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/CitaMedica'; // Reemplaza con la URL de tu API

const CitaList = document.getElementById('cita-list');


// Función para cargar la lista de productos Interno
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

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(cita => {
                const row = document.createElement('tr');
                //const fechaNacimiento = new Date(internos.fechaNacimiento);
                //const fechaSolo = fechaNacimiento.toISOString().split('T')[0];

                //Validar el nombre de la variable para el medico
                //Validar el nombre de la variable para el intenro*paciente
                row.setAttribute('data-id', cita.idCita);
                row.innerHTML = `
                    <td>${cita.idCita}</td>
                    <td>${cita.fechaHora}</td>
                    <td>${cita.motivo}</td>
                    <td>${cita.costo}</td>
                    <td>${cita.nombre + " " + cita.apellido}</td>
                    <td>${cita.medico}</td> 
                    <td>${cita.interno}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarProducto(${cita.idCita})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarProducto(${cita.idCita})">Eliminar</button>
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




//Función para llenar el select

const apiUrl1 = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

async function cargaselect() {
    fetch(`${apiUrl1}/Lista`).then(function(result){
        if(result.ok){
            return result.json();
        }
        
    }).then(function(data){
        console.log("Checkbox");
        console.log(data);
        //data = JSON.parse(data);
        data.forEach(function(element){
            console.log(element);
            let enfermero = document.getElementById("enfermeros");
            let opt = document.createElement("option");
            opt.appendChild(document.createTextNode(element.nombre));
            opt.value = element.idEnfermero;

            enfermero.appendChild(opt);

        })

    })
}
