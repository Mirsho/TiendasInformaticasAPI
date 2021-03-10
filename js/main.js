//Link al repositorio en GitHub:
//  https://github.com/Mirsho/TiendasInformaticasAPI

//const baseURL = 'http://localhost:8080/EmprInfRs_PereraAdrian/webresources/tienda'
const inmaURL = 'https://webapp-210130211157.azurewebsites.net/webresources/mitienda/';

const spinner = document.getElementById('spinner');
const loadingScreen = document.getElementById('loading-screen');
const addSearch = document.getElementById('add-search');
const options = document.getElementById('opciones');
let selectedConnection = '';

//----------------BOTÓNES CONEXIÓN---------------//

window.addEventListener('load', () => {
  let buttons = document.getElementById('buttons').getElementsByTagName('button');
  let connectionType = null;
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      if (this !== connectionType) {
        connectionType = this;
        switchConnection(connectionType.value, inmaURL);
      }
      console.log(this.value)
    });
  }
});

/**
 * Ejecuta las llamadas a las funciones de la conexión seleccionada.
 * @param {String} type - Tipo de conexión marcada en el formulario de botones radio.
 */
function switchConnection(type, url) {
  options.style.display = 'none';
  switch (type) {
    case "xhr": selectedConnection = 'xhr';
      peticionXML(url);
      break;
    case "fetch": {
      selectedConnection = 'fetch';
      peticionFetch(url)
        .then(response => response)
        .then(data => {
          displayAddSearch();
          let tiendas = JSON.parse(data);
          tiendas.forEach(tienda => generarTemplate(tienda, '#shopCard', '#lista'));
        })
        .finally(() => {
          hideSpinner();
          console.log("Terminado.");
        })
        .catch(error => {
          displayError(error);
          options.style.display = 'inline';
        });
      break;
    }
    case "jquery": selectedConnection = 'jquery';
      peticionJQuery(url, 'GET');
      break;
    default: console.log('Seleccione un tipo de conexión.');
  }
}

/**
 *Establece una primera conexión de tipo XMLHttp con la Dog API para obtener la lista de razas.
 *
 * @param {String} url - Ruta de acceso a la Dog API
 */
function peticionXML(url) {
  let conection = new XMLHttpRequest();
  conection.onreadystatechange = procesarEventos;
  conection.open('GET', url, true);
  conection.send();

  /**
   *Procesa los eventos de la conexión XML
   *
   */
  function procesarEventos() {
    if (conection.readyState == 4) {
      if (conection.status == 200) {
        let tiendas = JSON.parse(conection.responseText);
        console.log(tiendas);
        //spinner.hide();
        hideSpinner();
        displayAddSearch();
        tiendas.forEach(tienda => generarTemplate(tienda, '#shopCard', '#lista'));
      }
      else {
        hideSpinner();
        displayError(conection.statusText);
        options.style.display = 'block';
      }
    } else if (conection.readyState == 1 || conection.readyState == 2 || conection.readyState == 3) {
      console.log('Procesando...');
      displaySpinner();
      //spinner.show();
    }
  }
}

/**
 * JQUERY - Conexión con API mediante Jquery
 * @param {String} path - URL de la API a la que nos queremos conectar mediante el métod JQuery
 */
function peticionJQuery(path, requestType) {
  $.ajax({
    url: path, //URL de la petición
    data: {}, //información a enviar, puede ser una cadena
    type: requestType, //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    beforeSend: () => {
      //spinner.show();
      displaySpinner();
    },
    success: function (json) { //función a ejecutar si es satisfactoria 
      displayAddSearch();
      console.log(json);
      json.forEach(tienda => generarTemplate(tienda, '#shopCard', '#lista'));
    }, error: function (jqXHR, status, error) { //función error 
      displayError(error);
      options.style.display = 'block';
      console.log(jqXHR);
      console.log(status);
    }, finally: function () {
      //Función a ejecutar sin importar si la petición falló o no.
      //La aprovechamos para ocultar el spinner en cualquier caso.
      hideSpinner();
    },
    complete: function (jqXHR, status) {
      hideSpinner();
      console.log('Petición realizada');
      console.log(jqXHR);
      console.log(status);
    }
  });
}

