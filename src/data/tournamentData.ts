export interface House {
  id: string;
  name: string;
  tag: string;
  logo: string;
  color: string;
  glowColor: string;
  borderColor: string;
  accentBg: string;
}

export interface Discipline {
  id: string;
  name: string;
  type: 'deportivo' | 'cultural';
  typeLabel: string;
  category: 'futbol' | 'voley' | 'atletismo' | 'cultural' | 'esports';
  categoryLabel: string;
  format: string;
  iconName: string;
  xpReward: number;
  location: string;
  rulesSummary: string;
  dates: string;
  isPopular?: boolean;
}

export interface ScheduleEvent {
  stage: string;
  levelNumber: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'inauguracion' | 'clasificatorias' | 'esports' | 'final';
  status: 'completado' | 'en_progreso' | 'proximamente';
}

export const HOUSES: House[] = [
  {
    id: 'san-benito',
    name: 'San Benito Abad',
    tag: 'SBA',
    logo: '/logos/san-benito.png',
    color: 'from-red-600 via-rose-500 to-amber-500',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    borderColor: 'border-red-500/40',
    accentBg: 'bg-red-500/10',
  },
  {
    id: 'san-alberto',
    name: 'San Alberto Hurtado',
    tag: 'SAH',
    logo: '/logos/san-alberto.png',
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    borderColor: 'border-cyan-500/40',
    accentBg: 'bg-cyan-500/10',
  },
  {
    id: 'zuloaga',
    name: 'Escuela Zuloaga',
    tag: 'EZU',
    logo: '/logos/zuloaga.png',
    color: 'from-amber-400 via-yellow-500 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    borderColor: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
  },
  {
    id: 'evita',
    name: 'Escuela Evita',
    tag: 'EVA',
    logo: '/logos/evita.png',
    color: 'from-purple-500 via-fuchsia-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    borderColor: 'border-purple-500/40',
    accentBg: 'bg-purple-500/10',
  },
  {
    id: 'eet-18',
    name: 'Escuela Técnica EET N° 18',
    tag: 'E18',
    logo: '/logos/enet-18.png',
    color: 'from-emerald-500 via-teal-500 to-cyan-600',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    borderColor: 'border-emerald-500/40',
    accentBg: 'bg-emerald-500/10',
  }
];

