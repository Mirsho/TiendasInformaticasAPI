//Link al repositorio en GitHub:
//  https://github.com/Mirsho/TiendasInformaticasAPI

import * as ajax from "./ajaxrequests.js";

//const baseURL = 'http://localhost:8080/EmprInfRs_PereraAdrian/webresources/tienda'
const inmaURL = 'https://webapp-210130211157.azurewebsites.net/webresources/mitienda/';

const options = document.getElementById('opciones');
const spinner = document.getElementById('spinner');
const searchButton = document.getElementById('buscarTienda');
const loadingScreen = document.getElementById('loading-screen');
const addSearch = document.getElementById('add-search');
let selectedConnection = '';

//!Por cada metodo consulta, 1 get y 1 post
//6 methods 3 y 3, solo devuleven los datos.
//Si hay error, devolver null.
//3 funciones para lo necesario: sacar la lista de tiendas, buscarla e insertar. Los switdh deben estar en estos métodos, que comprueben la variable del método de consulta y que haga las llamadas a funciones correspondientes y la URL que le corresponda (ej: concatenando el ID).
//En los get devuelve objeto, en el Post un mensaje de exito-error, o un boolean, etc.
//Con todo esto gestionar la parte del dom.
//Funciones concisas.

//----------------BOTÓNES CONEXIÓN---------------//

window.addEventListener('load', () => {
  let buttons = document.getElementById('buttons').getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (event) {
      selectedConnection = event.target.value;
      listShops();
      console.log(this.value)
    });
  }
});

//----------------LISTAR TIENDAS---------------//

let listaTiendas;
async function listShops() {
  displaySpinner();
  switch (selectedConnection) {
    case "xhr": listaTiendas = ajax.getXHR(inmaURL);
      break;
    case "fetch": listaTiendas = await ajax.getFetch(inmaURL);
      break;
    case "jquery": listaTiendas = ajax.getJQuery(inmaURL);
      break;
    default: console.log('Seleccione un tipo de conexión.');
  }
  if (listaTiendas) {
    clearNodes(document.getElementById('lista'));
    listaTiendas.forEach(tienda => generarTemplate(tienda, '#shopCard', '#lista'));
    displayAddSearch();
    hideSpinner();
    options.style.display = 'none';
  } else {
    hideSpinner();
    options.style.display = 'inline';
  }
}

//----------------BOTÓN BÚSQUEDA---------------//

searchButton.addEventListener('click', () => {
  let inputValue = document.getElementById("shopId").value;
  console.log(inputValue);
  let searchURL = inmaURL.concat(inputValue);
  console.log(searchURL);
  searchShop(searchURL);
});

//----------------BUSCAR TIENDA---------------//

let tienda;
/**
 * Ejecuta las llamadas a las funciones de la conexión seleccionada.
 * @param {String} type - Tipo de conexión marcada en el formulario de botones radio.
 */
async function searchShop(url) {
  displaySearchSpinner();
  switch (selectedConnection) {
    case "xhr": tienda = ajax.getXHR(url);
      break;
    case "fetch": tienda = await ajax.getFetch(url);
      break;
    case "jquery": tienda = ajax.getJQuery(url);
      break;
    default: console.log('Seleccione un tipo de conexión.');
  }
  if (tienda) {
    clearNodes(document.getElementById('lista'));
    generarTemplate(tienda, '#shopCard', '#lista');
    searchButton.firstChild.setAttribute('class', 'fa fa-times');
    hideSearchSpinner();
  } else {
    hideSearchSpinner();
    searchButton.firstChild.setAttribute('class', 'fa fa-times');
  }
}

//-----------VALIDACIONES FORMULARIO AÑADIR TIENDA----------//

const name = document.getElementById('name');
/**
 * Gestiona la validación del nombre, lanzando y asignando la clase de error correspondiente en caso de que no cumpla los requisitos.
 */
function validarNombre() {
  const errorZone = name.nextElementSibling;
  name.classList.remove('correctoInput');
  name.classList.remove('errorInput');
  errorZone.textContent = "";
  if (name.validity.valueMissing) {
    name.classList.add('errorInput');
    errorZone.textContent = "Este campo es obligatorio.";
  } else if (name.validity.patternMismatch) {
    name.classList.add('errorInput');
    errorZone.textContent = "No cumple con los requisitos, debe empezar por mayúscula, pruebe otra vez.";
  } else {
    name.classList.add('correctoInput');
  }
}
name.addEventListener('input', validarNombre);

