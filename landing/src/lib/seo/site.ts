/**
 * Constantes de sitio para SEO. Fuente única de verdad: si cambia el dominio,
 * el teléfono o las redes, se cambia aquí y se propaga a metatags, JSON-LD y sitemap.
 */

/**
 * Origen canónico. En producción `www.segispro.com` responde 307 hacia el ápex,
 * así que el canónico debe ser el ápex: apuntar a una URL que redirige obliga a
 * Google a descartar la señal.
 */
export const SITE_URL = 'https://segispro.com';

export const SITE_NAME = 'SEGISPRO Ingeniería';
export const SITE_SHORT_NAME = 'SEGISPRO';
export const SITE_LOCALE = 'es_CO';
export const SITE_LANG = 'es-CO';

export const CONTACT = {
	telefono: '+573104853340',
	telefonoVisible: '+57 310 485 3340',
	email: 'administracion@segispro.com',
	direccion: 'Yopal',
	ciudad: 'Yopal',
	departamento: 'Casanare',
	codigoPostal: '850001',
	pais: 'CO',
	latitud: 5.336674979441651,
	longitud: -72.38573869384264
} as const;

/** Página de Facebook. La usan el grafo `sameAs` y el enlace de novedades. */
export const FACEBOOK_URL = 'https://www.facebook.com/SEGISPRO';

export const SOCIAL = [
	FACEBOOK_URL,
	'https://co.linkedin.com/company/segispro-ingenieria-sas',
	'https://www.instagram.com/segispro_auditores/'
];

export const FUNDACION = '2009';

/**
 * Campus institucional. El catálogo de formación vive allí desde que se retiró
 * de la landing; `hooks.server.ts` redirige `/capacitaciones/*` a `/cursos`.
 */
export const CAMPUS_URL = 'https://formarpro.segispro.com';
export const CAMPUS_CURSOS = `${CAMPUS_URL}/cursos`;

/** Imagen por defecto para Open Graph / Twitter (1200×630). */
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Cobertura geográfica declarada a los buscadores. El orden va de la plaza
 * principal hacia la expansión: Casanare es la sede, el resto es el corredor
 * llanero y el eje Bogotá–Boyacá donde se concentra la demanda de SST.
 */
export interface Region {
	slug: string;
	nombre: string;
	tipo: 'State' | 'City';
	departamento: string;
	ciudades: string[];
	/** Frase que resume por qué operamos allí; alimenta la página de cobertura. */
	enfoque: string;
	sectores: string[];
	/** Retos propios de la región; evita que las páginas de cobertura sean calcadas. */
	retos: string[];
	/** Marco normativo o contractual que más pesa en la zona. */
	normatividad: string;
}

