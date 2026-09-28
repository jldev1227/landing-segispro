<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/seo/Seo.svelte';
	import { CONTACT, REGIONES } from '$lib/seo/site';
	import {
		breadcrumbSchema,
		graph,
		organizationSchema,
		webPageSchema,
		websiteSchema,
		faqSchema
	} from '$lib/seo/schema';
	import { absoluteUrl } from '$lib/seo/site';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageFooter from '$lib/components/PageFooter.svelte';
	import MapaCobertura from '$lib/components/MapaCobertura.svelte';
	import { serviciosData } from '$lib/data/servicios';
	import metricas from '$lib/data/metricas.json';

	const title =
		'Cobertura SEGISPRO: SST, auditorías y capacitaciones en Casanare, Meta, Boyacá, Bogotá y Cundinamarca';
	const description =
		'Consultoría, auditoría, interventoría, formación y simulacros en seguridad y salud en el trabajo con operación en Casanare, Meta, Boyacá, Bogotá D.C. y Cundinamarca.';

	const preguntas = [
		{
			pregunta: '¿En qué departamentos presta servicios SEGISPRO?',
			respuesta:
				'SEGISPRO opera desde Yopal (Casanare) y atiende de forma permanente Casanare, Meta, Boyacá, Bogotá D.C. y Cundinamarca, con desplazamiento a locación en todo el territorio nacional.'
		},
		{
			pregunta: '¿SEGISPRO realiza capacitaciones presenciales fuera de Casanare?',
			respuesta:
				'Sí. Las capacitaciones, simulacros y campañas se ejecutan de forma presencial en la sede del cliente en cualquiera de los departamentos cubiertos, y también en modalidad virtual o híbrida.'
		},
		{
			pregunta: '¿Qué servicios se pueden contratar en cada región?',
			respuesta:
				'El portafolio completo está disponible en todas las regiones: consultoría y auditoría de sistemas de gestión, interventoría, formación y capacitación, campañas y estudios, digitalización y proyectos especiales.'
		},
		{
			pregunta: '¿Cuánto tiempo toma agendar una visita en sitio?',
			respuesta:
				'La programación de visitas en Casanare y Meta suele concretarse en la misma semana; para Boyacá, Bogotá y Cundinamarca se coordina según el alcance del servicio contratado.'
		}
	];

	const schema = graph([
		organizationSchema(),
		websiteSchema(),
		webPageSchema({ url: absoluteUrl('/cobertura'), title, description }),
		breadcrumbSchema([{ name: 'Cobertura', path: '/cobertura' }]),
		faqSchema(preguntas)
	]);

	const servicios = Object.values(serviciosData);

	/**
	 * Zonas del snapshot: los municipios con más actividad ejecutada. Vienen del
	 * mismo agregado que alimenta el tablero del home, así que las dos páginas no
	 * pueden decir cosas distintas.
	 */
	const zonas = metricas.zonas ?? [];
</script>

<Seo {title} {description} path="/cobertura" {schema} />

<PageHeader activa="cobertura" />

