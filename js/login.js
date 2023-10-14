function login(){

    let usuario = document.getElementById("usuario").value;
    let contra = document.getElementById("contra").value;


    const login = {
        user: usuario.value,
        pass: contra.value
    };

    /* Comprueba si las credenciales son válidas (en una aplicación real, esto se haría en el servidor)
    if (usuario === login.user && contra === login.pass) {
        window.location="Menu.html"
        // En una aplicación real, aquí redirigirías al usuario a la página de inicio.
    } else {
        alert("Datos Malos");
    }*/

    if (usuario === "usuario" && contra === "contraseña") {
        window.location="Menu.html"
        // En una aplicación real, aquí redirigirías al usuario a la página de inicio.
    } else {
        alert("Datos Malos");
    }

}