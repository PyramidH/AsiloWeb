const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Usuarios';

const UserList = document.getElementById('usuario-list');


// Función para cargar la lista de enfermeros
async function cargarListaUsuarios() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();

        if (response.status === 200) {
            // Limpiar la lista
            UserList.innerHTML = '';

            // Crear una tabla con clases de Bootstrap
            const table = document.createElement('table');

            // Crear encabezados de la tabla con clases de Bootstrap
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Email</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de los enfermeros
            const tableBody = document.createElement('tbody');
            data.response.forEach(usuarios => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', usuarios.idUsuario);
                row.innerHTML = `
                    <td>${usuarios.idUsuario}</td>
                    <td>${usuarios.nombre}</td>
                    <td>${usuarios.usuario1}</td>
                    <td>${usuarios.rol}</td>
                    <td>${usuarios.email}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarUsuario(${usuarios.idUsuario})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarUsuario(${usuarios.idUsuario})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            UserList.appendChild(table);
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al cargar la lista de los usuarios:', error);
    }
}    

async function eliminarUsuario(idUsuario) {
    let apiUrlEndpoint = `${apiUrl}/Eliminar/${idUsuario}`;
    const id = { idUsuario: idUsuario}
    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(id)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaUsuarios();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}

function editarUsuario(id) {
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    celdas.forEach(function (celda, index) {
        if (index < celdas.length - 1) {
            const valorOriginal = celda.innerText;
            celda.innerHTML = `<input type="text" style='width:100%' value="${valorOriginal}">`;
            if(index == 3){
            celda.innerHTML = 
            `<select style='width:100%'>
            <option value="${valorOriginal}">${valorOriginal}</option>
            <option value="Médico General">Médico General</option>
            <option value="Médico Especialidad">Médico Especialidad</option>
            <option value="Laboratorio">Laboratorio</option>
            <option value="Fundacion">Fundación</option>
            <option value="Asilo">Asilo</option>
        </select>`;
            }
        }
    });

    const btnEditar = fila.querySelector('button.btn-primary');
    btnEditar.textContent = 'Guardar';
    btnEditar.classList.remove("btn-primary");
    btnEditar.classList.add("btn-save");
    btnEditar.onclick = function () {
        actualizarUsuarios(id);
    };
    const btnEliminar = fila.querySelector('button.btn-cancel');
    btnEliminar.textContent = 'Cancelar';
    btnEliminar.onclick = function () {
        cargarListaUsuarios();
    };
}

async function actualizarUsuarios(id) {
    event.preventDefault();
    const fila = document.querySelector(`tr[data-id="${id}"]`);
    const celdas = fila.querySelectorAll('td');
    const usuario = {
        idUsuario: celdas[0].querySelector('input').value,
        nombre: celdas[1].querySelector('input').value,
        usuario1: celdas[2].querySelector('input').value,
        rol: celdas[3].querySelector('select').value,
        email: celdas[4].querySelector('input').value
    };

    let apiUrlEndpoint = `${apiUrl}/Editar`;

    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const data = await response.json();

        if (response.status === 200) {
            cargarListaUsuarios();
        } else {
            console.error('Error en la respuesta de la API:', data.mensaje);
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
    }
}

//document.getElementById('RegistrarEnfermero').addEventListener('submit', GuardarEnfermero);
