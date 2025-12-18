export default {
  units: {
    // Группы единиц
    groups: {
      counting: "Count",
      time: "Time",
      distance: "Distance and Movement",
      health: "Health and Nutrition",
      reading: "Reading and Learning",
      finance: "Finance",
    },
    
    // Единицы подсчёта
    counting: {
      times: "times",
      pieces: "pieces",
      points: "points",
      sets: "sets",
      tasks: "tasks",
    },
    
    // Единицы времени
    time: {
      minutes: "minutes",
      hours: "hours",
    },
    
    // Единицы расстояния и движения
    distance: {
      steps: "steps",
      kilometers: "kilometers",
      meters: "meters",
    },
    
    // Единицы веса
    weight: {
      kilograms: "kilograms",
      grams: "grams",
    },
    
    // Единицы объёма
    volume: {
      glasses: "glasses",
      liters: "liters",
      milliliters: "milliliters",
      portions: "portions",
      cups: "cups",
    },
    
    // Калории
    calories: {
      calories: "calories",
    },
    
    // Чтение
    reading: {
      pages: "pages",
      words: "words",
      chapters: "chapters",
    },
    
    // Валюты
    currency: {
      rub: "rub.",
      usd: "$",
      eur: "€",
    },
  }
} as const;
