'use strict';

let Gallery = function() {
  let self = this;
  
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

  this._onPhotoClick = this._onPhotoClick.bind(this);
  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  this.hideGallery = this.hideGallery.bind(this);
  this.showGallery = this.showGallery.bind(this);
  this.showPhoto = this.showPhoto.bind(this);

  

  
  window.addEventListener('hashchange', this.hashVerify.bind(this));
}

Gallery.prototype._onPhotoClick = function() {
  ++this.numberPhoto;
  if (this.numberPhoto > this.photosArray.length - 1) {
    this.numberPhoto = 0;
  }
  location.hash = 'photo/' + this.photosArray[this.numberPhoto].url;
};

Gallery.prototype.hashVerify = function() {
  if (location.hash && location.hash.match(/#photo\/(\S+)/)) {
    var hashLink = location.hash.match(/#photo\/(\S+)/);
    this.showGallery(hashLink[1]);
  }
};

/**
  @param {Event} event
  */

Gallery.prototype._onDocumentKeyDown = function(event) {
  const ESC_KEY = 27; //код клавиши ESC
  if (event.keyCode === ESC_KEY && !this.photoGallery.classList.contains('invisible')) {
    this.hideGallery();
  }
};

/**
  функция скрытия галереи
*/
Gallery.prototype.hideGallery = function() {
  history.pushState('', document.title, window.location.pathname);
  this.photoGallery.classList.add('invisible');
  window.removeEventListener('keydown', this._onDocumentKeyDown);
  this.galleryClose.removeEventListener('click', this.hideGallery);
  this.galleryImg.removeEventListener('click', this._onPhotoClick);
};

/**
  функция показа галереи
  @param {number} indexPhoto
  */

Gallery.prototype.showGallery = function(indexPhoto) {
  if (this.photoGallery.classList.contains('invisible')) {
    this.photoGallery.classList.remove('invisible');
  }
  this.showPhoto(indexPhoto);
  window.addEventListener('keydown', this._onDocumentKeyDown);
  this.galleryClose.addEventListener('click', this.hideGallery);
  this.galleryImg.addEventListener('click', this._onPhotoClick);
};

/**
  функция показа изображения
  @param {number} num
  */

Gallery.prototype.showPhoto = function(num) {
  if (typeof(num) === 'number') {
    this.numberPhoto = num;
    this.galleryImg.src = this.photosArray[num].url;
    this.galleryLikes.innerHTML = this.photosArray[num].likes;
    this.galleryComments.innerHTML = this.photosArray[num].comments;
  } else if (typeof(num) === 'string') {
    this.galleryImg.src = num;
    this.photosArray.forEach(function(item, i){
      if (item.url === num) {
        this.numberPhoto = i;
      }
    }.bind(this))
    this.galleryLikes.innerHTML = this.photosArray[this.numberPhoto].likes;
    this.galleryComments.innerHTML = this.photosArray[this.numberPhoto].comments;
  }
}





module.exports = new Gallery();
