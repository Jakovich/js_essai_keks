'use strict';
module.exports = {
  /**
    функция установки даты жизни cookies - количество дней, прошедших с дня рождения (06.03)
    @return {number}
  */
  
  setTimeofExpires: () => {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let birthDate = (currentDate <= new Date(currentYear, 2, 6)) ? new Date(currentYear - 1, 2, 6) : new Date(currentYear, 2, 6);
    let expireDateMilisec = currentDate - birthDate;
    let expireDate = Math.floor(expireDateMilisec / 3600 / 24 / 1000);
    return expireDate;
  },
    
  /**
   *функция формирования сообщения об ошибки
  */
  
  errorMsg: (elem) => {
    var msg = document.createElement('span');
    msg.style.display = 'block';
    msg.style.color = 'red';
    msg.style.position = 'absolute';
    msg.style.left = '100px';
    msg.style.bottom = '0px';
    msg.style.zIndex = '100';
    msg.innerHTML = '«кадр» должен находиться в пределах исходного изображения';
    msg.className = 'error';
    elem.appendChild(msg);
  }
    
}


