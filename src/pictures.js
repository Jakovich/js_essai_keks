'use strict';

(function() {
  
  let filterBlock = document.querySelector('.filters');
  let templateElement = document.querySelector('#picture-template');
  
  let pictures;
  
  const PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
  
  /** @enum {number} */
  var FILTER = {
    'LIKES': 'filter-popular',
    'NEWS': 'filter-new',
    'DISCUSSED': 'filter-discussed',
  };
  
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
      
      if(filterBlock.classList.contains('hidden')) {
        filterBlock.classList.remove('hidden')
      }
      
      let loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', PICTURES_LOAD_URL);
    xhr.send();
  };
  
  
  /**
  * @param {Array.<Object>} hotels
  * @param {string} filter
 */
  let getFilteredPictures = (pictures, filter) => {
    let filterChilds = filterBlock.children;
    
    for (var i = 0; i < filterChilds.length; i++) {
      if (filterChilds[i].matches('.alert')) {
        filterBlock.removeChild(filterChilds[i]);
      }
    }
    
    let alertTemplate = document.querySelector('#alert-template');
    let alertelementToClone = ('content' in alertTemplate) ? alertTemplate.content.querySelector('.alert') : alertTemplate.querySelector('.alert');
   
    let picturesToFilter = pictures.slice(0);
    let currentPeriod = new Date() - 4 * 24 * 60 * 60 * 1000; //4 дня - период показа при выборе фильтра "недавние"
    switch(filter) {
      case FILTER.LIKES:
        picturesToFilter.sort(function(a, b) {
          return b.likes - a.likes;
        })
        
      break;
      case FILTER.DISCUSSED:
        picturesToFilter.sort(function(a, b) {
          return b.comments - a.comments;
        })
      break;
        
      case FILTER.NEWS: 
        picturesToFilter = picturesToFilter.filter(function(a) {
          return new Date(a.date) >= currentPeriod;
        });
        picturesToFilter.sort(function(a, b) {
          return b.date - a.date;
        });
        
      break;   
    }
    
    //вывод сообщения в случае, если ни один элемент не соответствует фильтру
    if (picturesToFilter.length === 0) {
      let element = alertelementToClone.cloneNode(true);
      let filterLabel = document.querySelector('label[for=' + filter + ']');
      element.querySelector('.filter-name').textContent = '"' + filterLabel.textContent + '"';
      filterBlock.appendChild(element);
    }
    
    return picturesToFilter;
    
  };
  
  /** @param {Array.<Object>} pictures */
  let renderPictures = (pictures) => {
    picturesContainer.innerHTML = '';
    pictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
    
  };
  
  /** @param {string} filter */
  let setFilterEnabled = (filter) => {
    let filteredPictures = getFilteredPictures(pictures, filter);
    renderPictures(filteredPictures);
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
      let filterLabel = document.querySelector('label[for=' + filterId + ']');
      let next = filterLabel.nextSibling;
      filterBlock.insertBefore(infoSup, next);
   
      filtres[i].addEventListener('click', function() {
        setFilterEnabled(this.id);
      })
    }
    
    if (filterBlock.classList.contains('invisible')) {
      filterBlock.classList.remove('invisible');
    }
    
  };
  
  getPictures(function(loadedPictures){
    pictures = loadedPictures;
    setFiltrationEnabled();
    renderPictures(pictures);
  });
  
  
})();