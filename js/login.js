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
            },
        });

        const data = await response.json();
        console.log(data.response);
        if (data.sesion === true) {
            var idUsuario = data.response.idUsuario;
            var nombre = data.response.nombre;
            var usuario = data.response.usuario1;
            var contraseña = data.response.contraseña;
            var rol = data.response.rol;
            var email = data.response.email;
            var sesion = data.sesion;
            localStorage.setItem("idUsuario", idUsuario);
            localStorage.setItem("nombre", nombre);
            localStorage.setItem("usuario", usuario);
            localStorage.setItem("contraseña", contraseña);
            localStorage.setItem("rol", rol);
            localStorage.setItem("email", email);
            localStorage.setItem("sesion", sesion);
            var rolUsuario = localStorage.getItem("rol");
            switch (rolUsuario) {
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

function logOut() {
    if (localStorage.getItem("sesion") == "true") {
        localStorage.removeItem("idUsuario", idUsuario);
        localStorage.removeItem("nombre", nombre);
        localStorage.removeItem("usuario", usuario);
        localStorage.removeItem("contraseña", contraseña);
        localStorage.removeItem("rol", rol);
        localStorage.removeItem("email", email);
        localStorage.removeItem("sesion", sesion);
    }
}

function isActive() {
    if (localStorage.getItem("sesion") == "true") {
        var rolUsuario = localStorage.getItem("rol");
        switch (rolUsuario) {
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
}



