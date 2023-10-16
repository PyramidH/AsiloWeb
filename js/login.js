function login(){

    let usuario = document.getElementById("usuario").value;
    let contra = document.getElementById("contra").value;


    

    /* Comprueba si las credenciales son válidas (en una aplicación real, esto se haría en el servidor)


    if (usuario === login.user && contra === login.pass) {
        window.location="Menu.html"
        // En una aplicación real, aquí redirigirías al usuario a la página de inicio.
    } else {
        alert("Datos Malos");
    }*/


    async function login(event) {
        event.preventDefault();
    
        const login = {
            usuario: usuario.value,
            contraseña: contra.value
        };
    
        let apiUrlEndpoint = `${apiUrl}/Login`;
    
        
        try {
            const response = await fetch(apiUrlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(login)
            });
    
            const data = await response.json();
    
            if (response.status == 'true') {
                window.location="Menu.html"
            }
         else {
                console.error('Contraseña o Usuario Incorrecto', data.mensaje);
                alert("Contraseña o Usuario Incorrecto");
            }
        } catch (error) {
            console.error('Contraseña o Usuario Incorrecto', error);
        }
    }


    if (usuario === "usuario" && contra === "contraseña") {
        window.location="Menu.html"
        // En una aplicación real, aquí redirigirías al usuario a la página de inicio.
    } else {
        alert("Datos Malos");
    }

}