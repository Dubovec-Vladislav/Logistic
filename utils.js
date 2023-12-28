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
  const lastPoint = points[points.length - 1];
  const numberOfTripsToLastPoint = Math.floor(lastPoint.КоличествоЕздок / cars.length) || 1;

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

  cars.forEach((car, index) => {
    if (index < lastPoint.КоличествоЕздок) { // Если мы можем дать машине хоть одну поездку в последний пункт, то мы ее добавляем
      car.ОставшеесяВремяРаботы -= timeForLastTripsAndToDepot;
      car.Пробег += mileageToLastPointAndToDepot;
      car.Маршрут = { ...route };
    }
  });

  lastPoint.КоличествоЕздок -= numberOfTripsToLastPoint * NUMBER_OF_CARS;
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