export const DISCIPLINES: Discipline[] = [
  // --- COMPETENCIAS DEPORTIVAS ---
  {
    id: 'futbol-femenino',
    name: 'Fútbol 9 Femenino',
    type: 'deportivo',
    typeLabel: 'Área Deportiva',
    category: 'futbol',
    categoryLabel: 'Fútbol',
    format: 'Fútbol Femenino',
    iconName: 'trophy',
    xpReward: 550,
    location: 'Complejo Oscar Chapino',
    rulesSummary: 'Partidos de fútbol femenino de duración de 10min de corrido, lista de buenafe de 12 jugadoras.',
    dates: 'Martes 6 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'futbol-11-masculino',
    name: 'Fútbol 11 Masculino',
    type: 'deportivo',
    typeLabel: 'Área Deportiva',
    category: 'futbol',
    categoryLabel: 'Fútbol',
    format: 'Fútbol 11 Masculino',
    iconName: 'trophy',
    xpReward: 600,
    location: 'Complejo Oscar Chapino',
    rulesSummary: 'Enfrentamientos tradicionales de fútbol 11 con duracion de 10min de corrido y lista de buenafe de 18 jugadores.',
    dates: 'Martes 6 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'voley-femenino',
    name: 'Vóley Femenino',
    type: 'deportivo',
    typeLabel: 'Área Deportiva',
    category: 'voley',
    categoryLabel: 'Vóley',
    format: 'Vóley en Equipo Femenino',
    iconName: 'activity',
    xpReward: 500,
    location: 'Parque Vieytes - Gimnasio Techado',
    rulesSummary: 'Partidos de vóley femenino con duracion de 10min y lista de buenafe de 9 jugadoras.',
    dates: 'Miercoles 7 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'voley-masculino',
    name: 'Vóley Masculino',
    type: 'deportivo',
    typeLabel: 'Área Deportiva',
    category: 'voley',
    categoryLabel: 'Vóley',
    format: 'Vóley en Equipo Masculino',
    iconName: 'activity',
    xpReward: 500,
    location: 'Parque Vieytes - Gimnasio Techado',
    rulesSummary: 'Encuentros de vóley masculino con duracion de 10min y lista de buenafe de 9 jugadores.',
    dates: 'Miercoles 7 de Octubre (10:00 a 15:00 hs)'
  },
  {
    id: 'atletismo-femenino',
    name: 'Atletismo Femenino',
    type: 'deportivo',
    typeLabel: 'Área Deportiva',
    category: 'atletismo',
    categoryLabel: 'Atletismo',
    format: 'Pista y Campo Femenino (100m, Salto y Postas)',
    iconName: 'zap',
    xpReward: 480,
    location: 'Parque Vieytes - Pista de Atletismo',
    rulesSummary: 'Jornadas de atletismo femenino con carreras de velocidad de 100m, carrera de relevos y maratón de aproximadamente 2km',
    dates: 'lunes 5 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'atletismo-masculino',
    name: 'Atletismo Masculino',
    type: 'deportivo',
    typeLabel: 'Área Deportiva',
    category: 'atletismo',
    categoryLabel: 'Atletismo',
    format: 'Pista y Campo Masculino (100m, Salto y Postas)',
    iconName: 'zap',
    xpReward: 480,
    location: 'Parque Vieytes - Pista de Atletismo',
    rulesSummary: 'Competencias de atletismo masculino con carreras de velocidad de 100m, carrera de relevos y maratón de aproximadamente 2km',
    dates: 'lunes 5 de Octubre (10:00 a 15:00 hs)'
  },

  // --- ÁREA CULTURAL & JUEGOS ---
  {
    id: 'preguntados',
    name: 'Preguntados Intercolegial',
    type: 'cultural',
    typeLabel: 'Área Cultural',
    category: 'cultural',
    categoryLabel: 'Mente & Cultura',
    format: 'Trivia Escolar por Equipos',
    iconName: 'brain',
    xpReward: 450,
    location: 'Parque Vieytes',
    rulesSummary: 'Juego de preguntas y respuestas sobre la historia de la ciudad de San Benito, se entregara el material a las instituciones, podrá participar un equipo por escuela, cada equipo puede estar compuesto por 6 integrantes max.',
    dates: 'Viernes 9 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
{
    id: 'presentacion_escuelas',
    name: 'Presentación de Escuelas',
    type: 'cultural',
    typeLabel: 'Área Cultural',
    category: 'cultural',
    categoryLabel: 'Cultura',
    format: 'Trivia Escolar por Equipos',
    iconName: 'brain',
    xpReward: 450,
    location: 'Parque Vieytes',
    rulesSummary: 'Cada institución podrá presentar libremente su identidad y espíritu mediante propuestas creativas como murga, coreografías, disfraces, banderas, canciones o representaciones Cada presentación tendrá un máximo de 3 minutos y deberá ser organizada previamente por cada institución.',
    dates: 'Viernes 9 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'truco-trio-mixto',
    name: 'Truco Mixto',
    type: 'cultural',
    typeLabel: 'Área Cultural',
    category: 'cultural',
    categoryLabel: 'Mente & Cultura',
    format: 'Juego de Cartas en Tríos Mixtos (3 vs 3)',
    iconName: 'sparkles',
    xpReward: 420,
    location: 'Parque Vieytes - Galería Principal',
    rulesSummary: 'Juego de cartas en equipos mixtos de 3 integrantes, se juega 9 malas y 9 buenas, pica-pica a partir de la 2da vuelta hasta 6 buenas.',
    dates: 'Jueves 8 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'ea-sports-fc-26',
    name: 'EA Sports FC 27',
    type: 'cultural',
    typeLabel: 'Área Cultural & Gaming',
    category: 'esports',
    categoryLabel: 'Esports & Gaming',
    format: 'Torneo en Consolas / Gaming',
    iconName: 'gamepad-2',
    xpReward: 500,
    location: 'Bibloteca municipal - Punto digital',
    rulesSummary: 'Torneo del simulador de fútbol, donde los representantes gamer de cada escuela se enfrentan en partidos directos,max 3 participantes por institución.',
    dates: 'Jueves 8 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'muestra-talento',
    name: 'Muestra de Talentos',
    type: 'cultural',
    typeLabel: 'Área Cultural',
    category: 'cultural',
    categoryLabel: 'Mente & Cultura',
    format: 'Escenario Abierto y Artístico',
    iconName: 'sparkles',
    xpReward: 650,
    location: 'Parque Vieytes.',
    rulesSummary: 'Espacio de expresión artística y cultural donde los estudiantes muestran sus habilidades en canto, baile, bandas musicales, teatro y expresiones creativas. Se tendra en cuenta la cantidad de participantes, escenografía, indumentaria y originalidad.',
    dates: 'Viernes 9 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'desfile',
    name: 'Desfile',
    type: 'cultural',
    typeLabel: 'Área Cultural',
    category: 'cultural',
    categoryLabel: 'Cultura',
    format: 'Escenario Abierto y Artístico',
    iconName: 'sparkles',
    xpReward: 650,
    location: 'Parque Vieytes.',
    rulesSummary: 'Desfile de rey y reina - princesa y principe. Deberán participar 4 alumnos por escuela, 2 de C.B.C y 2 C.B.O, el desfile tendrá que tener presentador y será una sola pasada.',
    dates: 'Viernes 9 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  },
  {
    id: 'desfile-mascota',
    name: 'Desfile de Mascotas/disfraces',
    type: 'cultural',
    typeLabel: 'Área Cultural',
    category: 'cultural',
    categoryLabel: 'Cultura',
    format: 'Escenario Abierto y Artístico',
    iconName: 'sparkles',
    xpReward: 650,
    location: 'Parque Vieytes.',
    rulesSummary: 'Desfile de mascota o de disfraces por escuela la cual debe tener un significado para la institución o para los alumnos, 2 de C.B.C y 2 de C.B.O, el desfile debera tener presentador/presentadores y sera una sola pasada de gala.',
    dates: 'Viernes 9 de Octubre (10:00 a 15:00 hs)',
    isPopular: true
  }
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    stage: 'NIVEL 01',
    levelNumber: 1,
    title: 'Apertura Oficial: Desfile de las 5 Escuelas & Jornada Inicial',
    date: 'Lunes 5 de Octubre, 2026',
    time: '10:00 a 15:00 HS',
    location: 'Parque Vieytes - Predio Central',
    description: 'Ceremonia inaugural con las 5 delegaciones escolares, juramento deportivo y primeros encuentros en el Parque Vieytes.',
    type: 'inauguracion',
    status: 'proximamente'
  },
  {
    stage: 'NIVEL 02',
    levelNumber: 2,
    title: 'Fase Deportiva: Fútbol, Vóley y Atletismo',
    date: '6 y 7 de Octubre, 2026',
    time: '10:00 a 15:00 HS',
    location: 'Parque Vieytes - Canchas & Pistas',
    description: 'Competencias de Fútbol Femenino y Masculino 11, cruces de Vóley y pruebas de velocidad y salto en Atletismo.',
    type: 'clasificatorias',
    status: 'proximamente'
  },
  {
    stage: 'NIVEL 03',
    levelNumber: 3,
    title: 'Área Cultural & Gaming: Preguntados, Truco y EA Sports FC',
    date: 'Jueves 8 de Octubre, 2026',
    time: '10:00 a 15:00 HS',
    location: 'Parque Vieytes - Galería y Domo Gamer',
    description: 'Rondas de Preguntados, partidas de Truco Trío Mixto, torneos de EA Sports FC 26 y postas atléticas.',
    type: 'esports',
    status: 'proximamente'
  },
  {
    stage: 'BOSS FINAL',
    levelNumber: 4,
    title: 'Gran Gala de Muestra de Talentos & Entrega de Copa 2026',
    date: 'Viernes 9 de Octubre, 2026',
    time: '10:00 a 15:00 HS',
    location: 'Parque Vieytes - Anfiteatro Principal',
    description: 'Presentaciones en vivo de la Muestra de Talentos, finales destacadas y entrega de la Copa Intercolegial 2026.',
    type: 'final',
    status: 'proximamente'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'En un momento decisivo de la competencia en el Parque Vieytes, ¿cuál es tu mayor fortaleza?',
    options: [
      { text: 'Liderar con garra y potencia en fútbol 11 o fútbol femenino para defender la casa', houseId: 'san-benito' },
      { text: 'Armar jugadas en vóley con cabeza fría, solidaridad y estrategia táctica', houseId: 'san-alberto' },
      { text: 'Acelerar a máxima velocidad en atletismo y dominar en EA Sports FC', houseId: 'zuloaga' },
      { text: 'Subir al escenario en la Muestra de Talentos y levantar a todo el público con arte', houseId: 'evita' },
      { text: 'Cantar el truco con picardía, responder en Preguntados y ganar por astucia', houseId: 'eet-18' }
    ]
  },
  {
    id: 2,
    question: '¿En qué área te gustaría brillar más durante los Intercolegiales?',
    options: [
      { text: 'Fútbol 11 Masculino o Fútbol Femenino en cancha principal', houseId: 'san-benito' },
      { text: 'Vóley Femenino / Masculino y responder en el Preguntados escolar', houseId: 'san-alberto' },
      { text: 'Pruebas de velocidad en Atletismo y campeonatos de EA Sports FC 26', houseId: 'zuloaga' },
      { text: 'Canto, baile, bandas en vivo y expresión en la Muestra de Talentos', houseId: 'evita' },
      { text: 'Truco Trío Mixto, postas de atletismo y competencias de destreza', houseId: 'eet-18' }
    ]
  },
  {
    id: 3,
    question: '¿Qué lema define mejor tu actitud en la competencia?',
    options: [
      { text: '"Defendiendo la casa con fuego, honor y corazón."', houseId: 'san-benito' },
      { text: '"Solidaridad, táctica y juego limpio siempre."', houseId: 'san-alberto' },
      { text: '"Velocidad que sorprende, impacto que conquista."', houseId: 'zuloaga' },
      { text: '"Fuerza colectiva, arte y pasión sin límites."', houseId: 'evita' },
      { text: '"Mente ágil, picardía criolla y temple de acero."', houseId: 'eet-18' }
    ]
  }
];
