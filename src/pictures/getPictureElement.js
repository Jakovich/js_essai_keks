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
  * @return {HTMLElement}
 */
  
let getPictureElement = (data) => {
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
  return element;
};

/**
  * @param {Object} data
  * @param {HTMLElement} container
  * @param {Array} picturesArr
  * @constructor
*/

let Photo = function(data, container, picturesArr) {
  var self = this;
  this.data = data;
  this.element = getPictureElement(this.data);
  this.onClickShow = (evt) => {
    evt.preventDefault();
    gallery.showGallery(picturesArr.indexOf(self.data));
  }
  this.remove = () => {
    this.element.removeEventListener('click', self.onClickShow);
    this.element.parentNode.removeChild(self.element);
  };
  container.appendChild(this.element);
  this.element.addEventListener('click', self.onClickShow);
}

module.exports = Photo;