import colors from './colors'

export default function (swiper) {
  let actIndex = swiper.activeIndex;
  let slides = swiper.slides
  if (slides[actIndex].classList.contains('animate-middleware')) {
    swiper.lockSwipes();
    let prevIndex = swiper.previousIndex;
    let direction = actIndex - prevIndex;

    function transitionEndCallBack(el) {
      return function realCallBack(e) {
        if (e.srcElement == el) {
          swiper.unlockSwipes();
          swiper["slide" + (direction > 0 ? "Next" : "Prev")]();
          el.removeEventListener('transitionend', realCallBack);
        }
      }
    }

    document.body.addEventListener('transitionend', transitionEndCallBack(document.body))
    document.body.style.backgroundColor = colors["mainColor" + slides[(actIndex + direction)].dataset.background];
  }
};