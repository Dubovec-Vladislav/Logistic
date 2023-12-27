// Получаем элемент, в который будем вставлять данные
const outputElement = document.getElementById('output');

// Создаем HTML-строку на основе данных
let distance = 0;
let htmlString = '<ul class="list">';
cars.forEach((item) => {
  distance += item.Пробег;
  htmlString += '<li class="item">';
  htmlString += `<div class="title">Название: <span>${item['Название']}</span></div>`;
  htmlString += `<div class="time">Время работы на маршруте: <span>${(8 - item['ОставшеесяВремяРаботы']).toFixed(2)}</span> час(-а)</div>`;
  htmlString += `<div class="distance">Пробег: <span>${item['Пробег']}</span> км</div>`;

  // Форматируем данные о маршруте
  const routeString = Object.entries(item['Маршрут'])
    .map(([point, distance]) => `${point} - ${distance} поездок(-ки)`)
    .join(', ');

  htmlString += `<div class="route">Маршрут: <span>${routeString}</span></div>`;
  htmlString += '</li>';
});
htmlString += '</ul>';
htmlString += `<div class="total-distance">Общий пробег: <span>${distance}</span></div>`;

// Вставляем HTML в элемент
outputElement.innerHTML = htmlString;
