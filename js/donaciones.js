const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Donaciones'; // Reemplaza con la URL de tu API

const internList = document.getElementById('Donaciones-list');

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

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>TipoDonante</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(donaciones => {
                const row = document.createElement('tr');
                const fechaNacimiento = new Date(donaciones.fecha);
                const fechaSolo = fechaNacimiento.toISOString().split('T')[0];
                row.innerHTML = `
                    <td>${donaciones.idDonacion}</td>
                    <td>${donaciones.tipoDonante}</td>
                    <td>${donaciones.monto}</td>
                    <td>${fechaSolo}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarProducto(${donaciones.idDonacion})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarProducto(${donaciones.idDonacion})">Eliminar</button>
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
