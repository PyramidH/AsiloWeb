const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

function login(){

    let nombre = document.getElementById("nombreenfer").value;
    let apellido = document.getElementById("apellidoenfer").value;


    async function login(event) { //Cambiar nombre de la función
        event.preventDefault();
    
        const login = {
            nombre: nombre.value,
            apellido: apellido.value
        };
    
        let apiUrlEndpoint = `${apiUrl}Enfermeros/Guardar`;
    
        
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
}