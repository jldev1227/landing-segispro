<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/seo/Seo.svelte';
	import { absoluteUrl, REGIONES } from '$lib/seo/site';
	import {
		breadcrumbSchema,
		faqSchema,
		graph,
		organizationSchema,
		webPageSchema,
		websiteSchema
	} from '$lib/seo/schema';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageFooter from '$lib/components/PageFooter.svelte';
	import { enviarPostulacion } from '$lib/api/postulacion';
	import { obtenerTokenCaptcha, precargarCaptcha } from '$lib/recaptcha';
	import metricas from '$lib/data/metricas.json';
	import { CIFRAS } from '$lib/data/cifras';
	import { AREAS, PASOS, PERFILES, PREGUNTAS } from './datos';

	const title = 'Trabaja con nosotros | Auditores, capacitadores y consultores SST | SEGISPRO';
	const description =
		'Postúlate a la red de profesionales de SEGISPRO: auditores internos ISO, capacitadores en seguridad y salud en el trabajo, consultores HSEQ y especialistas en estudios técnicos en Casanare, Meta, Boyacá, Bogotá y Cundinamarca.';

	const schema = graph([
		organizationSchema(),
		websiteSchema(),
		webPageSchema({ url: absoluteUrl('/trabaja-con-nosotros'), title, description }),
		breadcrumbSchema([{ name: 'Trabaja con nosotros', path: '/trabaja-con-nosotros' }]),
		faqSchema(PREGUNTAS)
	]);

	const regiones = REGIONES.map((region) => region.nombre).join(', ');

	/**
	 * Clase de los campos del formulario. Se declara una vez porque son nueve
	 * controles y antes la cadena de Tailwind iba copiada en cada uno: bastaba
	 * olvidar uno para que se descolgara del resto.
	 *
	 * Esquina viva y filete fino, como el resto del sistema; el foco se ve con
	 * un contorno navy de 2px y no con un halo difuminado.
	 */
	const CAMPO =
		'w-full border border-gray-300 bg-placa px-4 py-3 text-sm text-tinta placeholder:text-gray-500 focus:border-obliga focus:outline-2 focus:outline-offset-2 focus:outline-obliga';

	/** Tira de conteo de la banda de leyenda. Mismos umbrales que el home. */
	const prueba = [
		{ valor: CIFRAS.profesionales, etiqueta: 'profesionales en la red' },
		{ valor: CIFRAS.servicios, etiqueta: 'servicios ejecutados' },
		{ valor: CIFRAS.municipios, etiqueta: 'municipios' },
		{ valor: CIFRAS.anios, etiqueta: 'años operando' }
	];

	/**
	 * Las líneas de servicio, ordenadas por volumen y **sin el conteo**.
	 *
	 * Antes esto era una tabla con la cifra exacta de cada una: 868 de
	 * consultoría, 197 de capacitación, 2 de vídeo. Eso es información de
	 * gestión interna —dice qué líneas están flojas a cualquiera que entre,
	 * competencia incluida— y a quien se postula no le aporta nada que no le dé
	 * el orden. Lo que necesita saber es dónde hay volumen, y para eso basta con
	 * en qué escalón está cada línea.
	 */
	const ESCALONES = [
		{ desde: 0.5, etiqueta: 'La mayor parte del volumen' },
		{ desde: 0.1, etiqueta: 'Volumen alto' },
		{ desde: 0.01, etiqueta: 'Volumen medio' },
		{ desde: 0, etiqueta: 'Volumen ocasional' }
	];

	const totalCategorias = metricas.porCategoria.reduce((suma, c) => suma + c.total, 0) || 1;

	/**
	 * El escalón se imprime solo cuando cambia. La lista está ordenada, así que
	 * repetirlo convierte la columna derecha en «volumen ocasional» nueve veces
	 * seguidas: el ojo deja de leerlo y el dato desaparece por saturación. Con
	 * la etiqueta una vez, la columna se lee como bandas.
	 */
	let escalonAnterior = '';
	const lineasServicio = metricas.porCategoria.map((c) => {
		const escalon = (ESCALONES.find((e) => c.total / totalCategorias >= e.desde) ?? ESCALONES[3])
			.etiqueta;
		const abre = escalon !== escalonAnterior;
		escalonAnterior = escalon;
		return { etiqueta: c.etiqueta, escalon, abre };
	});

	// ── Formulario ────────────────────────────────────────────────────────────
	let nombre = $state('');
	let correo = $state('');
	let telefono = $state('');
	let ciudad = $state('');
	let areaInteres = $state('');
	let aniosExperiencia = $state('');
	let mensaje = $state('');
	let archivo: File | null = $state(null);
	let aceptaPolitica = $state(false);

	let enviando = $state(false);
	let exito = $state<string | null>(null);
	let errores = $state<string[]>([]);

	const TAMANIO_MAXIMO = 8 * 1024 * 1024;
	const EXTENSIONES = ['.pdf', '.doc', '.docx'];

	function elegirArchivo(evento: Event) {
		const entrada = evento.target as HTMLInputElement;
		const elegido = entrada.files?.[0] ?? null;
		errores = [];

		if (!elegido) {
			archivo = null;
			return;
		}

		// El backend valida por bytes de cabecera; esto es solo para avisar antes
		// de gastar una subida y una petición del límite de tasa.
		const extension = elegido.name.slice(elegido.name.lastIndexOf('.')).toLowerCase();
		if (!EXTENSIONES.includes(extension)) {
			errores = ['Tu hoja de vida debe ir en PDF, DOC o DOCX.'];
			archivo = null;
			entrada.value = '';
			return;
		}

		if (elegido.size > TAMANIO_MAXIMO) {
			errores = [`El archivo pesa ${(elegido.size / 1048576).toFixed(1)} MB y el máximo son 8 MB.`];
			archivo = null;
			entrada.value = '';
			return;
		}

		archivo = elegido;
	}

	async function enviar(evento: SubmitEvent) {
		evento.preventDefault();
		errores = [];

		if (!archivo) {
			errores = ['Adjunta tu hoja de vida.'];
			return;
		}
		if (!aceptaPolitica) {
			errores = ['Debes autorizar el tratamiento de tus datos personales.'];
			return;
		}

		enviando = true;
		const token = await obtenerTokenCaptcha('postulacion');
		const respuesta = await enviarPostulacion(
			{ nombre, correo, telefono, ciudad, areaInteres, aniosExperiencia, mensaje },
			archivo,
			token
		);
		enviando = false;

		if (respuesta.ok) {
			exito = respuesta.message;
			return;
		}
		errores = respuesta.errores;
	}
