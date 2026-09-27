<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import Seo from '$lib/seo/Seo.svelte';
	import { absoluteUrl, REGIONES } from '$lib/seo/site';
	import {
		breadcrumbSchema,
		graph,
		organizationSchema,
		serviceSchema,
		webPageSchema,
		websiteSchema
	} from '$lib/seo/schema';

	let { data } = $props();
	const servicio = $derived(data.servicio);

	const path = $derived(`/servicios/${servicio.slug}`);
	const regiones = REGIONES.map((region) => region.nombre).join(', ');

	const title = $derived(`${servicio.title} | SEGISPRO Ingeniería`);
	/** La meta descripción se arma con el tagline, que es la frase más corta y comercial. */
	const description = $derived(
		`${servicio.tagline} ${servicio.description.replace(/\s+/g, ' ').slice(0, 110).trim()}…`.slice(
			0,
			158
		)
	);

	const schema = $derived(
		graph([
			organizationSchema(),
			websiteSchema(),
			webPageSchema({ url: absoluteUrl(path), title, description }),
			breadcrumbSchema([
				{ name: 'Servicios', path: '/#services' },
				{ name: servicio.title, path }
			]),
			serviceSchema({ name: servicio.title, description: servicio.tagline, path })
		])
	);
</script>

<Seo {title} {description} {path} {schema} />

{#if servicio}
	<!-- Hero Section -->
	<section
		class="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black px-6 pt-32 pb-20"
	>
		<!-- Grid pattern -->
		<div class="absolute inset-0 opacity-5">
			<div
				class="absolute inset-0"
				style="background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0); background-size: 40px 40px;"
			></div>
		</div>

		<!-- Gradiente -->
		<div
			class="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"
		></div>

		<div class="relative z-10 container mx-auto max-w-5xl">
			<!-- Breadcrumb -->
			<nav class="mb-8" in:fly={{ y: -20, duration: 500, easing: quintOut }}>
				<ol class="flex items-center gap-2 text-sm text-gray-400">
					<li><a href={resolve('/')} class="hover:text-white">Inicio</a></li>
					<li>/</li>
					<li><a href="/#services" class="hover:text-white">Servicios</a></li>
					<li>/</li>
					<li class="text-white">{servicio.title}</li>
				</ol>
			</nav>

			<!-- Header -->
			<div
				class="text-center"
				in:scale={{ duration: 600, delay: 100, start: 0.9, easing: quintOut }}
			>
				<div
					class="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-blue-600 to-blue-500 text-5xl shadow-2xl"
				>
					{servicio.icon}
				</div>
				<h1 class="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
					{servicio.title}
				</h1>
				<p class="mx-auto max-w-3xl text-xl text-gray-300">
					{servicio.tagline}
				</p>
			</div>
		</div>
	</section>

	<!-- Content Section -->
	<section class="bg-white px-6 py-20">
		<div class="container mx-auto max-w-5xl">
			<!-- Description -->
			<div class="mb-16" in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}>
				<p class="text-lg leading-relaxed text-gray-700">
					{servicio.description}
				</p>
			</div>

			<!-- Benefits -->
			<div class="mb-20" in:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }}>
				<h2 class="mb-8 text-3xl font-bold text-gray-900">¿Qué logran nuestros clientes?</h2>
				<div class="grid gap-4 md:grid-cols-2">
					{#each servicio.benefits as benefit, i (i)}
						<div
							class="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
							in:scale={{ duration: 400, delay: 400 + i * 50, start: 0.9, easing: quintOut }}
						>
							<div class="shrink-0">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
							</div>
							<p class="text-gray-700">{benefit}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Features -->
			{#if servicio.features}
				<div class="mb-20" in:fly={{ y: 30, duration: 600, delay: 500, easing: quintOut }}>
					<h2 class="mb-8 text-3xl font-bold text-gray-900">{servicio.features.title}</h2>
					<div class="space-y-4">
						{#each servicio.features.items as item, i (i)}
							<div
								class="group rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
								in:fly={{ x: -20, duration: 400, delay: 600 + i * 80, easing: quintOut }}
							>
								<div class="flex items-start gap-4">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-blue-500 font-bold text-white"
									>
										{i + 1}
									</div>
									<p class="pt-1 text-gray-700">{item}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Standards -->
			{#if servicio.standards}
				<div class="mb-20" in:fly={{ y: 30, duration: 600, delay: 700, easing: quintOut }}>
					<h2 class="mb-8 text-3xl font-bold text-gray-900">Normas y Estándares</h2>
					<div class="space-y-6">
						{#each servicio.standards as standard, i (i)}
							<div
								class="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-xl"
								in:scale={{ duration: 400, delay: 800 + i * 60, start: 0.95, easing: quintOut }}
							>
								<div class="flex flex-col md:flex-row">
									<!-- Code Badge -->
									<div
										class="flex items-center justify-center bg-linear-to-br from-blue-600 to-blue-500 p-8 md:w-48"
									>
										<span class="text-center text-lg font-bold text-white">
											{standard.code}
										</span>
									</div>
									<!-- Content -->
									<div class="flex-1 p-6">
										<h3
											class="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600"
										>
											{standard.name}
										</h3>
										<p class="text-gray-600">{standard.description}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Additional Sections -->
			{#if servicio.additionalSections}
				{#each servicio.additionalSections as section, idx (idx)}
					<div
						class="mb-20"
						in:fly={{ y: 30, duration: 600, delay: 900 + idx * 100, easing: quintOut }}
					>
						<h2 class="mb-6 text-3xl font-bold text-gray-900">{section.title}</h2>
						{#if section.content}
							<p class="mb-8 text-lg leading-relaxed text-gray-700">{section.content}</p>
						{/if}
						{#if section.items}
							<div class="grid gap-4 md:grid-cols-2">
								{#each section.items as item (item)}
									<div class="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
										<div class="shrink-0">
											<div
												class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
										</div>
										<p class="text-sm text-gray-700">{item}</p>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			{/if}

			<!-- Cobertura: enlaza el servicio con cada región donde se presta -->
			<div class="mt-16">
				<h2 class="mb-2 text-2xl font-bold text-gray-900">
					{servicio.title} en {regiones}
				</h2>
				<p class="mb-6 text-sm leading-relaxed text-gray-600">
					Este servicio se presta en toda nuestra área de cobertura, con desplazamiento a locación y
					acompañamiento presencial o remoto según el alcance contratado.
				</p>
				<ul class="flex flex-wrap gap-2">
					{#each REGIONES as region (region.slug)}
						<li>
							<a
								href={resolve('/cobertura/[region]', { region: region.slug })}
								class="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-400 hover:text-blue-700"
							>
								{region.nombre}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- CTA -->
			<div
				class="mt-20 rounded-3xl bg-linear-to-br from-blue-600 to-blue-500 p-10 text-center text-white shadow-2xl"
				in:scale={{ duration: 600, delay: 1000, start: 0.9, easing: quintOut }}
			>
				<h2 class="mb-4 text-3xl font-bold">¿Listo para transformar tu organización?</h2>
				<p class="mb-8 text-lg text-blue-100">Contáctanos y descubre cómo podemos ayudarte</p>
				<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
					<a
						href="/#contacto"
						class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
					>
						Contáctanos
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
					</a>
					<a
						href="/#services"
						class="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-blue-600"
					>
						Ver todos los servicios
					</a>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
