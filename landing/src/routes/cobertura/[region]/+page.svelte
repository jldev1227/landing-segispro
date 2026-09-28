<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/seo/Seo.svelte';
	import { CAMPUS_CURSOS, CONTACT, absoluteUrl } from '$lib/seo/site';
	import { CIFRAS } from '$lib/data/cifras';
	import {
		breadcrumbSchema,
		graph,
		organizationSchema,
		serviceSchema,
		webPageSchema,
		websiteSchema
	} from '$lib/seo/schema';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageFooter from '$lib/components/PageFooter.svelte';
	import { serviciosData } from '$lib/data/servicios';

	let { data } = $props();
	const region = $derived(data.region);

	const servicios = Object.values(serviciosData);

	const path = $derived(`/cobertura/${region.slug}`);
	const title = $derived(
		`SST, auditorías y capacitaciones en ${region.nombre} | SEGISPRO Ingeniería`
	);
	const description = $derived(
		`Consultoría, auditoría, interventoría, formación y simulacros en seguridad y salud en el trabajo para empresas de ${region.nombre}. Atención en ${region.ciudades.slice(0, 4).join(', ')} y municipios vecinos.`
	);

	const schema = $derived(
		graph([
			organizationSchema(),
			websiteSchema(),
			webPageSchema({ url: absoluteUrl(path), title, description }),
			breadcrumbSchema([
				{ name: 'Cobertura', path: '/cobertura' },
				{ name: region.nombre, path }
			]),
			serviceSchema({
				name: `Servicios de seguridad y salud en el trabajo en ${region.nombre}`,
				description: region.enfoque,
				path,
				tipo: 'Seguridad y salud en el trabajo'
			})
		])
	);
</script>

<Seo {title} {description} {path} {schema} />

<PageHeader />

<main class="min-h-screen bg-white pt-20">
	<section class="bg-linear-to-br from-gray-900 via-gray-800 to-black px-4 py-16 sm:px-6">
		<div class="container mx-auto max-w-5xl">
			<nav aria-label="Ruta de navegación" class="mb-6 text-sm text-gray-400">
				<a href={resolve('/')} class="hover:text-blue-400">Inicio</a>
				<span class="mx-2">/</span>
				<a href={resolve('/cobertura')} class="hover:text-blue-400">Cobertura</a>
				<span class="mx-2">/</span>
				<span class="text-white">{region.nombre}</span>
			</nav>

			<h1 class="mb-5 text-3xl font-bold text-balance text-white sm:text-4xl lg:text-5xl">
				Seguridad y salud en el trabajo en {region.nombre}
			</h1>
			<p class="max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
				{region.enfoque}
			</p>
		</div>
	</section>

	<section class="px-4 py-14 sm:px-6">
		<div class="container mx-auto grid max-w-5xl gap-10 lg:grid-cols-3">
			<div class="lg:col-span-2">
				<h2 class="mb-4 text-2xl font-bold text-gray-900">
					Qué encontramos en las operaciones de {region.nombre}
				</h2>
				<ul class="space-y-3">
					{#each region.retos as reto (reto)}
						<li class="flex gap-3 text-sm leading-relaxed text-gray-700">
							<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"></span>
							<span>{reto}</span>
						</li>
					{/each}
				</ul>

				<h2 class="mt-10 mb-3 text-2xl font-bold text-gray-900">Marco normativo aplicable</h2>
				<p class="text-sm leading-relaxed text-gray-700">{region.normatividad}</p>
			</div>

			<aside class="space-y-6">
				<div class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
					<h2 class="mb-3 text-sm font-semibold tracking-wide text-gray-900 uppercase">
						Sectores atendidos
					</h2>
					<ul class="flex flex-wrap gap-1.5">
						{#each region.sectores as sector (sector)}
							<li class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
								{sector}
							</li>
						{/each}
					</ul>
				</div>

				<div class="rounded-2xl border border-gray-200 bg-gray-50 p-5">
					<h2 class="mb-3 text-sm font-semibold tracking-wide text-gray-900 uppercase">
						Municipios con atención
					</h2>
					<p class="text-sm leading-relaxed text-gray-700">{region.ciudades.join(', ')}.</p>
				</div>
			</aside>
		</div>
	</section>

	<section class="bg-gray-50 px-4 py-14 sm:px-6">
		<div class="container mx-auto max-w-5xl">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">
				Servicios disponibles en {region.nombre}
			</h2>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each servicios as servicio (servicio.slug)}
					<a
						href={resolve('/servicios/[slug]', { slug: servicio.slug })}
						class="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
					>
						<h3 class="mb-2 font-semibold text-gray-900">{servicio.title}</h3>
						<p class="text-sm leading-relaxed text-gray-600">{servicio.tagline}</p>
					</a>
				{/each}
			</div>

			<div class="mt-10 rounded-2xl border border-gray-200 bg-white p-8">
				<h2 class="mb-3 text-2xl font-bold text-gray-900">
					¿Eres profesional de SST y trabajas en {region.nombre}?
				</h2>
				<p class="mb-6 max-w-3xl text-sm leading-relaxed text-gray-600">
					Buscamos auditores, capacitadores, consultores y especialistas en estudios técnicos para
					ejecutar servicios en {region.ciudades.slice(0, 3).join(', ')} y el resto de {region.nombre}.
					La red la integran {CIFRAS.profesionales} profesionales y la contratación es por actividad.
				</p>
				<a
					href={resolve('/trabaja-con-nosotros')}
					class="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
				>
					Enviar mi hoja de vida
				</a>
			</div>

			<div class="mt-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
				<h2 class="mb-3 text-2xl font-bold">¿Necesita acompañamiento en {region.nombre}?</h2>
				<p class="mx-auto mb-6 max-w-2xl text-blue-100">
					Cuéntenos el alcance y coordinamos una visita técnica o una propuesta de consultoría.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a
						href="tel:{CONTACT.telefono}"
						class="rounded-full bg-white px-6 py-3 font-semibold text-blue-600 transition-transform hover:scale-105"
					>
						{CONTACT.telefonoVisible}
					</a>
					<a
						href={CAMPUS_CURSOS}
						target="_blank"
						rel="noopener"
						class="rounded-full border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600"
					>
						Ver formación
					</a>
				</div>
			</div>
		</div>
	</section>
</main>

<PageFooter />
