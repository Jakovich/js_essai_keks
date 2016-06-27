/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  
  let browserCookies = require('browser-cookies');
  
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    return true;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
          checkValid();
        };
        
        

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };
  
  /**
  @type {Element}
  */
  let filterChoice = filterForm['upload-filter'];
  
  filterChoice.value = browserCookies.get('filter') || '';
  
  filterMap = {
    'none': 'filter-none',
    'chrome': 'filter-chrome',
    'sepia': 'filter-sepia'
  };
  
  filterImage.className = 'filter-image-preview ' + filterMap[filterChoice.value];
  
  /**
    функция установки даты жизни cookies - количество дней, прошедших с дня рождения (06.03)
    @return {number}
  */
  
  let setTimeofExpires = () => {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let birthDate = (currentDate <= new Date(currentYear, 2, 6)) ? new Date(currentYear - 1, 2, 6) : new Date(currentYear, 2, 6);
    let expireDateMilisec = currentDate - birthDate;
    let expireDate = Math.floor(expireDateMilisec / 3600 / 24 / 1000);
    return expireDate;
  };
  

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    
    /**
    @type {number}
    */
    let expireDateValue = setTimeofExpires ();
    /**
      запись в cookies последнего выбранного значения
    */
    browserCookies.set('filter', filterChoice.value, {
      expires: expireDateValue
    });
  };
  

  //валидация формы
  
  /**
  @type {Element}
  */
  let resizeX = resizeForm['x'];
  
  /**
  @type {Element}
  */
  let resizeY = resizeForm['y'];
  
  /**
  @type {Element}
  */
  let resizeSize = resizeForm['size'];
  
  /**
  @type {Element}
  */
  let submitButton = resizeForm.querySelector('#resize-fwd');
  
  /**
   *Обрабочики изменения значения полей формы
  */
  resizeX.oninput = function() {
    checkValid();
   };
  
  resizeY.oninput = function() {
    checkValid();
  };
  
  resizeSize.oninput = function() {
    checkValid();
  };
  
  /**
   *Функция проверки валидности полей формы и добавления атрибута disabled
   *конпке отправки форма и вывода сообщения об ошибки
  */
  let checkValid = () => {
    /**
      @type {number}
    */
    let valueX = parseInt(resizeX.value, 10);
    /**
      @type {number}
    */
    let valueY = parseInt(resizeY.value, 10);
    /**
      @type {number}
    */
    let valueSize = parseInt(resizeSize.value, 10);  
    if (validCondition(valueX, valueY, valueSize)) {
      submitButton.removeAttribute('disabled');
      if (resizeForm.lastChild.className === 'error') {
        resizeForm.removeChild(resizeForm.lastChild);
      }
    } else {
      submitButton.setAttribute('disabled', true);
      if (!(resizeForm.lastChild.className === 'error')) {
        errorMsg();
      }
    }
  };
  
  /**
   *функция проверки условий валидности
   @parametr {number} val1
   @parametr {number} val2
   @parametr {number} val3
   @return {boolean}
  */
  let validCondition = (val1, val2, val3) => val1 >= 0 && val2 >= 0 && (val1 + val3) <= currentResizer._image.naturalWidth && (val2 + val3) <= currentResizer._image.naturalHeight;
  
  /**
   *функция формирования сообщения об ошибки
  */
  
  let errorMsg = () => {
    var msg = document.createElement('span');
    msg.style.display = 'block';
    msg.style.color = 'red';
    msg.style.position = 'absolute';
    msg.style.left = '100px';
    msg.style.bottom = '0px';
    msg.style.zIndex = '100';
    msg.innerHTML = '«кадр» должен находиться в пределах исходного изображения';
    msg.className = 'error';
    resizeForm.appendChild(msg);
  };
  
  
  
  cleanupResizer();
  updateBackground();
})();
