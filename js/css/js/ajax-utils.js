(function (global) {

  // Создаём объект для экспорта
  var ajaxUtils = {};

  // ------------------------------
  // Отправка GET-запроса
  // ------------------------------
  ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      handleResponse(request, responseHandler, isJsonResponse);
    };

    request.open("GET", requestUrl, true);
    request.send(null); // GET-запрос без тела
  };

  // ------------------------------
  // Обработка ответа
  // ------------------------------
  function handleResponse(request, responseHandler, isJsonResponse) {
    if ((request.readyState == 4) && (request.status == 200)) {
      if (isJsonResponse === undefined) {
        isJsonResponse = true; // по умолчанию считаем JSON
      }

      if (isJsonResponse) {
        responseHandler(JSON.parse(request.responseText));
      } else {
        responseHandler(request.responseText);
      }
    }
  }

  // Экспортируем в глобальную область
  global.$ajaxUtils = ajaxUtils;

})(window);
