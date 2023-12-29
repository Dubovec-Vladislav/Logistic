let NUMBER_OF_CARS = 3;

// ---------- Информация о точках ---------- //
const depotToCareerDistance = 6; // Расстояние от депо до карьера
const depotToPointsDistances = [10, 8, 13]; // Расстояния от депо до каждой точки
const careerToPointsDistances = [18, 12, 7]; // Расстояния от карьера до каждой точки
const needs = [30, 40, 50]; // Потребности для каждой точки

const pointsInfo = Array.from({ length: depotToPointsDistances.length }, (_, index) => ({
  name: `Пункт ${index + 1}`,
  depotTo: depotToPointsDistances[index],
  careerTo: careerToPointsDistances[index],
  need: needs[index],
}));
// ----------------------------------------- //

// -------- Транспортные характеристики ------ //
const transportCharacteristics = {
  speed: 40,
  liftingCapacity: 6,
  capacityUtilizationFactor: 0.9,
  loadingAndUnloadingTime: 0.33,
};

const actualLiftingCapacity = transportCharacteristics.liftingCapacity * transportCharacteristics.capacityUtilizationFactor;
// ----------------------------------------- //

// ------- 1. Определение количество ездок в каждую точку ------ //
const trips = pointsInfo.map((point) => Math.ceil(point.need / actualLiftingCapacity));
// ------------------------------------------------------------- //

// ------------- 2. Определение очередности объезда ------------ //
const queueList = getSortedQueueList(pointsInfo); // -> { Point3: 1, Point2: 2, Point1: 3 }

// Формирование информации о точках
const points = pointsInfo.map((point, index) => ({
  Название: point.name,
  РасстояниеОтДепоДоЭтойТочки: point.depotTo,
  РасстояниеОтКарьераДоЭтойТочки: point.careerTo,
  КоличествоЕздок: trips[index],
  ОчередностьОбъезда: queueList[`Point${index + 1}`],
  ОставшаясяПотребность: point.need,
}));

// Сортировка точек по порядку объезда
points.sort((a, b) => a['ОчередностьОбъезда'] - b['ОчередностьОбъезда']); // 1 -> 2 -> 3 -> ...
// ------------------------------------------------------------- //

// --- 3. Планирование последних поездок и возвращения в депо -- //

// Информация о машинах
const cars = Array.from({ length: NUMBER_OF_CARS }, (_, index) => ({
  'Название': `Машина ${index + 1}`,
  'ОставшеесяВремяРаботы': 8,
  'Пробег': 0,
  'Маршрут': {},
}));

// Планирование последних поездок и возвращения в депо
planLastTripsAndReturn(cars, points);

// Планирование других маршрутов для автомобилей
planOtherRoutes(cars, points);

// Планирование других маршрутов для автомобилей
const percent = calculateCompletionPercentage(points, pointsInfo);
// ------------------------------------------------------------- //
