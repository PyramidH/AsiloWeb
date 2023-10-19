const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Internos'; // Reemplaza con la URL de tu API

const internListCita = document.getElementById('cita-list');


// Función para cargar la lista de productos Interno
async function cargarListaProductos() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            internListCita.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');
            table.classList.add('table', 'table-success' , 'table-striped', 'table-bordered', 'table-hover');

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

            internListCita.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de citas:', error);
    }
}

// Función para eliminar un producto
async function eliminarProducto(idProducto) {
    // Lógica para eliminar un producto utilizando la API
    // Después de eliminar, vuelve a cargar la lista de productos
}