async function cargarListaProductos() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            productList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');
            table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.idProducto}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.marca}</td>
                    <td>${producto.precio}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarProducto(${producto.idProducto})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarProducto(${producto.idProducto})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            productList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de productos:', error);
    }
}