const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/CuotaMensual'; // Reemplaza con la URL de tu API
const cuotaMensualList = document.getElementById('Cuota Mensual-list');

// Función para cargar la lista de Cuota Mensual
async function cargarCuotaMensual() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            cuotaMensualList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');
            table.classList.add('table', 'table-success', 'table-striped', 'table-bordered', 'table-hover');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>IDCuota</th>
                    <th>IDInterno</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Descripcion</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(CuotaMensual => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${CuotaMensual.idCuota}</td>
                    <td>${CuotaMensual.idInterno}</td>
                    <td>${CuotaMensual.monto}</td>
                    <td>${CuotaMensual.fecha}</td>
                    <td>${CuotaMensual.descripcion}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editarCuotaMensual(${CuotaMensual.idCuota})">Editar</button>
                        <button class="btn btn-cancel" onclick="eliminarCuotaMensual(${CuotaMensual.idCuota})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            cuotaMensualList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de Cuota Mensual:', error);
    }
}

// Función para guardar una nueva Cuota Mensual
async function guardarCuotaMensual() {
    // Obtén los datos del formulario y crea un objeto Cuota Mensual
    const nuevoCuotaMensual = {
        idInterno: document.getElementById('IDInterno').value,
        monto: document.getElementById('Monto').value,
        fecha: document.getElementById('Fecha').value,
        descripcion: document.getElementById('Descripcion').value,
    };

    // Realiza una solicitud POST a la API para guardar la Cuota Mensual
    try {
        const response = await fetch(`${apiUrl}/Guardar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCuotaMensual)
        });

        const data = await response.json();

        if (response.status === 200) {
            // Si la respuesta es exitosa, carga la lista actualizada de Cuota Mensual
            cargarCuotaMensual();
            // Limpia el formulario
            document.getElementById('CuotaMensual-form').reset();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al guardar la Cuota Mensual:', error);
    }
}

// Función para eliminar una Cuota Mensual
async function eliminarCuotaMensual(idCuota) {
    // Realiza una solicitud DELETE a la API para eliminar la Cuota Mensual con el ID proporcionado
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idCuota}`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            // Si la respuesta es exitosa, carga la lista actualizada de Cuota Mensual
            cargarCuotaMensual();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar la Cuota Mensual:', error);
    }
}

// Función para editar un registro de Cuota Mensual
async function editarCuotaMensual(idCuota) {
    const cuota = {
        idInterno: document.getElementById('IDInterno').value,
        monto: document.getElementById('Monto').value,
        fecha: document.getElementById('Fecha').value,
        descripcion: document.getElementById('Descripcion').value,
    };

    let apiUrlEndpoint = `${apiUrl}/Editar/${idCuota}`; // Reemplaza con la ruta adecuada para editar un registro

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cuota)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarCuotaMensual(); // Carga la lista actualizada de Cuota Mensual
            document.getElementById('CuotaMensual-form').reset(); // Limpia el formulario
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al editar la Cuota Mensual:', error);
    }
}


// Agregar el evento para guardar una Cuota Mensual cuando se envía el formulario
document.getElementById('CuotaMensual-form').addEventListener('submit', function (event) {
    event.preventDefault();
    guardarCuotaMensual();
});

// Cargar la lista de Cuota Mensual al cargar la página
cargarCuotaMensual();
