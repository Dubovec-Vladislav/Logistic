// - Расстояние от депо до точек и карьера - //
const depotToCareerDistance = 6;
const depotToPoint1Distance = 10;
const depotToPoint2Distance = 8;
const depotToPoint3Distance = 13;
// ----------------------------------------- //

// ----- Расстояние от карьера до точек ---- //
const careerToPoint1Distance = 18;
const careerToPoint2Distance = 12;
const careerToPoint3Distance = 7;
// ----------------------------------------- //

// -------------- Потребности -------------- //
const needPoint1 = 30;
const needPoint2 = 40;
const needPoint3 = 50;
// ----------------------------------------- //

// -------- Транспортные характеристики ------ //
const speed = 40;
const liftingCapacity = 6;
const capacityUtilizationFactor = 0.9;
const actualLiftingCapacity = liftingCapacity * capacityUtilizationFactor;
const loadingAndUnloadingTime = 0.33;
// ----------------------------------------- //

// ------- 1. Определение количество ездок в каждую точку ------ //
const tripsToPoint1 = Math.ceil(needPoint1 / actualLiftingCapacity);
const tripsToPoint2 = Math.ceil(needPoint2 / actualLiftingCapacity);
const tripsToPoint3 = Math.ceil(needPoint3 / actualLiftingCapacity);
// ------------------------------------------------------------- //

// ------------- 2. Определение очередности объезда ------------ //
const sequenceOfPoint1 = depotToPoint1Distance - careerToPoint1Distance;
const sequenceOfPoint2 = depotToPoint2Distance - careerToPoint2Distance;
const sequenceOfPoint3 = depotToPoint3Distance - careerToPoint3Distance;

const queueList = {
  'Point1': sequenceOfPoint1,
  'Point2': sequenceOfPoint2,
  'Point3': sequenceOfPoint3,
}; // {Point 1: -8, Point 2: -4, Point 3: 6}

const entries = Object.entries(queueList); // Преобразовываем объект в массив
entries.sort((a, b) => b[1] - a[1]); // Сортируем массив в порядке убывания
for (let i = 0; i < entries.length; i++) entries[i][1] = i + 1; // { Point 3: 6, Point 2: -4, Point 1: -8 } => { Point 3: 1, Point 2: 2, Point 1: 3 }
const sortedQueueList = Object.fromEntries(entries); // Преобразовываем отсортированный массив обратно в объект
// ------------------------------------------------------------- //

const points = [
  {
    'Название': 'Пункт 1',
    'РасстояниеОтДепоДоЭтойТочки': depotToPoint1Distance,
    'РасстояниеОтКарьераДоЭтойТочки': careerToPoint1Distance,
    'КоличествоЕздок': tripsToPoint1,
    'ОчередностьОбъезда': sortedQueueList['Point1'],
  },
  {
    'Название': 'Пункт 2',
    'РасстояниеОтДепоДоЭтойТочки': depotToPoint2Distance,
    'РасстояниеОтКарьераДоЭтойТочки': careerToPoint2Distance,
    'КоличествоЕздок': tripsToPoint2,
    'ОчередностьОбъезда': sortedQueueList['Point2'],
  },
  {
    'Название': 'Пункт 3',
    'РасстояниеОтДепоДоЭтойТочки': depotToPoint3Distance,
    'РасстояниеОтКарьераДоЭтойТочки': careerToPoint3Distance,
    'КоличествоЕздок': tripsToPoint3,
    'ОчередностьОбъезда': sortedQueueList['Point3'],
  },
];

points.sort((a, b) => a['ОчередностьОбъезда'] - b['ОчередностьОбъезда']); // Сортируем массив в порядке возрастания

// --- 3. Планирование последних поездок и возвращения в депо -- //

const cars = [
  {
    'Название': 'Машина 1',
    'ОставшеесяВремяРаботы': 8,
    'Пробег': 0,
    'Маршрут': {},
  },
  {
    'Название': 'Машина 2',
    'ОставшеесяВремяРаботы': 8,
    'Пробег': 0,
    'Маршрут': {},
  },
  {
    'Название': 'Машина 3',
    'ОставшеесяВремяРаботы': 8,
    'Пробег': 0,
    'Маршрут': {},
  },
];

const lastPoint = points[points.length - 1];
const numberOfTripsToLastPoint = lastPoint['КоличествоЕздок'] / 3; // Общее к-во ездок в последний пункт делим на 3 авто

let timeForLastTripsAndToDepot = 0;
let mileageToLastPointAndToDepot = 0;
const route = {};
let tripCounter = 0;

for (let i = 0; i < numberOfTripsToLastPoint; i++) {
  if (i !== numberOfTripsToLastPoint - 1) {
    tripCounter += 1;
    timeForLastTripsAndToDepot += (lastPoint['РасстояниеОтКарьераДоЭтойТочки'] * 2) / speed + loadingAndUnloadingTime;
    mileageToLastPointAndToDepot += lastPoint['РасстояниеОтКарьераДоЭтойТочки'] * 2;
    route[lastPoint.Название] = tripCounter;
  } else {
    tripCounter += 1;
    timeForLastTripsAndToDepot += (lastPoint['РасстояниеОтКарьераДоЭтойТочки'] + lastPoint['РасстояниеОтДепоДоЭтойТочки']) / speed + loadingAndUnloadingTime;
    mileageToLastPointAndToDepot += lastPoint['РасстояниеОтКарьераДоЭтойТочки'] + lastPoint['РасстояниеОтДепоДоЭтойТочки'];
    route[lastPoint.Название] = tripCounter;
  } // Если поездка последняя, то машина едет в депо
}

cars.forEach((car) => {
  car.ОставшеесяВремяРаботы -= timeForLastTripsAndToDepot;
  car.Пробег += mileageToLastPointAndToDepot;
  car.Маршрут = { ...route };
}); // Добавляем пробег и последнюю точку для каждой машины

lastPoint.КоличествоЕздок = 0; // Обнуляем И
points.pop(); // Удаляем последнюю точку потому что мы уже распределили с нее все поездки на три маршрута

// ------------------------------------------------------------- //

// ------ 4. Планирование других маршрутов для автомобилей ----- //
for (let i = 0; i < points.length; i++) {
  const point = points[i];

  for (let j = 0; j < cars.length; j++) {
    let tripCounter = 0;
    const car = cars[j];

    while (point.КоличествоЕздок > 0) {
      tripCounter += 1;
      let time = (point['РасстояниеОтКарьераДоЭтойТочки'] * 2) / speed + loadingAndUnloadingTime;
      let mileage = point['РасстояниеОтКарьераДоЭтойТочки'] * 2;

      if (car.ОставшеесяВремяРаботы - time > 0) {
        car.ОставшеесяВремяРаботы -= time;
        car.Пробег += mileage;
        car.Маршрут[point.Название] = tripCounter;
        point.КоличествоЕздок -= 1;
      } else break;
    }
  }
}
// ------------------------------------------------------------- //

// ------------------------------------------------------------- //
// ------------------------------------------------------------- //
// ------------------------------------------------------------- //
// ------------------------------------------------------------- //
// ------------------------------------------------------------- //

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
