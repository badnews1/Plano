export default {
  units: {
    // Группы единиц
    groups: {
      counting: "Счёт",
      time: "Время",
      distance: "Расстояние и движение",
      health: "Здоровье и питание",
      reading: "Чтение и обучение",
      finance: "Финансы",
    },
    
    // Единицы подсчёта
    counting: {
      times: "разы",
      pieces: "штуки",
      points: "баллы",
      sets: "подходы",
      tasks: "задачи",
    },
    
    // Единицы времени
    time: {
      minutes: "минуты",
      hours: "часы",
    },
    
    // Единицы расстояния и движения
    distance: {
      steps: "шаги",
      kilometers: "километры",
      meters: "метры",
    },
    
    // Единицы веса
    weight: {
      kilograms: "килограммы",
      grams: "граммы",
    },
    
    // Единицы объёма
    volume: {
      glasses: "стаканы",
      liters: "литры",
      milliliters: "миллилитры",
      portions: "порции",
      cups: "чашки",
    },
    
    // Калории
    calories: {
      calories: "калории",
    },
    
    // Чтение
    reading: {
      pages: "страницы",
      words: "слова",
      chapters: "главы",
    },
    
    // Валюты
    currency: {
      rub: "руб.",
      usd: "$",
      eur: "€",
    },
  }
} as const;
