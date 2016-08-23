'use strict';

let utils = require('../utils');
let getPictureElement = require('./getPictureElement');
let getPictures = require('./getPictures');
let filterBlock = document.querySelector('.filters');
let renderPictures = require('./renderPictures');
let getFilteredPictures = require('../filters/filter');
let gallery = require('../gallery');

let pictures;

let filteredPictures = [];

const PAGE_SIZE = 12;

const THROTTLE_DELAY = 100;


/** @type {number} */
let pageNumber = 0;



/** @param {string} filter */
let setFilterEnabled = (filter) => {
  let filteredPictures = getFilteredPictures(pictures, filter);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);
  if (utils.isBottomReached() && utils.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber, false);
  }
  gallery.getPhotos(filteredPictures);
  
};

let setFiltrationEnabled = () => {
  let filtres = filterBlock.querySelectorAll('.filters-radio');

  for (var i = 0; i < filtres.length; i++) {

    let filterId = filtres[i].getAttribute('id');

    //создание надписи с кол-вом фотографий, подходящих под этот фильтр
    let filteredPictures = getFilteredPictures(pictures, filterId);
    let picturesQuantity = filteredPictures.length;

    //добавление disabled фильтрам, которым не соответствует ни одна фоо
    if (picturesQuantity === 0) {
      filtres[i].setAttribute('disabled', true);
    }

    let infoSup = document.createElement('sup');
    infoSup.innerHTML = picturesQuantity;
    let filterLabel = document.querySelector(`label[for=${filterId}]`);

    let next = filterLabel.nextSibling;
    filterBlock.insertBefore(infoSup, next);

    filtres[i].addEventListener('click', function () {
      setFilterEnabled(this.id);
    });
  }

  if (filterBlock.classList.contains('invisible')) {
    filterBlock.classList.remove('invisible');
  }

};

let setScrollEnabled = () => {
  let lastCall = Date.now();
  window.addEventListener('scroll', function () {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      if (utils.isBottomReached() &&
        utils.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderPictures(pictures, pageNumber, false);
      }
      lastCall = Date.now();
    }
  });
};





getPictures(function (loadedPictures) {
  pictures = loadedPictures;
  setFiltrationEnabled();
  setFilterEnabled('LIKES');
  setScrollEnabled();
  
});