export const REGIONES: Region[] = [
	{
		slug: 'casanare',
		nombre: 'Casanare',
		tipo: 'State',
		departamento: 'Casanare',
		ciudades: [
			'Yopal',
			'Aguazul',
			'Tauramena',
			'Villanueva',
			'Monterrey',
			'Paz de Ariporo',
			'Maní',
			'Trinidad',
			'Orocué',
			'Nunchía'
		],
		enfoque:
			'Sede principal de SEGISPRO. Atendemos operaciones de hidrocarburos, obra civil, agroindustria y entidades públicas con acompañamiento presencial permanente en campo.',
		sectores: ['Hidrocarburos', 'Obra civil', 'Agroindustria', 'Sector público', 'Transporte'],
		retos: [
			'Rotación alta de personal contratista en campos de producción, que obliga a inducciones y reinducciones permanentes.',
			'Trabajo en alturas, espacios confinados y trabajo en caliente como riesgos críticos recurrentes.',
			'Exigencia de los operadores de exigir SG-SST verificable a toda la cadena de proveedores.',
			'Desplazamientos largos por vías terciarias, con la seguridad vial como riesgo transversal.'
		],
		normatividad:
			'Resolución 0312 de 2019, Resolución 4272 de 2021 (trabajo en alturas) y los estándares propios de los operadores de hidrocarburos que contratan en la región.'
	},
	{
		slug: 'meta',
		nombre: 'Meta',
		tipo: 'State',
		departamento: 'Meta',
		ciudades: [
			'Villavicencio',
			'Acacías',
			'Puerto Gaitán',
			'Granada',
			'Castilla la Nueva',
			'Puerto López',
			'San Martín'
		],
		enfoque:
			'Corredor llanero con alta concentración de campos petroleros y contratistas. Cubrimos auditorías a proveedores, simulacros y formación normativa con desplazamiento a locación.',
		sectores: ['Hidrocarburos', 'Transporte de carga', 'Agroindustria', 'Construcción'],
		retos: [
			'Operación distribuida entre Villavicencio y locaciones remotas como Puerto Gaitán, que encarece la formación presencial.',
			'Cadenas de contratación largas donde el operador exige auditoría a proveedores documentada.',
			'Alta siniestralidad vial en el corredor Bogotá–Villavicencio–Puerto Gaitán.',
			'Riesgo biomecánico y térmico en operaciones agroindustriales de clima cálido.'
		],
		normatividad:
			'Resolución 0312 de 2019, Decreto 1072 de 2015, planes estratégicos de seguridad vial (Resolución 40595 de 2022) y requisitos HSE de los operadores del bloque.'
	},
	{
		slug: 'boyaca',
		nombre: 'Boyacá',
		tipo: 'State',
		departamento: 'Boyacá',
		ciudades: [
			'Tunja',
			'Duitama',
			'Sogamoso',
			'Chiquinquirá',
			'Paipa',
			'Puerto Boyacá',
			'Nobsa',
			'Villa de Leyva'
		],
		enfoque:
			'Corredor industrial de Duitama–Sogamoso–Nobsa: siderurgia, cementeras, minería y manufactura, donde la gestión de riesgo y la certificación ISO son requisito de contratación.',
		sectores: ['Siderurgia', 'Minería', 'Cemento', 'Manufactura', 'Sector público'],
		retos: [
			'Procesos siderúrgicos y de cemento con riesgo químico, térmico y de material particulado.',
			'Minería bajo tierra y a cielo abierto con exigencias específicas de ventilación y rescate.',
			'Cadena de proveedores pyme que necesita cerrar brechas antes de una auditoría de certificación.',
			'Contratación pública que exige sistemas de gestión certificados como requisito habilitante.'
		],
		normatividad:
			'ISO 45001, ISO 14001 e ISO 9001 como requisito de contratación, sumadas al Decreto 1072 de 2015 y a la reglamentación minera del Decreto 1886 de 2015.'
	},
	{
		slug: 'bogota',
		nombre: 'Bogotá D.C.',
		tipo: 'City',
		departamento: 'Bogotá D.C.',
		ciudades: ['Bogotá D.C.'],
		enfoque:
			'Atención a casas matrices, áreas corporativas de HSEQ y contratistas con operación nacional. Consultoría, auditoría interna y formación virtual o presencial en sitio.',
		sectores: ['Corporativo', 'Servicios', 'Logística', 'Construcción', 'Salud'],
		retos: [
			'Casas matrices que deben estandarizar el SG-SST de sucursales dispersas en varios departamentos.',
			'Auditorías de cliente y de segunda parte como condición para mantener contratos marco.',
			'Riesgo psicosocial y biomecánico predominante en operaciones administrativas y de servicios.',
			'Necesidad de evidencia digital y trazable para responder a la ARL y a los entes de control.'
		],
		normatividad:
			'Decreto 1072 de 2015, Resolución 0312 de 2019, Resolución 2646 de 2008 (riesgo psicosocial) y los esquemas de auditoría interna bajo ISO 19011.'
	},
	{
		slug: 'cundinamarca',
		nombre: 'Cundinamarca',
		tipo: 'State',
		departamento: 'Cundinamarca',
		ciudades: [
			'Soacha',
			'Chía',
			'Zipaquirá',
			'Facatativá',
			'Fusagasugá',
			'Mosquera',
			'Funza',
			'Madrid',
			'Cajicá',
			'Girardot'
		],
		enfoque:
			'Sabana de Bogotá y corredor industrial occidental: parques logísticos, floricultura y manufactura con exigencias de SG-SST y auditorías de cliente.',
		sectores: ['Logística', 'Floricultura', 'Manufactura', 'Alimentos', 'Construcción'],
		retos: [
			'Centros de distribución con manipulación manual de cargas y tráfico permanente de montacargas.',
			'Floricultura con riesgo químico por agroquímicos y exigencias de certificación para exportar.',
			'Plantas de alimentos que deben articular inocuidad, calidad y seguridad en un solo sistema.',
			'Personal temporal en picos de producción, con inducción de SST como cuello de botella.'
		],
		normatividad:
			'Decreto 1072 de 2015, Resolución 0312 de 2019, ISO 45001 e ISO 9001, y los estándares de certificación exigidos por los compradores internacionales.'
	}
];

/** Todas las ciudades declaradas, sin repetir, para `areaServed`. */
export const CIUDADES_CUBIERTAS = [...new Set(REGIONES.flatMap((r) => r.ciudades))];

/** Construye una URL absoluta sobre el origen canónico. */
export function absoluteUrl(path = '/'): string {
	return new URL(path, SITE_URL).href.replace(/\/$/, path === '/' ? '/' : '');
}
