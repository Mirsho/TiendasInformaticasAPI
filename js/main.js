const baseURL = 'http://localhost:8080/EmprInfRs_PereraAdrian/webresources/tienda'

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

/**
 * Crea y añade nodos al documento HTML en base a los datos del objeto recibido, ya sea utilizando HTML templates o la función crearNodo(), 
 * cuando el navegador no sea compatible con las templates.
 *
 * @param {Object} objeto - Objeto con los datos que queremos renderizar en el DOM.
 * @param {*} containerID - ID del contenedor donde ubicaremos los nodos generados con templates.
 * @param {*} templateTag - Etiqueta HTML de la template que queremos utilizar.
 * @param {*} tagID - ID del elemento del contenedor en el que insertamos el nodo.
 */
function generarTemplate(objeto, containerID, templateTag, tagID) {
  //Clonado de nodos:
  // Comprobar si el navegador soporta el elemento HTML template element chequeando
  // si tiene el atributo 'content'
  if ('content' in document.createElement('template')) {
    // Instanciar el elemento HTML
    // y su contenido con el template
    var container = document.querySelector(containerID),
      opcion = container.content.querySelectorAll(templateTag);
    opcion[0].setAttribute("Value", objeto)
    opcion[0].textContent = objeto;

    // Clonar el nuevo objeto e insertarlo en la lista
    var listaObjetos = document.querySelector(tagID);
    var clone = document.importNode(container.content, true);
    listaObjetos.appendChild(clone);
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
 *Establece una primera conexión de tipo XMLHttp con la Dog API para obtener la lista de razas.
 *
 * @param {String} url - Ruta de acceso a la Dog API
 */
function peticionXHR(url) {
  let dogexion = new XMLHttpRequest();
  dogexion.onreadystatechange = procesarEventos;
  dogexion.open('GET', url, true);
  dogexion.send();

  /**
   *Procesa los eventos de la conexión XML
   *
   */
  function procesarEventos() {
    if (dogexion.readyState == 4) {
      if (dogexion.status == 200) {
        let dogBreeds = JSON.parse(dogexion.responseText);
        let breeds = Object.keys(dogBreeds.message);
        console.log(breeds);
        let firstDog = breeds[0]; //Asignar el atributo selected
        breeds.forEach(dog => listarPerros(dog));
        dogPhoto(firstDog);
      }
      else {
        alert(dogexion.statusText);
      }
    } else if (dogexion.readyState == 1 || dogexion.readyState == 2 || dogexion.readyState == 3) {
      console.log('Procesando...');
    }
  }
}

peticionXHR(baseURL);

function peticionJQuery(path) {
  $.ajax({
    url: path, //URL de la petición
    data: { id: 123 }, //información a enviar, puede ser una cadena
    type: 'GET', //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    success: function (json) { //función a ejecutar si es satisfactoria 
      $('<h1/>').text(json.title).appendTo('body'); $('<div class="content"/>').html(json.html).appendTo('body');
    }, error: function (jqXHR, status, error) { //función error 
      alert('Disculpe, existió un problema');
    }, // función a ejecutar sin importar si la petición falló o no 
    complete: function (jqXHR, status) { alert('Petición realizada'); }
  });
}

const jsonJQuery = peticionJQuery(baseURL);
console.log(jsonJQuery);

const peticionFetch = async (url) => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("WARN", response.status);
  const data = await response.text();
  return data;
}

const jsonFecth = peticionFetch(baseURL);
console.log(jsonFecth);

/* Implementación con promesas */
//Ejemplo MANZ
const doTask = (iterations) => new Promise((resolve, reject) => {
  const numbers = [];
  for (let i = 0; i < iterations; i++) {
    const number = 1 + Math.floor(Math.random() * 6);
    numbers.push(number);
    if (number === 6) {
      reject({
        error: true,
        message: "Se ha sacado un 6"
      });
    }
  }
  resolve({
    error: false,
    value: numbers
  });
});