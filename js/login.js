const apiUrl = 'http://malvarado-001-site1.atempurl.com/api/Usuarios';

async function login(user, pass) {
    var user = document.getElementById('usuario').value;
    var pass = document.getElementById('contra').value;
    let apiUrlEndpoint = `${apiUrl}/Login/${user}/${pass}`;
    try {
        const response = await fetch(apiUrlEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }, credentials: 'same-origin'
        });

        const data = await response.json();
        console.log(data);
        if (data.response == true) {
            console.log("Sesion Iniciada Correctamente");
            console.log(document.cookie);
            var userInfoCookie = getCookie("InformacionSesion");
            var userInfo = JSON.parse(userInfoCookie);
            var usuario = userInfo.Usuario;
            var rol = userInfo.Rol;
            var sesionActiva = userInfo.SesionActiva;
            var email = userInfo.email;
            var nombre = userInfo.nombre;
            switch (rol) {
                case "Laboratorio":
                    window.location = "dashboardLaboratorio.html";
                    break;
                case "Asilo":
                    window.location = "dashboardAsilo.html";
                    break;
                case "Fundación":
                    window.location = "dashboardFundacion.html"
                    break;
                case "Médico General":
                    window.location = "dashboardMedicoGeneral.html"
                    break;
                case "Médico Especialidad":
                    window.location = "dashboardMedicoEspecialista.html"
                    break;
            }
        }
        else {
            alert("Contraseña o Usuario Incorrecto");
        }
    } catch (error) {
        console.error('Contraseña o Usuario Incorrecto', error);
    }
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}


