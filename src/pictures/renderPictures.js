'use strict';
let picturesContainer = document.querySelector('.pictures');
const PAGE_SIZE = 12;
let getPictureElement = require('./getPictureElement');
/*
 * @param {Array.<Object>} pictures 
 * @param {number} page
 * @param {boolean} replace
 */
let renderPictures = (pictures, page, replace) => {

  if (replace) {
    picturesContainer.innerHTML = '';
  }

  let from = page * PAGE_SIZE;
  let to = from + PAGE_SIZE;

  pictures.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, picturesContainer, pictures);
  });

};

module.exports = renderPictures;