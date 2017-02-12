import Swiper from 'swiper'
require('./js/index')

let swiper = new Swiper('.swiper-container', {
  direction: 'vertical',
  pagination: '.swiper-pagination',
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  // scrollbar: '.swiper-scrollbar',
});