</script>

<Seo {title} {description} path="/trabaja-con-nosotros" {schema} />

<PageHeader activa="trabaja" />

<main class="bg-placa pt-20">
	<!--
		Banda de leyenda. Era un degradado gris-a-negro con las cifras sueltas en
		cuatro columnas; ahora es la placa de obligación del sistema, con la misma
		tira de conteo estampada que el primer pliegue del home. Las cifras son las
		mismas del sistema de gestión, que es lo que un profesional necesita para
		decidir si vale la pena postularse.
	-->
	<section class="bg-obliga">
		<div class="container mx-auto max-w-5xl px-6 py-10 sm:px-8 sm:py-14">
			<nav aria-label="Ruta de navegación">
				<ol
					class="flex flex-wrap items-center gap-2 font-leyenda text-xs tracking-[0.06em] text-marca-300 uppercase"
				>
					<li><a href={resolve('/')} class="transition-colors hover:text-white">Inicio</a></li>
					<li aria-hidden="true">·</li>
					<li class="text-white">Trabaja con nosotros</li>
				</ol>
			</nav>

			<div class="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
				<div class="max-w-3xl">
					<p class="font-leyenda text-xs font-bold tracking-[0.12em] text-segura uppercase">
						Red de profesionales
					</p>
					<h1
						class="mt-3 font-leyenda text-3xl leading-[1.1] font-bold tracking-[0.02em] text-balance text-obliga-tinta uppercase sm:text-4xl lg:text-5xl"
					>
						Trabaja con SEGISPRO
					</h1>
					<p class="mt-5 max-w-[58ch] text-base leading-relaxed text-marca-100 sm:text-lg">
						Buscamos auditores, capacitadores, consultores y especialistas en estudios técnicos para
						ejecutar servicios en {regiones}. La contratación es por actividad: cada servicio se
						pacta con su alcance, sus fechas y su tarifa.
					</p>
				</div>

				<a
					href="#postular"
					class="shrink-0 self-start bg-segura px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
				>
					Enviar mi hoja de vida
				</a>
			</div>
		</div>

		<!-- Tira de conteo, estampada contra el borde de la banda. -->
		<div class="border-t border-marca-700">
			<div class="container mx-auto max-w-5xl px-6 sm:px-8">
				<dl class="flex flex-wrap items-baseline gap-x-10 gap-y-4 py-6">
					{#each prueba as dato (dato.etiqueta)}
						<div class="flex items-baseline gap-2.5">
							<dd class="text-2xl font-bold text-obliga-tinta tabular-nums sm:text-3xl">
								{dato.valor}
							</dd>
							<dt class="font-leyenda text-xs font-bold tracking-[0.08em] text-marca-200 uppercase">
								{dato.etiqueta}
							</dt>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</section>

	<section class="container mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-16">
		<h2
			class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
		>
			Perfiles que contratamos
		</h2>
		<p class="mt-3 max-w-[64ch] text-base leading-relaxed text-gray-600">
			No son vacantes con fecha y ubicación: son los perfiles que se buscan de forma recurrente para
			repartir las actividades que entran.
		</p>

		<div class="mt-10 grid gap-x-10 gap-y-9 md:grid-cols-2">
			{#each PERFILES as perfil (perfil.titulo)}
				<article class="border-t-2 border-tinta pt-5">
					<h3 class="font-leyenda text-base font-bold tracking-[0.05em] text-tinta uppercase">
						{perfil.titulo}
					</h3>
					<p class="mt-2.5 max-w-[56ch] text-sm leading-relaxed text-gray-600">
						{perfil.descripcion}
					</p>
					<ul class="mt-4 space-y-1.5">
						{#each perfil.requisitos as requisito (requisito)}
							<li class="flex gap-2.5 text-sm leading-relaxed text-gray-700">
								<span class="mt-[0.55em] h-1 w-2.5 shrink-0 bg-segura"></span>
								<span>{requisito}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<!--
		Las líneas de servicio por volumen, sin el conteo de cada una.

		Antes era una tabla con la cifra exacta: 868 de consultoría, 197 de
		capacitación, 2 de vídeo. Para quien se postula el orden ya dice todo lo
		que necesita —dónde hay trabajo—, y el detalle es información de gestión
		interna que quedaba publicada para cualquiera.
	-->
	<section class="border-t border-gray-200 bg-marca-50">
		<div class="container mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-16">
			<h2
				class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
			>
				En qué se trabaja
			</h2>
			<p class="mt-3 max-w-[66ch] text-base leading-relaxed text-gray-600">
				Las líneas del portafolio ordenadas por volumen ejecutado, de mayor a menor. Sirve para
				saber dónde hay trabajo antes de postularse.
			</p>

			<ol class="mt-10 divide-y divide-gray-200 border-y border-gray-200">
				{#each lineasServicio as linea (linea.etiqueta)}
					<li class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
						<span class="font-leyenda text-sm font-bold tracking-[0.04em] text-tinta uppercase">
							{linea.etiqueta}
						</span>
						<span
							class="font-leyenda text-xs tracking-[0.06em] text-gray-600 uppercase"
							aria-label={linea.escalon}
						>
							{linea.abre ? linea.escalon : ''}
						</span>
					</li>
				{/each}
			</ol>

			<p class="mt-7 text-xs leading-relaxed text-gray-600">
				Orden tomado del sistema de gestión de SEGISPRO; solo cuentan las actividades efectivamente
				ejecutadas.
			</p>
		</div>
	</section>

	<section class="container mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-16">
		<h2
			class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
		>
			Cómo es el proceso
		</h2>
		<ol class="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
			{#each PASOS as paso, i (paso.titulo)}
				<li class="border-t-2 border-tinta pt-5">
					<span
						class="font-leyenda text-2xl font-bold text-marca-300 tabular-nums"
						aria-hidden="true"
					>
						{String(i + 1).padStart(2, '0')}
					</span>
					<h3 class="mt-2 font-leyenda text-sm font-bold tracking-[0.05em] text-tinta uppercase">
						{paso.titulo}
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-gray-600">{paso.detalle}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section id="postular" class="border-t border-gray-200 bg-marca-50">
		<div class="container mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-16">
			<h2
				class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
			>
				Envía tu hoja de vida
			</h2>
			<p class="mt-3 text-base leading-relaxed text-gray-600">
				Los campos marcados con asterisco son obligatorios. El archivo puede ir en PDF, DOC o DOCX,
				hasta 8 MB.
			</p>

			{#if exito}
				<div class="mt-10 border-l-4 border-segura bg-placa p-6" role="status" aria-live="polite">
					<h3 class="font-leyenda text-sm font-bold tracking-[0.08em] text-tinta uppercase">
						Recibido
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-gray-700">{exito}</p>
				</div>
			{:else}
				<form
					class="mt-10 space-y-6"
					onsubmit={enviar}
					onfocusin={precargarCaptcha}
					enctype="multipart/form-data"
				>
					{#if errores.length}
						<!--
							El aviso de error usa el ámbar de advertencia del sistema, no un rojo
							ajeno a la paleta: es exactamente lo que el triángulo significa.
						-->
						<div class="border-l-4 border-advierte bg-placa p-4" role="alert" aria-live="assertive">
							<ul class="space-y-1 text-sm text-tinta">
								{#each errores as error (error)}
									<li>{error}</li>
								{/each}
							</ul>
						</div>
					{/if}

					<div class="grid gap-6 sm:grid-cols-2">
						<div>
							<label
								for="nombre"
								class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
							>
								Nombre completo <span class="text-advierte" aria-hidden="true">*</span>
							</label>
							<input
								id="nombre"
								name="nombre"
								type="text"
								required
								minlength="3"
								maxlength="160"
								autocomplete="name"
								bind:value={nombre}
								class={CAMPO}
							/>
						</div>

						<div>
							<label
								for="correo"
								class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
							>
								Correo electrónico <span class="text-advierte" aria-hidden="true">*</span>
							</label>
							<input
								id="correo"
								name="correo"
								type="email"
								required
								maxlength="160"
								autocomplete="email"
								bind:value={correo}
								class={CAMPO}
							/>
						</div>

						<div>
							<label
								for="telefono"
								class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
							>
								Teléfono <span class="text-advierte" aria-hidden="true">*</span>
							</label>
							<input
								id="telefono"
								name="telefono"
								type="tel"
								required
								maxlength="40"
								autocomplete="tel"
								bind:value={telefono}
								class={CAMPO}
							/>
						</div>

						<div>
							<label
								for="ciudad"
								class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
							>
								Ciudad
							</label>
							<input
								id="ciudad"
								name="ciudad"
								type="text"
								maxlength="120"
								autocomplete="address-level2"
								bind:value={ciudad}
								class={CAMPO}
							/>
						</div>

						<div>
							<label
								for="area"
								class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
							>
								Área de interés
							</label>
							<select id="area" name="areaInteres" bind:value={areaInteres} class={CAMPO}>
								<option value="">Selecciona una</option>
								{#each AREAS as area (area)}
									<option value={area}>{area}</option>
								{/each}
							</select>
						</div>

						<div>
							<label
								for="experiencia"
								class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
							>
								Años de experiencia
							</label>
							<input
								id="experiencia"
								name="aniosExperiencia"
								type="number"
								min="0"
								max="60"
								bind:value={aniosExperiencia}
								class={CAMPO}
							/>
						</div>
					</div>

					<div>
						<label
							for="mensaje"
							class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
						>
							Cuéntanos sobre tu perfil
						</label>
						<textarea
							id="mensaje"
							name="mensaje"
							rows="4"
							maxlength="1000"
							bind:value={mensaje}
							class={CAMPO}
						></textarea>
					</div>

					<div>
						<label
							for="archivo"
							class="mb-2 block font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
						>
							Hoja de vida <span class="text-advierte" aria-hidden="true">*</span>
						</label>
						<input
							id="archivo"
							name="file"
							type="file"
							required
							accept=".pdf,.doc,.docx"
							onchange={elegirArchivo}
							class="w-full border border-gray-300 bg-placa px-4 py-3 text-sm text-gray-700 file:mr-4 file:border-0 file:bg-obliga file:px-4 file:py-2 file:font-leyenda file:text-xs file:font-bold file:tracking-[0.07em] file:text-obliga-tinta file:uppercase focus:border-obliga focus:outline-2 focus:outline-offset-2 focus:outline-obliga"
						/>
						{#if archivo}
							<p class="mt-2 text-xs text-gray-600">
								{archivo.name} · {(archivo.size / 1024).toFixed(0)} KB
							</p>
						{/if}
					</div>

					<div class="flex items-start gap-3">
						<input
							id="politica"
							type="checkbox"
							required
							bind:checked={aceptaPolitica}
							class="mt-1 h-4 w-4 shrink-0 rounded-none border-gray-400 text-obliga focus:ring-obliga"
						/>
						<label for="politica" class="text-sm leading-relaxed text-gray-600">
							Autorizo el tratamiento de mis datos personales conforme a la
							<a
								href={resolve('/politicas-de-privacidad')}
								class="border-b border-obliga font-medium text-obliga">política de privacidad</a
							>, en los términos de la Ley 1581 de 2012.
						</label>
					</div>

					<button
						type="submit"
						disabled={enviando}
						class="w-full bg-segura px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obliga disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
					>
						{enviando ? 'Enviando…' : 'Enviar hoja de vida'}
					</button>

					<p class="text-xs leading-relaxed text-gray-600">
						Este sitio está protegido por reCAPTCHA; aplican la
						<a
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noopener"
							class="underline">política de privacidad</a
						>
						y los
						<a
							href="https://policies.google.com/terms"
							target="_blank"
							rel="noopener"
							class="underline">términos de servicio</a
						> de Google.
					</p>
				</form>
			{/if}
		</div>
	</section>

	<section class="container mx-auto max-w-4xl px-6 py-14 sm:px-8 sm:py-16">
		<h2
			class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
		>
			Preguntas frecuentes
		</h2>
		<dl class="mt-10 divide-y divide-gray-200 border-y border-gray-200">
			{#each PREGUNTAS as item (item.pregunta)}
				<div class="grid gap-2 py-6 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8">
					<dt class="font-leyenda text-sm font-bold tracking-[0.01em] text-tinta">
						{item.pregunta}
					</dt>
					<dd class="max-w-[68ch] text-sm leading-relaxed text-gray-600">{item.respuesta}</dd>
				</div>
			{/each}
		</dl>
	</section>
</main>

<PageFooter />
