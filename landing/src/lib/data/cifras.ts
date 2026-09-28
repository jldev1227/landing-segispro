import metricas from './metricas.json';

/**
 * Cómo se enseñan las cifras hacia fuera.
 *
 * El snapshot guarda el dato exacto porque para calcular hace falta exacto.
 * Lo que se publica es otra cosa: un umbral. Dos razones, y ninguna es estética.
 *
 * La primera es que un total exacto en una página comercial envejece mal y se
 * lee como inventario: «1.174 servicios» invita a preguntar qué pasó con el
 * 1.175. «Más de 1.000» es igual de cierto el mes que viene.
 *
 * La segunda es que el reparto por categoría —868 de consultoría, 2 de
 * vídeo— es información de gestión interna. Dice qué líneas están flojas a
 * cualquiera que entre, competencia incluida. El orden sí es útil para quien
 * se postula; el conteo no le sirve de nada.
 *
 * El número de municipios no está aquí y no debe volver: publicarlo invita a
 * compararlo con el mapa nacional del competidor de turno, y el argumento de
 * SEGISPRO no es extensión sino arraigo. Dónde se trabaja lo enseña el mapa de
 * cobertura; cuántos son no lo dice nadie.
 */

/** Suelo que se publica para cada cifra. Es una decisión editorial, no un cálculo. */
export const UMBRALES = {
	servicios: 1000,
	profesionales: 20,
	empresas: 300
} as const;

/** «+1.000». El signo va delante para que se lea como suelo y no como total. */
export function umbral(valor: number): string {
	return `+${valor.toLocaleString('es-CO')}`;
}

export const CIFRAS = {
	servicios: umbral(UMBRALES.servicios),
	profesionales: umbral(UMBRALES.profesionales),
	empresas: umbral(UMBRALES.empresas),
	anios: String(metricas.aniosOperacion)
} as const;

/**
 * Aviso en desarrollo si el dato real se queda por debajo del umbral que se
 * publica. Prometer «más de 1.000» con 900 ejecutados sería falso, y el error
 * pasaría inadvertido porque la página seguiría pintando el mismo texto.
 */
if (import.meta.env.DEV) {
	const comprobaciones: [string, number, number][] = [
		['servicios', metricas.serviciosPrestados, UMBRALES.servicios],
		['profesionales', metricas.profesionales, UMBRALES.profesionales],
		['empresas', metricas.clientesAtendidos, UMBRALES.empresas]
	];
	for (const [nombre, real, suelo] of comprobaciones) {
		if (real < suelo) {
			console.warn(
				`[cifras] Se publica «${umbral(suelo)} ${nombre}» pero el snapshot trae ${real}.`
			);
		}
	}
}
