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
  
  let getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    
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
    
    pictureItem.src = data.url;
    
    
    container.appendChild(element);
    return element;
  };
  
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
  
  if (filterBlock.classList.contains('invisible')) {
    filterBlock.classList.remove('invisible');
  }
  
  
})();