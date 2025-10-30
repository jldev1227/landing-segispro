<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { bounce, fadeInUp } from '$lib/animations';
	import CarouselInfinito from '$lib/components/CarouselInfinito.svelte';
	import CarouselClientes from '$lib/components/CarouselClientes.svelte';

	let scrollY = 0;
	let mobileMenuOpen = false;
	let activeSection = 'inicio';

	$: isScrolled = scrollY > 50;

	const navItems = [
		{ id: 'inicio', label: 'Inicio' },
		{ id: 'services', label: 'Servicios' },
		{ id: 'nosotros', label: 'Nosotros' },
		{ id: 'contacto', label: 'Contacto' }
	];
	let mounted = false;
	let heroVisible = false;
	let servicesVisible = false;
	let characteristicsVisible = false;

	onMount(() => {
		mounted = true;

		// Observer para animaciones al hacer scroll
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target.id === 'hero') heroVisible = true;
						if (entry.target.id === 'services') servicesVisible = true;
						if (entry.target.id === 'characteristics') characteristicsVisible = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Observar secciones
		const sections = document.querySelectorAll('section[id]');
		sections.forEach((section) => observer.observe(section));

		// Animación inicial del héroe
		setTimeout(() => {
			heroVisible = true;
		}, 100);

		return () => observer.disconnect();
	});

	interface Service {
		title: string;
		description: string;
		icon: string;
	}

	const services: Service[] = [
		{
			title: 'CONSULTORÍA',
			description:
				'Acompañamiento experto en sistemas de gestión, cumplimiento normativo y mejora continua para fortalecer la seguridad y el desempeño de tu organización.',
			icon: '🎯'
		},
		{
			title: 'AUDITORÍA',
			description:
				'Auditorías precisas y confiables para garantizar el cumplimiento normativo y la excelencia operacional.',
			icon: '📊'
		},
		{
			title: 'INTERVENTORÍA',
			description:
				'Supervisión técnica diseñada para asegurar la calidad y el éxito en proyectos y procesos estratégicos.',
			icon: '🔍'
		},
		{
			title: 'CAPACITACIÓN',
			description:
				'Conocimiento especializado para potenciar habilidades y generar objetivos del progreso profesional y empresarial.',
			icon: '📚'
		}
	];

	interface Characteristic {
		icon: string;
		title: string;
		description: string;
	}

	const characteristics: Characteristic[] = [
		{
			icon: '✓',
			title: 'Soluciones a la medida',
			description:
				'Diseñamos estrategias personalizadas que se adaptan específicamente a las necesidades de tu organización.'
		},
		{
			icon: '⚡',
			title: 'Soluciones prácticas',
			description:
				'Implementamos acciones concretas y efectivas que generan resultados tangibles en el corto plazo.'
		},
		{
			icon: '🎯',
			title: 'Experiencia comprobada',
			description:
				'Más de 10 años respaldando empresas en el cumplimiento normativo y mejora continua.'
		},
		{
			icon: '💡',
			title: 'Innovación constante',
			description:
				'Utilizamos las últimas metodologías y tecnologías para optimizar tus procesos empresariales.'
		},
		{
			icon: '🛡️',
			title: 'Seguridad garantizada',
			description:
				'Protección total de la información y cumplimiento estricto de estándares internacionales.'
		},
		{
			icon: '🤝',
			title: 'Compromiso total',
			description:
				'Acompañamiento integral en cada etapa del proyecto hasta alcanzar tus objetivos.'
		},
		{
			icon: '📈',
			title: 'Resultados medibles',
			description:
				'KPIs claros y reportes detallados para evaluar el impacto de nuestras intervenciones.'
		},
		{
			icon: '🌟',
			title: 'Excelencia operativa',
			description:
				'Optimización de procesos para lograr la máxima eficiencia y calidad en tu operación.'
		}
	];

	const clientes = [
		{ name: 'SURA', logo: '/clientes/sura.png' },
		{ name: 'Colmena Seguros', logo: '/clientes/colmena.png' },
		{ name: 'Positiva Compañía de Seguros', logo: '/clientes/positiva.png' },
		{ name: 'AXA Colpatria', logo: '/clientes/axa.png' },
		{ name: 'Liberty Seguros', logo: '/clientes/liberty.webp' },
		{ name: 'Equidad Seguros', logo: '/clientes/equidad.png' },
		{ name: 'Mapfre Seguros', logo: '/clientes/equidad.png' },
		{ name: 'Bolívar', logo: '/clientes/bolivar.png' },
		{ name: 'La Previsora Seguros', logo: '/clientes/bolivar.png' },
		{ name: 'QBE Seguros', logo: '/clientes/qbe.webp' }
	];
