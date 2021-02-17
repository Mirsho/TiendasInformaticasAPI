const baseURL = 'http://localhost:8080/EmprInfRs_PereraAdrian/webresources/tienda'
const inmaURL = 'https://webapp-210130211157.azurewebsites.net/webresources/mitienda/';

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