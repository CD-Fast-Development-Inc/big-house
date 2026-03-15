// Инициализация EmailJS
(function () {
  emailjs.init(EMAIL_CONFIG.publicKey);
})();

document.addEventListener('DOMContentLoaded', function () {

  // Инициализация AOS (анимации при скролле)
  AOS.init({
    once: true,
    duration: 700,
    offset: 80,
    easing: 'ease-out-cubic'
  });

  // Инициализация Swiper (слайдер проектов)
  window.projectsSwiper = new Swiper('.projectsSwiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 24 }
    }
  });

  // Тень header при скролле + кнопка "наверх"
  var header = document.getElementById('header');
  var scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ----------------------------------------------------------
  // Загрузка данных из Supabase (опционально)
  // Если Supabase недоступен — сайт работает со статичным HTML
  // ----------------------------------------------------------
  if (typeof supabaseClient !== 'undefined') {
    // Загружаем проекты из БД и отрисовываем слайды
    renderProjectsFromDB().then(function () {
      // После обновления слайдов — переинициализируем Swiper
      window.projectsSwiper.update();
      window.projectsSwiper.slideToLoop(0);
    });

    // Загружаем услуги из БД и отрисовываем карточки
    renderServicesFromDB();
  }

});


// ============================================================
// Отправка формы — основная секция
// ============================================================
function sendEmail() {
  var name = document.getElementById('userName').value.trim();
  var email = document.getElementById('userEmail').value.trim();
  var phone = document.getElementById('userPhone').value.trim();
  var statusEl = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  // Валидация полей
  if (!name || !email || !phone) {
    statusEl.innerHTML = '<span style="color: #d32f2f;">Пожалуйста, заполните все поля</span>';
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    statusEl.innerHTML = '<span style="color: #d32f2f;">Введите корректный email</span>';
    return;
  }

  // Блокируем кнопку на время отправки
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i> Отправка...';

  // Параметры для EmailJS шаблона
  var templateParams = {
    from_name: name,
    from_email: email,
    phone: phone,
    message: 'Заявка с основной формы сайта'
  };

  // Сохраняем заявку в Supabase (параллельно с отправкой email)
  if (typeof saveApplication === 'function') {
    saveApplication(name, email, phone, 'main_form');
  }

  // Отправляем email через EmailJS
  emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
    .then(function () {
      statusEl.innerHTML = '<span style="color: #2E7D32;">✓ Заявка отправлена! Мы свяжемся с вами.</span>';
      document.getElementById('userName').value = '';
      document.getElementById('userEmail').value = '';
      document.getElementById('userPhone').value = '';
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send me-1"></i> Отправить заявку';
    })
    .catch(function (error) {
      statusEl.innerHTML = '<span style="color: #d32f2f;">Ошибка отправки. Попробуйте позже.</span>';
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send me-1"></i> Отправить заявку';
      console.error('EmailJS:', error);
    });
}


// ============================================================
// Отправка формы — модальное окно
// ============================================================
function sendModalEmail() {
  var name = document.getElementById('modalName').value.trim();
  var email = document.getElementById('modalEmail').value.trim();
  var phone = document.getElementById('modalPhone').value.trim();
  var statusEl = document.getElementById('modalFormStatus');

  // Валидация полей
  if (!name || !email || !phone) {
    statusEl.innerHTML = '<span style="color: #d32f2f;">Заполните все поля</span>';
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    statusEl.innerHTML = '<span style="color: #d32f2f;">Введите корректный email</span>';
    return;
  }

  var templateParams = {
    from_name: name,
    from_email: email,
    phone: phone,
    message: 'Заявка из модального окна'
  };

  // Сохраняем заявку в Supabase (параллельно с отправкой email)
  if (typeof saveApplication === 'function') {
    saveApplication(name, email, phone, 'modal');
  }

  // Отправляем email через EmailJS
  emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
    .then(function () {
      statusEl.innerHTML = '<span style="color: #2E7D32;">✓ Отправлено! Спасибо.</span>';
      document.getElementById('modalName').value = '';
      document.getElementById('modalEmail').value = '';
      document.getElementById('modalPhone').value = '';
    })
    .catch(function (error) {
      statusEl.innerHTML = '<span style="color: #d32f2f;">Ошибка. Попробуйте позже.</span>';
      console.error('EmailJS:', error);
    });
}
