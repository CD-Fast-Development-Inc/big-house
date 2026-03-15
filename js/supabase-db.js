// ============================================================
// ЗАЯВКИ (applications)
// ============================================================

/**
 * Сохраняет заявку клиента в базу данных
 * @param {string} name   — Имя клиента
 * @param {string} email  — Email клиента
 * @param {string} phone  — Телефон клиента
 * @param {string} source — Источник заявки: 'main_form' или 'modal'
 * @returns {Object|null} — Сохранённая запись или null при ошибке
 */
async function saveApplication(name, email, phone, source) {
  // Формируем объект с данными для вставки
  var applicationData = {
    name: name,
    email: email,
    phone: phone,
    source: source || 'main_form'
  };

  // Отправляем INSERT-запрос в таблицу applications
  var result = await supabaseClient
    .from('applications')      // Имя таблицы
    .insert([applicationData]) // Массив записей для вставки
    .select();                 // Возвращаем вставленные данные

  // Обработка ошибки
  if (result.error) {
    console.error('Ошибка сохранения заявки:', result.error.message);
    return null;
  }

  console.log('Заявка сохранена:', result.data);
  return result.data;
}


// ============================================================
// ПРОЕКТЫ (projects)
// ============================================================

/**
 * Получает список активных проектов из базы данных
 * @returns {Array} — Массив объектов проектов
 */
async function getProjects() {
  var result = await supabaseClient
    .from('projects')                  // Имя таблицы
    .select('*')                       // Выбираем все столбцы
    .eq('is_active', true)             // Фильтр: только активные
    .order('sort_order', { ascending: true }); // Сортировка по порядку

  if (result.error) {
    console.error('Ошибка загрузки проектов:', result.error.message);
    return [];
  }

  return result.data;
}


// ============================================================
// УСЛУГИ (services)
// ============================================================

/**
 * Получает список активных услуг из базы данных
 * @returns {Array} — Массив объектов услуг
 */
async function getServices() {
  var result = await supabaseClient
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (result.error) {
    console.error('Ошибка загрузки услуг:', result.error.message);
    return [];
  }

  return result.data;
}


// ============================================================
// ДИНАМИЧЕСКАЯ ОТРИСОВКА (опционально)
// ============================================================

/**
 * Загружает проекты из БД и вставляет слайды в Swiper
 * Вызывается при загрузке страницы
 */
async function renderProjectsFromDB() {
  var projects = await getProjects();

  // Если проектов нет или произошла ошибка — оставляем статичные слайды
  if (!projects || projects.length === 0) {
    console.log('Проекты не загружены из БД, используются статичные данные');
    return;
  }

  // Находим контейнер слайдов
  var swiperWrapper = document.querySelector('.projectsSwiper .swiper-wrapper');
  if (!swiperWrapper) return;

  // Очищаем статичные слайды
  swiperWrapper.innerHTML = '';

  // Генерируем слайды из данных БД
  projects.forEach(function (project) {
    var slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML =
      '<div class="project-slide">' +
        '<div class="project-image" style="background-image: url(\'' + project.image_url + '\');"></div>' +
        '<div class="project-info">' +
          '<h5>' + project.title + '</h5>' +
          '<p>' + project.description + '</p>' +
        '</div>' +
      '</div>';
    swiperWrapper.appendChild(slide);
  });

  // Обновляем Swiper после добавления слайдов
  if (window.projectsSwiper) {
    window.projectsSwiper.update();
  }
}

/**
 * Загружает услуги из БД и вставляет карточки
 */
async function renderServicesFromDB() {
  var services = await getServices();

  if (!services || services.length === 0) {
    console.log('Услуги не загружены из БД, используются статичные данные');
    return;
  }

  var container = document.querySelector('.about-section .about-section-items');
  if (!container) return;

  container.innerHTML = '';

  services.forEach(function (service, index) {
    var col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-duration', '600');
    col.setAttribute('data-aos-delay', String(index * 150));
    col.innerHTML =
      '<div class="service-card">' +
        '<div class="service-icon"><i class="bi ' + service.icon + '"></i></div>' +
        '<h4>' + service.title + '</h4>' +
        '<p>' + service.description + '</p>' +
      '</div>';
    container.appendChild(col);
  });
}
