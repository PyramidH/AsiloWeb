const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Enfermeros';

    async function GuardarEnfermero() { //Cambiar nombre de la función
        
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
                window.location="registroenfermero.html"
            }
         else {
                console.error('Error al guardar la información', data.mensaje);
                //alert("Contraseña o Usuario Incorrecto");
            }
        } catch (error) {
            console.error('Contraseña o Usuario Incorrecto', error);
        }
    }
