const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Medicamentos'; // Reemplaza con la URL de tu API

const internList = document.getElementById('Medicamentos-list');

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
                    <th>Descripcion</th>
                    <th>Costo</th>
                    <th>Existencia</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(Medicamentos => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${Medicamentos.idMedicamento}</td>
                    <td>${Medicamentos.nombre}</td>
                    <td>${Medicamentos.descripcion}</td>
                    <td>${Medicamentos.costo}</td>
                    <td>${Medicamentos.stock}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarProducto(${Medicamentos.idMedicamentos})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarProducto(${Medicamentos.idMedicamentos})">Eliminar</button>
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