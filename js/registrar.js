document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("registrar");
  
    formulario.addEventListener("submit", function (event) {
      
      event.preventDefault();
      guardar();
  
      
    });
  });
const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Usuarios';

    async function guardar() {
    var usuario = document.getElementById('usuario').value;
    var nombre = document.getElementById('nombre').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var rol = document.getElementById('rol').value;
    
       const registrar = {
            nombre: nombre,
            usuario1: usuario,
            contraseña: password,
            rol: rol,
            email: email
        };

        document.getElementById("spinner").style.display = "block";
    
        let apiUrlEndpoint = `${apiUrl}/Guardar`;
        console.log(apiUrlEndpoint);
        
        try {
            const response = await fetch(apiUrlEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrar)
            });
           // document.getElementById("spinner").style.display = "none";
            alert('Usuario Registrado Exitosamente')
            const data = await response.json();
            console.log(data)

    
        } catch (error) {
            console.error('Error al registrar usuario', error);
        }
    }
