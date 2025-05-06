// Массив предметов
export const mockSubjects = [
    { id: 'math', name: 'Математика' },
    { id: 'physics', name: 'Физика' },
    { id: 'informatics', name: 'Информатика' },
  ];
  
  // Темы по каждому предмету
  export const mockTopicsBySubject: Record<string, { id: string; title: string }[]> = {
    math: [
      { id: 'm1', title: 'Алгебра' },
      { id: 'm2', title: 'Геометрия' },
    ],
    physics: [
      { id: 'p1', title: 'Механика' },
      { id: 'p2', title: 'Оптика' },
    ],
    informatics: [
      { id: 'i1', title: 'Программирование' },
      { id: 'i2', title: 'Алгоритмы' },
    ],
  };
  