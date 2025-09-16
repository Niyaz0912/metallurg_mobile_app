// src/data/mockData.ts

export interface DepartmentMockData {
  welcomeMessage: string;
  stats: Array<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }>;
  recentActivity: string[];
  quickActions: Array<{
    title: string;
    icon: string;
    color: string;
    screen?: string;
  }>;
  chartData?: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  notifications?: Array<{
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';  // ✅ Строгое перечисление
    time: string;
  }>;
}

export const mockData = {
  // 🏢 Административный департамент
  admin: {
    welcomeMessage: "Добро пожаловать, Администратор!",
    stats: [
      { title: "Всего пользователей", value: 24, icon: "👥", color: "#3498db" },
      { title: "Активных отделов", value: 6, icon: "🏢", color: "#2ecc71" },
      { title: "Активных пользователей", value: 18, icon: "✅", color: "#27ae60" },
      { title: "Требует внимания", value: 2, icon: "⚠️", color: "#e74c3c" }
    ],
    recentActivity: [
      "Евдокимов Б.В. добавлен в Производственный отдел",
      "Отчет по качеству за март готов к просмотру",
      "Обновлены настройки системы безопасности",
      "Создан новый проект для коммерческого отдела",
      "Завершено обучение сотрудников HR департамента"
    ],
    quickActions: [
      { title: "Управление пользователями", icon: "👥", color: "#3498db" },
      { title: "Системная аналитика", icon: "📊", color: "#9b59b6" },
      { title: "Настройки системы", icon: "⚙️", color: "#95a5a6" },
      { title: "Отчеты департаментов", icon: "📋", color: "#34495e" }
    ],
    chartData: [
      { label: "Производственный", value: 95, color: "#e74c3c" },
      { label: "Коммерческий", value: 87, color: "#3498db" },
      { label: "Качество", value: 92, color: "#2ecc71" },
      { label: "HR", value: 89, color: "#f39c12" },
      { label: "Финансовый", value: 94, color: "#9b59b6" }
    ]
  },

  // 🏭 Производственный департамент
  production: {
    welcomeMessage: "Добро пожаловать в Производство!",
    stats: [
      { title: "План на день", value: "150 шт", icon: "🎯", color: "#3498db" },
      { title: "Выполнено", value: "142 шт", icon: "✅", color: "#2ecc71" },
      { title: "Процент выполнения", value: "95%", icon: "📈", color: "#27ae60" },
      { title: "Активные линии", value: 3, icon: "⚡", color: "#f39c12" }
    ],
    recentActivity: [
      "Линия А: завершена партия труб ø50мм - 50 шт",
      "Линия Б: начато производство фланцев - план 80 шт",
      "Проведен технический осмотр оборудования",
      "Обновлена технологическая карта ТК-007",
      "Смена №2: выполнение плана 102%"
    ],
    quickActions: [
      { title: "Технологические карты", icon: "📋", color: "#e74c3c" },
      { title: "Состояние линий", icon: "⚡", color: "#f39c12" },
      { title: "План смены", icon: "📅", color: "#3498db" },
      { title: "Отчет по качеству", icon: "🔍", color: "#2ecc71" }
    ],
    chartData: [
      { label: "Линия А", value: 98, color: "#2ecc71" },
      { label: "Линия Б", value: 85, color: "#f39c12" },
      { label: "Линия В", value: 0, color: "#e74c3c" }
    ],
    notifications: [
      { title: "Линия В", message: "Требуется техническое обслуживание", type: "warning" as const, time: "2 ч назад" },
      { title: "План смены", message: "Перевыполнен на 5%", type: "success" as const, time: "30 мин назад" }
    ]
  },

  // 🔍 Департамент качества  
  quality: {
    welcomeMessage: "Добро пожаловать в отдел Качества!",
    stats: [
      { title: "Проверок сегодня", value: 8, icon: "🔍", color: "#3498db" },
      { title: "Выявлено нарушений", value: 3, icon: "⚠️", color: "#e74c3c" },
      { title: "Устранено", value: 2, icon: "✅", color: "#2ecc71" },
      { title: "Уровень качества", value: "96.2%", icon: "📊", color: "#27ae60" }
    ],
    recentActivity: [
      "Проверка партии №547: обнаружен дефект сварки",
      "Контроль качества продукции линии А - норма",
      "Обновлен чек-лист проверки входящих материалов",
      "Проведен аудит складского помещения №3",
      "Подготовлен отчет по несоответствиям за неделю"
    ],
    quickActions: [
      { title: "Активные проверки", icon: "🔍", color: "#3498db" },
      { title: "Журнал нарушений", icon: "📝", color: "#e74c3c" },
      { title: "Чек-листы", icon: "✅", color: "#2ecc71" },
      { title: "Отчеты качества", icon: "📊", color: "#9b59b6" }
    ],
    notifications: [
      { title: "Критическое нарушение", message: "Партия №547 отклонена", type: "warning" as const, time: "1 ч назад" }
    ]
  },

  // 💰 Коммерческий департамент
  commercial: {
    welcomeMessage: "Добро пожаловать в Коммерцию!",
    stats: [
      { title: "Продажи за день", value: "1.2M ₽", icon: "💰", color: "#2ecc71" },
      { title: "Новые клиенты", value: 3, icon: "👥", color: "#3498db" },
      { title: "Активные сделки", value: 15, icon: "🤝", color: "#f39c12" },
      { title: "Выполнение плана", value: "87%", icon: "🎯", color: "#e67e22" }
    ],
    recentActivity: [
      'Заключен договор с ООО "СтройМонтаж" на 2.5М ₽',
      "Проведена встреча с потенциальным клиентом",
      'Отправлено КП для ЗАО "Нефтегаз" - детали №150-200',
      "Обновлена база контактов - добавлено 12 компаний",
      "Подготовлена презентация новой продукции"
    ],
    quickActions: [
      { title: "CRM система", icon: "👥", color: "#3498db" },
      { title: "Активные сделки", icon: "🤝", color: "#f39c12" },
      { title: "Отчеты продаж", icon: "📊", color: "#2ecc71" },
      { title: "База клиентов", icon: "📞", color: "#9b59b6" }
    ],
    notifications: [
      { title: "Новая сделка", message: "Получен заказ на 3.2М ₽", type: "success" as const, time: "45 мин назад" }
    ]
  },

  // 👥 HR департамент
  hr: {
    welcomeMessage: "Добро пожаловать в HR!",
    stats: [
      { title: "Сотрудников в компании", value: 24, icon: "👥", color: "#3498db" },
      { title: "Новых за месяц", value: 2, icon: "➕", color: "#2ecc71" },
      { title: "На больничном", value: 1, icon: "🏥", color: "#e74c3c" },
      { title: "В отпуске", value: 3, icon: "🏖️", color: "#f39c12" }
    ],
    recentActivity: [
      "Оформлен отпуск для Петрова С.А. с 15.03 по 29.03",
      "Проведено собеседование с кандидатом на инженера",
      "Обновлены трудовые договоры (3 сотрудника)",
      "Подготовлен график отпусков на апрель",
      "Проведен инструктаж по ТБ для новых сотрудников"
    ],
    quickActions: [
      { title: "База сотрудников", icon: "👥", color: "#3498db" },
      { title: "Отпуска и больничные", icon: "📅", color: "#e74c3c" },
      { title: "Документооборот", icon: "📋", color: "#2ecc71" },
      { title: "Подбор персонала", icon: "🎯", color: "#f39c12" }
    ],
    notifications: [
      { title: "Документы", message: "Требуется обновить 3 трудовых договора", type: "info" as const, time: "3 ч назад" }
    ]
  },

  // 💼 Финансовый департамент
  finance: {
    welcomeMessage: "Добро пожаловать в Финансы!",
    stats: [
      { title: "Доходы за месяц", value: "15.2M ₽", icon: "📈", color: "#2ecc71" },
      { title: "Расходы за месяц", value: "12.8M ₽", icon: "📉", color: "#e74c3c" },
      { title: "Прибыль", value: "2.4M ₽", icon: "💰", color: "#27ae60" },
      { title: "Рентабельность", value: "15.8%", icon: "📊", color: "#f39c12" }
    ],
    recentActivity: [
      "Поступила оплата от ООО Газпром - 3.2М ₽",
      "Произведена выплата зарплаты сотрудникам",
      "Подготовлен финансовый отчет за март",
      "Оплачены счета поставщиков - 850К ₽",
      "Обновлен бюджет на апрель 2024"
    ],
    quickActions: [
      { title: "Движение средств", icon: "💰", color: "#2ecc71" },
      { title: "Финансовые отчеты", icon: "📊", color: "#3498db" },
      { title: "Управление бюджетом", icon: "📋", color: "#9b59b6" },
      { title: "Налоги и платежи", icon: "🧾", color: "#e74c3c" }
    ],
    notifications: [
      { title: "Платежи", message: "Подготовлены налоговые документы", type: "info" as const, time: "1 день назад" }
    ]
  }
};

// Функция для получения данных по ID департамента
export const getDepartmentMockData = (departmentId: number): DepartmentMockData => {
  const departmentMap: Record<number, DepartmentMockData> = {
    1: mockData.admin,
    2: mockData.hr,
    3: mockData.quality,
    4: mockData.commercial,
    5: mockData.production,
    6: mockData.finance
  };
  
  return departmentMap[departmentId] || mockData.admin;
};

// Названия департаментов для отображения
export const departmentNames: Record<number, string> = {
  1: "Административный",
  2: "HR департамент",
  3: "Департамент качества",
  4: "Коммерческий департамент", 
  5: "Производственный департамент",
  6: "Финансовый департамент"
};
