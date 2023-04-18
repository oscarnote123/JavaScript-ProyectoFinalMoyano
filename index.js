// Declaración de una constante "historialInscripciones" que obtiene su valor del local storage
const historialInscripciones = JSON.parse(localStorage.getItem("historialInscripciones")) || [];

// Función que muestra el historial de inscripciones en la página y actualiza en el local storage
function mostrarHistorialInscripciones() {
  const lista = document.querySelector("#historial");
  lista.innerHTML = "";

  historialInscripciones.forEach(inscripcion => {
    const item = document.createElement("li");
    item.textContent = `${inscripcion.nombre} ${inscripcion.apellido} - ${inscripcion.instrumento} - ${inscripcion.edad} años - ${inscripcion.fechaInicio}`;
    lista.appendChild(item);
  });

  localStorage.setItem("historialInscripciones", JSON.stringify(historialInscripciones));
}
// declaro constante mensaje
const mensaje = document.querySelector("#mensaje");
const formulario = document.querySelector("#formulario");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nombre = document.querySelector("#nombre").value;
  const apellido = document.querySelector("#apellido").value;
  const edad = parseInt(document.querySelector("#edad").value);
  const instrumento = document.querySelector("#instrumento").value;
  const fechaInicio = document.querySelector("#fechaInicio").value;


// Expresión regular para validar que el nombre y apellido contengan solo letras
const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  
// Validación del nombre y apellido con la expresión regular
if (!regexSoloLetras.test(nombre) || !regexSoloLetras.test(apellido)) {
  mensaje.textContent = "El nombre y el apellido solo pueden contener letras.";
  return;
}


  if (!instrumento) {
    mensaje.textContent = "Seleccione un instrumento.";
    return;
  }

  if (!fechaInicio) {
    mensaje.textContent = "Seleccione una fecha de inicio.";
    return;
  }

  const resultado = await inscribirseEnMusica(nombre, apellido, edad, instrumento, fechaInicio);
  mensaje.textContent = resultado;
});
// Función que calcula el precio total en función del instrumento y los días de reserva
function calcularPrecioTotal(instrumento, diasReserva) {
  let precio;
  switch (instrumento) {
    case 'saxo':
      precio = 10;
      break;
    case 'piano':
      precio = 15;
      break;
    case 'guitarra':
      precio = 12;
      break;
    case 'clarinete':
      precio = 8;
      break;
    default:
      precio = 0;
      break;
  }
  return precio * diasReserva;
}

//Función que se encarga de inscribir al usuario en la escuela de música 
async function inscribirseEnMusica(nombre, apellido, edad, instrumento, fechaInicio) {
  
  const fechaActual = new Date();
  const fechaInicioObj = new Date(fechaInicio);

  if (fechaInicioObj <= fechaActual) {
    return "La fecha de inicio debe ser posterior a la fecha actual.";
  }
    
  if (edad < 18) {
    return "Lo sentimos, debes ser mayor de edad para inscribirte.";
  } else {
    const diasReserva = Math.ceil((new Date(fechaInicio) - new Date()) / (1000 * 60 * 60 * 24));
    const precioTotal = calcularPrecioTotal(instrumento, diasReserva);
    const mensaje = `¡Felicidades ${nombre} ${apellido}! Te has inscripto en la escuela de música para tocar el ${instrumento}. El precio total de tu reserva es de ${precioTotal} dólares.`;
    const inscripcion = {
      nombre,
      apellido,
      edad,
      instrumento,
      fechaInicio,
    };
    historialInscripciones.push(inscripcion);
    mostrarHistorialInscripciones();

    await esperaAleatoria(); // Espera aleatoria simulando una operación asíncrona

    return mensaje;
  }    
}

function esperaAleatoria() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, Math.floor(Math.random() * 1000));
  });
}
function filtrarPorInstrumento(instrumento) {
  const historialElement = document.querySelector("#historial");
  historialElement.innerHTML = "";

  const inscripcionesFiltradas = historialInscripciones.filter(inscripcion => inscripcion.instrumento === instrumento);

  inscripcionesFiltradas.forEach(inscripcion => {
    const listItem = document.createElement("li");
    listItem.textContent = `${inscripcion.nombre} ${inscripcion.apellido} - ${inscripcion.instrumento}`;
    historialElement.appendChild(listItem);
  });
}


//borro todos los campos, tambien el historial de inscriptos
function borrarCampos() {
  document.querySelectorAll("input[type='text'], input[type='date']").forEach(input => input.value = "");
  document.querySelector("#edad").value = "";
  document.querySelector("#instrumento").value = "";
  document.querySelector("#duracion").value = "";
  document.querySelector("#mensaje").textContent = "";
  document.querySelector("#historial").textContent = "";
}

// API - clima
const API_KEY = 'e42257640a3e4908b7f54548231604';
const city = 'Mar del Plata';
const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const { temp_c, humidity } = data.current;
    console.log("La temperatura actual en " + city + " es " + temp_c + " y la humedad es " + humidity + ".");

  })
  .catch(error => console.error(error));

//Mostrar api al usuario

function mostrarDatosDeAPI(data) {
  const { temp_c, humidity } = data.current;
  const mensaje = document.getElementById('m_api');
  mensaje.textContent = `La temperatura actual en Mar del Plata es ${temp_c}°C con una humedad del ${humidity}%.`;
}

fetch(url)
  .then(response => response.json())
  .then(mostrarDatosDeAPI)
  .catch(error => console.error(error));
  
  //actualizo la API cada 15 segundos.
  setInterval(() => {
    fetch(url)
      .then(response => response.json())
      .then(mostrarDatosDeAPI)
      .catch(error => console.error(error));
  }, 15000);
  