const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Usuarios';

    async function login(user,pass) {
    var user = document.getElementById('usuario').value;
    var pass = document.getElementById('contra').value;
    
      /* const login = {
            usuario: user.value,
            contraseña: pass.value
        };*/
    
        let apiUrlEndpoint = `${apiUrl}/Login/${user}/${pass}`;
        console.log(apiUrlEndpoint);
        
        try {
            const response = await fetch(apiUrlEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            });
    
            const data = await response.json();
            /*console.log(data);
            console.log(response.status);
            console.log(data.mensaje);*/
            
            if (data.response == true) {
                window.location="Menu.html"
            }
         else {
                //console.error('Contraseña o Usuario Incorrecto', data.mensaje);
                alert("Contraseña o Usuario Incorrecto");
            }
        } catch (error) {
            console.error('Contraseña o Usuario Incorrecto', error);
        }
    }


   /* if (usuario === "usuario" && contra === "contraseña") {
        window.location="Menu.html"
        // En una aplicación real, aquí redirigirías al usuario a la página de inicio.
    } else {
        alert("Datos Malos");
    }*/

