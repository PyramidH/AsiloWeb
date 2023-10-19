const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

    async function GuardarEnfermero() { 
        
        const nombreInput = document.getElementById("nombreenfer");
        const apellidoInput = document.getElementById("apellidoenfer");

        const GuardarEn = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value
        };
    
        let apiUrlEndpoint = `${apiUrl}/Guardar`;
        
        
        try {
            const response = await fetch(apiUrlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(GuardarEn)
            });
    
            const data = await response.json();
    
            if (response.status == '200') {
                window.location= "enfermero.html"
            }
         else {
                console.error('Error al guardar la información', data.mensaje);
            }
        } catch (error) {
            console.error('Contraseña o Usuario Incorrecto', error);
        }
    }


    const internList = document.getElementById('enfermero-list');

//*****************

// Función para cargar la lista de enfermeros
async function cargarListaProductos() {
    try {
        const response = await fetch(`${apiUrl}/Lista`);
        const data = await response.json();
        console.log("Tabla");
        console.log(data);

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
                    <th>Apellido</th>
                    <th>Opciones</th>
                </tr>
            `;
            table.appendChild(tableHeader);

            // Crear filas de la tabla con datos de productos
            const tableBody = document.createElement('tbody');
            data.response.forEach(enfermero => {
                const row = document.createElement('tr');
                //const fechaNacimiento = new Date(internos.fechaNacimiento);
                //const fechaSolo = fechaNacimiento.toISOString().split('T')[0];

                //Validar el nombre de la variable para el medico
                //Validar el nombre de la variable para el intenro*paciente
                row.innerHTML = `
                    <td>${enfermero.idEnfermero}</td>
                    <td>${enfermero.nombre}</td>
                    <td>${enfermero.apellido}</td>
                    <td>
                    <button class="btn btn-primary" onclick="editarProducto(${enfermero.idEnfermero})">Editar</button>
                    <button class="btn btn-cancel" onclick="eliminarProducto(${enfermero.idEnfermero})">Eliminar</button>
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
        console.error('Error al cargar la lista de enfermeros:', error);
    }
}

// Función para eliminar un producto
async function eliminarProducto(idProducto) {
    // Lógica para eliminar un producto utilizando la API
    // Después de eliminar, vuelve a cargar la lista de productos
}

//*****************

   //Función para llenar el select

    fetch(`${apiUrl}/Lista`).then(function(result){
        if(result.ok){
            return result.json();
        }
    }).then(function(data){
        console.log("Checkbox");
        console.log(data);
        //data = JSON.parse(data);
        data.forEach(function(element){
            console.log(element);
            let enfermero = document.getElementById("lista-enfermero");
            let opt = document.createElement("option");
            opt.appendChild(document.createTextNode(element.nombre));
            opt.value = element.idEnfermero;

            enfermero.appendChild(opt);

        })

    })

    


    //const ListaEnf = document.getElementById('lista-enfermeros');

   /* async function ListaEnfermeros() {
        try {
            const response = await fetch(`${apiUrl}/Lista`);
            const data = await response.json();

            console.log(apiUrl);
    
            if (response.status === 200) {
                // Limpiar la lista
                ListaEnf.innerHTML = '';
    
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
    }*/
