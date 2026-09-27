/**
 * Carga perezosa de reCAPTCHA v3.
 *
 * El script pesa y bloquea, así que no se incluye en el `<head>`: se pide la
 * primera vez que el usuario toca el formulario. Sin clave configurada la
 * función devuelve `null` y el backend, que tampoco la exige cuando le falta la
 * suya, deja pasar el envío. Así el formulario funciona en local sin claves.
 */
const CLAVE = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

let promesaCarga: Promise<void> | null = null;

declare global {
	interface Window {
		grecaptcha?: {
			ready(cb: () => void): void;
			execute(clave: string, opciones: { action: string }): Promise<string>;
		};
	}
}

function cargarScript(): Promise<void> {
	if (promesaCarga) return promesaCarga;

	promesaCarga = new Promise((resolver, rechazar) => {
		const script = document.createElement('script');
		script.src = `https://www.google.com/recaptcha/api.js?render=${CLAVE}`;
		script.async = true;
		script.defer = true;
		script.onload = () => resolver();
		script.onerror = () => rechazar(new Error('No se pudo cargar reCAPTCHA'));
		document.head.appendChild(script);
	});

	return promesaCarga;
}

/** Precarga el script sin pedir token todavía. */
export function precargarCaptcha(): void {
	if (!CLAVE) return;
	void cargarScript().catch(() => {});
}

/** Devuelve el token de la acción, o `null` si no hay captcha configurado. */
export async function obtenerTokenCaptcha(accion: string): Promise<string | null> {
	if (!CLAVE) return null;

	try {
		await cargarScript();
		const grecaptcha = window.grecaptcha;
		if (!grecaptcha) return null;

		await new Promise<void>((resolver) => grecaptcha.ready(resolver));
		return await grecaptcha.execute(CLAVE, { action: accion });
	} catch {
		// Que Google no cargue no debe impedir postular: el backend resuelve el
		// fallo de verificación a favor del usuario y el límite de tasa sigue ahí.
		return null;
	}
}