const localidad = document.getElementById('location');
/**
 * Gestiona la validación de la Localidad, lanzando y asignando la clase de error correspondiente en caso de que no cumpla los requisitos.
 */
function validarLocalidad() {
  const errorZone = localidad.nextElementSibling;
  localidad.classList.remove('correctoInput');
  localidad.classList.remove('errorInput');
  errorZone.textContent = "";
  if (localidad.validity.valueMissing) {
    localidad.classList.add('errorInput');
    errorZone.textContent = "Este campo es obligatorio.";
  } else if (localidad.validity.patternMismatch) {
    localidad.classList.add('errorInput');
    errorZone.textContent = "No cumple con los requisitos, debe empezar por mayúscula, pruebe otra vez.";
  } else {
    localidad.classList.add('correctoInput');
  }
}
localidad.addEventListener('input', validarLocalidad);

const address = document.getElementById('address');
/**
 * Gestiona la validación de la dirección, lanzando y asignando la clase de error correspondiente en caso de que no cumpla los requisitos.
 */
function validarDireccion() {
  const errorZone = address.nextElementSibling;
  address.classList.remove('correctoInput');
  address.classList.remove('errorInput');
  errorZone.textContent = "";
  if (address.validity.valueMissing) {
    address.classList.add('errorInput');
    errorZone.textContent = "Este campo es obligatorio.";
  } else if (address.validity.patternMismatch) {
    address.classList.add('errorInput');
    errorZone.textContent = "No cumple con los requisitos, debe empezar por mayúscula, pruebe otra vez. Se puede incluir el prefijo de direccion \"C/\"";
  } else {
    address.classList.add('correctoInput');
  }
}
address.addEventListener('input', validarDireccion);

const phoneNumber = document.getElementById('phone');
/**
 * Gestiona la validación de número de teléfono, lanzando y asignando la clase de error correspondiente en caso de que no cumpla los requisitos.
 */
function validatePhone() {
  const errorZone = phoneNumber.nextElementSibling;
  phoneNumber.classList.remove('correctoInput');
  phoneNumber.classList.remove('errorInput');
  errorZone.textContent = "";
  if (phoneNumber.validity.valueMissing) {
    phoneNumber.classList.add('errorInput');
    errorZone.textContent = "Este campo es obligatorio.";
  } else if (phoneNumber.validity.patternMismatch) {
    phoneNumber.classList.add('errorInput');
    errorZone.textContent = "El campo puede tener prefijo opcional y 9 cifras (Debe empezar por 6, 8 ó 9) Ejemplo: (+34)934321234 | 654345234";
  } else {
    phoneNumber.classList.add('correctoInput');
  }
}
phoneNumber.addEventListener('input', validatePhone);

const formulario = document.getElementsByTagName('form')[0];

formulario.addEventListener('submit', (e) => {

  const resultado = document.getElementById('lista');
  clearNodes(resultado);
  let fallo = 0;
  if (!name.validity.valid) {
    validarNombre();
    fallo++;
  }
  if (!localidad.validity.valid) {
    validarLocalidad();
    fallo++;
  }
  if (!address.validity.valid) {
    validarDireccion();
    fallo++;
  }
  if (!phoneNumber.validity.valid) {
    validatePhone();
    fallo++;
  }
  if (fallo == 0) {
    //getFormShop();
    let newShop = getFormShop();
    console.log(newShop);
    insertShop(newShop);
  } else {
    console.log(fallo);
  }
  e.preventDefault();
});

// const addButton = document.getElementById('addButton');
// addButton.addEventListener('click', () => {
//   let newShop = getFormShop();
//   console.log(newShop);
//   switchInsert(selectedConnection, inmaURL, newShop);
// });

function getFormShop() {
  let nameValue = document.getElementById("name").value;
  let locationValue = document.getElementById("location").value;
  let addressValue = document.getElementById("address").value;
  let phoneValue = document.getElementById("phone").value;
  let newShop = {
    "nombreTienda": nameValue,
    "direccion": addressValue,
    "localidad": locationValue,
    "telefono": phoneValue
  }
  console.log(newShop);
  return newShop;
}

//----------------INSERTAR TIENDA---------------//

let message;
/**
 * Ejecuta las llamadas a las funciones de la conexión seleccionada.
 * @param {String} type - Tipo de conexión marcada en el formulario de botones radio.
 */
async function insertShop(object) {
  displaySearchSpinner();
  switch (selectedConnection) {
    case "xhr": message = ajax.postXHR(inmaURL, object);
      break;
    case "fetch": message = await ajax.postFetch(inmaURL, object);
      break;
    case "jquery": message = ajax.postJQuery(inmaURL, object);
      break;
    default: console.log('Seleccione un tipo de conexión.');
  }
  if (message) {
    hideSearchSpinner();
    listShops();
  } else {
    hideSearchSpinner();
    searchButton.firstChild.setAttribute('class', 'fa fa-times');
  }
}