<main class="bg-placa pt-20">
	<section class="bg-obliga">
		<div class="container mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
			<nav aria-label="Ruta de navegación">
				<ol
					class="flex flex-wrap items-center gap-2 font-leyenda text-xs tracking-[0.06em] text-marca-300 uppercase"
				>
					<li><a href={resolve('/')} class="transition-colors hover:text-white">Inicio</a></li>
					<li aria-hidden="true">·</li>
					<li class="text-white">Cobertura</li>
				</ol>
			</nav>

			<h1
				class="mt-8 font-leyenda text-3xl leading-[1.1] font-bold tracking-[0.02em] text-balance text-obliga-tinta uppercase sm:text-4xl lg:text-5xl"
			>
				Dónde operamos
			</h1>
			<p class="mt-5 max-w-[62ch] text-base leading-relaxed text-marca-100 sm:text-lg">
				Desde la sede en Yopal acompañamos a empresas públicas y privadas del corredor llanero y del
				eje Bogotá–Boyacá. Cada región tiene su propia mezcla de riesgo, normatividad sectorial y
				exigencia contractual, y el servicio se ajusta a ella.
			</p>
		</div>
	</section>

	<!--
		Zonas más frecuentadas. Es el mismo tablero del home, alimentado por el
		snapshot del sistema de gestión: municipios donde más actividad se ha
		ejecutado, con el conteo y las empresas distintas atendidas en cada uno.

		El denominador es `serviciosLocalizados` y no el total: no todas las
		actividades ejecutadas traen municipio registrado, y repartir sobre el
		total daría a entender que el resto no ocurrió en ninguna parte.
	-->
	{#if zonas.length}
		<section class="container mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
			<h2
				class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
			>
				Dónde se concentra el trabajo
			</h2>
			<p class="mt-3 max-w-[68ch] text-base leading-relaxed text-gray-600">
				En navy, los municipios de Casanare donde más servicios se han ejecutado. El cuadrado verde
				es la sede en {CONTACT.ciudad}, desde donde sale el desplazamiento a locación.
			</p>

			<div class="mt-10">
				<MapaCobertura {zonas} />
			</div>
		</section>
	{/if}

	<section class="border-t border-gray-200 bg-marca-50">
		<div class="container mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
			<h2
				class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
			>
				Regiones donde operamos
			</h2>

			<!-- Filetes por celda: cinco regiones en tres columnas dejaban un hueco
			     gris en la última fila que parecía una región sin nombre. -->
			<ul class="mt-10 grid border-t border-l border-gray-200 md:grid-cols-2 lg:grid-cols-3">
				{#each REGIONES as region (region.slug)}
					<li class="border-r border-b border-gray-200 bg-placa">
						<article class="flex h-full flex-col p-6">
							<span class="h-1.5 w-12 bg-segura"></span>
							<h3
								class="mt-4 font-leyenda text-base font-bold tracking-[0.05em] text-tinta uppercase"
							>
								<a
									href={resolve('/cobertura/[region]', { region: region.slug })}
									class="transition-colors hover:text-segura focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obliga"
								>
									{region.nombre}
								</a>
							</h3>
							<p class="mt-2 grow text-sm leading-relaxed text-gray-600">{region.enfoque}</p>

							<ul class="mt-4 flex flex-wrap gap-1.5">
								{#each region.sectores as sector (sector)}
									<li
										class="border border-gray-300 px-2 py-0.5 font-leyenda text-[0.6875rem] font-bold tracking-[0.06em] text-gray-700 uppercase"
									>
										{sector}
									</li>
								{/each}
							</ul>

							<p class="mt-4 text-xs leading-relaxed text-gray-600">
								{region.ciudades.slice(0, 6).join(' · ')}
							</p>
						</article>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="container mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
		<h2
			class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
		>
			Servicios disponibles en todas las regiones
		</h2>
		<ul class="mt-10 grid border-t border-l border-gray-200 sm:grid-cols-2 lg:grid-cols-3">
			{#each servicios as servicio (servicio.slug)}
				<li class="border-r border-b border-gray-200 bg-placa">
					<a
						href={resolve('/servicios/[slug]', { slug: servicio.slug })}
						class="block h-full px-5 py-4 font-leyenda text-sm font-bold tracking-[0.04em] text-tinta uppercase transition-colors hover:bg-obliga hover:text-obliga-tinta focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-obliga"
					>
						{servicio.title}
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="bg-obliga">
		<div class="container mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-14">
			<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
				<div class="max-w-[60ch]">
					<h2
						class="font-leyenda text-xl leading-tight font-bold tracking-[0.03em] text-balance text-obliga-tinta uppercase sm:text-2xl"
					>
						Trabaja con nosotros
					</h2>
					<p class="mt-3 text-sm leading-relaxed text-marca-100">
						Las actividades de estas cinco regiones las ejecuta una red de profesionales
						independientes. Si eres auditor, capacitador, consultor o especialista en estudios
						técnicos, puedes enviarnos tu hoja de vida.
					</p>
				</div>
				<a
					href={resolve('/trabaja-con-nosotros')}
					class="shrink-0 self-start bg-segura px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
				>
					Enviar mi hoja de vida
				</a>
			</div>
		</div>
	</section>

	<section class="container mx-auto max-w-4xl px-6 py-14 sm:px-8 sm:py-16">
		<h2
			class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
		>
			Preguntas frecuentes
		</h2>
		<dl class="mt-10 divide-y divide-gray-200 border-y border-gray-200">
			{#each preguntas as item (item.pregunta)}
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
