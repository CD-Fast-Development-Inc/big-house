document.addEventListener('DOMContentLoaded', function () {
  // Инициализация Swiper
  var projectsSwiper = new Swiper('.projectsSwiper', {
    slidesPerView: 1, spaceBetween: 24, loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 24 }
    }
  });

  // Тень header при скролле
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) { header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  });
});