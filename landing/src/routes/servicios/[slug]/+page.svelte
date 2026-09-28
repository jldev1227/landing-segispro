<script lang="ts">
	/**
	 * Ficha de servicio, en el sistema señalético.
	 *
	 * La versión anterior no tenía cabecera ni pie: se llegaba desde el home o
	 * desde el buscador y el único camino de vuelta era el botón atrás. Además
	 * era el mundo antiguo entero —degradado gris-a-negro, orbe azul difuminado,
	 * cifras numeradas en cápsulas con gradiente— y once transiciones escalonadas
	 * que retrasaban el contenido hasta un segundo después de la carga.
	 *
	 * Aquí manda el alcance: qué se hace, contra qué norma y qué se lleva el
	 * cliente. La acción de cotizar viaja con el visitante en una banda pegajosa,
	 * porque en una página larga la decisión no siempre se toma al final.
	 */
	import Icono from '$lib/components/Icono.svelte';
	import Placa from '$lib/components/Placa.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PageFooter from '$lib/components/PageFooter.svelte';
	import { resolve } from '$app/paths';
	import Seo from '$lib/seo/Seo.svelte';
	import { absoluteUrl, REGIONES, WHATSAPP_URL } from '$lib/seo/site';
	import { serviciosData } from '$lib/data/servicios';
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

	/**
	 * La forma de la placa clasifica igual que en el primer pliegue del home: no
	 * es decoración, es la mitad del mensaje. Lo que obliga la norma va en
	 * círculo, lo que mide riesgo en triángulo, la capacidad entregada en
	 * cuadrado.
	 */
	const TIPO_POR_SERVICIO: Record<string, 'obliga' | 'advierte' | 'segura'> = {
		'consultoria-asesoria': 'obliga',
		interventoria: 'obliga',
		'campanas-estudios': 'advierte',
		formacion: 'segura',
		digitalizacion: 'segura',
		'proyectos-especiales': 'segura'
	};

	/** El resto del portafolio, para que la ficha no sea un callejón sin salida. */
	const otros = $derived(Object.values(serviciosData).filter((s) => s.slug !== servicio.slug));

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

<PageHeader activa="servicios" />

