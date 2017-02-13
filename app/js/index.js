import Swiper from 'swiper'
require('swiper/dist/css/swiper.min.css');
require('../css/index.pcss');
import changeBodyColor from './swiper-background-animate'
import colors from './colors'

let swiper = new Swiper('.swiper-container', {
  nextButton: '.swiper-button-next',
  prevButton: '.swiper-button-prev',
  // scrollbar: '.swiper-scrollbar',
  onInit(swiper) {
    document.body.style.backgroundColor = colors["mainColor" + swiper.slides[0].dataset.background]
  },
  onSlideChangeStart(swiper) {
    changeBodyColor(swiper);
  }
});
function toggleForm (e) {
  e.preventDefault();
  document.getElementById('apply').classList.toggle('show')
  document.getElementsByClassName('swiper-container')[0].classList.toggle('hide')
}
document.getElementById('show-form').addEventListener('click',toggleForm);
document.getElementsByClassName('btn-close')[0].addEventListener('click', toggleForm);