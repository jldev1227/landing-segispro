/** Cliente de `POST /api/public/postulaciones`. */

export interface DatosPostulacion {
	nombre: string;
	correo: string;
	telefono: string;
	ciudad?: string;
	areaInteres?: string;
	aniosExperiencia?: string;
	mensaje?: string;
}

export type RespuestaPostulacion =
	| { ok: true; id: string; message: string }
	| { ok: false; errores: string[] };

/** El backend devuelve `message` como cadena o como lista de errores de validación. */
function normalizarErrores(carga: unknown): string[] {
	if (typeof carga === 'string') return [carga];
	if (carga && typeof carga === 'object' && 'message' in carga) {
		const mensaje = (carga as { message: unknown }).message;
		if (Array.isArray(mensaje)) return mensaje.map(String);
		if (typeof mensaje === 'string') return [mensaje];
	}
	return ['No pudimos enviar tu hoja de vida. Inténtalo de nuevo en unos minutos.'];
}

export async function enviarPostulacion(
	datos: DatosPostulacion,
	archivo: File,
	captchaToken: string | null
): Promise<RespuestaPostulacion> {
	const base = import.meta.env.VITE_API_URL as string | undefined;
	if (!base) {
		return { ok: false, errores: ['La API no está configurada (falta VITE_API_URL).'] };
	}

	const cuerpo = new FormData();
	for (const [clave, valor] of Object.entries(datos)) {
		if (valor) cuerpo.append(clave, valor);
	}
	if (captchaToken) cuerpo.append('captchaToken', captchaToken);
	cuerpo.append('file', archivo);

	try {
		const respuesta = await fetch(`${base}/public/postulaciones`, {
			method: 'POST',
			body: cuerpo
		});

		const carga: unknown = respuesta.headers.get('content-type')?.includes('application/json')
			? await respuesta.json()
			: await respuesta.text();

		if (!respuesta.ok) {
			// 429 llega del límite de tasa y merece un mensaje propio: el genérico
			// haría pensar al usuario que el envío falló por su culpa.
			if (respuesta.status === 429) {
				return {
					ok: false,
					errores: ['Has hecho varios envíos seguidos. Espera un momento e inténtalo de nuevo.']
				};
			}
			return { ok: false, errores: normalizarErrores(carga) };
		}

		return carga as { ok: true; id: string; message: string };
	} catch {
		return {
			ok: false,
			errores: ['No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.']
		};
	}
}