/**
 * FETCH - Función asíncrona para realizar peticiones fetch. 
 * @param {*} url 
 */
const peticionFetch = async (url) => {
  displaySpinner();
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("WARN", response.status);
  const data = await response.text();
  return data;
}

//----------------BOTÓN BÚSQUEDA---------------//

const searchButton = document.getElementById('buscarTienda');
searchButton.addEventListener('click', () => {
  let inputValue = document.getElementById("shopId").value;
  console.log(inputValue);
  let searchURL = inmaURL.concat(inputValue);
  console.log(searchURL);
  switchSearch(selectedConnection, searchURL);
});

/**
 * Ejecuta las llamadas a las funciones de la conexión seleccionada.
 * @param {String} type - Tipo de conexión marcada en el formulario de botones radio.
 */
function switchSearch(type, url) {
  switch (type) {
    case "xhr": searchXML(url);
      break;
    case "fetch": {
      searchFetch(url)
        .then(response => response)
        .then(data => {
          let tienda = JSON.parse(data);
          clearNodes(document.getElementById('lista'));
          generarTemplate(tienda, '#shopCard', '#lista');
          searchButton.firstChild.setAttribute('class', 'fa fa-times');
        })
        .finally(() => {
          hideSpinner();
          console.log("Terminado.");
        })
        .catch(error => {
          displayError(error);
        });
      break;
    }
    case "jquery": searchJQuery(url, 'GET');
      break;
    default: console.log('Seleccione un tipo de conexión.');
  }
}

/**
 *Establece una primera conexión de tipo XMLHttp con la Dog API para obtener la lista de razas.
 *
 * @param {String} url - Ruta de acceso a la Dog API
 */
function searchXML(url) {
  let conection = new XMLHttpRequest();
  conection.onreadystatechange = procesarEventos;
  conection.open('GET', url, true);
  conection.send();

  /**
   *Procesa los eventos de la conexión XML
   *
   */
  function procesarEventos() {
    if (conection.readyState == 4) {
      if (conection.status == 200) {
        clearNodes(document.getElementById('lista'));
        let tienda = JSON.parse(conection.responseText);
        console.log(tienda);
        //spinner.hide();
        hideSearchSpinner();
        generarTemplate(tienda, '#shopCard', '#lista');
        searchButton.firstChild.setAttribute('class', 'fa fa-times');
      }
      else {
        hideSearchSpinner();
        displayError(conection.statusText);
      }
    } else if (conection.readyState == 1 || conection.readyState == 2 || conection.readyState == 3) {
      console.log('Procesando...');
      displaySearchSpinner();
      //spinner.show();
    }
  }
}

/**
 * JQUERY - Conexión con API mediante Jquery
 * @param {String} path - URL de la API a la que nos queremos conectar mediante el métod JQuery
 */
function searchJQuery(path, requestType) {
  $.ajax({
    url: path, //URL de la petición
    data: {}, //información a enviar, puede ser una cadena
    type: requestType, //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    beforeSend: () => {
      //spinner.show();
      displaySearchSpinner();
    },
    success: function (json) { //función a ejecutar si es satisfactoria 
      clearNodes(document.getElementById('lista'));
      generarTemplate(json, '#shopCard', '#lista');
      searchButton.firstChild.setAttribute('class', 'fa fa-times');
    }, error: function (jqXHR, status, error) { //función error 
      displayError(error);
      console.log(jqXHR);
      console.log(status);
    }, finally: function () {
      //Función a ejecutar sin importar si la petición falló o no.
      //La aprovechamos para ocultar el spinner en cualquier caso.
      hideSearchSpinner();
    },
    complete: function (jqXHR, status) {
      hideSearchSpinner();
      console.log('Petición realizada');
      console.log(jqXHR);
      console.log(status);
    }
  });
}

/**
 * FETCH - Función asíncrona para realizar peticiones fetch. 
 * @param {*} url 
 */
const searchFetch = async (url) => {
  displaySearchSpinner();
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("WARN", response.status);
  const data = await response.text();
  return data;
}

//----------------AÑADIR TIENDA---------------//

