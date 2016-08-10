'use strict';

let picturesContainer = document.querySelector('.pictures');
const GAP = 100;

module.exports = {
  /**
  * @param {Array} hotels
  * @param {number} page
  * @param {number} pageSize
  * @return {boolean}
  */
  isNextPageAvailable: (pictures, page, pageSize) => page < Math.floor(pictures.length / pageSize),
  /** @return {boolean} */
  isBottomReached: () => {
    let picturesPosition = picturesContainer.getBoundingClientRect();
    return picturesPosition.bottom - window.innerHeight - GAP <= 0;
  }
}