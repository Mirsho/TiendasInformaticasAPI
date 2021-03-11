//---------------GET METHODS---------------//

/**
 *Establece una primera conexión de tipo XMLHttp con la API para obtener la lista de razas.
 *
 * @param {String} url - Ruta de acceso a la Dog API
 */
export function getXHR(url) {
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
        let json = JSON.parse(conection.responseText);
        console.log(json);
        return json;
      }
      else {
        return null;
      }
    } else if (conection.readyState == 1 || conection.readyState == 2 || conection.readyState == 3) {
      console.log('Procesando...');
    }
  }
}

/**
 * JQUERY - Conexión con API mediante Jquery
 * @param {String} path - URL de la API a la que nos queremos conectar mediante el métod JQuery
 */
export function getJQuery(url) {
  $.ajax({
    url: url, //URL de la petición
    data: {}, //información a enviar, puede ser una cadena
    type: 'GET', //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    beforeSend: () => {
    },
    success: (json) => { //función a ejecutar si es satisfactoria 
      return json;
    }, error: function (jqXHR, status, error) { //función error 
      console.log(jqXHR);
      console.log(status);
      console.log(error);
      return null;
    }, finally: function () {
    },
    complete: function (jqXHR, status) {
      console.log('Petición realizada');
      console.log(jqXHR);
      console.log(status);
    }
  });
}

/**
 * FETCH - Función asíncrona para realizar peticiones fetch.  
 */
export async function getFetch(url) {
  return await fetch(url)
    .then(response => response)
    .then(data => JSON.parse(data))
    .finally(() => {
      console.log("Terminado.");
    })
    .catch(error => {
      console.log(error);
      return null;
    });
}

//----------------POST METHODS---------------//

/**
 *Establece una primera conexión de tipo XMLHttp con la API para obtener la lista de razas.
 *
 * @param {String} url - Ruta de acceso a la Dog API
 */
export function postXHR(url, data) {
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
        let successMessage = JSON.parse(conection.responseText);
        console.log(successMessage);
        return successMessage;
      }
      else {
        //!Mensajes de error
        return null;
      }
    } else if (conection.readyState == 1 || conection.readyState == 2 || conection.readyState == 3) {
      console.log('Procesando...');
    }
  }
}

/**
 * JQUERY - Conexión con API mediante Jquery
 * @param {String} path - URL de la API a la que nos queremos conectar mediante el métod JQuery
 */
export function postJQuery(url, data) {
  $.ajax({
    url: url, //URL de la petición
    data: JSON.stringify(data), //información a enviar, puede ser una cadena u objeto {}
    type: 'POST', //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    contentType: 'application/json',
    beforeSend: () => {
    },
    success: (message) => { //función a ejecutar si es satisfactoria 
      return message;
    }, error: function (jqXHR, status, error) { //función error 
      console.log(jqXHR);
      console.log(status);
      console.log(error);
      return null;
    }, finally: function () {
    },
    complete: function (jqXHR, status) {
      console.log('Petición realizada');
      console.log(jqXHR);
      console.log(status);
    }
  });
}

/**
 * FETCH - Función asíncrona para realizar peticiones fetch.  
 */
export async function postFetch(url, data) {
  return await fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response)
    .then(data => {
      //!Mensaje éxito
      return JSON.parse(data)
    })
    .finally(() => {
      console.log("Terminado.");
    })
    .catch(error => {
      console.log(error);
      return null;
    });
}