'use strict';

let Gallery = function() {
  let self = this;
  const ESC_KEY = 27; //код клавиши ESC
  this.photoGallery = document.querySelector('.gallery-overlay');
  this.galleryClose = this.photoGallery.querySelector('.gallery-overlay-close');
  this.galleryImg = this.photoGallery.querySelector('.gallery-overlay-image');
  this.galleryLikes = this.photoGallery.querySelector('.likes-count');
  this.galleryComments = this.photoGallery.querySelector('.comments-count');
  this.numberPhoto;
  
  /**
  @type {Array.<Object>}
  */
  this.photosArray = [];
  
  /**
  функция создания массива объектов, описывающих фотографии
  @param {Array.<Object>} arr
  */
  this.getPhotos = (arr) => this.photosArray = arr.slice();
  
  /**
  функция показа галереи
  @param {number} indexPhoto
  */

  this.showGallery = (indexPhoto) => {
    if (self.photoGallery.classList.contains('invisible')) {
      self.photoGallery.classList.remove('invisible');
    }
    self.showPhoto(indexPhoto);
    window.addEventListener('keydown', self._onDocumentKeyDown);
    self.galleryClose.addEventListener('click', self.hideGallery);
    self.galleryImg.addEventListener('click', self._onPhotoClick);
  }
  /**
  функция показа изображения
  @param {number} num
  */
  
  this.showPhoto = (num) => {
    if (typeof(num) === 'number') {
      self.numberPhoto = num;
      self.galleryImg.src = self.photosArray[num].url;
      self.galleryLikes.innerHTML = self.photosArray[num].likes;
      self.galleryComments.innerHTML = self.photosArray[num].comments;
    } else if (typeof(num) === 'string') {
      self.galleryImg.src = num;
      for (let i = 0; i < self.photosArray.length; i++) {
        if (self.photosArray[i].url === num) {
          self.numberPhoto = self.photosArray.indexOf(self.photosArray[i]);
        }
      }
      self.galleryLikes.innerHTML = self.photosArray[self.numberPhoto].likes;
      self.galleryComments.innerHTML = self.photosArray[self.numberPhoto].comments;
    }
  }
  
  /**
  функция скрытия галереи
  */

  this.hideGallery = () => {
    history.pushState('', document.title, window.location.pathname);
    self.photoGallery.classList.add('invisible');
    window.removeEventListener('keydown', self._onDocumentKeyDown);
    self.galleryClose.removeEventListener('click', self.hideGallery);
    self.galleryImg.removeEventListener('click', self._onPhotoClick);
  }

  this._onPhotoClick = () => {
    ++self.numberPhoto;
    if (self.numberPhoto > self.photosArray.length - 1) {
      self.numberPhoto = 0;
    }
    location.hash = 'photo/' + self.photosArray[self.numberPhoto].url;
  };

  /**
  @param {Event} event
  */
  this._onDocumentKeyDown = (event) => {
    if (event.keyCode === ESC_KEY && !self.photoGallery.classList.contains('invisible')) {
      self.hideGallery();
    }
  };
  
  this.hashVerify = function() {
    if (location.hash && location.hash.match(/#photo\/(\S+)/)) {
      var hashLink = location.hash.match(/#photo\/(\S+)/);
      this.showGallery(hashLink[1]);
    }
  };
  
  window.addEventListener('hashchange', this.hashVerify.bind(this));
}

module.exports = new Gallery();
