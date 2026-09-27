<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/seo/Seo.svelte';
	import { REGIONES } from '$lib/seo/site';
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
	import { serviciosData } from '$lib/data/servicios';

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
</script>

<Seo {title} {description} path="/cobertura" {schema} />

<PageHeader />

<main
	class="min-h-screen bg-linear-to-br from-white via-gray-50 to-blue-50 px-4 pt-28 pb-20 sm:px-6"
>
	<div class="container mx-auto max-w-6xl">
		<nav aria-label="Ruta de navegación" class="mb-6 text-sm text-gray-500">
			<a href={resolve('/')} class="hover:text-blue-600">Inicio</a>
			<span class="mx-2">/</span>
			<span class="text-gray-900">Cobertura</span>
		</nav>

		<h1 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">Dónde operamos</h1>
		<p class="mb-10 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
			Desde nuestra sede en Yopal acompañamos a empresas públicas y privadas del corredor llanero y
			del eje Bogotá–Boyacá. Cada región tiene su propia mezcla de riesgo, normatividad sectorial y
			exigencia contractual, y el servicio se ajusta a ella.
		</p>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each REGIONES as region (region.slug)}
				<article
					class="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
				>
					<h2 class="mb-2 text-xl font-bold text-gray-900">
						<a
							href={resolve('/cobertura/[region]', { region: region.slug })}
							class="hover:text-blue-600"
						>
							{region.nombre}
						</a>
					</h2>
					<p class="mb-4 grow text-sm leading-relaxed text-gray-600">{region.enfoque}</p>
					<ul class="mb-4 flex flex-wrap gap-1.5">
						{#each region.sectores as sector (sector)}
							<li class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
								{sector}
							</li>
						{/each}
					</ul>
					<p class="mb-4 text-xs text-gray-500">
						{region.ciudades.slice(0, 6).join(' · ')}
					</p>
					<a
						href={resolve('/cobertura/[region]', { region: region.slug })}
						class="text-sm font-semibold text-blue-600 hover:text-blue-700"
					>
						Ver servicios en {region.nombre} →
					</a>
				</article>
			{/each}
		</div>

		<section class="mt-16">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
				Servicios disponibles en todas las regiones
			</h2>
			<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each servicios as servicio (servicio.slug)}
					<li>
						<a
							href={resolve('/servicios/[slug]', { slug: servicio.slug })}
							class="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:border-blue-300 hover:text-blue-700"
						>
							{servicio.title}
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<section class="mt-16 rounded-2xl border border-gray-200 bg-white p-8">
			<h2 class="mb-3 text-2xl font-bold text-gray-900">Trabaja con nosotros</h2>
			<p class="mb-6 max-w-3xl text-sm leading-relaxed text-gray-600">
				Las actividades de estas cinco regiones las ejecuta una red de profesionales independientes.
				Si eres auditor, capacitador, consultor o especialista en estudios técnicos, puedes
				enviarnos tu hoja de vida.
			</p>
			<a
				href={resolve('/trabaja-con-nosotros')}
				class="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
			>
				Enviar mi hoja de vida
			</a>
		</section>

		<section class="mt-16">
			<h2 class="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">Preguntas frecuentes</h2>
			<dl class="space-y-4">
				{#each preguntas as item (item.pregunta)}
					<div class="rounded-2xl border border-gray-200 bg-white p-5">
						<dt class="mb-2 font-semibold text-gray-900">{item.pregunta}</dt>
						<dd class="text-sm leading-relaxed text-gray-600">{item.respuesta}</dd>
					</div>
				{/each}
			</dl>
		</section>
	</div>
</main>

<PageFooter />
