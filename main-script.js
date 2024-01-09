let NUMBER_OF_CARS;

function calculateData() {
  const pointCount = document.getElementById('pointCount').value;
  NUMBER_OF_CARS = parseInt(document.getElementById('carCount').value);

  const depotToPointsDistances = [];
  const careerToPointsDistances = [];
  const needs = [];

  for (let i = 0; i < pointCount; i++) {
    const depotDistance = parseFloat(document.getElementById(`depotDistance${i}`).value);
    const careerDistance = parseFloat(document.getElementById(`careerDistance${i}`).value);
    const pointNeeds = parseFloat(document.getElementById(`needs${i}`).value);
    depotToPointsDistances.push(depotDistance);
    careerToPointsDistances.push(careerDistance);
    needs.push(pointNeeds);
  }

  const transport = {
    speed: parseFloat(document.getElementById('speed').value),
    liftingCapacity: parseFloat(document.getElementById('liftingCapacity').value),
    capacityUtilizationFactor: parseFloat(document.getElementById('capacityUtilizationFactor').value),
    loadingAndUnloadingTime: parseFloat(document.getElementById('loadingAndUnloadingTime').value),
  };

  main(depotToPointsDistances, careerToPointsDistances, needs, transport);
}

function main(depotToPointsDistances, careerToPointsDistances, needs, transport) {
  // -------- Транспортные характеристики ------ //
  const actualLiftingCapacity = transport.liftingCapacity * transport.capacityUtilizationFactor;
  // ----------------------------------------- //

  // ---------- Информация о точках ---------- //
  const pointsInfo = Array.from({ length: depotToPointsDistances.length }, (_, index) => ({
    name: `Пункт ${index + 1}`,
    depotTo: depotToPointsDistances[index],
    careerTo: careerToPointsDistances[index],
    need: needs[index],
  }));
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
    Потребность: needs[index],
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
  planLastTripsAndReturn(cars, points, transport, actualLiftingCapacity);

  // Планирование других маршрутов для автомобилей
  planOtherRoutes(cars, points, transport, actualLiftingCapacity);

  swapFirstRouteKeyValue(cars);

  // Планирование других маршрутов для автомобилей
  const percent = calculateCompletionPercentage(points, pointsInfo);

  dataOutput(cars, points, percent);
  // ------------------------------------------------------------- //
}
