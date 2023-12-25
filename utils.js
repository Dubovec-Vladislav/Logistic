// Вспомогательная функция для вычисления фактической грузоподъемности
function getActualLiftingCapacity() {
  return transportCharacteristics.liftingCapacity * transportCharacteristics.capacityUtilizationFactor;
}

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
function planLastTripsAndReturn(cars, points) {
  const lastPoint = points.pop();
  const numberOfTripsToLastPoint = lastPoint.КоличествоЕздок / cars.length;

  let timeForLastTripsAndToDepot = 0;
  let mileageToLastPointAndToDepot = 0;
  const route = {};
  let tripCounter = 0;

  for (let i = 0; i < numberOfTripsToLastPoint; i++) {
    tripCounter += 1;
    const isLastTrip = i === numberOfTripsToLastPoint - 1;
    const distanceToCareer = lastPoint.РасстояниеОтКарьераДоЭтойТочки;
    const distanceToDepot = lastPoint.РасстояниеОтДепоДоЭтойТочки;

    timeForLastTripsAndToDepot += isLastTrip
      ? (distanceToCareer + distanceToDepot) / transportCharacteristics.speed + transportCharacteristics.loadingAndUnloadingTime
      : (distanceToCareer * 2) / transportCharacteristics.speed + transportCharacteristics.loadingAndUnloadingTime;

    mileageToLastPointAndToDepot += isLastTrip ? distanceToCareer + distanceToDepot : distanceToCareer * 2;

    route[lastPoint.Название] = tripCounter;
  }

  cars.forEach((car) => {
    car.ОставшеесяВремяРаботы -= timeForLastTripsAndToDepot;
    car.Пробег += mileageToLastPointAndToDepot;
    car.Маршрут = { ...route };
  });

  lastPoint.КоличествоЕздок = 0;
}
// ------------------------------------------------------------- //

// ------- Планирование других маршрутов для автомобилей ------- //
function planOtherRoutes(cars, points) {
  for (const point of points) {
    for (const car of cars) {
      let tripCounter = 0;

      while (point.КоличествоЕздок > 0 && car.ОставшеесяВремяРаботы > 0) {
        tripCounter += 1;
        const time = (point['РасстояниеОтКарьераДоЭтойТочки'] * 2) / transportCharacteristics.speed + transportCharacteristics.loadingAndUnloadingTime;
        const mileage = point['РасстояниеОтКарьераДоЭтойТочки'] * 2;

        if (car.ОставшеесяВремяРаботы - time > 0) {
          car.ОставшеесяВремяРаботы -= time;
          car.Пробег += mileage;
          car.Маршрут[point.Название] = tripCounter;
          point.КоличествоЕздок -= 1;
        } else break;
      }
    }
  }
}
// ------------------------------------------------------------- //
