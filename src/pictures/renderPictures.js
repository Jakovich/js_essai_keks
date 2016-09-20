'use strict';
let picturesContainer = document.querySelector('.pictures');
const PAGE_SIZE = 12;
let Photo = require('./getPictureElement');
/*
 * @param {Array.<Object>} pictures 
 * @param {number} page
 * @param {boolean} replace
 */
let renderedPhoto = [];
let renderPictures = (pictures, page, replace) => {

  if (replace) {
    renderedPhoto.forEach(function(photo){
    photo.remove();
    renderedPhoto = [];
   });
  }

  let from = page * PAGE_SIZE;
  let to = from + PAGE_SIZE;

  pictures.slice(from, to).forEach(function(picture) {
    renderedPhoto.push(new Photo(picture, picturesContainer, pictures));
  });

};

module.exports = renderPictures;