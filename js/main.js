//const baseURL = 'http://localhost:8080/EmprInfRs_PereraAdrian/webresources/tienda'
const inmaURL = 'https://webapp-210130211157.azurewebsites.net/webresources/mitienda/';

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

function collapseForm() {
  //Crear efecto de transición en el despliegue
  let x = document.getElementById("newShop");
  if (x.style.display === "none") {
    x.style.display = "flex";
  }
}

/**
 * Ejecuta las llamadas a las funciones de la conexión seleccionada.
 * @param {String} type - Tipo de conexión marcada en el formulario de botones radio.
 */
function switchConnection(type, url) {
  clearNodes(document.getElementById('lista'));
  switch (type) {
    case "xhr": peticionXML(url);
      break;
    case "fetch": {
      peticionFetch(url)
        .then(response => JSON.parse(response))
        .then(data => {
          let listaTiendas = Object.keys(data.message);
          console.log(listaTiendas);
          listaTiendas.forEach(tienda => generarTemplate(tienda, 'lista', 'shopCard'));
        })
        .finally(() => console.log("Terminado."))
        .catch(error => console.error(error));
      break;
    }
    case "jquery": peticionJQuery(url, 'list');
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
      }
      else {
        //!Ocultar spinner si lo hubiera
        alert(conection.statusText);
      }
    } else if (conection.readyState == 1 || conection.readyState == 2 || conection.readyState == 3) {
      console.log('Procesando...');
    }
  }
}

peticionXML(inmaURL);

peticionJQuery(inmaURL);

/**
 * JQUERY - Conexión con API mediante Jquery
 * @param {String} path - URL de la API a la que nos queremos conectar mediante el métod JQuery
 */
function peticionJQuery(path, resourceType) {
  $.ajax({
    url: path, //URL de la petición
    data: {}, //información a enviar, puede ser una cadena
    type: 'GET', //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    success: function (json) { //función a ejecutar si es satisfactoria 
      console.log(json);
      json.forEach(tienda => generarTemplate(tienda, '#shopCard', '#lista'));
    }, error: function (jqXHR, status, error) { //función error 
      alert('Disculpe, existió un problema. Vuelva a intentarlo.');
    }, finally: function () { },
    // función a ejecutar sin importar si la petición falló o no 
    complete: function (jqXHR, status) { console.log('Petición realizada'); }
  });
}

/**
 * FETCH - Función asíncrona para realizar peticiones fetch. 
 * @param {*} url 
 */
const peticionFetch = async (url) => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("WARN", response.status);
  const data = await response.text();
  //console.log(data);
  return data;
}

peticionFetch(inmaURL)
  .then(result => result)
  .then(data => console.log(JSON.parse(data)))
  .finally(() => console.log("Terminado."))
  .catch(error => console.error(error));

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