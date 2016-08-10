'use strict';
const PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
let picturesContainer = document.querySelector('.pictures');
let filterBlock = document.querySelector('.filters');

/** @param {function(Array.<Object>)} callback */
let getPictures = (callback) => {
  let xhr = new XMLHttpRequest();
  xhr.timeout = 10000;

  xhr.onloadstart = () => picturesContainer.classList.add('pictures-loading');

  xhr.onerror = () => {
    picturesContainer.classList.remove('pictures-loading');
    picturesContainer.classList.add('pictures-failure');
  }

  xhr.ontimeout = xhr.onerror;

  /** @param {ProgressEvent} */
  xhr.onload = (evt) => {
    picturesContainer.classList.remove('pictures-loading');

    if (filterBlock.classList.contains('hidden')) {
      filterBlock.classList.remove('hidden')
    }

    let loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };

  xhr.open('GET', PICTURES_LOAD_URL);
  xhr.send();
};

module.exports = getPictures;
