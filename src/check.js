'use strict';
function getMessage(a, b) {
  let msg = `Вы загрузили что-то непонятное, возьмите себя в руки и найдите подходящий формат`;
  
  switch (typeof(a)) {
      
    case 'boolean':
      if (a) {
        msg = `Переданное GIF-изображение анимировано и содержит ${b} кадров`;
        
      } else {
        msg = `Переданное GIF-изображение не анимировано`;
      }
      break;
      
    case 'number':
      msg = `Переданное SVG-изображение содержит ${a} объектов и ${b * 4} атрибутов`;
      break;
      
    case 'object':
      if (typeof(b) === 'object') {
        var longestArr = a;
        var shortestArr = b;
        if (b.length > a.legth) {
          longestArr = b;
          shortestArr = a;
        }
        var square = shortestArr.reduce((sum, current, i) => sum + current * longestArr[i], 0 );
        msg = `Общая площадь артефактов сжатия: ${square} пикселей`;
        
      } else {
        var sum = a.reduce((sum, current) => sum + current, 0);
        msg = `Количество красных точек во всех строчках изображения: ${sum}`;
      }
      
      break;
      
  }
  
   return msg;
};
