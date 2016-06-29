'use strict';

(function() {
  
  let filterBlock = document.querySelector('.filters');
  let templateElement = document.querySelector('#picture-template');
  let pictures = window.pictures;
  
  let picturesContainer = document.querySelector('.pictures');
  
  if (!(filterBlock.classList.contains('invisible'))) {
    filterBlock.classList.add('invisible');
  }
  
  let elementToClone = ('content' in templateElement) ? templateElement.content.querySelector('.picture') : templateElement.querySelector('.picture');
  
  
  
  /**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
  
  let getPictureElement = function({url, likes, comments}, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = comments;
    element.querySelector('.picture-likes').textContent = likes;
    
    let pictureItem = new Image();
    
    let imageLoadTimeout = setTimeout(function() {
      pictureItem.src = '';
      element.classList.add('picture-load-failure');
    }, 10000);
    
    pictureItem.onload = function() {
      clearTimeout(imageLoadTimeout);
      let pictureElement = element.querySelector('img');
      pictureElement.src = pictureItem.src;
      pictureElement.width = 182;
      pictureElement.height = 182;
    };
    
    pictureItem.onerror = function() {
      element.classList.add('picture-load-failure');
    }
    
    pictureItem.src = url;
    
    
    container.appendChild(element);
    return element;
  };
  
  let getJSONP = function(address = '//up.htmlacademy.ru/assets/js_intensive/jsonp/pictures.js', callback = 'window.__picturesLoadCallback') {
   
    let scriptFunct = document.createElement('script');
    scriptFunct.src = address;
    let currentScript = document.currentScript;
    document.body.insertBefore(scriptFunct, currentScript);
    scriptFunct.onload = function() {
      callback();
    }
  };
  
  window.__picturesLoadCallback = function(data) {
    var pictures = [];
    pictures = data;
    pictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };
  
  getJSONP();
  
  if (filterBlock.classList.contains('invisible')) {
    filterBlock.classList.remove('invisible');
  }
  
  
})();