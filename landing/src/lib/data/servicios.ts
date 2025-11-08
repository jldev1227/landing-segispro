export interface ServiceDetail {
	slug: string;
	title: string;
	icon: string;
	tagline: string;
	description: string;
	benefits: string[];
	features?: {
		title: string;
		items: string[];
	};
	standards?: {
		code: string;
		name: string;
		description: string;
	}[];
	additionalSections?: {
		title: string;
		content: string;
		items?: string[];
	}[];
}

export const serviciosData: Record<string, ServiceDetail> = {
	'consultoria-asesoria': {
		slug: 'consultoria-asesoria',
		title: 'Consultoría y Auditoría',
		icon: '🧩',
		tagline: 'Transformamos sistemas en resultados medibles.',
		description: `En Segispro Ingeniería SAS, la consultoría es una alianza estratégica para dinamizar la gestión organizacional. Acompañamos a empresas públicas y privadas en el diseño, documentación, implementación y evaluación de sistemas de gestión, alineados con estándares nacionales e internacionales. Cada intervención se adapta al contexto, con enfoque técnico, humano y sostenible, e integra herramientas digitales que facilitan el seguimiento, la trazabilidad y la toma de decisiones en tiempo real.`,
		benefits: [
			'Diagnósticos claros y planes de trabajo trazables',
			'Implementación efectiva con soporte técnico y humano',
			'Preparación sólida para certificaciones y auditorías externas',
			'Identificación de oportunidades reales de mejora',
			'Toma de decisiones basadas en evidencia',
			'Fortalecimiento de la cultura preventiva y el cumplimiento normativo',
			'Gestión más ágil y conectada gracias a soluciones digitales',
			'Selección de proveedores confiables y competentes',
			'Optimización de recursos y tiempos mediante herramientas digitales'
		],
		additionalSections: [
			{
				title: '🧩 Consultoría',
				content:
					'Transformamos sistemas en resultados medibles. En Segispro Ingeniería SAS, la consultoría es una alianza estratégica para dinamizar la gestión organizacional. Acompañamos a empresas públicas y privadas en el diseño, documentación, implementación y evaluación de sistemas de gestión, alineados con estándares nacionales e internacionales. Cada intervención se adapta al contexto, con enfoque técnico, humano y sostenible, e integra herramientas digitales que facilitan el seguimiento, la trazabilidad y la toma de decisiones en tiempo real.'
			},
			{
				title: '🔍 Auditoría',
				content:
					'Auditorías que enseñan, transforman y generan confianza. La auditoría no es solo verificación: es una herramienta estratégica para el aprendizaje, la mejora continua y el fortalecimiento institucional. Realizamos auditorías internas y a proveedores, orientadas a normas certificables, con enfoque ético, práctico y formativo. Incorporamos plataformas digitales, formularios inteligentes y tableros de control que dinamizan el ejercicio, facilitan la trazabilidad y permiten visualizar hallazgos en tiempo real.'
			},
			{
				title: '🤝 Auditoría a Proveedores',
				content:
					'Confianza que se construye desde la verificación. Evaluamos el desempeño de proveedores y contratistas frente a requisitos técnicos, normativos y estratégicos. Nuestras auditorías fortalecen la cadena de valor, previenen riesgos y aseguran que cada aliado esté alineado con los estándares de la organización.'
			}
		],
		standards: [
			{
				code: 'ISO 9001',
				name: 'Gestión de calidad',
				description: 'Mejora continua, eficiencia operativa y satisfacción del cliente.'
			},
			{
				code: 'ISO 14001',
				name: 'Gestión ambiental',
				description: 'Control de impactos, cumplimiento legal y sostenibilidad.'
			},
			{
				code: 'ISO 45001',
				name: 'Seguridad y salud en el trabajo',
				description: 'Prevención de riesgos laborales y cultura organizacional segura.'
			},
			{
				code: 'ISO 39001',
				name: 'Seguridad vial',
				description: 'Reducción de siniestros y gestión del riesgo en movilidad corporativa.'
			},
			{
				code: 'ISO 22000',
				name: 'Inocuidad alimentaria',
				description: 'Seguridad sanitaria en toda la cadena productiva.'
			},
			{
				code: 'ISO 27001',
				name: 'Seguridad de la información',
				description: 'Protección de datos y confianza institucional.'
			},
			{
				code: 'ISO 14064',
				name: 'Huella de carbono',
				description: 'Medición de emisiones y transición climática responsable.'
			},
			{
				code: 'ISO 50001',
				name: 'Gestión de energía',
				description: 'Eficiencia energética y reducción de costos operativos.'
			},
			{
				code: 'ISO 55001',
				name: 'Gestión de activos',
				description: 'Trazabilidad, planificación y extensión de vida útil.'
			},
			{
				code: 'ISO 28000',
				name: 'Seguridad en la cadena de suministro',
				description: 'Prevención de riesgos logísticos y confianza comercial.'
			},
			{
				code: 'ISO 26000',
				name: 'Responsabilidad social',
				description: 'Compromiso ético y fortalecimiento institucional.'
			},
			{
				code: 'BASC',
				name: 'Comercio seguro internacional',
				description: 'Prevención de ilícitos y acceso a mercados globales.'
			},
			{
				code: 'NORSOK S-006',
				name: 'Gestión HSE para contratistas',
				description: 'Estándares en sectores de alto riesgo.'
			},
			{
				code: 'RUC / RUC Transporte',
				name: 'Evaluación de contratistas en SST y ambiente',
				description: 'Cumplimiento legal y fortalecimiento de relaciones.'
			},
			{
				code: 'Normas logísticas',
				name: 'NTC, ISO, sectoriales',
				description: 'Optimización de transporte, almacenamiento y distribución.'
			},
			{
				code: 'NTC Sectoriales',
				name: 'Turismo, sostenibilidad y calidad',
				description: 'Posicionamiento en mercados especializados.'
			},
			{
				code: 'SG-SST',
				name: 'Decreto 1072 de 2015',
				description: 'Sistema obligatorio de gestión en SST para todas las empresas.'
			},
			{
				code: 'Resolución 40595',
				name: 'PESV',
				description: 'Plan Estratégico de Seguridad Vial para organizaciones con flota vehicular.'
			},
			{
				code: 'Resolución 2328',
				name: 'SARLAFT',
				description: 'Prevención de lavado de activos y financiación del terrorismo.'
			},
			{
				code: 'TRAST',
				name: 'Transporte terrestre automotor',
				description: 'Requisitos técnicos y operativos para empresas del sector.'
			}
		]
	},

	formacion: {
		slug: 'formacion',
		title: 'Formación, Capacitación y Campañas',
		icon: '🎓',
		tagline: 'Formamos equipos que inspiran, previenen y transforman.',
		description: `En Segispro Ingeniería SAS, la formación no es solo transferencia de conocimiento: es una experiencia que moviliza, conecta y transforma. Diseñamos programas a la medida que fortalecen la cultura organizacional, el talento humano y la gestión preventiva, integrando metodologías participativas, herramientas digitales y narrativas institucionales que generan impacto real.`,
		benefits: [
			'Equipos más competentes, motivados y alineados con la estrategia',
			'Cumplimiento legal trazable y documentado',
			'Fortalecimiento de la cultura preventiva, ética y de liderazgo',
			'Ambientes laborales más seguros, saludables y conectados',
			'Reputación institucional fortalecida ante clientes y entes reguladores',
			'Resultados medibles en cultura preventiva y gestión del cambio',
			'Experiencias formativas memorables, prácticas y emocionalmente conectadas'
		],
		additionalSections: [
			{
				title: '🧠 Formación Especializada',
				content:
					'Programas que conectan el saber técnico con el propósito institucional. Ofrecemos cursos y capacitaciones diseñadas para fortalecer competencias, cumplir requisitos normativos y transformar el clima organizacional.',
				items: [
					'Manejo defensivo – Promueve conductas seguras al volante, reduce incidentes y fortalece la responsabilidad vial',
					'Mercancías peligrosas – Asegura el manejo responsable de sustancias críticas, protegiendo la operación y el entorno',
					'Técnico en comando de incidentes – Fortalece la capacidad de respuesta ante emergencias, organizando equipos y recursos con eficacia',
					'Auditoría interna y sistemas de gestión – Desarrolla habilidades para evaluar procesos, identificar mejoras y asegurar cumplimiento',
					'Ergonomía y análisis de riesgos – Previene lesiones laborales y mejora la productividad mediante el diseño de espacios seguros',
					'Gestión documental – Optimiza el manejo de la información, asegurando trazabilidad, orden y cumplimiento normativo',
					'Conducción preventiva – Refuerza la conciencia vial y la anticipación de riesgos en contextos operativos',
					'Inocuidad alimentaria – Protege la salud del consumidor y fortalece la calidad en procesos productivos',
					'Seguridad de la información – Resguarda datos sensibles y fortalece la confianza institucional frente a riesgos tecnológicos',
					'Desarrollo humano y liderazgo – Potencia habilidades blandas, mejora el clima laboral y promueve el crecimiento personal'
				]
			},
			{
				title: '🎓 Modalidades',
				content: '',
				items: [
					'In-Company: adaptados al contexto y objetivos del cliente',
					'Certificables: con respaldo académico y trazabilidad',
					'Vivenciales: para conductores y equipos operativos',
					'Humanistas: para fortalecer habilidades blandas y bienestar laboral'
				]
			},
			{
				title: '🚧 Campañas Institucionales',
				content:
					'Intervenciones que movilizan la cultura preventiva. Diseñamos campañas que sensibilizan, educan y transforman comportamientos, integrando recursos visuales, gamificación y formatos digitales.',
				items: [
					'Seguridad vial – Sensibiliza sobre conductas responsables en la vía, reduciendo siniestros y fortaleciendo la cultura preventiva',
					'Estilos de vida saludable – Promueve hábitos que mejoran el bienestar físico, emocional y laboral',
					'Identificación de peligros – Fortalece la percepción del riesgo y la capacidad de prevención en todos los niveles de la organización',
					'Campañas ambientales – Generan conciencia sobre el impacto ambiental y fomentan prácticas sostenibles',
					'Prevención de enfermedades – Educan sobre factores de riesgo y promueven el autocuidado en entornos laborales',
					'Buenas prácticas laborales – Refuerzan comportamientos éticos, seguros y eficientes en la operación diaria',
					'Cultura ética y responsabilidad social – Conectan los valores institucionales con el comportamiento colectivo, proyectando una imagen responsable'
				]
			},
			{
				title: '🎨 Recursos creativos',
				content: '',
				items: [
					'Personajes institucionales',
					'Retos lúdicos',
					'Señalética y piezas gráficas',
					'Videos, microcápsulas y tableros digitales'
				]
			},
			{
				title: '🛡️ Simulacros y Capacitaciones Normativas',
				content:
					'Preparación que fortalece la respuesta y el cumplimiento legal. Ejecutamos simulacros y capacitaciones alineadas con normativas SST, ambientales y viales, que fortalecen la cultura preventiva y la capacidad de respuesta.',
				items: [
					'Simulacros ambientales – Preparan a los equipos para responder ante emergencias ecológicas, minimizando impactos',
					'Simulacros viales – Fortalecen la reacción ante incidentes en carretera, mejorando la seguridad operativa',
					'Simulacros de primeros auxilios – Capacitan en atención inmediata, salvando vidas y reduciendo consecuencias graves',
					'Capacitaciones en norma SG-SST – Aseguran el cumplimiento legal en seguridad y salud, fortaleciendo la cultura preventiva',
					'Evaluación de respuesta ante emergencias – Mide la efectividad de los protocolos y mejora la preparación institucional',
					'Talleres prácticos SST – Refuerzan el conocimiento técnico mediante ejercicios vivenciales y participativos'
				]
			}
		]
	},
	'campanas-estudios': {
		slug: 'campanas-estudios',
		title: 'Estudios',
		icon: '�',
		tagline: 'Evaluamos para transformar.',
		description: `En Segispro Ingeniería SAS, los estudios técnicos no son solo mediciones: son herramientas estratégicas que permiten tomar decisiones informadas, prevenir riesgos y fortalecer la gestión organizacional. Cada diagnóstico se adapta al contexto del cliente, integrando rigor técnico, enfoque humano y trazabilidad digital.`,
		benefits: [
			'Ambientes de trabajo más seguros, saludables y conectados',
			'Cumplimiento legal trazable y documentado',
			'Equipos más conscientes, comprometidos y motivados',
			'Reputación institucional fortalecida ante clientes, aliados y entes reguladores',
			'Resultados medibles en cultura preventiva y gestión del cambio'
		],
		additionalSections: [
			{
				title: '🌿 Estudios Ambientales',
				content: 'Cuidamos el entorno laboral y proyectamos sostenibilidad.',
				items: [
					'Medición de niveles de iluminación (luxometría) – Garantiza confort visual, cumplimiento normativo y prevención de fatiga ocular',
					'Medición de niveles de ruido (sonometría) – Identifica exposiciones sonoras que afectan la salud auditiva y el desempeño laboral',
					'Estudios ambientales generales – Evalúan condiciones físicas del entorno para fortalecer la seguridad, el bienestar y la imagen institucional'
				]
			},
			{
				title: '🩺 Estudios de Salud Laboral',
				content: 'Protegemos el bienestar físico, mental y emocional de los equipos.',
				items: [
					'Diagnóstico de factores psicosociales – Evalúa clima laboral, estrés y carga mental con instrumentos validados y enfoque humano',
					'Tamizajes de salud – Detecta condiciones médicas relevantes para prevenir riesgos y promover el autocuidado',
					'Análisis de puestos de trabajo – Estudia condiciones ergonómicas y funcionales para prevenir lesiones y mejorar la productividad',
					'Evaluación de clima organizacional y percepción de riesgos – Mide la experiencia laboral y fortalece la cultura preventiva'
				]
			},
			{
				title: '🚦 Estudios Viales y Operativos',
				content: 'Fortalecemos la seguridad en movimiento.',
				items: [
					'Monitoreo y medición de velocidad con radar (PESV) – Registra velocidades en operación para prevenir incidentes y cumplir con la Resolución 40595',
					'Simulacros y evaluación de respuesta ante emergencias – Diseña y ejecuta ejercicios que mejoran la preparación institucional y la capacidad de reacción'
				]
			}
		]
	},
	digitalizacion: {
		slug: 'digitalizacion',
		title: 'Digitalización y Proyectos Especiales',
		icon: '⚙️',
		tagline: 'Tecnología que transforma la gestión en agilidad, trazabilidad y control.',
		description: `Impulsamos la optimización de los sistemas de gestión mediante la integración de herramientas tecnológicas, automatización de procesos, formularios inteligentes y apps personalizadas. Digitalizamos matrices, formatos, indicadores, planes de acción y procesos clave, adaptándolos al contexto de cada organización.`,
		benefits: [
			'Simplificación de procesos operativos y administrativos',
			'Ahorro de tiempo en tareas repetitivas y seguimiento documental',
			'Trazabilidad en tiempo real de hallazgos, acciones y cumplimiento',
			'Control centralizado de indicadores, riesgos y requisitos normativos',
			'Mayor preparación para auditorías, certificaciones y toma de decisiones'
		],
		additionalSections: [
			{
				title: '💻 Digitalización',
				content:
					'Tecnología que transforma la gestión en agilidad, trazabilidad y control. Impulsamos la optimización de los sistemas de gestión mediante la integración de herramientas tecnológicas, automatización de procesos, formularios inteligentes y apps personalizadas. Digitalizamos matrices, formatos, indicadores, planes de acción y procesos clave, adaptándolos al contexto de cada organización.'
			},
			{
				title: '¿Qué logramos?',
				content: '',
				items: [
					'Simplificación de procesos operativos y administrativos',
					'Ahorro de tiempo en tareas repetitivas y seguimiento documental',
					'Trazabilidad en tiempo real de hallazgos, acciones y cumplimiento',
					'Control centralizado de indicadores, riesgos y requisitos normativos',
					'Mayor preparación para auditorías, certificaciones y toma de decisiones'
				]
			},
			{
				title: '¿Dónde aplicamos la digitalización?',
				content: '',
				items: [
					'Sistemas de gestión ISO (calidad, ambiente, SST, seguridad vial, activos, energía, información)',
					'Planes estratégicos (PESV, RUC, BASC, NORSOK, SG-SST)',
					'Auditorías internas y a proveedores',
					'Campañas, capacitaciones y estudios técnicos',
					'Evaluaciones psicosociales, simulacros y análisis de puestos de trabajo'
				]
			},
			{
				title: '¿Cómo lo hacemos?',
				content: '',
				items: [
					'Diseño de formatos digitales y automatizados',
					'Integración con plataformas colaborativas (Google Workspace, Microsoft 365, Power BI, entre otras)',
					'Desarrollo de tableros de control y formularios inteligentes',
					'Capacitación en el uso de herramientas y acompañamiento en la implementación'
				]
			}
		]
	},
	'proyectos-especiales': {
		slug: 'proyectos-especiales',
		title: 'Proyectos Especiales',
		icon: '🛠️',
		tagline: 'Soluciones únicas para desafíos únicos.',
		description: `Diseñamos proyectos especiales que nacen de la escucha activa, la co-creación y la comprensión profunda de las necesidades del cliente. Integramos conocimiento técnico, creatividad y herramientas digitales para construir soluciones innovadoras, flexibles y alineadas con los objetivos estratégicos de cada organización.`,
		benefits: [
			'Soluciones alineadas con su realidad, cultura y recursos',
			'Mayor apropiación y sostenibilidad de los resultados',
			'Diferenciación estratégica frente a su sector o competencia',
			'Herramientas únicas que fortalecen su gestión y reputación',
			'Acompañamiento cercano, creativo y comprometido con el impacto'
		],
		additionalSections: [
			{
				title: '🛠️ Proyectos Especiales',
				content:
					'Soluciones únicas para desafíos únicos. Diseñamos proyectos especiales que nacen de la escucha activa, la co-creación y la comprensión profunda de las necesidades del cliente. Integramos conocimiento técnico, creatividad y herramientas digitales para construir soluciones innovadoras, flexibles y alineadas con los objetivos estratégicos de cada organización.'
			},
			{
				title: '¿Qué tipo de proyectos desarrollamos?',
				content: '',
				items: [
					'Modelos de gestión integrados o sectoriales',
					'Herramientas personalizadas para seguimiento, evaluación o formación',
					'Adaptación de normativas a contextos específicos (territoriales, institucionales o sectoriales)',
					'Metodologías, matrices, protocolos o contenidos técnicos a medida',
					'Estrategias de transformación cultural, sostenibilidad o innovación organizacional',
					'Proyectos piloto, laboratorios de aprendizaje o intervenciones de alto impacto'
				]
			},
			{
				title: '¿Qué logran nuestros clientes?',
				content: '',
				items: [
					'Soluciones alineadas con su realidad, cultura y recursos',
					'Mayor apropiación y sostenibilidad de los resultados',
					'Diferenciación estratégica frente a su sector o competencia',
					'Herramientas únicas que fortalecen su gestión y reputación',
					'Acompañamiento cercano, creativo y comprometido con el impacto'
				]
			},
			{
				title: '🚗 Proyecto Integral de Seguridad Vial',
				content:
					'Una estrategia completa para transformar la cultura vial y reducir riesgos operacionales. Este proyecto combina consultoría, auditoría, formación, campañas y control técnico, alineado con la norma ISO 39001 y la Resolución 40595 (PESV). Integra herramientas digitales, gamificación y evaluación técnica para lograr resultados medibles.',
				items: [
					'Plan Estratégico de Seguridad Vial – ISO 39001: Diseño e implementación del PESV con enfoque normativo, estratégico y contextualizado. Mejora la planificación, cumplimiento legal y reducción de siniestros',
					'Auditoría de Seguridad Vial: Evaluación a proveedores para verificar cumplimiento, identificar riesgos y fortalecer la trazabilidad. Mejora continua y preparación para certificaciones',
					'Capacitaciones en Seguridad Vial: Programas gamificados y participativos para fortalecer competencias, conciencia y comportamiento vial. Mayor apropiación del conocimiento y transformación cultural',
					'Campañas en Seguridad Vial: Intervenciones comunicativas que sensibilizan, educan y movilizan a los equipos. Reducción de conductas riesgosas y fortalecimiento de la cultura preventiva',
					'Inspecciones y Puntos de Control: Evaluaciones técnicas con radar de velocidad y otros equipos para monitorear el comportamiento en ruta. Control operativo y prevención de incidentes'
				]
			},
			{
				title: '¿Qué logra el cliente con este enfoque integral?',
				content: '',
				items: [
					'Reducción de siniestros viales y mejora del comportamiento en carretera',
					'Cumplimiento legal ante entes reguladores y certificaciones',
					'Fortalecimiento de la cultura vial y la responsabilidad corporativa',
					'Trazabilidad, control y mejora continua en la operación vehicular',
					'Posicionamiento institucional como organización segura y responsable'
				]
			}
		]
	},
	interventoria: {
		slug: 'interventoria',
		title: 'Interventoría',
		icon: '�',
		tagline: 'Supervisión estratégica que garantiza cumplimiento, calidad y transformación.',
		description: `En Segispro Ingeniería SAS ejercemos interventoría como un servicio especializado que asegura la correcta ejecución de contratos, proyectos y procesos, conforme a los requisitos técnicos, legales, administrativos y normativos vigentes en Colombia. Más que vigilar, acompañamos con visión estratégica, herramientas digitales y observaciones constructivas que promueven la mejora continua.`,
		benefits: [
			'Ejecución alineada con los objetivos, requisitos y tiempos del proyecto',
			'Reducción de desviaciones, riesgos y reprocesos',
			'Fortalecimiento de la calidad, la trazabilidad y la reputación institucional',
			'Acompañamiento experto que transforma la supervisión en aprendizaje y mejora',
			'Cumplimiento normativo conforme a los estándares exigidos por entidades públicas y privadas'
		],
		additionalSections: [
			{
				title: '¿Qué tipo de interventoría realizamos?',
				content: '',
				items: [
					'Proyectos de obras civiles e infraestructura – Supervisamos la ejecución técnica, administrativa y ambiental de obras públicas y privadas, garantizando calidad, trazabilidad y cumplimiento contractual',
					'Proyectos de seguridad vial y transporte – Acompañamos la implementación de planes estratégicos, auditorías, capacitaciones, campañas y puntos de control, asegurando impacto real en la movilidad segura',
					'Implementación de sistemas de gestión – ISO 39001, SG-SST, PESV, BASC, RUC, NORSOK, entre otros, con seguimiento técnico y normativo',
					'Procesos de formación, campañas y estudios técnicos – Supervisamos la ejecución de intervenciones educativas, diagnósticos y simulacros con enfoque participativo y trazable',
					'Proyectos especiales – Supervisión de iniciativas de sostenibilidad, cultura preventiva, transformación digital o innovación organizacional'
				]
			},
			{
				title: '¿Cómo lo hacemos?',
				content: '',
				items: [
					'Aplicación de matrices de seguimiento, control y evaluación',
					'Observaciones estratégicas que promueven la mejora continua',
					'Informes técnicos claros, trazables y orientados a la toma de decisiones',
					'Integración de herramientas digitales para supervisión remota y en campo',
					'Comunicación empática, rigurosa y adaptada al contexto del cliente'
				]
			}
		]
	}
};
