'use strict';

(function() {
  
  let filterBlock = document.querySelector('.filters');
  let templateElement = document.querySelector('#picture-template');
  
  let pictures;
  
  const PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
  
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
  
  let getPictureElement = ({url, likes, comments}, container) => {
    let element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = comments;
    element.querySelector('.picture-likes').textContent = likes;
    
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
    
    pictureItem.src = url;
    
    container.appendChild(element);
    return element;
  };
  
  
  /** @param {function(Array.<Object>)} callback */
  let getPictures = function(callback) {
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
      
      if(filterBlock.classList.contains('hidden')) {
        filterBlock.classList.remove('hidden')
      }
      
      let loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', PICTURES_LOAD_URL);
    xhr.send();
  };
  
  let setFilterEnabled = (filter) => {
    
  }
  
  let setFiltrationEnabled = () => {
    let filtres = filterBlock.querySelectorAll('.filters-radio');
    for (var i = 0; i < filtres.length; i++) {
      filtres[i].addEventListener('click', function() {
        setFilterEnabled(this.id);
      })
    }
  };
  
  
  /** @param {Array.<Object>} pictures */
  let renderPictures = (pictures) => {
    pictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };
  
  getPictures(function(loadedPictures){
    pictures = loadedPictures;
    setFiltrationEnabled();
    renderPictures(pictures);
  });
  
  if (filterBlock.classList.contains('invisible')) {
    filterBlock.classList.remove('invisible');
  }
  
  
})();