import colors from './colors'

export default function (swiper) {
  let actIndex = swiper.activeIndex;
  let slides = swiper.slides
  if (slides[actIndex].classList.contains('animate-middleware')) {
    swiper.lockSwipes();
    let prevIndex = swiper.previousIndex;
    let direction = actIndex - prevIndex;

    function transitionEndCallBack() {
      swiper.unlockSwipes();
      swiper["slide" + (direction > 0 ? "Next" : "Prev")]();
    }
    setTimeout(transitionEndCallBack, 300)

    document.body.style.backgroundColor = colors["mainColor" + slides[(actIndex + direction)].dataset.background];
  }
};