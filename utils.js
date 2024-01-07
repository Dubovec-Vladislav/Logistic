// Вспомогательная функция для получения отсортированного списка очередности объезда
function getSortedQueueList(pointsInfo) {
  return Object.fromEntries(
    pointsInfo
      .map((point, index) => ({ key: `Point${index + 1}`, value: point.depotTo - point.careerTo }))
      .sort((a, b) => b.value - a.value)
      .map((entry, index) => [entry.key, index + 1])
  );
}

// Вспомогательная для смены первого и последнего пункта маршрута местами
function swapFirstRouteKeyValue(cars) {
  cars.forEach((car) => {
    const route = car.Маршрут;
    const keys = Object.keys(route);
    const values = Object.values(route);

    // Меняем местами первый и последний ключ
    [keys[0], keys[keys.length - 1]] = [keys[keys.length - 1], keys[0]];
    // Меняем местами первое и последнее значение
    [values[0], values[values.length - 1]] = [values[values.length - 1], values[0]];

    // Обновляем поле "Маршрут" в объекте
    car.Маршрут = keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});
  });
}

// ---- Планирование последних поездок и возвращения в депо ---- //

// Функция для расчета времени и пробега до последней точки
function calculateTimeAndMileageToLastPoint(lastPoint, transport, numberOfTrips) {
  let time = 0;
  let mileage = 0;
  const route = {};

  for (let i = 0; i < numberOfTrips; i++) {
    const isLastTrip = i === numberOfTrips - 1;
    const distanceToCareer = lastPoint.РасстояниеОтКарьераДоЭтойТочки;
    const distanceToDepot = lastPoint.РасстояниеОтДепоДоЭтойТочки;

    time += isLastTrip
      ? (distanceToCareer + distanceToDepot) / transport.speed + transport.loadingAndUnloadingTime
      : (distanceToCareer * 2) / transport.speed + transport.loadingAndUnloadingTime;
    mileage += isLastTrip ? distanceToCareer + distanceToDepot : distanceToCareer * 2;

    route[lastPoint.Название] = i + 1;
  }

  return { time, mileage, route };
}

// Функция для обновления данных по каждому автомобилю
function updateCarData(cars, lastPoint, time, mileage, route) {
  cars.slice(0, lastPoint.КоличествоЕздок).forEach((car) => {
    car.ОставшеесяВремяРаботы -= time;
    car.Пробег += mileage;
    car.Маршрут = { ...route };
  });
}

// Функция для обновления данных по последней точке
function updateLastPointData(lastPoint, numberOfTrips) {
  lastPoint.КоличествоЕздок -= numberOfTrips * cars.length;
  if (lastPoint.КоличествоЕздок < 0) lastPoint.КоличествоЕздок = 0;
  lastPoint.ОставшаясяПотребность -= numberOfTrips * cars.length * actualLiftingCapacity;
  if (lastPoint.ОставшаясяПотребность < 0) lastPoint.ОставшаясяПотребность = 0;
}

// Главная функция для планирование последних поездок и возвращения в депо
function planLastTripsAndReturn(cars, points) {
  const lastPoint = points[points.length - 1];
  const numberOfTripsToLastPoint = NUMBER_OF_CARS === points.length ? Math.floor(lastPoint.КоличествоЕздок / cars.length) || 1 : 1;

  const { time, mileage, route } = calculateTimeAndMileageToLastPoint(lastPoint, transport, numberOfTripsToLastPoint);
  updateCarData(cars, lastPoint, time, mileage, route);
  updateLastPointData(lastPoint, numberOfTripsToLastPoint);
}
// ------------------------------------------------------------- //

// ------- Планирование других маршрутов для автомобилей ------- //
function planOtherRoutes(cars, points) {
  for (const point of points) {
    for (const car of cars) {
      let tripCounter = car.Маршрут[point.Название] ? car.Маршрут[point.Название] : 0; // Если у нас уже были ездки на этой машине в этот пункт,
      //  то счетчик начинается с их количества (а не с 0)
      while (point.КоличествоЕздок > 0 && car.ОставшеесяВремяРаботы > 0) {
        tripCounter += 1;
        const mileage = point['РасстояниеОтКарьераДоЭтойТочки'] * 2;
        const time = mileage / transport.speed + transport.loadingAndUnloadingTime;

        if (car.ОставшеесяВремяРаботы - time > 0) {
          car.ОставшеесяВремяРаботы -= time;
          car.Пробег += mileage;
          car.Маршрут[point.Название] = tripCounter;
          point.КоличествоЕздок -= 1;
          point.ОставшаясяПотребность -= actualLiftingCapacity;
          if (point.ОставшаясяПотребность < 0) point.ОставшаясяПотребность = 0;
        } else break;
      }
    }
  }
}
// ------------------------------------------------------------- //

// ------------ Расчет общего % доставленных грузов ------------ //
function calculateCompletionPercentage(points, pointsInfo) {
  const fulfilledNeed = points.reduce((sum, point) => sum + point.ОставшаясяПотребность, 0);
  const totalNeed = pointsInfo.reduce((sum, point) => sum + point.need, 0);
  return 100 - (fulfilledNeed / totalNeed) * 100;
}
// ------------------------------------------------------------- //
