/** Contenido de la página de postulación. Vive aparte para no inflar el `.svelte`. */

export interface Perfil {
	titulo: string;
	descripcion: string;
	requisitos: string[];
}

/**
 * Perfiles que SEGISPRO contrata de forma recurrente. No son vacantes con
 * fecha y ubicación, así que no llevan `JobPosting`: marcar como oferta algo
 * que no lo es expone el dominio a una acción manual de Google.
 */
export const PERFILES: Perfil[] = [
	{
		titulo: 'Auditor interno de sistemas de gestión',
		descripcion:
			'Auditorías internas y a proveedores sobre ISO 9001, ISO 14001 e ISO 45001, con informes que el cliente pueda accionar.',
		requisitos: [
			'Formación como auditor interno en al menos una norma certificable',
			'Experiencia demostrable conduciendo auditorías completas',
			'Redacción técnica: el informe es el entregable'
		]
	},
	{
		titulo: 'Capacitador e instructor en SST',
		descripcion:
			'Formación presencial y virtual en seguridad y salud en el trabajo, seguridad vial, trabajo en alturas y respuesta a emergencias.',
		requisitos: [
			'Licencia vigente en seguridad y salud en el trabajo',
			'Certificaciones específicas según la temática que dicte',
			'Disponibilidad para desplazarse a locación'
		]
	},
	{
		titulo: 'Profesional de consultoría HSEQ',
		descripcion:
			'Diseño, documentación e implementación de sistemas de gestión en empresas públicas y privadas.',
		requisitos: [
			'Profesional en ingeniería, administración o áreas afines',
			'Especialización en SST, calidad o gestión ambiental',
			'Experiencia implementando el Decreto 1072 y la Resolución 0312'
		]
	},
	{
		titulo: 'Especialista en estudios técnicos',
		descripcion:
			'Estudios de iluminación, ruido, psicosocial e inspecciones de puestos de trabajo, con equipos calibrados.',
		requisitos: [
			'Formación específica en higiene ocupacional o ergonomía',
			'Licencia SST vigente',
			'Manejo de instrumentación y protocolos de medición'
		]
	}
];

/** Se ofrecen al postulante en el selector; coinciden con las áreas del portafolio. */
export const AREAS = [
	'Auditoría',
	'Capacitación y formación',
	'Consultoría HSEQ',
	'Estudios técnicos',
	'Interventoría',
	'Seguridad vial',
	'Digitalización',
	'Otra'
];

export const PASOS = [
	{
		titulo: 'Envías tu hoja de vida',
		detalle:
			'El formulario acepta PDF, DOC y DOCX hasta 8 MB. Los datos que dejes son los que usamos para contactarte.'
	},
	{
		titulo: 'La revisa el equipo',
		detalle:
			'Quien gestiona hojas de vida recibe un aviso en el momento. La revisión mira perfil, licencias y región.'
	},
	{
		titulo: 'Entras al banco de profesionales',
		detalle:
			'Si el perfil encaja, quedas registrado y te buscamos cuando salga una actividad de tu especialidad y tu zona.'
	},
	{
		titulo: 'Trabajas por actividad',
		detalle:
			'La contratación es por servicio prestado, no por nómina fija. Cada actividad se pacta con su alcance, sus fechas y su tarifa.'
	}
];

export const PREGUNTAS = [
	{
		pregunta: '¿SEGISPRO contrata por nómina o por prestación de servicios?',
		respuesta:
			'La red de profesionales trabaja por actividad: cada servicio se pacta con su alcance, sus fechas y su tarifa. No es una vinculación laboral por nómina.'
	},
	{
		pregunta: '¿Qué formación necesito para capacitar en seguridad y salud en el trabajo?',
		respuesta:
			'Licencia vigente en seguridad y salud en el trabajo expedida por la secretaría de salud, más las certificaciones específicas de la temática que vayas a dictar: trabajo en alturas, espacios confinados, seguridad vial o primeros auxilios, según el caso.'
	},
	{
		pregunta: '¿Puedo postularme si no vivo en Casanare?',
		respuesta:
			'Sí. Operamos en Casanare, Meta, Boyacá, Bogotá D.C. y Cundinamarca, y buena parte de las actividades exigen desplazamiento a locación. Indica tu ciudad en el formulario para que la revisión tenga en cuenta tu zona.'
	},
	{
		pregunta: '¿Cuánto tarda la respuesta?',
		respuesta:
			'La hoja de vida entra al banco de profesionales en cuanto se revisa. El contacto llega cuando aparece una actividad que encaja con tu perfil y tu región, así que puede pasar tiempo entre el envío y la primera propuesta.'
	},
	{
		pregunta: '¿Qué hacen con mis datos personales?',
		respuesta:
			'Se usan únicamente para evaluar tu perfil y contactarte por oportunidades. El tratamiento se rige por nuestra política de privacidad, conforme a la Ley 1581 de 2012.'
	}
];
