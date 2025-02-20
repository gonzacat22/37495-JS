//Para quienes estuvieron en el after o vean el video, el error estaba en la function validateUser (me olvide de agregar el typeof, deah)

//Fake Databases de Usuarios y Mascotas ( en el mundo real esto está en una DB que es accedida a través del backend)
const usuarios = [{
    nombre: 'Azul',
    mail: 'azulperez@mail.com',
    pass: 'azulcomoelmarazul'
},
{
    nombre: 'Betiana',
    mail: 'betidicarlo@mail.com',
    pass: 'sha23AWx!'
},
{
    nombre: 'Carlos',
    mail: 'lopezcarlosadrian@mail.com',
    pass: 'sanlore2002'
}]

const mascotas = [{
    nombre: "Oddie",
    especie: "perro",
    edad: 1,
    peso: 3,
    img: './img/oddie.jpg'
}, {
    nombre: "Garfield",
    especie: "gato",
    edad: 3,
    peso: 8,
    img: './img/garfield.webp'
}, {
    nombre: "Orson",
    especie: "chancho",
    edad: 2,
    peso: 40,
    img: './img/orson.webp'
}, {
    nombre: "Roy",
    especie: "gallo",
    edad: 2,
    peso: 2,
    img: './img/roy.webp'
}]


//Todos los elementos del DOM que voy a necesitar
const mailLogin = document.getElementById('emailLogin'),
    //Había borrado la variable que gilaaaaaa
    passLogin = document.getElementById('passwordLogin'),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    contTarjetas = document.getElementById('tarjetas'),
    toggles = document.querySelectorAll('.toggles');


//guardamos los datos que recuperamos de la database en el storage
function guardarDatos(usuarioDB, storage) {
    const usuario = {
        'name': usuarioDB.nombre,
        'user': usuarioDB.mail,
        'pass': usuarioDB.pass
    }

    if (storage === 'sessionStorage') {
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }

    if (storage === 'localStorage') {
        localStorage.setItem('usuario', JSON.stringify(usuario));
    }
}

//limpiar los storages
function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}

//recupero los datos que se guardaron y los retorno
function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}

//cambio el dom para mostrar el nombre del usuario logueado, usando los datos del storage
function saludar(usuario) {
    nombreUsuario.innerHTML = `Bienvenido/a, <span>${usuario.name}</span>`
}

//Crear HTML dinámico para mostrar la información de las mascotas a partir del array fake DB
function mostrarInfoMascota(array) {
    contTarjetas.innerHTML = '';
    array.forEach(element => {
        let html = `<div class="card cardMascota" id="tarjeta${element.nombre}">
                <h3 class="card-header" id="nombreMascota">Nombre: ${element.nombre}</h3>
                <img src="${element.img}" alt="${element.nombre}" class="card-img-bottom" id="fotoMascota">
                <div class="card-body">
                    <p class="card-text" id="especieMascota">Especie: ${element.especie}</p>
                    <p class="card-text" id="edadMascota">Edad: ${element.edad} años</p>
                    <p class="card-text" id="pesoMascota">Peso: ${element.peso} kilos</p>
                </div>
            </div>`;
        contTarjetas.innerHTML += html;
    });
}

//esta función nos permite intercambiar la visualizaión de los elementos del DOM, agregando o sacando la clase d-none. Si el elemento la tiene, se la saco, y si no la tiene, se la agrego. La gata Flora de las funciones sería.
function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

//esta función revisa si hay un usuario guardado en el storage, y en ese caso evita todo el proceso de login 
function isLogged(usuario) {

    if (usuario) {
        saludar(usuario);
        mostrarInfoMascota(mascotas);
        presentarInfo(toggles, 'd-none');
    }
}


//La función de validar se aprovecha del tipo de return que hace el método find (el objeto si lo encuentra, o undefined si no encuentra ninguno que cumpla con la condición)
function validateUser(usersDB, user, pass) {
    let isFound = usersDB.find((userDB) => userDB.mail == user);

    //console.log('Usuario encontrado por validate '+ typeof isFound);
    //ME OLVIDE DE PREGUNTAR POR EL TYPEOF!!! 
    if (typeof isFound === 'undefined') {
        return 'Usuario y/o contraseña incorrectos A' //En realidad, sabemos que significa que el usuario no existe, pero no vamos a dar información extra a posibles estafadores
    } else {
        //si estoy en este punto, quiere decir que el mail existe, sólo queda comparar la contraseña
        if (isFound.pass != pass) {
            return 'Usuario y/o contraseña incorrectos B'
        } else {
            return isFound;
        }
    }
}


btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    //Validamos que ambos campos estén completos
    if (!mailLogin.value || !passLogin.value) {
        alert('Todos los campos son requeridos');
    } else {
        //revisamos si el return de la función validate es un objeto o un string. Si es un objeto, fue una validación exitosa y usamos los datos. Si no, usamos los strings para mostrarle al usuario eso en un alert
        let data = validateUser(usuarios, mailLogin.value, passLogin.value);

        if (typeof data === 'string') {
            alert(`No pudimos validar el login 
            ${data}`)
        } else {

            //revisamos si elige persistir la info aunque se cierre el navegador o no
            if (recordar.checked) {
                guardarDatos(data, 'localStorage');
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, 'sessionStorage');
                saludar(recuperarUsuario(sessionStorage));
            }
            //recién ahora cierro el cuadrito de login
            modal.hide();
            //muestro la info para usuarios logueados
            mostrarInfoMascota(mascotas);
            presentarInfo(toggles, 'd-none');
        }

    }


});

btnLogout.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(toggles, 'd-none');
});

isLogged(recuperarUsuario(localStorage));
