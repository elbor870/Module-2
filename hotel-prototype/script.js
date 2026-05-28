// База номеров
const allRooms = [
  { id: 1, category: 'standard', price: 3500, image: 'https://via.placeholder.com/300x200/8ecae6/ffffff?text=Standard', features: 'Wi-Fi, ТВ, Душ' },
  { id: 2, category: 'comfort', price: 5200, image: 'https://via.placeholder.com/300x200/00b4d8/ffffff?text=Comfort', features: 'Wi-Fi, ТВ, Кондиционер, Завтрак' },
  { id: 3, category: 'lux', price: 8900, image: 'https://via.placeholder.com/300x200/0077b6/ffffff?text=Lux', features: 'Панорамный вид, Мини-бар, Джакузи' },
  { id: 4, category: 'standard', price: 3800, image: 'https://via.placeholder.com/300x200/48cae4/ffffff?text=Standard+', features: 'Wi-Fi, ТВ, Фен' },
  { id: 5, category: 'comfort', price: 5800, image: 'https://via.placeholder.com/300x200/90e0ef/000000?text=Comfort+', features: 'Wi-Fi, Рабочая зона, Кондиционер' },
  { id: 6, category: 'lux', price: 9500, image: 'https://via.placeholder.com/300x200/caf0f8/000000?text=Lux+', features: 'Терраса, Все включено, Вид на парк' }
];

// Перемешивание массива (для "случайного" вывода)
function shuffleArray(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// Рендер карточек
function renderRooms(rooms) {
  const container = document.getElementById('roomContainer');
  if (!container) return;
  container.innerHTML = '';
  rooms.forEach(room => {
    container.innerHTML += `
      <div class="room-card" data-category="${room.category}">
        <img src="${room.image}" alt="Номер ${room.category}">
        <h3>${room.category.charAt(0).toUpperCase() + room.category.slice(1)}</h3>
        <p>Цена: ${room.price} ₽/ночь</p>
        <p>Характеристики: ${room.features}</p>
        <button onclick="bookRoom(${room.id})">Забронировать</button>
      </div>
    `;
  });
}

// Фильтрация
function applyFilter() {
  const selected = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
  const filtered = selected.length === 0 ? shuffleArray(allRooms) : allRooms.filter(r => selected.includes(r.category));
  renderRooms(filtered);
}

function resetFilter() {
  document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
  renderRooms(shuffleArray(allRooms));
}

// Переход на бронирование
function bookRoom(id) {
  localStorage.setItem('selectedRoomId', id);
  window.location.href = 'booking.html';
}

// Валидация формы
function validateBookingForm() {
  const getVal = id => document.getElementById(id).value.trim();
  const firstName = getVal('firstName');
  const lastName = getVal('lastName');
  const phone = getVal('phone');
  const email = getVal('email');
  const checkIn = getVal('checkIn');
  const checkOut = getVal('checkOut');

  const cyrillicRegex = /^[а-яёА-ЯЁ\s\.\-]+$/;
  const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{2}:\d{2}:\d{4}$/; // Формат ДД:ММ:ГГГГ

  if (!cyrillicRegex.test(firstName)) return 'Имя должно содержать только кириллицу, пробелы, точки или тире.';
  if (!cyrillicRegex.test(lastName)) return 'Фамилия должна содержать только кириллицу, пробелы, точки или тире.';
  if (!phoneRegex.test(phone)) return 'Телефон должен быть в формате +7(XXX)XXX-XX-XX';
  if (!emailRegex.test(email)) return 'Неверный формат E-mail';
  if (!dateRegex.test(checkIn)) return 'Дата заезда в формате ДД:ММ:ГГГГ';
  if (!dateRegex.test(checkOut)) return 'Дата выезда в формате ДД:ММ:ГГГГ';
  
  return null;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Логика Каталога
  if (document.getElementById('applyFilter')) {
    renderRooms(shuffleArray(allRooms));
    document.getElementById('applyFilter').addEventListener('click', applyFilter);
    document.getElementById('resetFilter').addEventListener('click', resetFilter);
  }

  // Логика Бронирования
  if (document.getElementById('bookingForm')) {
    const roomId = localStorage.getItem('selectedRoomId');
    const room = allRooms.find(r => r.id == roomId);
    if (room) document.getElementById('selectedRoomInfo').textContent = `${room.category.toUpperCase()} (ID: ${room.id})`;
    
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const error = validateBookingForm();
      if (error) {
        alert('⚠️ Ошибка: ' + error);
      } else {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('bookingForm').reset();
        setTimeout(() => document.getElementById('successMessage').style.display = 'none', 3000);
      }
    });
  }
});