</script>

<svelte:head>
	<title>SEGISPRO - Tu aliado estratégico</title>
</svelte:head>

<svelte:window bind:scrollY />

<!-- Header/Navbar -->
<header
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-500"
	class:bg-white={isScrolled}
	class:backdrop-blur-lg={isScrolled}
	class:shadow-lg={isScrolled}
	class:py-4={!isScrolled}
	class:py-2={isScrolled}
>
	{#if mounted}
		<nav class="container mx-auto px-6" in:fly={{ y: -20, duration: 800, easing: quintOut }}>
			<div class="flex items-center justify-between">
				<!-- Logo con efecto hover -->
				<a href="#inicio" class="group flex items-center space-x-2">
					<div class="relative overflow-hidden rounded-lg">
						<img
							src="/assets/logo.png"
							alt="SEGISPRO Logo"
							class="h-8 w-32 transition-transform duration-500 group-hover:scale-110"
						/>
						<!-- Brillo animado al hover -->
						<div
							class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
						></div>
					</div>
				</a>

				<!-- Desktop Menu -->
				<div class="hidden items-center space-x-1 rounded-full bg-gray-100/50 px-2 py-2 md:flex">
					{#each navItems as item, i}
						<a
							href="#{item.id}"
							class="group relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300"
							class:text-white={activeSection === item.id}
							class:text-gray-600={activeSection !== item.id}
							on:click={() => (activeSection = item.id)}
							in:fly={{ x: -20, duration: 600, delay: i * 100, easing: quintOut }}
						>
							<!-- Background activo con animación -->
							{#if activeSection === item.id}
								<span
									class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg"
									in:fly={{ scale: 0.8, duration: 400 }}
								></span>
							{/if}

							<!-- Texto -->
							<span
								class="relative z-10 inline-block transition-transform duration-300 group-hover:scale-105"
							>
								{item.label}
							</span>

							<!-- Indicador hover para items inactivos -->
							{#if activeSection !== item.id}
								<span
									class="absolute inset-0 scale-0 rounded-full bg-gray-200/50 transition-transform duration-300 group-hover:scale-100"
								></span>
							{/if}
						</a>
					{/each}
				</div>

				<!-- CTA Button -->
				<button
					class="group relative hidden overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl md:block"
					in:fly={{ x: 20, duration: 600, delay: 400, easing: quintOut }}
				>
					<span class="relative z-10">Contáctanos</span>
					<!-- Efecto de onda al hover -->
					<span
						class="absolute inset-0 translate-y-full bg-gradient-to-r from-blue-500 to-purple-600 transition-transform duration-300 group-hover:translate-y-0"
					></span>
				</button>

				<!-- Mobile Menu Button -->
				<button
					class="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 md:hidden"
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					<div class="flex h-5 w-6 flex-col justify-between">
						<span
							class="h-0.5 w-full rounded-full bg-gray-800 transition-all duration-300"
							class:rotate-45={mobileMenuOpen}
							class:translate-y-2={mobileMenuOpen}
						></span>
						<span
							class="h-0.5 w-full rounded-full bg-gray-800 transition-all duration-300"
							class:opacity-0={mobileMenuOpen}
						></span>
						<span
							class="h-0.5 w-full rounded-full bg-gray-800 transition-all duration-300"
							class:-rotate-45={mobileMenuOpen}
							class:-translate-y-2={mobileMenuOpen}
						></span>
					</div>
				</button>
			</div>
		</nav>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div
				class="border-t bg-white md:hidden"
				in:fly={{ y: -20, duration: 400, easing: quintOut }}
				out:fly={{ y: -20, duration: 300 }}
			>
				<div class="container mx-auto space-y-2 px-6 py-6">
					{#each navItems as item, i}
						<a
							href="#{item.id}"
							class="block rounded-xl px-6 py-3 font-medium text-gray-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
							on:click={() => {
								activeSection = item.id;
								mobileMenuOpen = false;
							}}
							in:fly={{ x: -20, duration: 400, delay: i * 50 }}
						>
							{item.label}
						</a>
					{/each}
					<button
						class="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
						in:fly={{ x: -20, duration: 400, delay: navItems.length * 50 }}
					>
						Contáctanos
					</button>
				</div>
			</div>
		{/if}
	{/if}
</header>

<!-- Hero Section -->
<section
	id="hero"
	class="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-100 px-6 pt-32 pb-20"
>
	<div class="container mx-auto max-w-6xl">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<!-- Contenido Izquierdo -->
			<div class="relative z-10">
				{#if heroVisible}
					<div in:fly={{ y: 50, duration: 800, easing: quintOut }}>
						<p class="mb-4 text-sm font-semibold tracking-wide text-blue-600 uppercase">
							Capacitaciones y auditorías para un trabajo más seguro
						</p>
						<h1 class="mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
							<span class="text-blue-600">SEGISPRO</span><br />
							<span class="text-gray-900">tu aliado</span><br />
							<span class="text-gray-900">estratégico.</span>
						</h1>
					</div>

					<div in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}>
						<p class="mb-8 max-w-2xl text-lg leading-relaxed text-gray-700">
							Capacitaciones personalizadas que fortalecen habilidades y cumplimiento. Muy pronto,
							cursos digitales para aprender con flexibilidad y apoyo experto en todo momento.
						</p>
					</div>
				{/if}
			</div>

			<!-- Video Derecho con Mask Orgánico -->
			<div class="relative hidden lg:block">
				{#if heroVisible}
					<div
						in:scale={{ duration: 1000, delay: 400, start: 0.8, easing: quintOut }}
						class="relative"
					>
						<!-- Contenedor del video con mask deformado -->
						<div class="video-mask relative">
							<video autoplay muted loop playsinline preload="auto" class="h-132 w-full">
								<source src="/videos/hero-video.mp4" type="video/mp4" />
							</video>

							<!-- Borde brillante animado -->
							<div class="border-glow pointer-events-none absolute inset-0"></div>
						</div>

						<!-- Elementos decorativos flotantes -->
						<div
							class="absolute -top-6 -right-6 h-24 w-24 animate-pulse rounded-full bg-blue-500/20 blur-2xl"
						></div>
						<div
							class="absolute -bottom-8 -left-8 h-32 w-32 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
							style="animation-delay: 1s;"
						></div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Services Section -->
<section
	id="services"
	class="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white px-6 py-20"
>
	<!-- Elementos decorativos de fondo -->
	<div class="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"></div>
	<div class="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl"></div>

	<div class="relative z-10 container mx-auto max-w-6xl">
		{#if mounted}
			<div in:fly={{ y: 30, duration: 600 }} class="mb-16 text-center">
				<p class="mb-3 text-sm font-semibold tracking-wide text-blue-600 uppercase">
					Experiencia y compromiso
				</p>
				<h2 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
					Nuestros <span class="text-blue-600">servicios</span>
				</h2>
				<div
					class="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
				></div>
			</div>
		{/if}

		<div class="grid gap-8 md:grid-cols-2">
			{#each services as service, i}
				{#if servicesVisible || mounted}
					<div
						in:scale={{ duration: 600, delay: i * 150, start: 0.8, easing: quintOut }}
						class="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
					>
						<!-- Gradiente de fondo animado -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>

						<!-- Borde brillante en hover -->
						<div
							class="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
						></div>

						<div class="relative z-10">
							<!-- Icono con fondo -->
							<div
								class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
							>
								<div class="text-3xl text-white">
									{service.icon}
								</div>
							</div>

							<h3
								class="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600"
							>
								{service.title}
							</h3>

							<p class="mb-6 leading-relaxed text-gray-600">
								{service.description}
							</p>

							<!-- Botón mejorado -->
							<button
								class="group/btn relative inline-flex transform items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl active:scale-95"
							>
								<span class="relative z-10">Ver más</span>
								<svg
									class="relative z-10 h-4 w-4 transform transition-transform duration-300 group-hover/btn:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
								<!-- Efecto de brillo al hover -->
								<div
									class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
								></div>
							</button>
						</div>

						<!-- Efecto de esquina decorativa -->
						<div
							class="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- Characteristics Section -->
<section
	id="characteristics"
	class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 px-6 py-24"
>
	<!-- Elementos decorativos de fondo -->
	<div class="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
	<div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl"></div>

	<!-- Patrón de fondo sutil -->
	<div class="absolute inset-0 opacity-[0.02]">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0); background-size: 40px 40px;"
		></div>
	</div>

	<div class="relative z-10 container mx-auto max-w-6xl">
		{#if characteristicsVisible || mounted}
			<!-- Encabezado mejorado -->
			<div in:fly={{ y: 30, duration: 800 }} class="mb-16 text-center">
				<p class="mb-3 text-sm font-semibold tracking-wide text-blue-600 uppercase">
					Nuestro compromiso
				</p>
				<h2 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
					<span class="text-blue-600">Características</span> que nos definen
				</h2>
				<div
					class="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
				></div>
			</div>

			<!-- Card destacada principal -->
			<div in:fly={{ y: 30, duration: 800, delay: 200 }}>
				<div
					class="group relative mb-12 overflow-hidden rounded-3xl border border-gray-100 bg-white p-10 shadow-xl transition-all duration-500 hover:border-blue-200 hover:shadow-2xl"
				>
					<!-- Gradiente de fondo animado -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Número decorativo grande -->
					<div
						class="absolute -top-6 -left-6 text-[200px] leading-none font-bold text-blue-500/5 select-none"
					>
						01
					</div>

					<div class="relative z-10">
						<!-- Badge con número -->
						<div
							class="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 text-white shadow-lg"
						>
							<span class="text-sm font-bold">01</span>
							<div class="h-4 w-px bg-white/30"></div>
							<span class="text-sm font-semibold">Principal</span>
						</div>

						<h3
							class="mb-6 text-3xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 md:text-4xl"
						>
							Ayudamos a las entidades al mejoramiento continuo
						</h3>

						<p class="max-w-3xl text-lg leading-relaxed text-gray-600">
							Nos dedicamos a guiar las entidades en su búsqueda de mejora continua, ofreciendo
							soluciones innovadoras, eficientes y sostenibles para impulsar su crecimiento y éxito
							a largo plazo.
						</p>

						<!-- Iconos decorativos -->
						<div class="mt-8 flex items-center gap-4">
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<div class="h-2 w-2 rounded-full bg-blue-500"></div>
								<span>Innovación</span>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<div class="h-2 w-2 rounded-full bg-purple-500"></div>
								<span>Eficiencia</span>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<div class="h-2 w-2 rounded-full bg-green-500"></div>
								<span>Sostenibilidad</span>
							</div>
						</div>
					</div>

					<!-- Esquina decorativa -->
					<div
						class="absolute top-0 right-0 h-40 w-40 rounded-bl-[100px] bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>
				</div>
			</div>

			<!-- Título del carrusel -->
			<div in:fly={{ y: 30, duration: 800, delay: 300 }} class="mb-8">
				<h3 class="text-center text-2xl font-bold text-gray-900 md:text-3xl">
					Más características destacadas
				</h3>
				<p class="mt-2 text-center text-gray-600">Descubre todo lo que nos hace diferentes</p>
			</div>

			<!-- Carrusel Infinito de Características con contenedor limitado -->
			<div in:fly={{ y: 30, duration: 800, delay: 400 }}>
				<CarouselInfinito visible={characteristicsVisible || mounted} {characteristics} />
			</div>
		{/if}
	</div>
</section>

<!-- Clients Section -->
<section class="bg-gray-50 px-6 py-16">
	<div class="container mx-auto max-w-6xl">
		<CarouselClientes visible={mounted} {clientes} speed={35} />
	</div>
</section>

<!-- Footer -->
<footer class="border-t border-gray-200 bg-white px-6 py-12">
	<div class="container mx-auto max-w-6xl">
		{#if mounted}
			<div in:fade={{ duration: 600, delay: 200 }}>
				<div class="grid gap-8 md:grid-cols-4">
					<!-- Segispro Column -->
					<div>
						<h4 class="mb-4 font-bold text-gray-800">Segispro</h4>
						<p class="text-sm text-gray-600">Created by Visual Design</p>
					</div>

					<!-- Company Column -->
					<div>
						<h4 class="mb-4 font-bold text-gray-800">Company</h4>
						<ul class="space-y-2">
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>About</a
								>
							</li>
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>Careers</a
								>
							</li>
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>Mobile</a
								>
							</li>
						</ul>
					</div>

					<!-- Contact Column -->
					<div>
						<h4 class="mb-4 font-bold text-gray-800">Contact</h4>
						<ul class="space-y-2">
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>Help</a
								>
							</li>
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>Press</a
								>
							</li>
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>Affiliates</a
								>
							</li>
						</ul>
					</div>

					<!-- More Column -->
					<div>
						<h4 class="mb-4 font-bold text-gray-800">More</h4>
						<ul class="space-y-2">
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>Airline</a
								>
							</li>
							<li>
								<a href="#" class="text-sm text-gray-600 transition-colors hover:text-blue-600"
									>Low fare tips</a
								>
							</li>
						</ul>
					</div>
				</div>

				<div class="mt-12 border-t border-gray-200 pt-8 text-center">
					<p class="text-sm text-gray-600">All rights www.segispro.co</p>
				</div>
			</div>
		{/if}
	</div>
</footer>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		overflow-x: hidden;
	}

	.video-mask {
		clip-path: polygon(10% 0%, 100% 5%, 95% 100%, 0% 90%);
		box-shadow:
			0 20px 60px rgba(59, 130, 246, 0.3),
			0 0 80px rgba(147, 51, 234, 0.2);
		transition: all 0.5s ease;
	}

	.video-mask:hover {
		clip-path: polygon(5% 2%, 98% 8%, 100% 95%, 2% 98%);
		transform: scale(1.02);
	}

	.border-glow {
		background: linear-gradient(
			45deg,
			transparent,
			rgba(59, 130, 246, 0.4),
			transparent,
			rgba(147, 51, 234, 0.4),
			transparent
		);
		background-size: 300% 300%;
		animation: borderGlow 3s ease infinite;
		border-radius: inherit;
		filter: blur(2px);
	}

	@keyframes borderGlow {
		0%,
		100% {
			background-position: 0% 50%;
			opacity: 0.6;
		}
		50% {
			background-position: 100% 50%;
			opacity: 1;
		}
	}

	/* Versión móvil - mostrar video debajo del texto */
	@media (max-width: 1023px) {
		.video-mask {
			clip-path: polygon(5% 3%, 97% 0%, 100% 97%, 3% 100%);
			margin-top: 2rem;
		}
	}
</style>
