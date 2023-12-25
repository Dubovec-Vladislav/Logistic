// Получаем элемент, в который будем вставлять данные
const outputElement = document.getElementById('output');

// Создаем HTML-строку на основе данных
let distance = 0;
let htmlString = '<ul>';
cars.forEach((item) => {
  distance += item.Пробег;
  htmlString += '<li>';
  htmlString += `<strong>Название:</strong> ${item['Название']}, `;
  htmlString += `<strong>Время работы на маршруте:</strong> ${8 - item['ОставшеесяВремяРаботы'].toFixed(2)} час(-а), `;
  htmlString += `<strong>Пробег:</strong> ${item['Пробег']} км, `;

  // Форматируем данные о маршруте
  const routeString = Object.entries(item['Маршрут'])
    .map(([point, distance]) => `${point} - ${distance} поездок(-ки)`)
    .join(', ');

  htmlString += `<strong>Маршрут:</strong> ${routeString}`;
  htmlString += '</li>';
});
htmlString += `<strong>Общий пробег:</strong> ${distance}`;
htmlString += '</ul>';

// Вставляем HTML в элемент
outputElement.innerHTML = htmlString;
