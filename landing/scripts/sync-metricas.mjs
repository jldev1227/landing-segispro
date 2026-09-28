#!/usr/bin/env node
/**
 * Congela los agregados del backend en `src/lib/data/metricas.json`.
 *
 * La landing es estática y se prerenderiza: si consultara la API en cada carga
 * habría que volver dinámicas las páginas, exponer el endpoint al público y
 * añadir latencia al primer render. Con el snapshot el sitio no depende de la
 * API en tiempo de ejecución, y si la API se cae sigue mostrando la última
 * cifra buena.
 *
 * Uso:
 *   node scripts/sync-metricas.mjs
 *   API_STATS_URL=http://localhost:3001/api/public/stats node scripts/sync-metricas.mjs
 */
import { writeFile, readFile } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destino = resolve(raiz, 'src/lib/data/metricas.json');

const url = process.env.API_STATS_URL ?? 'http://localhost:3001/api/public/stats';
const TIEMPO_LIMITE_MS = 20_000;

/** Campos sin los cuales el JSON no sirve para pintar nada. */
const OBLIGATORIOS = ['serviciosPrestados', 'clientesAtendidos', 'aniosOperacion', 'porCategoria'];

function validar(datos) {
	for (const campo of OBLIGATORIOS) {
		if (datos[campo] === undefined) throw new Error(`Falta el campo "${campo}" en la respuesta`);
	}
	if (!Array.isArray(datos.porCategoria)) {
		throw new Error('"porCategoria" debería ser una lista');
	}
	// Un cero casi siempre significa que la consulta se rompió, no que no haya
	// actividad: preferimos conservar el snapshot anterior antes que publicarlo.
	if (datos.serviciosPrestados <= 0 || datos.clientesAtendidos <= 0) {
		throw new Error(
			`Cifras en cero (servicios ${datos.serviciosPrestados}, clientes ${datos.clientesAtendidos})`
		);
	}
}

/**
 * Campos que una API más vieja que el snapshot todavía no devuelve. Si faltan
 * en la respuesta se conservan los del snapshot anterior: sin esto, sincronizar
 * contra un despliegue atrasado borraría las zonas de cobertura y la página se
 * quedaría sin el tablero, que es peor que mostrar la cifra de la semana pasada.
 */
const OPCIONALES = ['zonas', 'municipios', 'serviciosLocalizados'];

function conservados(datos, previo) {
	if (!previo) return datos;
	const fusionado = { ...datos };
	for (const campo of OPCIONALES) {
		if (fusionado[campo] === undefined && previo[campo] !== undefined) {
			fusionado[campo] = previo[campo];
			console.warn(`  La API no devolvió "${campo}"; se conserva el valor anterior.`);
		}
	}
	return fusionado;
}

async function anterior() {
	try {
		return JSON.parse(await readFile(destino, 'utf8'));
	} catch {
		return null;
	}
}

const reloj = AbortSignal.timeout(TIEMPO_LIMITE_MS);

try {
	const respuesta = await fetch(url, { signal: reloj, headers: { accept: 'application/json' } });
	if (!respuesta.ok) throw new Error(`${respuesta.status} ${respuesta.statusText}`);

	const datos = await respuesta.json();
	validar(datos);

	const previo = await anterior();
	// El JSON se escribe pasado por prettier con la configuración del proyecto.
	// Sin esto, `JSON.stringify` parte los arrays cortos en varias líneas, el
	// fichero versionado queda distinto del que produce `npm run format`, y cada
	// sincronización ensuciaba el diff con doscientas líneas que no son datos.
	// `format` no lee `.prettierrc` por su cuenta: hay que resolverlo aparte, o
	// escribe con los ajustes de fábrica y el fichero vuelve a quedar distinto.
	const ajustes = await resolveConfig(destino);
	const json = JSON.stringify(conservados(datos, previo), null, '\t');
	await writeFile(destino, await format(json, { ...ajustes, filepath: destino }), 'utf8');

	const delta = previo ? datos.serviciosPrestados - previo.serviciosPrestados : null;
	console.log(
		`✓ ${datos.serviciosPrestados} servicios · ${datos.clientesAtendidos} clientes · ` +
			`${datos.porCategoria.length} categorías` +
			(delta === null ? '' : ` (${delta >= 0 ? '+' : ''}${delta} desde el snapshot anterior)`)
	);
} catch (error) {
	// Fallar aquí no debe romper un despliegue: el snapshot que ya está
	// versionado sigue siendo válido.
	console.error(`✗ No se pudo sincronizar desde ${url}: ${error.message}`);
	const previo = await anterior();
	if (previo) {
		console.error(`  Se conserva el snapshot del ${previo.calculadoEn}.`);
		process.exit(0);
	}
	console.error('  No hay snapshot previo que conservar.');
	process.exit(1);
}
