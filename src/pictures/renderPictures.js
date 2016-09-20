'use strict';
let picturesContainer = document.querySelector('.pictures');
const PAGE_SIZE = 12;
let Picture = require('./picture');
/*
 * @param {Array.<Object>} pictures 
 * @param {number} page
 * @param {boolean} replace
 */
let renderedPictures = [];
let renderPictures = (pictures, page, replace) => {

  if (replace) {
    renderedPictures.forEach(function(picture){
    picture.remove();
    renderedPictures = [];
   });
  }

  let from = page * PAGE_SIZE;
  let to = from + PAGE_SIZE;

  pictures.slice(from, to).forEach(function(picture) {
    renderedPictures.push(new Picture(picture, picturesContainer, pictures));
  });

};

module.exports = renderPictures;