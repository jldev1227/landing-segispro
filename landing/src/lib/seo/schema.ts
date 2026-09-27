/**
 * Constructores de JSON-LD. Devuelven objetos planos; el componente `Seo`
 * los serializa. Mantener los `@id` estables: son las anclas con las que Google
 * une la organización, el sitio y cada página del grafo.
 */
import {
	CIUDADES_CUBIERTAS,
	CONTACT,
	FUNDACION,
	OG_IMAGE,
	REGIONES,
	SITE_NAME,
	SITE_SHORT_NAME,
	SITE_URL,
	SOCIAL,
	absoluteUrl
} from './site';

export const ORG_ID = `${SITE_URL}/#organizacion`;
export const WEBSITE_ID = `${SITE_URL}/#sitio`;

const direccion = {
	'@type': 'PostalAddress',
	streetAddress: CONTACT.direccion,
	addressLocality: CONTACT.ciudad,
	addressRegion: CONTACT.departamento,
	postalCode: CONTACT.codigoPostal,
	addressCountry: CONTACT.pais
};

/**
 * `areaServed` enumerado: primero el país, luego cada departamento y cada
 * ciudad. Es la señal que le dice a Google que la cobertura excede a Yopal.
 */
const areaServed = [
	{ '@type': 'Country', name: 'Colombia' },
	...REGIONES.map((region) => ({
		'@type': region.tipo,
		name: region.nombre,
		...(region.tipo === 'State'
			? { containedInPlace: { '@type': 'Country', name: 'Colombia' } }
			: {})
	})),
	...CIUDADES_CUBIERTAS.map((ciudad) => ({ '@type': 'City', name: ciudad }))
];

/** Organización: el nodo raíz al que apunta todo lo demás. */
export function organizationSchema() {
	return {
		'@type': ['Organization', 'ProfessionalService'],
		'@id': ORG_ID,
		name: SITE_NAME,
		alternateName: SITE_SHORT_NAME,
		legalName: 'SEGISPRO Ingeniería S.A.S.',
		url: SITE_URL,
		logo: {
			'@type': 'ImageObject',
			url: absoluteUrl('/assets/logo.png'),
			caption: SITE_NAME
		},
		image: [OG_IMAGE, absoluteUrl('/assets/logo.png')],
		description:
			'Consultoría, auditoría, interventoría, formación, simulacros, campañas y estudios en seguridad y salud en el trabajo, medio ambiente y calidad para empresas públicas y privadas.',
		foundingDate: FUNDACION,
		telephone: CONTACT.telefono,
		email: CONTACT.email,
		address: direccion,
		geo: {
			'@type': 'GeoCoordinates',
			latitude: CONTACT.latitud,
			longitude: CONTACT.longitud
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
				opens: '08:00',
				closes: '18:00'
			}
		],
		areaServed,
		priceRange: '$$',
		knowsLanguage: ['es-CO'],
		sameAs: SOCIAL,
		contactPoint: [
			{
				'@type': 'ContactPoint',
				contactType: 'sales',
				telephone: CONTACT.telefono,
				email: CONTACT.email,
				areaServed: 'CO',
				availableLanguage: ['Spanish']
			}
		]
	};
}

/** Sitio web: da nombre al dominio y ancla el idioma. */
export function websiteSchema() {
	return {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: SITE_URL,
		name: SITE_SHORT_NAME,
		inLanguage: 'es-CO',
		publisher: { '@id': ORG_ID }
	};
}

export function webPageSchema(opts: { url: string; title: string; description: string }) {
	return {
		'@type': 'WebPage',
		'@id': `${opts.url}#pagina`,
		url: opts.url,
		name: opts.title,
		description: opts.description,
		inLanguage: 'es-CO',
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': ORG_ID }
	};
}

/** Migas de pan. `items` no incluye el Inicio: se antepone aquí. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
	const todos = [{ name: 'Inicio', path: '/' }, ...items];
	return {
		'@type': 'BreadcrumbList',
		itemListElement: todos.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	};
}

/** Un servicio del portafolio, con la cobertura heredada de la organización. */
export function serviceSchema(opts: {
	name: string;
	description: string;
	path: string;
	tipo?: string;
}) {
	return {
		'@type': 'Service',
		'@id': `${absoluteUrl(opts.path)}#servicio`,
		name: opts.name,
		description: opts.description,
		serviceType: opts.tipo ?? opts.name,
		url: absoluteUrl(opts.path),
		provider: { '@id': ORG_ID },
		areaServed,
		availableChannel: {
			'@type': 'ServiceChannel',
			serviceUrl: absoluteUrl(opts.path),
			servicePhone: CONTACT.telefono
		}
	};
}

/** Listado de servicios, para que la home describa el portafolio completo. */
export function serviceListSchema(servicios: { name: string; path: string }[]) {
	return {
		'@type': 'ItemList',
		name: 'Portafolio de servicios SEGISPRO',
		itemListElement: servicios.map((s, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: s.name,
			url: absoluteUrl(s.path)
		}))
	};
}

/**
 * Curso. Se omite `aggregateRating` a propósito: las calificaciones del catálogo
 * no provienen de reseñas verificables y marcarlas expone el dominio a una
 * acción manual de Google por datos estructurados engañosos.
 */
export function courseSchema(opts: {
	name: string;
	description: string;
	path: string;
	modalidad: string;
	duracionHoras?: number;
	precio?: number;
}) {
	const modo =
		opts.modalidad === 'Virtual'
			? 'online'
			: opts.modalidad === 'Presencial'
				? 'onsite'
				: 'blended';

	return {
		'@type': 'Course',
		'@id': `${absoluteUrl(opts.path)}#curso`,
		name: opts.name,
		description: opts.description,
		url: absoluteUrl(opts.path),
		inLanguage: 'es-CO',
		provider: { '@id': ORG_ID },
		hasCourseInstance: {
			'@type': 'CourseInstance',
			courseMode: modo,
			courseWorkload: opts.duracionHoras ? `PT${opts.duracionHoras}H` : undefined,
			location: {
				'@type': 'Place',
				name: `${CONTACT.ciudad}, ${CONTACT.departamento}`,
				address: direccion
			}
		},
		...(opts.precio
			? {
					offers: {
						'@type': 'Offer',
						price: opts.precio,
						priceCurrency: 'COP',
						category: 'Paid',
						availability: 'https://schema.org/InStock',
						url: absoluteUrl(opts.path)
					}
				}
			: {})
	};
}

export function faqSchema(preguntas: { pregunta: string; respuesta: string }[]) {
	return {
		'@type': 'FAQPage',
		mainEntity: preguntas.map((p) => ({
			'@type': 'Question',
			name: p.pregunta,
			acceptedAnswer: { '@type': 'Answer', text: p.respuesta }
		}))
	};
}

/** Envuelve los nodos en un único `@graph`: un solo bloque por página. */
export function graph(nodes: object[]) {
	return { '@context': 'https://schema.org', '@graph': nodes };
}
