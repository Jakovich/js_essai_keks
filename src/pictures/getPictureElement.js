'use strict';
let filterBlock = document.querySelector('.filters');
let gallery = require('../gallery')
let templateElement = document.querySelector('#picture-template');
  if (!(filterBlock.classList.contains('invisible'))) {
    filterBlock.classList.add('invisible');
  }
  
let elementToClone = ('content' in templateElement) ? templateElement.content.querySelector('.picture') : templateElement.querySelector('.picture');
  
  
  
  /**
  * @param {Object} data
  * @param {HTMLElement} container
  * @return {HTMLElement}
 */
  
  let getPictureElement = (data, container, picturesArr) => {
    let element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    
    let pictureItem = new Image();
    
    let imageLoadTimeout = setTimeout(function() {
      pictureItem.src = '';
      element.classList.add('picture-load-failure');
    }, 10000);
    
    pictureItem.onload = () => {
      clearTimeout(imageLoadTimeout);
      let pictureElement = element.querySelector('img');
      pictureElement.src = pictureItem.src;
      pictureElement.width = 182;
      pictureElement.height = 182;
    };
    
    pictureItem.onerror = () => element.classList.add('picture-load-failure');
    
    pictureItem.src = data.url;
    
    container.appendChild(element);
    
    element.addEventListener('click', function(evt) {
      evt.preventDefault();
      console.log(picturesArr.indexOf(data))
      gallery.showGallery(picturesArr.indexOf(data));
      
    });
    return element;
  };

module.exports = getPictureElement;