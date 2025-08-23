export const generateRandomUser = () => {
  const adjectives = [
    "Смелый",
    "Умный",
    "Быстрый",
    "Добрый",
    "Веселый",
    "Мудрый",
    "Сильный",
    "Ловкий",
    "Храбрый",
    "Честный",
  ];
  const nouns = [
    "Волк",
    "Лев",
    "Орел",
    "Дракон",
    "Тигр",
    "Медведь",
    "Сокол",
    "Пантера",
    "Феникс",
    "Барс",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
};
