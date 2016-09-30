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
    self.numberPhoto = indexPhoto;
    window.addEventListener('keydown', self._onDocumentKeyDown);
    self.galleryClose.addEventListener('click', self.hideGallery);
    self.galleryImg.addEventListener('click', self._onPhotoClick);
  }
  /**
  функция показа изображения
  @param {number} num
  */
  
  this.showPhoto = (num) => {
    self.galleryImg.src = self.photosArray[num].url;
    self.galleryLikes.innerHTML = self.photosArray[num].likes;
    self.galleryComments.innerHTML = self.photosArray[num].comments;
  }
  
  /**
  функция скрытия галереи
  */

  this.hideGallery = () => {
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
    self.showPhoto(self.numberPhoto);
  };

  /**
  @param {Event} event
  */
  this._onDocumentKeyDown = (event) => {
    if (event.keyCode === ESC_KEY && !self.photoGallery.classList.contains('invisible')) {
      self.hideGallery();
    }
  };
}

module.exports = new Gallery();