//!Poner validación del formulario y añadirle un evento (al formulario) que haga con event.preventDefault();

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
    switchInsert(selectedConnection, inmaURL, newShop);
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

/**
 * Ejecuta las llamadas a las funciones de la conexión seleccionada.
 * @param {String} type - Tipo de conexión marcada en el formulario de botones radio.
 */
function switchInsert(type, url, object) {
  switch (type) {
    case "xhr": insertXML(url, object);
      break;
    case "fetch": {
      insertFetch(url, object)
        .then(response => response)
        .then(data => {
          console.log(data);
        })
        .finally(() => {
          hideSpinner();
          console.log("Terminado.");
          switchConnection(selectedConnection, inmaURL);
        })
        .catch(error => {
          displayError(error);
        });
      break;
    }
    case "jquery": insertJQuery(url, 'POST', object);
      break;
    default: console.log('Seleccione un tipo de conexión.');
  }
}

/**
 *Establece una primera conexión de tipo XMLHttp con la Dog API para obtener la lista de razas.
 *
 * @param {String} url - Ruta de acceso a la Dog API
 */
function insertXML(url, data) {
  let conection = new XMLHttpRequest();
  conection.onreadystatechange = procesarEventos;
  conection.open('POST', url, true);
  conection.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  conection.send(JSON.stringify(data));

  /**
   *Procesa los eventos de la conexión XML
   *
   */
  function procesarEventos() {
    if (conection.readyState == 4) {
      if (conection.status == 200) {
        clearNodes(document.getElementById('lista'));
        let respuesta = conection.responseText;
        console.log(respuesta);
        //spinner.hide();
        hideSearchSpinner();
        switchConnection(selectedConnection, inmaURL);
      }
      else {
        hideSearchSpinner();
        displayError(conection.statusText);
        switchConnection(selectedConnection, inmaURL);
      }
    } else if (conection.readyState == 1 || conection.readyState == 2 || conection.readyState == 3) {
      console.log('Procesando...');
      displaySearchSpinner();
      //spinner.show();
    }
  }
}

/**
 * JQUERY - Conexión con API mediante Jquery
 * @param {String} path - URL de la API a la que nos queremos conectar mediante el métod JQuery
 */
function insertJQuery(path, requestType, data) {
  $.ajax({
    url: path, //URL de la petición
    data: JSON.stringify(data), //información a enviar, puede ser una cadena u objeto {}
    type: requestType, //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    contentType: 'application/json',
    beforeSend: () => {
      //spinner.show();
      displaySpinner();
    },
    success: function (json) { //función a ejecutar si es satisfactoria 
      console.log(json);
      peticionJQuery(inmaURL, 'GET');
    }, error: function (jqXHR, status, error) { //función error 
      displayError(error);
      console.log(jqXHR);
      console.log(status);
    }, finally: function () {
      //Función a ejecutar sin importar si la petición falló o no.
      //La aprovechamos para ocultar el spinner en cualquier caso.
      hideSearchSpinner();
    },
    complete: function (jqXHR, status) {
      hideSearchSpinner();
      console.log('Petición realizada');
      console.log(jqXHR);
      console.log(status);
    }
  });
}

/**
 * FETCH - Función asíncrona para realizar peticiones fetch. 
 * @param {*} url 
 */
const insertFetch = async (url, data) => {
  displaySearchSpinner();
  const response = await fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok)
    throw new Error("WARN", response.status);
  const message = await response.text();
  return message;
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

function displaySpinner() {
  loadingScreen.style.display = 'inline';
  spinner.style.display = 'inline-block';
}

function displaySearchSpinner() {
  searchButton.firstChild.style.display = 'none';
  searchButton.appendChild(spinner);
  spinner.style.display = 'inline-block';
}

function hideSpinner() {
  loadingScreen.style.display = 'none';
  spinner.style.display = 'none';
}

function hideSearchSpinner() {
  spinner.style.display = 'none';
  searchButton.firstChild.style.display = 'inline';
}

function displayError(error) {
  alert('Ocurrió un error al obtener los datos.');
  console.error(error);

}

function displayAddSearch() {
  addSearch.style.display = 'inline';
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