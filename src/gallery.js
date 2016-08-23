'use strict';

let photoGallery = document.querySelector('.gallery-overlay');
let galleryClose = photoGallery.querySelector('.gallery-overlay-close');
let galleryImg = photoGallery.querySelector('.gallery-overlay-image');
let galleryLikes = photoGallery.querySelector('.likes-count');
let galleryComments = photoGallery.querySelector('.comments-count');
let numberPhoto;

/**
@type {Array.<Object>}
*/
let photosArray = [];

/**
функция создания массива объектов, описывающих фотографии
@param {Array.<Object>} arr
*/
let getPhotos = (arr) => photosArray = arr.slice();
 
/**
функция показа галереи
@param {number}
*/

let showGallery = (photoNumber) =>  {
  if(photoGallery.classList.contains('invisible')) {
   photoGallery.classList.remove('invisible'); 
  }
  showPhoto(photoNumber);
  numberPhoto = photoNumber;
  window.addEventListener('keydown', _onDocumentKeyDown);
  galleryClose.addEventListener('click', hideGallery);
  photoGallery.addEventListener('click', hideGallery);
  //galleryImg.addEventListener('click', _onPhotoClick);
}

/**
функция показа изображения
@param {number} num
*/

let showPhoto = (num) => {
  
  galleryImg.src = photosArray[num].url;
  galleryLikes.innerHTML = photosArray[num].likes;
  galleryComments.innerHTML = photosArray[num].comments;
}
/**
функция скрытия галереи
*/
let hideGallery = () => {
  photoGallery.classList.add('invisible');
  window.removeEventListener('keydown', _onDocumentKeyDown);
  galleryClose.removeEventListener('click', hideGallery);
  photoGallery.removeEventListener('click', hideGallery);
  //galleryImg.removeEventListener('click', _onPhotoClick);
}

let _onPhotoClick = () => {
  if(numberPhoto < photosArray.length - 1) {
    ++numberPhoto;
    showPhoto(numberPhoto);
  }
};

/**
@param {Event} event
*/
let _onDocumentKeyDown = (event) => {
  let escKey = 27;//код клавиши ESC
  
  if (event.keyCode === escKey) {
    if (!photoGallery.classList.contains('invisible')) {
      hideGallery();
    }
  }
};

module.exports =  { 
  getPhotos: getPhotos,
  showGallery: showGallery
}



