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
	consultoria: {
		slug: 'consultoria',
		title: 'Consultoría',
		icon: '🎯',
		tagline: 'Transformamos sistemas en resultados medibles.',
		description: `En Segispro Ingeniería SAS, la consultoría es una alianza estratégica para dinamizar la gestión organizacional. Acompañamos a empresas públicas y privadas en el diseño, documentación, implementación y evaluación de sistemas de gestión, alineados con estándares nacionales e internacionales. Integramos herramientas digitales que facilitan el seguimiento, la trazabilidad y la toma de decisiones en tiempo real. Cada intervención se adapta al contexto, con enfoque técnico, humano y sostenible.`,
		benefits: [
			'Diagnósticos claros y planes de trabajo trazables',
			'Implementación efectiva con soporte técnico y humano',
			'Preparación sólida para certificaciones y auditorías externas',
			'Mejora continua con indicadores que evidencian impacto',
			'Gestión más ágil y conectada gracias a soluciones digitales'
		],
		standards: [
			{
				code: 'ISO 9001',
				name: 'Sistema de gestión de la calidad',
				description: 'Mejoramos la eficiencia operativa y la satisfacción del cliente mediante procesos estandarizados, trazables y orientados al valor.'
			},
			{
				code: 'ISO 14001',
				name: 'Sistema de gestión ambiental',
				description: 'Reducimos impactos ambientales, fortalecemos el cumplimiento legal y proyectamos una imagen responsable y sostenible.'
			},
			{
				code: 'ISO 45001',
				name: 'Sistema de gestión de la seguridad y salud en el trabajo',
				description: 'Prevenimos riesgos laborales, protegemos a los trabajadores y consolidamos una cultura organizacional segura y comprometida.'
			},
			{
				code: 'ISO 39001',
				name: 'Sistema de gestión de la seguridad vial',
				description: 'Diseñamos estrategias que disminuyen siniestros, mejoran la movilidad corporativa y fortalecen la responsabilidad vial.'
			},
			{
				code: 'ISO 22000',
				name: 'Sistema de gestión de la inocuidad alimentaria',
				description: 'Aseguramos la calidad sanitaria en toda la cadena productiva, protegiendo al consumidor y cumpliendo con exigencias internacionales.'
			},
			{
				code: 'ISO 27001',
				name: 'Sistema de gestión de la seguridad de la información',
				description: 'Protegemos datos sensibles, reducimos riesgos tecnológicos y generamos confianza en clientes, aliados y entes reguladores.'
			},
			{
				code: 'ISO 14064',
				name: 'Medición de huella de carbono',
				description: 'Cuantificamos emisiones, trazamos metas de reducción y acompañamos la transición hacia una gestión climáticamente responsable.'
			},
			{
				code: 'ISO 50001',
				name: 'Sistema de gestión de la energía',
				description: 'Optimizamos el uso de la energía, reducimos costos operativos y mejoramos el desempeño ambiental con soluciones digitales.'
			},
			{
				code: 'ISO 55001',
				name: 'Sistema de gestión de activos',
				description: 'Maximizamos el valor de los activos físicos, mejoramos la planificación y extendemos su vida útil con trazabilidad y eficiencia.'
			},
			{
				code: 'ISO 28000',
				name: 'Sistema de gestión de la seguridad en la cadena de suministro',
				description: 'Fortalecemos la trazabilidad, prevenimos riesgos logísticos y mejoramos la confianza comercial en entornos exigentes.'
			},
			{
				code: 'BASC',
				name: 'Comercio seguro internacional',
				description: 'Prevenimos actividades ilícitas, fortalecemos la seguridad logística y facilitamos el acceso a mercados internacionales.'
			},
			{
				code: 'NORSOK S-006',
				name: 'Gestión HSE para contratistas',
				description: 'Estandarizamos requisitos en sectores de alto riesgo, mejoramos la evaluación de contratistas y fortalecemos la gestión HSE.'
			},
			{
				code: 'RUC / RUC Transporte',
				name: 'Evaluación de contratistas en SST y ambiente',
				description: 'Facilitamos el cumplimiento legal, mejoramos el desempeño en seguridad y ambiente, y fortalecemos la relación con empresas contratantes.'
			},
			{
				code: 'ISO 26000',
				name: 'Guía de responsabilidad social empresarial',
				description: 'Fortalecemos el compromiso ético, mejoramos la relación con grupos de interés y proyectamos una imagen institucional responsable.'
			},
			{
				code: 'Resolución 40595',
				name: 'PESV',
				description: 'Diseñamos e implementamos planes viales efectivos que reducen siniestros y dinamizan la gestión de flotas con soluciones digitales.'
			}
		]
	},
	auditoria: {
		slug: 'auditoria',
		title: 'Auditoría',
		icon: '📊',
		tagline: 'Auditorías que enseñan, transforman y generan confianza.',
		description: `En Segispro, la auditoría no es solo verificación: es una herramienta estratégica para el aprendizaje, la mejora continua y el fortalecimiento institucional. Realizamos auditorías orientadas a normas certificables, con enfoque ético, práctico y formativo. Incorporamos plataformas digitales, formularios inteligentes y tableros de control que dinamizan el ejercicio, facilitan la trazabilidad y permiten visualizar hallazgos en tiempo real.`,
		benefits: [
			'Identificar oportunidades reales de mejora',
			'Fortalecer la cultura preventiva y el cumplimiento normativo',
			'Tomar decisiones basadas en evidencia',
			'Prepararse para certificaciones con trazabilidad y confianza',
			'Generar valor desde la auditoría, no solo cumplir con ella',
			'Optimizar recursos y tiempos mediante herramientas digitales'
		],
		standards: [
			{
				code: 'ISO 9001',
				name: 'Sistema de gestión de la calidad',
				description: 'Establece requisitos para mejorar procesos, aumentar la satisfacción del cliente y asegurar la calidad en productos y servicios.'
			},
			{
				code: 'ISO 14001',
				name: 'Sistema de gestión ambiental',
				description: 'Permite controlar los impactos ambientales, cumplir con la legislación vigente y proyectar una imagen responsable y sostenible.'
			},
			{
				code: 'ISO 45001',
				name: 'Sistema de gestión de la seguridad y salud en el trabajo',
				description: 'Ayuda a prevenir accidentes, proteger la salud de los trabajadores y fortalecer la cultura preventiva en la organización.'
			},
			{
				code: 'Resolución 40595',
				name: 'Plan Estratégico de Seguridad Vial (PESV)',
				description: 'Obliga a implementar medidas para reducir la siniestralidad vial en empresas con flota, promoviendo movilidad segura y responsable.'
			},
			{
				code: 'ISO 39001',
				name: 'Sistema de gestión de la seguridad vial',
				description: 'Establece un marco para reducir muertes y lesiones por accidentes de tránsito, especialmente en organizaciones con operación vehicular.'
			},
			{
				code: 'ISO 22000',
				name: 'Sistema de gestión de la inocuidad alimentaria',
				description: 'Asegura la seguridad de los alimentos en toda la cadena productiva, protegiendo al consumidor y cumpliendo con exigencias internacionales.'
			},
			{
				code: 'ISO 27001',
				name: 'Sistema de gestión de la seguridad de la información',
				description: 'Protege la confidencialidad, integridad y disponibilidad de la información, reduciendo riesgos tecnológicos y fortaleciendo la confianza.'
			}
		],
		additionalSections: [
			{
				title: 'Auditoría a proveedores',
				content: 'Confianza que se construye desde la verificación. Evaluamos el desempeño de proveedores y contratistas frente a requisitos técnicos, normativos y estratégicos. Nuestras auditorías fortalecen la cadena de valor, previenen riesgos y aseguran que cada aliado esté alineado con los estándares de la organización.',
				items: [
					'Seleccionar proveedores confiables y competentes',
					'Prevenir incumplimientos que afecten la operación',
					'Fortalecer la trazabilidad y la reputación institucional',
					'Cumplir con requisitos de certificación y licitación'
				]
			}
		]
	},
	formacion: {
		slug: 'formacion',
		title: 'Formación',
		icon: '📚',
		tagline: 'Formamos equipos que inspiran, previenen y transforman.',
		description: `En Segispro Ingeniería SAS, la formación es una experiencia que moviliza el conocimiento, fortalece la cultura organizacional y potencia el talento humano. Diseñamos programas a la medida, con metodologías participativas, herramientas digitales y enfoque motivacional, que conectan el saber técnico con el propósito institucional.`,
		benefits: [
			'Equipos más competentes, motivados y alineados con la estrategia organizacional',
			'Cumplimiento de requisitos legales y normativos en formación',
			'Fortalecimiento de la cultura preventiva, ética y de liderazgo',
			'Transferencia de conocimiento con impacto real en los procesos',
			'Experiencias formativas memorables, prácticas y emocionalmente conectadas'
		],
		features: {
			title: '¿Qué ofrecemos?',
			items: [
				'Capacitaciones empresariales In-Company - Programas diseñados según las necesidades del cliente, alineados con sus objetivos estratégicos y normativos',
				'Cursos certificables - Formación especializada con respaldo académico en auditoría interna, sistemas de gestión, normativas ISO, ergonomía, análisis de riesgos',
				'Cursos para conductores - Formación técnica y vivencial en seguridad vial, conducción defensiva, cultura preventiva y normatividad vigente',
				'Curso de trabajo y desarrollo humano - Habilidades blandas, inteligencia emocional, comunicación asertiva, liderazgo y bienestar laboral',
				'Foros, conversatorios y espacios de reflexión - Escenarios de diálogo y actualización que promueven el intercambio de experiencias'
			]
		}
	},
	'campanas-estudios': {
		slug: 'campanas-estudios',
		title: 'Campañas y Estudios',
		icon: '🔬',
		tagline: 'Intervenciones que movilizan la cultura preventiva y fortalecen la gestión organizacional.',
		description: `En Segispro Ingeniería SAS diseñamos campañas, estudios y diagnósticos que conectan con las personas, transforman comportamientos y aseguran el cumplimiento legal. Cada intervención se adapta al contexto del cliente, integrando recursos visuales, herramientas digitales, gamificación y narrativas institucionales que inspiran acción.`,
		benefits: [
			'Ambientes de trabajo más seguros, saludables y conectados',
			'Cumplimiento legal trazable y documentado',
			'Equipos más conscientes, comprometidos y motivados',
			'Reputación institucional fortalecida ante clientes, aliados y entes reguladores',
			'Resultados medibles en cultura preventiva y gestión del cambio'
		],
		features: {
			title: 'Estudios técnicos y diagnósticos especializados',
			items: [
				'Medición de niveles de iluminación - Evaluamos condiciones lumínicas para garantizar confort visual y cumplimiento normativo',
				'Medición de niveles de ruido - Identificamos exposiciones sonoras que puedan afectar la salud auditiva',
				'Análisis de puestos de trabajo - Estudiamos condiciones físicas, ergonómicas y funcionales',
				'Diagnóstico de factores psicosociales - Evaluamos clima laboral, estrés y carga mental',
				'Simulacros y evaluación de respuesta ante emergencias - Diseñamos y ejecutamos simulacros',
				'Monitoreo y medición de velocidad con radar - Para prevenir incidentes y cumplir con el PESV'
			]
		}
	},
	digitalizacion: {
		slug: 'digitalizacion',
		title: 'Digitalización',
		icon: '⚙️',
		tagline: 'Tecnología que transforma la gestión en agilidad, trazabilidad y control.',
		description: `En Segispro Ingeniería SAS impulsamos la optimización de los sistemas de gestión mediante la integración de herramientas tecnológicas, automatización de procesos, formularios inteligentes y apps personalizadas. Digitalizamos matrices, formatos, indicadores, planes de acción y procesos clave, adaptándolos al contexto de cada organización.`,
		benefits: [
			'Simplificación de procesos operativos y administrativos',
			'Ahorro de tiempo en tareas repetitivas y seguimiento documental',
			'Trazabilidad en tiempo real de hallazgos, acciones y cumplimiento',
			'Control centralizado de indicadores, riesgos y requisitos normativos',
			'Mayor preparación para auditorías, certificaciones y toma de decisiones'
		],
		features: {
			title: '¿Dónde aplicamos la digitalización?',
			items: [
				'Sistemas de gestión ISO (calidad, ambiente, SST, seguridad vial, activos, energía, información)',
				'Planes estratégicos (PESV, RUC, BASC, NORSOK, SG-SST)',
				'Auditorías internas y a proveedores',
				'Campañas, capacitaciones y estudios técnicos',
				'Evaluaciones psicosociales, simulacros y análisis de puestos de trabajo'
			]
		},
		additionalSections: [
			{
				title: '¿Cómo lo hacemos?',
				content: '',
				items: [
					'Diseño de formatos digitales y automatizados',
					'Integración con plataformas colaborativas (Google Workspace, Microsoft 365, Power BI)',
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
		description: `En Segispro Ingeniería SAS entendemos que cada organización tiene retos particulares, por eso diseñamos proyectos especiales que nacen de la escucha activa, la co-creación y la comprensión profunda de las necesidades del cliente. Integramos conocimiento técnico, creatividad y herramientas digitales para construir soluciones innovadoras, flexibles y alineadas con los objetivos estratégicos de cada organización.`,
		benefits: [
			'Soluciones alineadas con su realidad, cultura y recursos',
			'Mayor apropiación y sostenibilidad de los resultados',
			'Diferenciación estratégica frente a su sector o competencia',
			'Herramientas únicas que fortalecen su gestión y reputación',
			'Acompañamiento cercano, creativo y comprometido con el impacto'
		],
		features: {
			title: '¿Qué tipo de proyectos desarrollamos?',
			items: [
				'Diseño e implementación de modelos de gestión integrados o sectoriales',
				'Desarrollo de herramientas personalizadas para seguimiento, evaluación o formación',
				'Adaptación de normativas a contextos específicos (territoriales, institucionales o sectoriales)',
				'Construcción de metodologías, matrices, protocolos o contenidos técnicos a medida',
				'Diseño de estrategias de transformación cultural, sostenibilidad o innovación organizacional',
				'Proyectos piloto, laboratorios de aprendizaje o intervenciones de alto impacto'
			]
		},
		additionalSections: [
			{
				title: 'Proyecto Integral de Seguridad Vial',
				content: 'Una estrategia completa para transformar la cultura vial y reducir riesgos operacionales. Este proyecto combina consultoría, auditoría, formación, campañas y control técnico, alineado con la norma ISO 39001 y la Resolución 40595 (PESV).',
				items: [
					'Plan Estratégico de Seguridad Vial – ISO 39001',
					'Auditoría de Seguridad Vial',
					'Capacitaciones en Seguridad Vial',
					'Campañas en Seguridad Vial',
					'Inspecciones y Puntos de Control'
				]
			}
		]
	},
	interventoria: {
		slug: 'interventoria',
		title: 'Interventoría',
		icon: '🔍',
		tagline: 'Supervisión estratégica que garantiza cumplimiento, calidad y transformación.',
		description: `En Segispro Ingeniería SAS ejercemos interventoría como un servicio especializado que asegura la correcta ejecución de contratos, proyectos y procesos, conforme a los requisitos técnicos, legales, administrativos y normativos vigentes en Colombia. Más que vigilar, acompañamos con visión estratégica, herramientas digitales y observaciones constructivas que promueven la mejora continua.`,
		benefits: [
			'Ejecución alineada con los objetivos, requisitos y tiempos del proyecto',
			'Reducción de desviaciones, riesgos y reprocesos',
			'Fortalecimiento de la calidad, la trazabilidad y la reputación institucional',
			'Acompañamiento experto que transforma la supervisión en aprendizaje y mejora',
			'Cumplimiento normativo conforme a los estándares exigidos por entidades públicas y privadas'
		],
		features: {
			title: '¿Qué tipo de interventoría realizamos?',
			items: [
				'Proyectos de obras civiles e infraestructura - Supervisamos la ejecución técnica, administrativa y ambiental',
				'Proyectos de seguridad vial y transporte - Acompañamos la implementación de planes estratégicos',
				'Implementación de sistemas de gestión - ISO 39001, SG-SST, PESV, BASC, RUC, NORSOK',
				'Procesos de formación, campañas y estudios técnicos - Supervisamos intervenciones educativas',
				'Proyectos especiales - Supervisión de iniciativas de sostenibilidad y transformación digital'
			]
		},
		additionalSections: [
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