//----------------DISPLAY CALLS---------------//

function displaySpinner() {
  loadingScreen.style.display = 'inline';
  spinner.style.display = 'inline-block';
}

function hideSpinner() {
  loadingScreen.style.display = 'none';
  spinner.style.display = 'none';
}

function displayError(error) {
  alert('Ocurrió un error al obtener los datos.');
  console.error(error);

}

function displayAddSearch() {
  addSearch.style.display = 'inline';
}

function displaySearchSpinner() {
  searchButton.firstChild.style.display = 'none';
  searchButton.appendChild(spinner);
  spinner.style.display = 'inline-block';
}

function hideSearchSpinner() {
  spinner.style.display = 'none';
  searchButton.firstChild.style.display = 'inline';
}

/**
 *Elimina los nodos hijo del nodo inidcado, para eliminar la foto del perro.
 *
 * @param {*} myNode - Nodo cuyos hijos deseamos eliminar.
 */
function clearNodes(myNode) {
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }
}

/**
 * Crea y añade nodos al documento HTML en base a los datos del objeto recibido, ya sea utilizando HTML templates o la función crearNodo(), 
 * cuando el navegador no sea compatible con las templates.
 *
 * @param {Object} objeto - Objeto con los datos que queremos renderizar en el DOM.
 * @param {*} containerID - ID del contenedor donde ubicaremos los nodos generados con templates.
 * @param {*} templateTag - Etiqueta HTML de la template que queremos utilizar.
 */
function generarTemplate(objeto, templateTag, containerID) {
  //Clonado de nodos:
  // Comprobar si el navegador soporta el elemento HTML template element chequeando
  // si tiene el atributo 'content'
  if ('content' in document.createElement('template')) {
    // Instanciar el elemento HTML
    // y su contenido con el template
    let container = document.querySelector(templateTag);
    let elemento = container.content.querySelectorAll('div');
    elemento[0].setAttribute("id", objeto.idTienda);
    elemento[0].childNodes[1].textContent = objeto.nombreTienda;
    elemento[0].childNodes[3].textContent = objeto.direccion;
    elemento[0].childNodes[5].textContent = objeto.localidad;
    elemento[0].childNodes[7].textContent = objeto.telefono;

    let listaElementos = document.querySelector(containerID);
    var clone = document.importNode(container.content, true);
    listaElementos.appendChild(clone);
  }
  else {
    // Forma alternativa de añadir filas mediante DOM porque el
    // elemento template no está soportado por el navegador.
    //Creamos los nodos de perros
    let objNode = crearNodo("option", null, null, [], [{ 'value': objeto }]);
    objNode.appendChild(document.createTextNode(objeto));
    document.getElementById('objeto').appendChild(objNode);
  }
}

/**
 *Crea un nodo en el DOM con la etiqueta HTML y los atributos que queramos asignarle.
 *
 * @param {String} tagName - Nombre de la etiqueta HTML que deseamos crear.
 * @param {String} nodeText - Atributo texto del elemento HTML.
 * @param {String} nodeId - Atributo id del elemento HTML.
 * @param {Array} nodeClasses - Nombre de las clases en un array. Ejemplo: ['parchita', 'velo'] Resultado: class="parchita velo".
 * @param {Array} nodeAttributes - Array de clave-valor de los atributos adicionales a añadir. Ejemplo: [{name: 'parchita', key: 'velo'}, {name:'crazy', key:'wombat'}] Resultado: parchita="velo" crazy="wombat".
 * @return {*} - Nodo con la etiqueta y los atributos asignados.
 */
function crearNodo(tagName, nodeText, nodeId, nodeClasses, nodeAttributes) {
  let nodeElement = document.createElement(tagName);

  if (nodeText != null) {
    nodeElement.setAttribute("text", nodeText);
  }

  if (nodeId != null) {
    nodeElement.setAttribute("id", nodeId);
  }

  if (nodeClasses.length > 0) {
    nodeClasses.forEach(className => {
      nodeElement.classList.add(className);
    });
  }

  if (nodeAttributes.length > 0) {
    nodeAttributes.forEach(attribute => {
      nodeElement.setAttribute(attribute.name, attribute.value);
    });
  }

  return nodeElement;
}

var collapsible = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < collapsible.length; i++) {
  collapsible[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}