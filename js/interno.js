const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Internos'; // Reemplaza con la URL de tu API

const internList = document.getElementById('Intern-list');

// Función para cargar la lista de productos Interno
async function cargarListaProductos() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            internList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');
            table.classList.add('table', 'table-success' , 'table-striped', 'table-bordered', 'table-hover');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>F. Nacimiento</th>
                    <th>Gen</th>
                    <th>Telefono</th>
                    <th>C. Emergencia</th>
                    <th>Num. Emergencia</th>
                    <th>Email</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(internos => {
                const row = document.createElement('tr');
                const fechaNacimiento = new Date(internos.fechaNacimiento);
                const fechaSolo = fechaNacimiento.toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${internos.idInterno}</td>
                    <td>${internos.nombre + " " + internos.apellido}</td>
                    <td>${fechaSolo}</td>
                    <td>${internos.genero}</td>
                    <td>${internos.telefono}</td>
                    <td>${internos.contactoEmergencia}</td>
                    <td>${internos.numContactoEmergencia}</td>
                    <td>${internos.email}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarProducto(${internos.idInterno})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarProducto(${internos.idInterno})">Eliminar</button>
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

// Función para eliminar un producto
async function eliminarProducto(idProducto) {
    // Lógica para eliminar un producto utilizando la API
    // Después de eliminar, vuelve a cargar la lista de productos
}
