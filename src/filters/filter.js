'use strict';
let filterBlock = document.querySelector('.filters');
/** @enum {number} */
const FILTER = {
  'LIKES': 'filter-popular',
  'NEWS': 'filter-new',
  'DISCUSSED': 'filter-discussed',
};
/**
 * @param {Array.<Object>} hotels
 * @param {string} filter
 */
let getFilteredPictures = (pictures, filter) => {
  let filterChilds = filterBlock.children;

  //обращение к прототипу массива, для того, чтобы применить к коллекции методы массива
    [].forEach.call(filterChilds, function (item) {
    if (item.classList.contains('alert')) {
      filterBlock.removeChild(item);
    }
  });

  let alertTemplate = document.querySelector('#alert-template');
  let alertelementToClone = ('content' in alertTemplate) ? alertTemplate.content.querySelector('.alert') : alertTemplate.querySelector('.alert');

  let picturesToFilter = pictures.slice(0);
  let currentPeriod = new Date() - 4 * 24 * 60 * 60 * 1000; //4 дня - период показа при выборе фильтра "недавние"
  switch (filter) {
    case FILTER.LIKES:
      picturesToFilter.sort((a, b) => b.likes - a.likes);

      break;
    case FILTER.DISCUSSED:
      picturesToFilter.sort((a, b) => b.comments - a.comments);
      break;

    case FILTER.NEWS:
      picturesToFilter = picturesToFilter.filter((a) => new Date(a.date) >= currentPeriod);

      picturesToFilter.sort((a, b) => b.date - a.date);

      break;
  }

  //вывод сообщения в случае, если ни один элемент не соответствует фильтру
  if (picturesToFilter.length === 0) {
    let element = alertelementToClone.cloneNode(true);
    let filterLabel = document.querySelector(`label[for=${filter}]`);
    element.querySelector('.filter-name').textContent = '"' + filterLabel.textContent + '"';
    filterBlock.appendChild(element);
  }

  return picturesToFilter;

};

module.exports = getFilteredPictures;