(function (global) {

  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  // STEP 0: переменная для случайной категории
  var randomCategoryShortName;

  // Вспомогательные функции
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // STEP 1: получаем список категорий и выбираем случайную
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    function (categories) {
      var randomIndex = Math.floor(Math.random() * categories.length);
      randomCategoryShortName = categories[randomIndex].short_name;
    }
  );

  // Загружаем главную страницу
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (responseText) {
        // STEP 2: подставляем случайную категорию в home-snippet
        responseText = insertProperty(responseText, "randomCategoryShortName", "'" + randomCategoryShortName + "'");
        insertHtml("#main-content", responseText);
      },
      false
    );
  });

  // Загружаем меню по категории
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML
    );
  };

  function buildAndShowMenuItemsHTML (menuItems) {
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            var finalHtml = menuItemsTitleHtml;
            finalHtml += buildMenuItemsViewHtml(menuItems, menuItemHtml);
            insertHtml("#main-content", finalHtml);
          },
          false
        );
      },
      false
    );
  }

  function buildMenuItemsViewHtml (menuItems, menuItemHtml) {
    var finalHtml = "";
    for (var i = 0; i < menuItems.menu_items.length; i++) {
      var html = menuItemHtml;
      html = insertProperty(html, "name", menuItems.menu_items[i].name);
      html = insertProperty(html, "description", menuItems.menu_items[i].description);
      finalHtml += html;
    }
    return finalHtml;
  }

  global.$dc = dc;

})(window);
