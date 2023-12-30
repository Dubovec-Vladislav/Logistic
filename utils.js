// Вспомогательная функция для получения отсортированного списка очередности объезда
function getSortedQueueList(pointsInfo) {
  return Object.fromEntries(
    pointsInfo
      .map((point, index) => ({ key: `Point${index + 1}`, value: point.depotTo - point.careerTo }))
      .sort((a, b) => b.value - a.value)
      .map((entry, index) => [entry.key, index + 1])
  );
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

    const distanceMultiplier = isLastTrip ? 1 : 2;
    time += (distanceToCareer * distanceMultiplier + distanceToDepot) / transport.speed + transport.loadingAndUnloadingTime;
    mileage += isLastTrip ? distanceToCareer + distanceToDepot : distanceToCareer * 2;

    route[lastPoint.Название] = i + 1;
  }

  return { time, mileage, route };
}

// Функция для обновления данных по каждому автомобилю
function updateCarData(cars, time, mileage, route) {
  cars.slice(0, cars.length).forEach((car) => {
    car.ОставшеесяВремяРаботы -= time;
    car.Пробег += mileage;
    car.Маршрут = { ...route };
  });
}

// Функция для обновления данных по последней точке
function updateLastPointData(lastPoint, numberOfTrips) {
  lastPoint.КоличествоЕздок -= numberOfTrips * cars.length;
  lastPoint.ОставшаясяПотребность -= numberOfTrips * cars.length * actualLiftingCapacity;
  if (lastPoint.ОставшаясяПотребность < 0) lastPoint.ОставшаясяПотребность = 0;
}

// Главная функция для планирование последних поездок и возвращения в депо
function planLastTripsAndReturn(cars, points) {
  const lastPoint = points[points.length - 1];
  const numberOfTripsToLastPoint = Math.floor(lastPoint.КоличествоЕздок / cars.length) || 1;

  const { time, mileage, route } = calculateTimeAndMileageToLastPoint(lastPoint, transport, numberOfTripsToLastPoint);
  updateCarData(cars, time, mileage, route);
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
        const time = (point['РасстояниеОтКарьераДоЭтойТочки'] * 2) / transport.speed + transport.loadingAndUnloadingTime;
        const mileage = point['РасстояниеОтКарьераДоЭтойТочки'] * 2;

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
