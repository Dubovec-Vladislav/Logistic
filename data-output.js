// Получаем элемент, в который будем вставлять данные
const outputElement = document.querySelector('.wrapper');

// Создаем HTML-строку на основе данных
let distance = 0;
let htmlString = '<div class="main__block">';
htmlString += '<ul class="cars__list">';
cars.forEach((item) => {
  distance += item.Пробег;
  htmlString += '<li class="cars__list-item">';
  htmlString += `<div class="cars__list-title"><span>Название:</span></span> ${item['Название']}</div>`;
  htmlString += `<div class="cars__list-point"><span>Время работы на маршруте:</span> ${(8 - item['ОставшеесяВремяРаботы']).toFixed(2)} час(-а)</div>`;
  htmlString += `<div class="cars__list-point"><span>Пробег:</span> ${item['Пробег']} км</div>`;

  const routeString = Object.entries(item['Маршрут'])
    .map(([point, distance]) => `<li class="cars__list-route-item">${point} - ${distance} поездок(-ки)</li>`)
    .join('');
  htmlString += `<div class="cars__list-point"><span>Маршрут:</span> <ul class="cars__list-route">${routeString}</ul></div>`;
});
htmlString += '</ul>';

htmlString += '<ul class="points__list">';
cars.forEach((item) => {
  distance += item.Пробег;
  htmlString += '<li class="cars__list-item">';
  htmlString += `<div class="cars__list-title"><span>Название:</span></span> ${item['Название']}</div>`;
  htmlString += `<div class="cars__list-point"><span>Время работы на маршруте:</span> ${(8 - item['ОставшеесяВремяРаботы']).toFixed(2)} час(-а)</div>`;
  htmlString += `<div class="cars__list-point"><span>Пробег:</span> ${item['Пробег']} км</div>`;

  const routeString = Object.entries(item['Маршрут'])
    .map(([point, distance]) => `<li class="cars__list-route-item">${point} - ${distance} поездок(-ки)</li>`)
    .join('');
  htmlString += `<div class="cars__list-point"><span>Маршрут:</span> <ul class="cars__list-route">${routeString}</ul></div>`;
});
htmlString += '</ul>';

htmlString += '</div>'

htmlString += `<div class="total__inf">Общий пробег: <span>${distance}</span></div>`;
htmlString += `<div class="total__inf">% Доставки: <span>${percent.toFixed(2)}%</span></div>`;

// Вставляем HTML в элемент
outputElement.innerHTML = htmlString;
