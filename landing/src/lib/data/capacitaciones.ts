// Datos de capacitaciones y cursos
export interface Capacitacion {
	id: string;
	slug: string;
	titulo: string;
	descripcion: string;
	descripcionLarga: string;
	imagen: string;
	duracion: string;
	modalidad: 'Virtual' | 'Presencial' | 'Híbrida';
	nivel: 'Básico' | 'Intermedio' | 'Avanzado';
	calificacion: number;
	numeroResenas: number;
	precio: number;
	precioDescuento?: number;
	instructor: string;
	categoria: string;
	temario: string[];
	requisitos: string[];
	certificacion: boolean;
	cupoLimitado?: boolean;
	destacado?: boolean;
}

export const capacitaciones: Capacitacion[] = [
	{
		id: '1',
		slug: 'auditorias-seguridad-industrial',
		titulo: 'Auditorías en Seguridad Industrial',
		descripcion:
			'Aprende a realizar auditorías completas en seguridad industrial según normativas internacionales ISO 45001.',
		descripcionLarga:
			'Curso integral que te capacita para realizar auditorías profesionales en seguridad y salud en el trabajo. Conocerás las mejores prácticas, metodologías de evaluación y cómo generar informes de alto impacto que impulsen la mejora continua en las organizaciones.',
		imagen: '/cursos/auditoria-seguridad.jpg',
		duracion: '40 horas',
		modalidad: 'Virtual',
		nivel: 'Avanzado',
		calificacion: 4.8,
		numeroResenas: 245,
		precio: 850000,
		precioDescuento: 680000,
		instructor: 'Ing. María Fernanda López',
		categoria: 'Auditoría',
		temario: [
			'Introducción a las auditorías de seguridad',
			'Normatividad ISO 45001:2018',
			'Metodologías de evaluación de riesgos',
			'Técnicas de entrevista y observación',
			'Elaboración de listas de chequeo',
			'Redacción de informes técnicos',
			'Seguimiento y cierre de hallazgos',
			'Casos prácticos reales'
		],
		requisitos: [
			'Conocimientos básicos en seguridad y salud en el trabajo',
			'Experiencia en sistemas de gestión (deseable)',
			'Acceso a computador con internet'
		],
		certificacion: true,
		destacado: true
	},
	{
		id: '2',
		slug: 'certificacion-arl',
		titulo: 'Certificación en Gestión de Riesgos Laborales ARL',
		descripcion:
			'Conviértete en experto en gestión de riesgos laborales y obtén tu certificación avalada por las principales ARL del país.',
		descripcionLarga:
			'Programa completo que te prepara para gestionar eficientemente los riesgos laborales en cualquier organización. Incluye normatividad colombiana, casos prácticos y preparación para certificación oficial.',
		imagen: '/cursos/certificacion-arl.jpg',
		duracion: '60 horas',
		modalidad: 'Híbrida',
		nivel: 'Intermedio',
		calificacion: 4.9,
		numeroResenas: 312,
		precio: 1200000,
		precioDescuento: 960000,
		instructor: 'Ing. Carlos Alberto Ruiz',
		categoria: 'Certificación',
		temario: [
			'Marco normativo colombiano en SST',
			'Identificación de peligros y valoración de riesgos',
			'Programa de vigilancia epidemiológica',
			'Plan de emergencias y contingencias',
			'Investigación de accidentes e incidentes',
			'Inspecciones de seguridad',
			'Gestión de contratistas',
			'Preparación para examen de certificación'
		],
		requisitos: [
			'Título profesional o técnico en áreas afines',
			'Mínimo 1 año de experiencia laboral',
			'Compromiso de asistencia mínima del 90%'
		],
		certificacion: true,
		cupoLimitado: true,
		destacado: true
	},
	{
		id: '3',
		slug: 'gestion-documental-digital',
		titulo: 'Gestión Documental Digital para Empresas',
		descripcion:
			'Digitaliza y optimiza los procesos documentales de tu empresa con herramientas modernas y metodologías ágiles.',
		descripcionLarga:
			'Aprende a implementar sistemas de gestión documental digital que mejoren la eficiencia, trazabilidad y seguridad de la información en tu organización. Incluye herramientas como Google Workspace, Microsoft 365 y plataformas especializadas.',
		imagen: '/cursos/gestion-documental.jpg',
		duracion: '32 horas',
		modalidad: 'Virtual',
		nivel: 'Intermedio',
		calificacion: 4.7,
		numeroResenas: 189,
		precio: 720000,
		precioDescuento: 576000,
		instructor: 'Ing. Diana Carolina Suárez',
		categoria: 'Digitalización',
		temario: [
			'Fundamentos de gestión documental',
			'Normatividad sobre archivo digital',
			'Digitalización de documentos físicos',
			'Implementación de flujos de trabajo',
			'Seguridad de la información',
			'Google Workspace para gestión documental',
			'Microsoft 365 y SharePoint',
			'Tableros de control y seguimiento'
		],
		requisitos: [
			'Conocimientos básicos de ofimática',
			'Acceso a herramientas digitales',
			'Interés en transformación digital'
		],
		certificacion: true
	},
	{
		id: '4',
		slug: 'conduccion-defensiva',
		titulo: 'Conducción Defensiva y Seguridad Vial',
		descripcion:
			'Técnicas avanzadas de conducción segura, normatividad vial y prevención de accidentes para conductores profesionales.',
		descripcionLarga:
			'Curso teórico-práctico diseñado para conductores que buscan mejorar sus habilidades al volante y reducir riesgos de siniestralidad. Cumple con la normatividad del PESV (Plan Estratégico de Seguridad Vial).',
		imagen: '/cursos/conduccion-defensiva.jpg',
		duracion: '16 horas',
		modalidad: 'Presencial',
		nivel: 'Básico',
		calificacion: 4.6,
		numeroResenas: 428,
		precio: 380000,
		instructor: 'Esp. Jorge Luis Mendoza',
		categoria: 'Seguridad Vial',
		temario: [
			'Fundamentos de seguridad vial',
			'Normatividad colombiana de tránsito',
			'Técnicas de conducción defensiva',
			'Manejo en condiciones adversas',
			'Prevención de accidentes',
			'Primeros auxilios básicos',
			'Práctica de conducción supervisada',
			'Evaluación final'
		],
		requisitos: [
			'Licencia de conducción vigente',
			'Mínimo 1 año de experiencia conduciendo',
			'Asistencia presencial obligatoria'
		],
		certificacion: true,
		cupoLimitado: true
	},
	{
		id: '5',
		slug: 'auditor-interno-iso-9001',
		titulo: 'Auditor Interno ISO 9001:2015',
		descripcion:
			'Formación completa para convertirte en auditor interno de sistemas de gestión de calidad ISO 9001.',
		descripcionLarga:
			'Programa intensivo que te capacita para planificar, ejecutar y reportar auditorías internas de sistemas de gestión de calidad. Incluye casos prácticos, role-playing y simulación de auditorías reales.',
		imagen: '/cursos/auditor-iso-9001.jpg',
		duracion: '40 horas',
		modalidad: 'Virtual',
		nivel: 'Avanzado',
		calificacion: 4.9,
		numeroResenas: 267,
		precio: 900000,
		precioDescuento: 720000,
		instructor: 'Ing. Gustavo Adolfo Ramírez',
		categoria: 'Auditoría',
		temario: [
			'Introducción a ISO 9001:2015',
			'Principios de gestión de calidad',
			'Planificación de auditorías',
			'Técnicas de auditoría efectivas',
			'Gestión de no conformidades',
			'Elaboración de informes de auditoría',
			'Seguimiento de acciones correctivas',
			'Examen de certificación'
		],
		requisitos: [
			'Conocimiento de la norma ISO 9001',
			'Experiencia en sistemas de gestión (deseable)',
			'Disponibilidad para clases en vivo'
		],
		certificacion: true,
		destacado: true
	},
	{
		id: '6',
		slug: 'ergonomia-puestos-trabajo',
		titulo: 'Ergonomía y Análisis de Puestos de Trabajo',
		descripcion:
			'Identifica y controla factores de riesgo ergonómico para mejorar el bienestar y productividad laboral.',
		descripcionLarga:
			'Curso especializado en evaluación ergonómica de puestos de trabajo, con enfoque práctico en la identificación de riesgos, mediciones antropométricas y diseño de mejoras ergonómicas efectivas.',
		imagen: '/cursos/ergonomia.jpg',
		duracion: '24 horas',
		modalidad: 'Virtual',
		nivel: 'Intermedio',
		calificacion: 4.7,
		numeroResenas: 198,
		precio: 650000,
		precioDescuento: 520000,
		instructor: 'Fisiot. Andrea Carolina Vega',
		categoria: 'Salud Ocupacional',
		temario: [
			'Fundamentos de ergonomía laboral',
			'Biomecánica ocupacional',
			'Evaluación de puestos de trabajo',
			'Métodos de valoración ergonómica',
			'Diseño de estaciones de trabajo',
			'Pausas activas y ejercicios compensatorios',
			'Prevención de lesiones musculoesqueléticas',
			'Casos prácticos y análisis'
		],
		requisitos: [
			'Conocimientos básicos en salud ocupacional',
			'Acceso a herramientas de medición (deseable)',
			'Compromiso con prácticas de mejora continua'
		],
		certificacion: true
	},
	{
		id: '7',
		slug: 'implementacion-iso-45001',
		titulo: 'Implementación de ISO 45001 - Sistema de Gestión SST',
		descripcion:
			'Guía completa para implementar exitosamente un sistema de gestión de seguridad y salud en el trabajo ISO 45001.',
		descripcionLarga:
			'Programa integral que cubre todos los aspectos necesarios para implementar ISO 45001 desde cero, incluyendo diagnóstico, documentación, capacitación del personal y preparación para auditoría de certificación.',
		imagen: '/cursos/iso-45001.jpg',
		duracion: '48 horas',
		modalidad: 'Híbrida',
		nivel: 'Avanzado',
		calificacion: 4.8,
		numeroResenas: 156,
		precio: 1350000,
		precioDescuento: 1080000,
		instructor: 'Ing. Fernando Andrés Castro',
		categoria: 'Consultoría',
		temario: [
			'Requisitos de ISO 45001:2018',
			'Contexto de la organización',
			'Liderazgo y participación',
			'Planificación del SG-SST',
			'Identificación de peligros',
			'Gestión del cambio',
			'Documentación y control',
			'Auditoría interna y mejora continua'
		],
		requisitos: [
			'Profesional o técnico en SST',
			'Experiencia mínima de 2 años',
			'Conocimientos previos en sistemas de gestión'
		],
		certificacion: true,
		cupoLimitado: true
	},
	{
		id: '8',
		slug: 'primeros-auxilios-empresas',
		titulo: 'Primeros Auxilios para Empresas',
		descripcion:
			'Capacitación práctica en primeros auxilios y atención de emergencias médicas en el entorno laboral.',
		descripcionLarga:
			'Curso teórico-práctico que prepara al personal de empresas para actuar eficientemente ante emergencias médicas. Incluye RCP, manejo de heridas, quemaduras y situaciones críticas.',
		imagen: '/cursos/primeros-auxilios.jpg',
		duracion: '16 horas',
		modalidad: 'Presencial',
		nivel: 'Básico',
		calificacion: 4.9,
		numeroResenas: 523,
		precio: 420000,
		instructor: 'Enf. Sandra Milena Parra',
		categoria: 'Salud Ocupacional',
		temario: [
			'Evaluación de la escena',
			'Signos vitales y valoración inicial',
			'RCP básico y DEA',
			'Manejo de obstrucción de vía aérea',
			'Control de hemorragias',
			'Inmovilización y traslado',
			'Atención de quemaduras',
			'Botiquín empresarial'
		],
		requisitos: [
			'Ningún requisito previo',
			'Disponibilidad para prácticas presenciales',
			'Ropa cómoda para ejercicios prácticos'
		],
		certificacion: true
	},
	{
		id: '9',
		slug: 'liderazgo-desarrollo-humano',
		titulo: 'Liderazgo y Desarrollo Humano',
		descripcion:
			'Desarrolla habilidades de liderazgo efectivo, inteligencia emocional y gestión de equipos de alto rendimiento.',
		descripcionLarga:
			'Programa transformador que potencia tus habilidades de liderazgo personal y organizacional. Aprende a inspirar equipos, gestionar conflictos y crear culturas de trabajo positivas y productivas.',
		imagen: '/cursos/liderazgo.jpg',
		duracion: '20 horas',
		modalidad: 'Virtual',
		nivel: 'Intermedio',
		calificacion: 4.8,
		numeroResenas: 341,
		precio: 580000,
		precioDescuento: 464000,
		instructor: 'Psic. Roberto Carlos Mendoza',
		categoria: 'Desarrollo Humano',
		temario: [
			'Fundamentos del liderazgo moderno',
			'Inteligencia emocional aplicada',
			'Comunicación asertiva',
			'Gestión de conflictos',
			'Trabajo en equipo',
			'Motivación y compromiso',
			'Cultura organizacional',
			'Plan de desarrollo personal'
		],
		requisitos: [
			'Apertura al autoconocimiento',
			'Disposición para actividades prácticas',
			'Compromiso con el desarrollo personal'
		],
		certificacion: true,
		destacado: true
	},
	{
		id: '10',
		slug: 'matriz-riesgos-peligros',
		titulo: 'Elaboración de Matriz de Riesgos y Peligros',
		descripcion:
			'Aprende a identificar, valorar y controlar peligros mediante matrices de riesgo efectivas y actualizadas.',
		descripcionLarga:
			'Curso especializado en la construcción de matrices de identificación de peligros, evaluación y valoración de riesgos según la GTC 45. Incluye herramientas digitales y casos prácticos de diferentes sectores.',
		imagen: '/cursos/matriz-riesgos.jpg',
		duracion: '24 horas',
		modalidad: 'Virtual',
		nivel: 'Intermedio',
		calificacion: 4.7,
		numeroResenas: 214,
		precio: 680000,
		precioDescuento: 544000,
		instructor: 'Ing. Claudia Marcela Ospina',
		categoria: 'Consultoría',
		temario: [
			'Marco normativo de la GTC 45',
			'Clasificación de peligros',
			'Metodologías de valoración',
			'Determinación de controles',
			'Uso de herramientas digitales',
			'Actualización y mantenimiento',
			'Comunicación de riesgos',
			'Taller práctico sectorial'
		],
		requisitos: [
			'Conocimientos básicos en SST',
			'Manejo de Excel (nivel intermedio)',
			'Experiencia laboral (deseable)'
		],
		certificacion: true
	}
];

export const categorias = [
	'Todas',
	'Auditoría',
	'Certificación',
	'Consultoría',
	'Digitalización',
	'Seguridad Vial',
	'Salud Ocupacional',
	'Desarrollo Humano'
];

export const modalidades = ['Todas', 'Virtual', 'Presencial', 'Híbrida'];

export const niveles = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];