<main class="bg-placa pt-20">
	<!-- Banda de leyenda: la placa de obligación que encabeza toda la página. -->
	<section class="bg-obliga">
		<div class="container mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
			<nav aria-label="Ruta de navegación">
				<ol
					class="flex flex-wrap items-center gap-2 font-leyenda text-xs tracking-[0.06em] text-marca-300 uppercase"
				>
					<li><a href={resolve('/')} class="transition-colors hover:text-white">Inicio</a></li>
					<li aria-hidden="true">·</li>
					<li>
						<a href="{resolve('/')}#services" class="transition-colors hover:text-white"
							>Servicios</a
						>
					</li>
					<li aria-hidden="true">·</li>
					<li class="text-white">{servicio.title}</li>
				</ol>
			</nav>

			<div class="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
				<div class="max-w-3xl">
					<h1
						class="font-leyenda text-3xl leading-[1.1] font-bold tracking-[0.02em] text-balance text-obliga-tinta uppercase sm:text-4xl lg:text-5xl"
					>
						{servicio.title}
					</h1>
					<p class="mt-5 max-w-[58ch] text-base leading-relaxed text-marca-100 sm:text-lg">
						{servicio.tagline}
					</p>
				</div>

				<div class="flex shrink-0 flex-wrap items-center gap-3">
					<a
						href="{resolve('/')}#contacto"
						class="bg-segura px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
					>
						Solicitar cotización
					</a>
					<a
						href={WHATSAPP_URL}
						target="_blank"
						rel="noopener"
						class="border-2 border-marca-400 px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-obliga-tinta uppercase transition-colors duration-150 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
					>
						Escribir por WhatsApp
					</a>
				</div>
			</div>
		</div>
	</section>

	<div class="container mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
		<!--
			Descripción y beneficios, uno al lado del otro: el texto largo explica y
			la columna de resultados es lo que el comprador escanea.
		-->
		<div class="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
			<div>
				<p class="max-w-[64ch] text-base leading-relaxed text-gray-700 sm:text-lg">
					{servicio.description}
				</p>
			</div>

			<section class="border-t-2 border-tinta pt-6">
				<h2 class="font-leyenda text-sm font-bold tracking-[0.09em] text-tinta uppercase">
					Qué se lleva el cliente
				</h2>
				<ul class="mt-5 space-y-2.5">
					{#each servicio.benefits as beneficio (beneficio)}
						<li class="flex gap-3 text-sm leading-relaxed text-gray-700">
							<Icono nombre="check" class="mt-0.5 h-4 w-4 shrink-0 text-segura" />
							<span>{beneficio}</span>
						</li>
					{/each}
				</ul>
			</section>
		</div>

		{#if servicio.features}
			<section class="mt-16 border-t-2 border-tinta pt-6">
				<h2
					class="font-leyenda text-xl leading-tight font-bold tracking-[0.04em] text-tinta uppercase sm:text-2xl"
				>
					{servicio.features.title}
				</h2>
				<!--
					Numeración en cifras tabulares contra el filete, no en cápsulas con
					degradado: es una secuencia, y lo que importa es el orden.
				-->
				<ol class="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
					{#each servicio.features.items as item, i (item)}
						<li class="flex gap-5 border-t border-gray-200 pt-4">
							<span
								class="shrink-0 font-leyenda text-2xl font-bold text-marca-300 tabular-nums"
								aria-hidden="true"
							>
								{String(i + 1).padStart(2, '0')}
							</span>
							<p class="max-w-[52ch] text-sm leading-relaxed text-gray-700">{item}</p>
						</li>
					{/each}
				</ol>
			</section>
		{/if}

		{#if servicio.standards}
			<section class="mt-16 border-t-2 border-tinta pt-6">
				<h2
					class="font-leyenda text-xl leading-tight font-bold tracking-[0.04em] text-tinta uppercase sm:text-2xl"
				>
					Normas y estándares
				</h2>
				<p class="mt-3 max-w-[62ch] text-sm leading-relaxed text-gray-600">
					SEGISPRO no es organismo certificador: acompaña el diseño, la implementación y la
					auditoría interna para que la organización llegue preparada ante el ente acreditado que
					elija.
				</p>

				<!-- El código es la etiqueta de la placa; va en su campo de color. -->
				<dl class="mt-8 divide-y divide-gray-200 border-y border-gray-200">
					{#each servicio.standards as norma (norma.code)}
						<div class="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[minmax(0,10rem)_1fr]">
							<dt>
								<span
									class="inline-block bg-obliga px-3 py-1.5 font-leyenda text-xs font-bold tracking-[0.08em] text-obliga-tinta uppercase"
								>
									{norma.code}
								</span>
							</dt>
							<dd>
								<p class="font-leyenda text-sm font-bold tracking-[0.03em] text-tinta">
									{norma.name}
								</p>
								<p class="mt-1 max-w-[62ch] text-sm leading-relaxed text-gray-600">
									{norma.description}
								</p>
							</dd>
						</div>
					{/each}
				</dl>
			</section>
		{/if}

		{#if servicio.additionalSections}
			{#each servicio.additionalSections as seccion (seccion.title)}
				<section class="mt-16 border-t-2 border-tinta pt-6">
					<h2
						class="font-leyenda text-xl leading-tight font-bold tracking-[0.04em] text-tinta uppercase sm:text-2xl"
					>
						{seccion.title}
					</h2>
					{#if seccion.content}
						<p class="mt-4 max-w-[68ch] text-base leading-relaxed text-gray-700">
							{seccion.content}
						</p>
					{/if}
					{#if seccion.items}
						<ul class="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
							{#each seccion.items as item (item)}
								<li
									class="flex gap-2.5 border-t border-gray-200 pt-3 text-sm leading-relaxed text-gray-700"
								>
									<span class="mt-[0.55em] h-1 w-2.5 shrink-0 bg-segura"></span>
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			{/each}
		{/if}

		<!-- Cobertura: enlaza el servicio con cada región donde se presta. -->
		<section class="mt-16 border-t-2 border-tinta pt-6">
			<h2
				class="font-leyenda text-xl leading-tight font-bold tracking-[0.04em] text-balance text-tinta uppercase sm:text-2xl"
			>
				{servicio.title} en {regiones}
			</h2>
			<p class="mt-3 max-w-[66ch] text-sm leading-relaxed text-gray-600">
				Se presta en toda el área de cobertura, con desplazamiento a locación y acompañamiento
				presencial o remoto según el alcance contratado.
			</p>
			<ul class="mt-6 flex flex-wrap border-t border-l border-gray-200">
				{#each REGIONES as region (region.slug)}
					<li class="border-r border-b border-gray-200 bg-placa">
						<a
							href={resolve('/cobertura/[region]', { region: region.slug })}
							class="block px-5 py-3 font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase transition-colors hover:bg-obliga hover:text-obliga-tinta focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-obliga"
						>
							{region.nombre}
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<!-- El resto del portafolio. Una ficha no debe ser un callejón sin salida. -->
		<section class="mt-16 border-t-2 border-tinta pt-6">
			<h2 class="font-leyenda text-sm font-bold tracking-[0.09em] text-tinta uppercase">
				Otros servicios
			</h2>
			<ul class="mt-8 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
				{#each otros as otro (otro.slug)}
					<li>
						<Placa
							tipo={TIPO_POR_SERVICIO[otro.slug] ?? 'segura'}
							icono={otro.icon}
							leyenda={otro.title}
							detalle={otro.tagline}
							href={resolve('/servicios/[slug]', { slug: otro.slug })}
						/>
					</li>
				{/each}
			</ul>
		</section>

		<!--
			Quien busca trabajo en esta especialidad llega por aquí. La llamada va en
			su propia línea y no incrustada en la frase: en versales y con filete,
			partida entre dos renglones, el subrayado quedaba colgando bajo «vida».
		-->
		<div class="mt-14 border-t border-gray-200 pt-5">
			<p class="max-w-[70ch] text-sm leading-relaxed text-gray-600">
				¿Eres profesional en esta área y quieres ejecutar servicios con nosotros?
			</p>
			<a
				href={resolve('/trabaja-con-nosotros')}
				class="mt-2.5 inline-block border-b-2 border-obliga pb-0.5 font-leyenda text-xs font-bold tracking-[0.06em] text-obliga uppercase transition-colors hover:border-segura hover:text-segura"
			>
				Envía tu hoja de vida
			</a>
		</div>
	</div>

	<!--
		Banda de cierre. La página es larga y la decisión de cotizar no siempre se
		toma al final, así que la acción vuelve a aparecer con el alcance del
		servicio nombrado, no como «¿Listo para transformar tu organización?».
	-->
	<section class="bg-obliga">
		<div class="container mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-14">
			<div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
				<div class="flex items-start gap-5">
					<!--
						Aquí no va una `Placa`: su campo navy desaparecería sobre esta banda,
						también navy, y su leyenda usa tinta oscura. El pictograma se monta
						sobre el verde de condición segura, que es el color de la acción.
					-->
					<span
						class="hidden h-16 w-16 shrink-0 items-center justify-center bg-segura sm:flex"
						aria-hidden="true"
					>
						<Icono nombre={servicio.icon} class="h-8 w-8 text-segura-tinta" />
					</span>
					<div class="max-w-[52ch]">
						<h2
							class="font-leyenda text-xl leading-tight font-bold tracking-[0.03em] text-balance text-obliga-tinta uppercase sm:text-2xl"
						>
							Cotizar {servicio.title.toLowerCase()}
						</h2>
						<p class="mt-3 text-sm leading-relaxed text-marca-100">
							Cuéntanos el alcance, el número de sedes y las fechas. La propuesta llega con el
							detalle de actividades y el valor por servicio.
						</p>
					</div>
				</div>

				<div class="flex shrink-0 flex-wrap gap-3">
					<a
						href="{resolve('/')}#contacto"
						class="bg-segura px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
					>
						Solicitar cotización
					</a>
				</div>
			</div>
		</div>
	</section>
</main>

<PageFooter />
