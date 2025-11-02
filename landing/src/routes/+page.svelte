<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { resolveRoute } from '$app/paths';
	import CarouselInfinito from '$lib/components/CarouselInfinito.svelte';
	import CarouselClientes from '$lib/components/CarouselClientes.svelte';
	import ServicesCarousel from '$lib/components/ServicesCarousel.svelte';
	import VideoCarouselHero from '$lib/components/VideoCarouselHero.svelte';

	let scrollY = 0;
	let mobileMenuOpen = false;
	let activeSection = 'inicio';
	let carouselVisible = false;
	let formacionDropdownOpen = false;

	// Modal de trabajo
	let cvModalOpen = false;
	let cvFile: File | null = null;
	let cvFileName = '';
	let cvUploading = false;
	let cvUploadSuccess = false;
	let cvUploadError = '';

	$: isScrolled = scrollY > 50;

	const navItems = [
		{ id: 'inicio', label: 'Inicio' },
		{ id: 'services', label: 'Servicios' },
		{ id: 'nosotros', label: 'Nosotros' },
		{ id: 'experience', label: 'Experiencia' }
	];
	let mounted = false;
	let heroVisible = false;
	let servicesVisible = false;
	let characteristicsVisible = false;

	// Estados para los contadores
	let hasAnimated = false;
	let statsSection: HTMLElement | undefined;
	let profesionales = 0;
	let cubrimiento = 0;
	let clientesNumber = 0;
	let experiencia = 0;

	// Configuración de las estadísticas
	const statsConfig = {
		profesionales: { target: 20, duration: 2000, suffix: '+' },
		cubrimiento: { target: 15, duration: 2000, suffix: '+' },
		clientes: { target: 125, duration: 2500, suffix: '+' },
		experiencia: { target: 15, duration: 2000, suffix: '+' }
	};

	// Función para animar contador
	function animateCounter(
		start: number,
		end: number,
		duration: number,
		callback: (value: number) => void
	) {
		const startTime = performance.now();
		const range = end - start;

		function update(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing personalizado para efecto más natural
			const easeProgress = 1 - Math.pow(1 - progress, 4);
			const current = Math.floor(start + range * easeProgress);

			callback(current);

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	}

	// Iniciar animación
	function startAnimation() {
		// Animar contadores con delays escalonados
		setTimeout(() => {
			animateCounter(
				0,
				statsConfig.profesionales.target,
				statsConfig.profesionales.duration,
				(val: number) => (profesionales = val)
			);
		}, 0);

		setTimeout(() => {
			animateCounter(
				0,
				statsConfig.cubrimiento.target,
				statsConfig.cubrimiento.duration,
				(val: number) => (cubrimiento = val)
			);
		}, 200);

		setTimeout(() => {
			animateCounter(
				0,
				statsConfig.clientes.target,
				statsConfig.clientes.duration,
				(val: number) => (clientesNumber = val)
			);
		}, 400);

		setTimeout(() => {
			animateCounter(
				0,
				statsConfig.experiencia.target,
				statsConfig.experiencia.duration,
				(val: number) => (experiencia = val)
			);
		}, 600);
	}

	onMount(() => {
		mounted = true;

		// Observer general para animaciones al hacer scroll
		const generalObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target.id === 'hero') heroVisible = true;
						if (entry.target.id === 'services') servicesVisible = true;
						if (entry.target.id === 'characteristics') characteristicsVisible = true;
					}
					if (entry.isIntersecting && !mapLoaded) {
						mapLoaded = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Observer ESPECÍFICO para las estadísticas con threshold más alto
		const statsObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// Solo activar cuando la sección es realmente visible (50% o más)
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;
						startAnimation();
					}
				});
			},
			{
				threshold: 0.3, // La sección debe estar al menos 30% visible (ajustado para mejor UX)
				rootMargin: '0px' // Sin margen para mejor control
			}
		);

		// Observar secciones con el observer general
		const sections = document.querySelectorAll('section[id]');
		sections.forEach((section) => {
			generalObserver.observe(section);
		});

		// Animación inicial del héroe
		setTimeout(() => {
			heroVisible = true;
		}, 100);

		setTimeout(() => {
			carouselVisible = true;
		}, 200);

		// Observar sección de estadísticas con el observer específico
		// IMPORTANTE: Usar setTimeout para asegurar que el elemento esté completamente montado
		setTimeout(() => {
			if (statsSection) {
				statsObserver.observe(statsSection);
			}
		}, 100);

		if (mapContainer) {
			generalObserver.observe(mapContainer);
		}

		// Auto-play interval
		const interval = setInterval(() => {
			if (isAutoPlaying && Date.now() - lastInteractionTime > INTERACTION_TIMEOUT) {
				goToNext();
			}
		}, AUTO_PLAY_INTERVAL);

		// Keyboard events
		window.addEventListener('keydown', handleKeydown);

		return () => {
			generalObserver.disconnect();
			statsObserver.disconnect();
			clearInterval(interval);
			if (autoPlayTimer) clearTimeout(autoPlayTimer);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	interface Characteristic {
		icon: string;
		title: string;
		description: string;
	}

	const characteristics: Characteristic[] = [
		{
			icon: '🎯',
			title: 'Excelencia Operativa',
			description:
				'Expertos éticos, con trayectoria y resultados medibles. Cada servicio se ejecuta con planes claros, seguimiento riguroso e informes conformes que impulsan decisiones efectivas.'
		},
		{
			icon: '⚡',
			title: 'Agilidad y Tecnología',
			description:
				'Simplificamos procesos, optimizamos tiempos y conectamos equipos mediante herramientas digitales, automatización y plataformas modernas.'
		},
		{
			icon: '💡',
			title: 'Innovación Continua',
			description:
				'Nos actualizamos permanentemente para dinamizar sistemas de gestión, adaptándonos a normativas, tendencias y contextos cambiantes.'
		},
		{
			icon: '🌍',
			title: 'Visión Global',
			description:
				'Acción Local: Entendemos la diversidad del mercado y actuamos con flexibilidad estratégica en empresas públicas y privadas de múltiples sectores.'
		},
		{
			icon: '🔒',
			title: 'Confidencialidad y Proyección',
			description:
				'Protegemos la información con protocolos éticos, proyectándola con claridad, impacto y propósito.'
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

	let mapLoaded = false;
	let mapContainer: HTMLElement;

	interface GalleryImage {
		src: string;
		title: string;
		description?: string;
	}

	let images: GalleryImage[] = [
		{ src: '/slides/slide-1.jpg', title: 'Imagen 1' },
		{ src: '/slides/slide-2.jpg', title: 'Imagen 2' },
		{ src: '/slides/slide-3.jpg', title: 'Imagen 3' },
		{ src: '/slides/slide-4.jpg', title: 'Imagen 4' },
		{ src: '/slides/slide-5.jpg', title: 'Imagen 5' },
		{ src: '/slides/slide-6.jpg', title: 'Imagen 6' }
	];

	let currentIndex = 0;
	let isAutoPlaying = true;
	let autoPlayTimer: ReturnType<typeof setTimeout>;
	let lastInteractionTime = Date.now();
	let containerWidth = 0;
	let isDragging = false;
	let startX = 0;
	let currentTranslate = 0;

	// Constantes para el efecto 3D
	const CARD_SPACING = 400; // Espacio entre cards
	const SCALE_FACTOR = 0.7; // Escala de cards laterales
	const BLUR_AMOUNT = 4; // Blur en px para cards laterales
	const AUTO_PLAY_INTERVAL = 2000; // 2 segundos
	const INTERACTION_TIMEOUT = 3000; // 3 segundos sin interacción

	// Obtener índice circular
	function getCircularIndex(index: number): number {
		return ((index % images.length) + images.length) % images.length;
	}

	// Calcular posición y estilo de cada card
	function getCardStyle(index: number): string {
		// Calcular posición circular relativa
		let position = index - currentIndex;

		// Normalizar para loop circular (camino más corto)
		const halfLength = Math.floor(images.length / 2);
		if (position > halfLength) {
			position -= images.length;
		} else if (position < -halfLength) {
			position += images.length;
		}

		const absPosition = Math.abs(position);

		// Solo mostrar cards cercanas (optimización)
		if (absPosition > 2) {
			return 'display: none;';
		}

		// Escala: 1 para el centro, menor para los lados
		const scale = position === 0 ? 1 : Math.max(0.4, SCALE_FACTOR - (absPosition - 1) * 0.1);

		// Blur: 0 para el centro, aumenta para los lados
		const blur = position === 0 ? 0 : Math.min(8, BLUR_AMOUNT + (absPosition - 1) * 2);

		// Opacidad
		const opacity = position === 0 ? 1 : Math.max(0.2, 0.6 - (absPosition - 1) * 0.2);

		// Posición Z (profundidad)
		const translateZ = position === 0 ? 0 : -100 * absPosition;

		// Posición X
		const translateX = position * CARD_SPACING;

		// Rotación Y para efecto 3D
		const rotateY = position * -15;

		return `
			transform: translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale});
			filter: blur(${blur}px);
			opacity: ${opacity};
			z-index: ${100 - absPosition};
			pointer-events: ${position === 0 ? 'auto' : 'none'};
			display: block;
		`;
	}

	// Navegación
	function goToNext() {
		currentIndex = getCircularIndex(currentIndex + 1);
		resetAutoPlay();
	}

	function goToPrev() {
		currentIndex = getCircularIndex(currentIndex - 1);
		resetAutoPlay();
	}

	function goToIndex(index: number) {
		currentIndex = index;
		resetAutoPlay();
	}

	// Auto-play logic
	function resetAutoPlay() {
		lastInteractionTime = Date.now();
		isAutoPlaying = false;
		clearTimeout(autoPlayTimer);

		// Reanudar auto-play después de 3 segundos sin interacción
		autoPlayTimer = setTimeout(() => {
			isAutoPlaying = true;
		}, INTERACTION_TIMEOUT);
	}

	// Drag handlers
	function handleDragStart(e: MouseEvent | TouchEvent) {
		isDragging = true;
		startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		resetAutoPlay();
	}

	function handleDragMove(e: MouseEvent | TouchEvent) {
		if (!isDragging) return;

		const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		currentTranslate = currentX - startX;
	}

	function handleDragEnd() {
		if (!isDragging) return;
		isDragging = false;

		// Cambiar slide si el drag fue suficiente
		if (Math.abs(currentTranslate) > 50) {
			if (currentTranslate > 0) {
				goToPrev();
			} else {
				goToNext();
			}
		}

		currentTranslate = 0;
	}

	// Keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') goToPrev();
		if (e.key === 'ArrowRight') goToNext();
	}

	// Funciones del modal de CV
	function openCvModal() {
		cvModalOpen = true;
		cvUploadSuccess = false;
		cvUploadError = '';
		document.body.style.overflow = 'hidden';
	}

	function closeCvModal() {
		cvModalOpen = false;
		cvFile = null;
		cvFileName = '';
		cvUploading = false;
		cvUploadSuccess = false;
		cvUploadError = '';
		document.body.style.overflow = '';
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			// Validar que sea PDF
			if (file.type !== 'application/pdf') {
				cvUploadError = 'Por favor, selecciona solo archivos PDF';
				cvFile = null;
				cvFileName = '';
				return;
			}

			// Validar tamaño (máximo 5MB)
			if (file.size > 5 * 1024 * 1024) {
				cvUploadError = 'El archivo no debe superar los 5MB';
				cvFile = null;
				cvFileName = '';
				return;
			}

			cvFile = file;
			cvFileName = file.name;
			cvUploadError = '';
		}
	}

	async function submitCV() {
		if (!cvFile) {
			cvUploadError = 'Por favor selecciona un archivo PDF';
			return;
		}

		cvUploading = true;
		cvUploadError = '';

		try {
			// Aquí se implementaría la lógica real de subida
			// Por ahora simulamos un delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Simular envío exitoso
			cvUploadSuccess = true;
			cvUploading = false;

			// Cerrar modal después de 2 segundos
			setTimeout(() => {
				closeCvModal();
			}, 2000);
		} catch (error) {
			cvUploading = false;
			cvUploadError = 'Ocurrió un error al enviar tu hoja de vida. Por favor intenta nuevamente.';
		}
	}

	// Datos estructurados JSON-LD para Google
	const schemaData = {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: 'SEGISPRO Ingeniería',
		image: 'https://www.segispro.com/assets/logo.png',
		'@id': 'https://www.segispro.com',
		url: 'https://www.segispro.com',
		telephone: '+573104853340',
		email: 'administracion@segispro.com',
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Yopal',
			addressLocality: 'Yopal',
			addressRegion: 'Casanare',
			postalCode: '850001',
			addressCountry: 'CO'
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: 5.336674979441651,
			longitude: -72.38573869384264
		},
		openingHoursSpecification: {
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			opens: '08:00',
			closes: '18:00'
		},
		foundingDate: '2009',
		description:
			'Desde 2009, somos líderes en soluciones integrales mediante Sistemas de Gestión en seguridad, salud laboral, medio ambiente y calidad para empresas públicas y privadas.',
		areaServed: {
			'@type': 'Country',
			name: 'Colombia'
		},
		priceRange: '$$',
		sameAs: [
			'https://www.facebook.com/SEGISPRO',
			'https://co.linkedin.com/company/segispro-ingenieria-sas',
			'https://www.instagram.com/segispro_auditores/'
		]
	};
</script>

<svelte:head>
	<!-- Title optimizado -->
	<title
		>SEGISPRO - Capacitaciones y Auditorías en Seguridad y Salud Laboral | Yopal, Casanare</title
	>

	<!-- Meta descripción -->
	<meta
		name="description"
		content="Desde 2009, SEGISPRO ofrece capacitaciones, auditorías y sistemas de gestión en seguridad, salud laboral, medio ambiente y calidad para empresas en Yopal, Casanare y toda Colombia."
	/>

	<!-- Meta keywords -->
	<meta
		name="keywords"
		content="capacitaciones empresariales, auditorías SST, seguridad laboral, salud ocupacional, sistemas de gestión, HSEQ, Yopal, Casanare, Colombia, SEGISPRO"
	/>

	<!-- Autor y copyright -->
	<meta name="author" content="SEGISPRO Ingeniería" />
	<meta name="copyright" content="SEGISPRO © 2025" />

	<!-- Open Graph (Facebook, LinkedIn) -->
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="SEGISPRO - Tu aliado estratégico en seguridad y salud laboral"
	/>
	<meta
		property="og:description"
		content="Capacitaciones personalizadas y auditorías especializadas para empresas. Más de 15 años de experiencia en sistemas de gestión HSEQ."
	/>
	<meta property="og:url" content="https://www.segispro.com" />
	<meta property="og:image" content="https://www.segispro.com/og-image.jpg" />
	<meta property="og:locale" content="es_CO" />
	<meta property="og:site_name" content="SEGISPRO" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="SEGISPRO - Capacitaciones y Auditorías SST" />
	<meta
		name="twitter:description"
		content="Líderes en soluciones integrales de seguridad, salud laboral y medio ambiente desde 2009."
	/>
	<meta name="twitter:image" content="https://www.segispro.com/twitter-card.jpg" />

	<!-- Canonical URL -->
	<link rel="canonical" href="https://www.segispro.com" />

	<!-- Robots -->
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>

	<!-- Viewport y responsive -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- Idioma -->
	<meta name="language" content="es-CO" />

	<!-- Tema de color para navegadores móviles -->
	<meta name="theme-color" content="#2563eb" />

	<!-- Favicon -->
	<link rel="icon" type="image/png" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type='application/ld+json'>${JSON.stringify(schemaData)}</script>`}
</svelte:head>

<svelte:window bind:scrollY />

<!-- Header/Navbar -->
<header
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
	class:bg-white={isScrolled}
	class:backdrop-blur-md={isScrolled}
	class:shadow-md={isScrolled}
>
	{#if mounted}
		<nav
			class="container mx-auto px-4 py-4 sm:px-6"
			in:fly={{ y: -20, duration: 600, easing: quintOut }}
		>
			<div class="flex items-center justify-between">
				<!-- Logo -->
				<a href="#inicio" class="group flex items-center">
					<img
						src="/assets/logo.png"
						alt="SEGISPRO Logo"
						class="h-8 w-32 transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-36"
					/>
				</a>

				<!-- Desktop Menu -->
				<div class="hidden items-center gap-8 lg:flex">
					{#each navItems as item (item.id)}
						<a
							href="#{item.id}"
							class="text-sm font-medium transition-colors duration-200"
							class:text-blue-600={activeSection === item.id}
							class:text-gray-700={activeSection !== item.id}
							class:hover:text-blue-600={activeSection !== item.id}
							on:click={() => (activeSection = item.id)}
						>
							{item.label}
						</a>
					{/each}
				</div>

				<!-- Desktop CTA Buttons -->
				<div class="hidden items-center gap-3 lg:flex">
					<!-- Dropdown de Formación -->
					<div role="group" class="relative">
						<button
							on:click={() => (formacionDropdownOpen = !formacionDropdownOpen)}
							on:mouseenter={() => (formacionDropdownOpen = true)}
							on:mouseleave={() => (formacionDropdownOpen = false)}
							class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
						>
							Formación
							<svg
								class="h-4 w-4 transition-transform duration-200"
								class:rotate-180={formacionDropdownOpen}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						<!-- Dropdown Menu con glassmorphism -->
						{#if formacionDropdownOpen}
							<div
								role="menu"
								tabindex="-1"
								on:mouseenter={() => (formacionDropdownOpen = true)}
								on:mouseleave={() => (formacionDropdownOpen = false)}
								class="absolute top-full left-0 z-50 w-48 pt-2"
							>
								<div
									class="overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-md"
									transition:fly={{ y: -10, duration: 200 }}
								>
									<div class="p-1.5">
										<a
											href="/capacitaciones"
											class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-white/60"
										>
											<span>🎓</span>
											<span>Cursos</span>
										</a>
										<a
											href={resolveRoute('/validar-certificado')}
											class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-white/60"
										>
											<span>✓</span>
											<span>Validar cursos</span>
										</a>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<a
						href="#contacto"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
					>
						Contacto
					</a>
				</div>

				<!-- Mobile Menu Button -->
				<button
					class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-gray-100 lg:hidden"
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					<svg
						class="h-6 w-6 text-gray-700 transition-transform duration-300"
						class:rotate-90={mobileMenuOpen}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						{#if mobileMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</nav>
	{/if}
</header>

<!-- Mobile Menu Drawer (fuera del header para z-index correcto) -->
{#if mounted && mobileMenuOpen}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-60 bg-black/50 lg:hidden"
		on:click={() => (mobileMenuOpen = false)}
		on:keydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		role="button"
		tabindex="-1"
		aria-label="Cerrar menú"
	></div>

	<!-- Drawer -->
	<div
		class="fixed top-0 right-0 z-70 h-full w-80 overflow-hidden bg-linear-to-b from-gray-900 to-gray-800 shadow-2xl lg:hidden"
		in:fly={{ x: 320, duration: 300, easing: quintOut }}
		out:fly={{ x: 320, duration: 250 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-gray-700 px-6 py-4">
			<span class="text-lg font-semibold text-white">Menú</span>
			<button
				on:click={() => (mobileMenuOpen = false)}
				class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-gray-700"
				aria-label="Cerrar menú"
			>
				<svg class="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<!-- Content -->
		<div class="overflow-y-auto p-6" style="height: calc(100% - 65px);">
			<!-- Navigation -->
			<nav class="space-y-1">
				{#each navItems as item, i (item.id)}
					<a
						href="#{item.id}"
						class="block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200"
						class:bg-blue-600={activeSection === item.id}
						class:text-white={activeSection === item.id}
						class:text-gray-300={activeSection !== item.id}
						class:hover:bg-gray-700={activeSection !== item.id}
						on:click={() => {
							activeSection = item.id;
							mobileMenuOpen = false;
						}}
						in:fly={{ x: 50, duration: 200, delay: i * 50 }}
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<!-- Divider -->
			<div class="my-6 border-t border-gray-700"></div>

			<!-- Action Buttons -->
			<div class="space-y-2">
				<!-- Formación con sub-items -->
				<div class="space-y-1">
					<button
						on:click={() => (formacionDropdownOpen = !formacionDropdownOpen)}
						class="flex w-full items-center justify-between rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-purple-700"
					>
						<span>📚 Formación</span>
						<svg
							class="h-4 w-4 transition-transform duration-200"
							class:rotate-180={formacionDropdownOpen}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if formacionDropdownOpen}
						<div
							class="ml-2 space-y-1 overflow-hidden rounded-lg border border-purple-500/30 bg-purple-900/30 p-1"
							transition:fly={{ y: -10, duration: 200 }}
						>
							<a
								href="/capacitaciones"
								class="block rounded-md px-3 py-2 text-sm text-purple-100 transition-colors duration-200 hover:bg-purple-700"
								on:click={() => (mobileMenuOpen = false)}
							>
								🎓 Cursos
							</a>
							<a
								href={resolveRoute('/validar-certificado')}
								class="block rounded-md px-3 py-2 text-sm text-purple-100 transition-colors duration-200 hover:bg-purple-700"
								on:click={() => (mobileMenuOpen = false)}
							>
								✓ Validar cursos
							</a>
						</div>
					{/if}
				</div>

				<a
					href="#contacto"
					class="block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
					on:click={() => (mobileMenuOpen = false)}
				>
					Contáctanos
				</a>
			</div>
		</div>
	</div>
{/if}

<!-- Hero Section Ultra-Compacto -->
<section
	id="inicio"
	class="relative overflow-hidden bg-linear-to-br from-white via-gray-50 to-blue-50 px-6 py-8 pt-18 sm:py-12 sm:pt-22 lg:py-16 lg:pt-18 xl:py-24"
>
	<div class="container mx-auto max-w-7xl">
		<div class="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
			<!-- Contenido Izquierdo -->
			<div class="relative z-10">
				{#if heroVisible}
					<div in:fly={{ y: 50, duration: 800, easing: quintOut }}>
						<p class="mb-1 text-xs font-semibold tracking-wide text-blue-600 uppercase sm:mb-2">
							Mejora y evoluciona con SEGISPRO Ingeniería. Transformamos tus retos empresariales en
							oportunidades con consultorías, auditorías y formación a la medida.
						</p>
						<h1 class="mb-2 text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl xl:text-5xl">
							<span class="text-blue-600">SEGISPRO</span><br />
							<span class="text-gray-900">tu aliado estratégico.</span>
						</h1>
					</div>

					<div in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}>
						<p class="mb-3 max-w-xl text-sm leading-relaxed text-gray-700 sm:mb-4">
							Capacitaciones personalizadas que fortalecen habilidades y cumplimiento. Muy pronto,
							cursos digitales para aprender con flexibilidad y apoyo experto.
						</p>

						<!-- CTA Buttons -->
						<div class="flex flex-wrap gap-2 sm:gap-3">
							<a
								href="#services"
								class="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl sm:px-6 sm:py-3"
							>
								Ver Servicios
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</a>
							<a
								href="#contacto"
								class="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-50 sm:px-6 sm:py-3"
							>
								Contactar
							</a>
						</div>
					</div>
				{/if}
			</div>

			<!-- Video Carousel Derecho - Estilo Netflix -->
			<div class="relative hidden lg:block">
				{#if heroVisible}
					<VideoCarouselHero visible={heroVisible} />
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Services Section Ultra-Compacto -->
<section
	id="services"
	class="bg-linear-to-b from-white via-gray-50 to-white px-6 py-8 sm:py-12 lg:py-16"
>
	<div class="container mx-auto max-w-7xl">
		<!-- Header Minimalista -->
		<div class="mb-6 text-center sm:mb-8">
			<div class="mb-2">
				<p class="mb-1 text-xs font-semibold tracking-wide text-blue-600 uppercase sm:text-sm">
					Nuestro portafolio
				</p>
				<h2 class="mb-1 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
					Servicios <span class="text-blue-600">Profesionales</span>
				</h2>
				<div
					class="mx-auto h-0.5 w-12 rounded-full bg-linear-to-r from-blue-600 to-blue-400 sm:w-16"
				></div>
			</div>

			<p class="mx-auto max-w-2xl text-xs leading-relaxed text-gray-600 sm:text-sm">
				Soluciones integrales en consultoría, formación y estudios especializados
			</p>
		</div>

		<!-- Carrusel de servicios directo -->
		<div class="mt-4 sm:mt-6">
			<!-- Contenedor con max-width para limitar el ancho -->
			<div class="mx-auto max-w-6xl">
				<ServicesCarousel visible={carouselVisible} />
			</div>
		</div>

		<!-- Stats Section Compactas -->
		<div bind:this={statsSection} class="mt-10 sm:mt-12 lg:mt-16">
			<div class="mb-6 text-center sm:mb-8">
				<h3 class="text-lg font-bold text-gray-900 sm:text-xl">Nuestra Trayectoria</h3>
				<p class="mx-auto mt-1 max-w-2xl text-xs text-gray-600">
					Datos que respaldan nuestro compromiso
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Profesionales -->
				<div class="group relative">
					<div
						class="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10"
					>
						<!-- Efecto de brillo animado -->
						<div
							class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-blue-500/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
						></div>

						<!-- Partículas decorativas -->
						{#if hasAnimated}
							<div
								class="absolute top-4 right-4 h-2 w-2 animate-ping rounded-full bg-blue-400"
								in:scale={{ duration: 600, delay: 0 }}
							></div>
						{/if}

						<div class="relative z-10 text-center">
							<!-- Número -->
							<div class="mb-3 flex items-center justify-center">
								<span
									class="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
								>
									{profesionales}{statsConfig.profesionales.suffix}
								</span>
							</div>

							<!-- Línea decorativa -->
							<div
								class="mx-auto mb-3 h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500"
							></div>

							<!-- Descripción -->
							<h4 class="text-base font-semibold text-gray-900">Profesionales</h4>
							<p class="text-sm text-gray-600">especializados</p>
						</div>
					</div>
				</div>

				<!-- Cubrimiento -->
				<div class="group relative">
					<div
						class="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10"
					>
						<div
							class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-purple-500/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
						></div>

						{#if hasAnimated}
							<div
								class="absolute top-4 right-4 h-2 w-2 animate-ping rounded-full bg-purple-400"
								in:scale={{ duration: 600, delay: 200 }}
							></div>
						{/if}

						<div class="relative z-10 text-center">
							<div class="mb-3 flex items-center justify-center">
								<span
									class="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
								>
									{cubrimiento}{statsConfig.cubrimiento.suffix}
								</span>
							</div>

							<div
								class="mx-auto mb-3 h-1 w-12 rounded-full bg-linear-to-r from-purple-500 to-pink-500"
							></div>

							<h4 class="text-base font-semibold text-gray-900">Cubrimiento</h4>
							<p class="text-sm text-gray-600">normativo</p>
						</div>
					</div>
				</div>

				<!-- Clientes -->
				<div class="group relative">
					<div
						class="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10"
					>
						<div
							class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-emerald-500/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
						></div>

						{#if hasAnimated}
							<div
								class="absolute top-4 right-4 h-2 w-2 animate-ping rounded-full bg-emerald-400"
								in:scale={{ duration: 600, delay: 400 }}
							></div>
						{/if}

						<div class="relative z-10 text-center">
							<div class="mb-3 flex items-center justify-center">
								<span
									class="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
								>
									{clientesNumber}{statsConfig.clientes.suffix}
								</span>
							</div>

							<div
								class="mx-auto mb-3 h-1 w-12 rounded-full bg-linear-to-r from-emerald-500 to-teal-500"
							></div>

							<h4 class="text-base font-semibold text-gray-900">Clientes</h4>
							<p class="text-sm text-gray-600">satisfechos</p>
						</div>
					</div>
				</div>

				<!-- Años de experiencia -->
				<div class="group relative">
					<div
						class="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-linear-to-br from-orange-500/5 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10"
					>
						<div
							class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-orange-500/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
						></div>

						{#if hasAnimated}
							<div
								class="absolute top-4 right-4 h-2 w-2 animate-ping rounded-full bg-orange-400"
								in:scale={{ duration: 600, delay: 600 }}
							></div>
						{/if}

						<div class="relative z-10 text-center">
							<div class="mb-3 flex items-center justify-center">
								<span
									class="bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
								>
									{experiencia}{statsConfig.experiencia.suffix}
								</span>
							</div>

							<div
								class="mx-auto mb-3 h-1 w-12 rounded-full bg-linear-to-r from-orange-500 to-amber-500"
							></div>

							<h4 class="text-base font-semibold text-gray-900">Años de</h4>
							<p class="text-sm text-gray-600">experiencia</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Sección CTA -->
<section class="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-12 text-white sm:py-16">
	<div class="container mx-auto max-w-6xl text-center">
		<h2 class="mb-4 text-3xl font-bold md:text-4xl">¿Listo para comenzar?</h2>
		<p class="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
			Contáctanos hoy y descubre cómo podemos ayudarte a alcanzar tus objetivos
		</p>
		<button
			class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
		>
			Solicitar Consulta
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 7l5 5m0 0l-5 5m5-5H6"
				/>
			</svg>
		</button>
	</div>
</section>

<!-- Characteristics Section -->
<section
	id="nosotros"
	class="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-blue-50 px-6 py-8 sm:py-12 lg:py-16"
>
	<!-- Elementos decorativos de fondo -->
	<div class="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
	<div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl"></div>

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
			<div in:fly={{ y: 30, duration: 800 }} class="mb-8 text-center sm:mb-10">
				<p class="mb-2 text-xs font-semibold tracking-wide text-blue-600 uppercase sm:text-sm">
					Nuestro compromiso
				</p>
				<h2 class="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
					<span class="text-blue-600">Características</span> que nos definen
				</h2>
				<div
					class="mx-auto h-0.5 w-12 rounded-full bg-linear-to-r from-blue-600 to-orange-600 sm:w-16"
				></div>
			</div>

			<!-- Card destacada principal -->
			<div in:fly={{ y: 30, duration: 800, delay: 200 }}>
				<div
					class="group relative mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl transition-all duration-500 hover:border-blue-200 hover:shadow-2xl sm:mb-10 sm:p-8"
				>
					<!-- Gradiente de fondo animado -->
					<div
						class="absolute inset-0 bg-linear-to-br from-blue-50 via-transparent to-orange-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Número decorativo grande -->
					<div
						class="absolute -top-6 -left-6 text-[150px] leading-none font-bold text-blue-500/5 select-none"
					>
						01
					</div>

					<div class="relative z-10">
						<!-- Badge con número -->
						<div
							class="mb-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600 px-4 py-1.5 text-white shadow-lg"
						>
							<span class="text-xs font-bold">01</span>
							<div class="h-3 w-px bg-white/30"></div>
							<span class="text-xs font-semibold">Principal</span>
						</div>

						<h3
							class="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 sm:text-2xl lg:text-3xl"
						>
							Ayudamos a las entidades al mejoramiento continuo
						</h3>

						<p class="max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
							Acompañamos a las organizaciones en su búsqueda de mejora continua, optimizando sus
							procesos con agilidad, con la confianza se garantiza la protección de su información y
							avanzan con innovación y sostenibilidad para lograr objetivos.
						</p>

						<!-- Iconos decorativos -->
						<div class="mt-6 flex flex-wrap items-center gap-3">
							<div class="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
								<div class="h-2 w-2 rounded-full bg-blue-500"></div>
								<span>Innovación</span>
							</div>
							<div class="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
								<div class="h-2 w-2 rounded-full bg-orange-500"></div>
								<span>Sostenibilidad</span>
							</div>
							<div class="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
								<div class="h-2 w-2 rounded-full bg-green-500"></div>
								<span>Agilidad</span>
							</div>
							<div class="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
								<div class="h-2 w-2 rounded-full bg-purple-500"></div>
								<span>Confidencialidad</span>
							</div>
						</div>
					</div>

					<!-- Esquina decorativa -->
					<div
						class="absolute top-0 right-0 h-32 w-32 rounded-bl-[80px] bg-linear-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>
				</div>
			</div>

			<!-- Título del carrusel -->
			<div in:fly={{ y: 30, duration: 800, delay: 300 }} class="mb-6">
				<h3 class="text-center text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
					Más características destacadas
				</h3>
				<p class="mt-1 text-center text-xs text-gray-600 sm:text-sm">
					Descubre todo lo que nos hace diferentes
				</p>
			</div>

			<!-- Carrusel Infinito de Características con contenedor limitado -->
			<div in:fly={{ y: 30, duration: 800, delay: 400 }}>
				<CarouselInfinito visible={characteristicsVisible || mounted} {characteristics} />
			</div>
		{/if}
	</div>
</section>

{#if mounted}
	<!-- Gallery Section (sin stats) -->
	<section
		id="experience"
		class="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black px-6 py-12 sm:py-16 lg:py-20"
	>
		<!-- Fondo animado -->
		<div class="absolute inset-0 opacity-20">
			<div
				class="absolute inset-0"
				style="background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0); background-size: 50px 50px;"
			></div>
		</div>

		<!-- Glow effect -->
		<div
			class="absolute inset-0 opacity-30 blur-3xl transition-all duration-1000"
			style="background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.4), transparent 70%);"
		></div>

		<div class="relative z-10 container mx-auto max-w-7xl">
			<!-- Header -->
			<div in:fly={{ y: 30, duration: 800 }} class="mb-8 text-center sm:mb-10">
				<p class="mb-2 text-xs font-semibold tracking-wide text-blue-400 uppercase sm:text-sm">
					Nuestra experiencia
				</p>
				<h2 class="mb-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
					Proyectos que <span class="text-blue-400">transforman</span>
				</h2>
				<div
					class="mx-auto h-0.5 w-12 rounded-full bg-linear-to-r from-blue-600 to-orange-600 sm:w-16"
				></div>
			</div>

			<!-- 3D Carousel Container -->
			<div
				class="relative h-[500px] md:h-[600px]"
				style="perspective: 2000px;"
				bind:clientWidth={containerWidth}
			>
				<!-- Cards -->
				{#key currentIndex}
					<div
						class="carousel-track absolute inset-0 flex items-center justify-center"
						style="transform-style: preserve-3d;"
						role="region"
						aria-label="Galería de imágenes"
					>
						{#each images as image, i (image.title)}
							{@const position = (() => {
								let pos = i - currentIndex;
								const halfLength = Math.floor(images.length / 2);
								if (pos > halfLength) pos -= images.length;
								else if (pos < -halfLength) pos += images.length;
								return pos;
							})()}
							{@const isVisible = Math.abs(position) <= 2}

							{#if isVisible}
								<div
									class="gallery-card absolute h-[400px] w-[300px] cursor-pointer overflow-hidden rounded-3xl md:h-[500px] md:w-[500px]"
									style={getCardStyle(i)}
									on:click={() => (i === currentIndex ? null : goToIndex(i))}
									on:keydown={(e) => e.key === 'Enter' && i !== currentIndex && goToIndex(i)}
									on:mousedown={handleDragStart}
									on:mousemove={handleDragMove}
									on:mouseup={handleDragEnd}
									on:mouseleave={handleDragEnd}
									on:touchstart={handleDragStart}
									on:touchmove={handleDragMove}
									on:touchend={handleDragEnd}
									role="button"
									tabindex={i === currentIndex ? 0 : -1}
								>
									<!-- Imagen -->
									<img
										src={image.src}
										alt={image.title}
										class="h-full w-full object-cover"
										loading="lazy"
									/>

									<!-- Overlay gradient -->
									<div
										class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
									></div>

									<!-- Info (solo visible en card activa) -->
									{#if i === currentIndex}
										<div
											class="absolute right-0 bottom-0 left-0 p-8 text-white"
											in:fly={{ y: 20, duration: 600, delay: 300 }}
										>
											{#if image.description}
												<p class="text-lg text-gray-300">
													{image.description}
												</p>
											{/if}
										</div>
									{/if}

									<!-- Border glow en card activa -->
									{#if i === currentIndex}
										<div
											class="pointer-events-none absolute inset-0 animate-pulse rounded-3xl border-4 border-blue-500/50"
										></div>
									{/if}
								</div>
							{/if}
						{/each}
					</div>
				{/key}

				<!-- Navigation Arrows -->
				<button
					on:click={goToPrev}
					class="absolute top-1/2 left-4 z-50 flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 md:left-8"
					aria-label="Imagen anterior"
				>
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<button
					on:click={goToNext}
					class="absolute top-1/2 right-4 z-50 flex h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 md:right-8"
					aria-label="Siguiente imagen"
				>
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="3"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			<!-- Indicators -->
			<div class="mt-8 flex items-center justify-center gap-3">
				{#each images as image, i (image.title + i)}
					<button
						on:click={() => goToIndex(i)}
						class="rounded-full transition-all duration-300 {i === currentIndex
							? 'h-3 w-12 bg-blue-500'
							: 'h-3 w-3 bg-white/30 hover:bg-white/50'}"
						aria-label={`Ir a imagen ${i + 1}`}
					></button>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Clients Section -->
<section class="bg-gray-50 px-6 py-12 sm:py-16">
	<div class="container mx-auto max-w-6xl">
		<CarouselClientes visible={mounted} {clientes} speed={35} />
	</div>
</section>

<!-- Trabaja con Nosotros Section -->
{#if mounted}
	<section
		class="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 px-6 py-12 sm:py-16 lg:py-20"
		in:fly={{ y: 50, duration: 800, delay: 200 }}
	>
		<!-- Elementos decorativos -->
		<div class="absolute top-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
		<div class="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"></div>

		<!-- Patrón de fondo -->
		<div class="absolute inset-0 opacity-[0.03]">
			<div
				class="absolute inset-0"
				style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"
			></div>
		</div>

		<div class="relative z-10 container mx-auto max-w-5xl">
			<div class="text-center">
				<!-- Icono -->
				<div class="mb-4 flex justify-center">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
					>
						<span class="text-4xl">👥</span>
					</div>
				</div>

				<!-- Título -->
				<h2 class="mb-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
					Trabaja con Nosotros
				</h2>

				<!-- Descripción -->
				<p class="mx-auto mb-6 max-w-2xl text-sm text-blue-100 sm:text-base lg:text-lg">
					¿Eres un profesional apasionado por la seguridad, la calidad y el mejoramiento continuo?
					Únete a nuestro equipo de expertos y haz parte de una empresa líder en consultoría,
					auditoría y formación.
				</p>

				<!-- Beneficios -->
				<div class="mb-8 grid gap-4 sm:gap-6 md:grid-cols-3">
					<div
						class="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 sm:p-6"
					>
						<div class="mb-2 text-2xl sm:text-3xl">🎯</div>
						<h3 class="mb-2 text-sm font-semibold text-white sm:text-base lg:text-lg">
							Proyectos Desafiantes
						</h3>
						<p class="text-xs text-blue-100 sm:text-sm">
							Trabaja en proyectos innovadores con clientes de diversos sectores
						</p>
					</div>

					<div
						class="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 sm:p-6"
					>
						<div class="mb-2 text-2xl sm:text-3xl">📚</div>
						<h3 class="mb-2 text-sm font-semibold text-white sm:text-base lg:text-lg">
							Desarrollo Profesional
						</h3>
						<p class="text-xs text-blue-100 sm:text-sm">
							Capacitaciones constantes y oportunidades de crecimiento
						</p>
					</div>

					<div
						class="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 sm:p-6"
					>
						<div class="mb-2 text-2xl sm:text-3xl">🤝</div>
						<h3 class="mb-2 text-sm font-semibold text-white sm:text-base lg:text-lg">
							Ambiente Colaborativo
						</h3>
						<p class="text-xs text-blue-100 sm:text-sm">
							Equipo multidisciplinario comprometido con la excelencia
						</p>
					</div>
				</div>

				<!-- CTA Button -->
				<button
					on:click={openCvModal}
					class="group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-3 text-base font-bold text-blue-700 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:text-lg"
				>
					<span class="relative z-10">Enviar mi Hoja de Vida</span>
					<svg
						class="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>

					<!-- Efecto hover -->
					<div
						class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-blue-500/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
					></div>
				</button>

				<!-- Nota -->
				<p class="mt-4 text-xs text-blue-200 sm:text-sm">
					Solo aceptamos archivos PDF · Tamaño máximo: 5MB
				</p>
			</div>
		</div>
	</section>
{/if}

<!-- Contact Section -->
<section
	id="contacto"
	class="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-blue-50 px-6 py-12 sm:py-16 lg:py-20"
>
	<!-- Elementos decorativos de fondo -->
	<div class="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
	<div class="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl"></div>

	<!-- Patrón de fondo sutil -->
	<div class="absolute inset-0 opacity-[0.02]">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0); background-size: 40px 40px;"
		></div>
	</div>

	<div class="relative z-10 container mx-auto max-w-6xl">
		{#if mounted}
			<!-- Encabezado -->
			<div in:fly={{ y: 30, duration: 800 }} class="mb-8 text-center sm:mb-10">
				<p class="mb-2 text-xs font-semibold tracking-wide text-blue-600 uppercase sm:text-sm">
					Hablemos
				</p>
				<h2 class="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
					¿Listo para <span class="text-blue-600">transformar</span> tu empresa?
				</h2>
				<p class="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
					Estamos aquí para asesorarte. Elige la forma que prefieras para ponerte en contacto con
					nosotros.
				</p>
				<div
					class="mx-auto mt-4 h-0.5 w-12 rounded-full bg-linear-to-r from-blue-600 to-orange-600 sm:w-16"
				></div>
			</div>

			<!-- Grid de métodos de contacto -->
			<div class="mb-8 grid gap-6 sm:mb-10 sm:gap-8 md:grid-cols-3">
				<!-- WhatsApp Card -->
				<div
					in:fly={{ y: 30, duration: 800, delay: 200 }}
					class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl sm:p-8"
				>
					<!-- Gradiente animado -->
					<div
						class="absolute inset-0 bg-linear-to-br from-green-50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Icono -->
					<div class="relative z-10 mb-4 sm:mb-6">
						<div
							class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-green-500 to-green-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:h-16 sm:w-16"
						>
							<svg class="h-6 w-6 text-white sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
								/>
							</svg>
						</div>
					</div>

					<div class="relative z-10 text-center">
						<h3
							class="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-600 sm:mb-3 sm:text-2xl"
						>
							WhatsApp
						</h3>
						<p class="mb-4 text-xs leading-relaxed text-gray-600 sm:mb-6 sm:text-sm">
							Chatea con nosotros en tiempo real y obtén respuestas inmediatas
						</p>

						<!-- Botones de WhatsApp -->
						<div class="mb-4 flex flex-col gap-3">
							<a
								href="https://wa.me/573104853340?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex transform items-center justify-center gap-2 rounded-full bg-linear-to-r from-green-600 to-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-600 hover:shadow-xl active:scale-95"
							>
								<span>+57 310 485 3340</span>
								<svg
									class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
							</a>

							<a
								href="https://wa.me/573112076203?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex transform items-center justify-center gap-2 rounded-full bg-linear-to-r from-green-600 to-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-600 hover:shadow-xl active:scale-95"
							>
								<span>+57 311 207 6203</span>
								<svg
									class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
							</a>
						</div>
					</div>

					<!-- Esquina decorativa -->
					<div
						class="absolute top-0 right-0 h-24 w-24 rounded-bl-[80px] bg-linear-to-bl from-green-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-32 sm:w-32"
					></div>
				</div>

				<!-- Email Card -->
				<div
					in:fly={{ y: 30, duration: 800, delay: 300 }}
					class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl sm:p-8"
				>
					<!-- Gradiente animado -->
					<div
						class="absolute inset-0 bg-linear-to-br from-blue-50 via-transparent to-orange-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Icono -->
					<div class="relative z-10 mb-4 sm:mb-6">
						<div
							class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:h-16 sm:w-16"
						>
							<svg
								class="h-6 w-6 text-white sm:h-8 sm:w-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>

					<div class="relative z-10 text-center">
						<h3
							class="mb-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 sm:mb-3 sm:text-2xl"
						>
							Email
						</h3>
						<p class="mb-4 text-xs leading-relaxed text-gray-600 sm:mb-6 sm:text-sm">
							Envíanos un correo detallado y te responderemos a la brevedad
						</p>

						<a
							href="mailto:administracion@segispro.com?subject=Consulta%20sobre%20servicios&body=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre..."
							class="inline-flex transform items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl active:scale-95 sm:text-base"
						>
							<span>Enviar email</span>
							<svg
								class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
						</a>
						<p class="mt-3 text-xs text-gray-500 sm:mt-4">administracion@segispro.com</p>
					</div>

					<!-- Esquina decorativa -->
					<div
						class="absolute top-0 right-0 h-24 w-24 rounded-bl-[80px] bg-linear-to-bl from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:h-32 sm:w-32"
					></div>
				</div>

				<!-- Teléfono Card -->
				<div
					in:fly={{ y: 30, duration: 800, delay: 400 }}
					class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl sm:p-8"
				>
					<!-- Gradiente animado -->
					<div
						class="absolute inset-0 bg-linear-to-br from-orange-50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Icono -->
					<div class="relative z-10 mb-6">
						<div
							class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
						>
							<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
					</div>

					<div class="relative z-10 text-center">
						<h3
							class="mb-3 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600"
						>
							Teléfono
						</h3>
						<p class="mb-6 text-sm leading-relaxed text-gray-600">
							Llámanos directamente y habla con nuestro equipo
						</p>

						<!-- Botones de llamada -->
						<div class="mb-4 flex flex-col gap-3">
							<a
								href="tel:+573104853340"
								class="inline-flex transform items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-600 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-orange-600 hover:shadow-xl active:scale-95"
							>
								<span>+57 310 485 3340</span>
								<svg
									class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
							</a>
							<a
								href="tel:+573112076203"
								class="inline-flex transform items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-600 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-orange-600 hover:shadow-xl active:scale-95"
							>
								<span>+57 311 207 6203</span>
								<svg
									class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
							</a>
						</div>
					</div>

					<!-- Esquina decorativa -->
					<div
						class="absolute top-0 right-0 h-32 w-32 rounded-bl-[100px] bg-linear-to-bl from-orange-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>
				</div>
			</div>

			<!-- Mapa con lazy loading -->
			<div
				in:fly={{ y: 30, duration: 800, delay: 500 }}
				bind:this={mapContainer}
				class="relative mb-16 overflow-hidden rounded-3xl border border-gray-200 shadow-2xl"
			>
				<!-- Preview estático (se muestra mientras carga el mapa) -->
				{#if !mapLoaded}
					<div
						class="relative flex h-96 w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200"
					>
						<div class="text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg"
							>
								<svg
									class="h-8 w-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<p class="mb-2 font-medium text-gray-600">Yopal, Casanare, Colombia</p>
							<p class="text-sm text-gray-500">Cargando mapa...</p>
						</div>
					</div>
				{/if}

				<!-- Mapa de Google (se carga con lazy loading) -->
				{#if mapLoaded}
					<div in:fade={{ duration: 600 }} class="relative">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d496.56547935508956!2d-72.3859526!3d5.336689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6b0db85693c5c9%3A0xeb12db3e6737fdbd!2sSEGISPRO%20INGENIERIA%20SAS!5e0!3m2!1ses-419!2sco!4v1761797696930!5m2!1ses-419!2sco"
							width="100%"
							height="450"
							style="border:0;"
							allowfullscreen
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
							title="Ubicación de SEGISPRO en Yopal, Casanare"
							class="w-full"
						></iframe>

						<!-- Botón flotante de "Cómo llegar" -->
						<a
							href="https://maps.app.goo.gl/vfxgQyrYaEJQdGP1A"
							target="_blank"
							rel="noopener noreferrer"
							class="absolute right-6 bottom-6 inline-flex transform items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-2xl active:scale-95"
						>
							<svg
								class="h-5 w-5 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
								/>
							</svg>
							<span>Cómo llegar</span>
						</a>
					</div>
				{/if}
			</div>

			<!-- CTA Bottom -->
			<div in:fly={{ y: 30, duration: 800, delay: 600 }} class="text-center">
				<div
					class="inline-flex items-center gap-8 rounded-full border border-gray-100 bg-white px-8 py-5 shadow-xl"
				>
					<div class="flex items-center gap-3">
						<div class="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
						<span class="text-sm font-medium text-gray-700">
							Respondemos en menos de 24 horas
						</span>
					</div>
					<div class="h-6 w-px bg-gray-200"></div>
					<div class="flex items-center gap-3">
						<svg
							class="h-5 w-5 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span class="text-sm font-medium text-gray-700">
							Lun - Vie: 8:00 AM - 6:00 PM<br />Sáb: 8:00 AM - 12:00 PM
						</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Footer -->
<footer
	class="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-16 text-white"
>
	<!-- Elementos decorativos de fondo -->
	<div class="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
	<div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl"></div>

	<!-- Patrón de fondo sutil -->
	<div class="absolute inset-0 opacity-[0.02]">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"
		></div>
	</div>

	<div class="relative z-10 container mx-auto max-w-6xl">
		{#if mounted}
			<div in:fade={{ duration: 600, delay: 200 }}>
				<!-- Sección principal del footer -->
				<div class="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
					<!-- Segispro Column -->
					<div>
						<div class="mb-6">
							<img src="/assets/logo-white.png" alt="SEGISPRO Logo" class="mb-4 h-8 w-32" />
						</div>
						<p class="mb-6 text-sm leading-relaxed text-gray-400">
							Tu aliado estratégico en capacitaciones y auditorías para un trabajo más seguro.
						</p>
						<!-- Redes sociales -->
						<div class="flex items-center gap-3">
							<a
								href="https://www.facebook.com/SEGISPRO"
								class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-blue-600"
								aria-label="Facebook de SEGISPRO"
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
									/>
								</svg>
							</a>
							<a
								href="https://x.com/segispro_ing"
								class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-blue-400"
								aria-label="X (Twitter) de SEGISPRO"
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
									/>
								</svg>
							</a>
							<a
								href="https://www.linkedin.com/company/segispro-ingenieria-sas/"
								class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-blue-700"
								aria-label="LinkedIn de SEGISPRO"
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
									/>
								</svg>
							</a>
							<a
								href="https://www.instagram.com/segispro_auditores/"
								class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-pink-600"
								aria-label="Instagram de SEGISPRO"
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"
									/>
								</svg>
							</a>
						</div>
					</div>

					<!-- Company Column -->
					<div>
						<h4 class="mb-6 text-lg font-bold text-white">Empresa</h4>
						<ul class="space-y-3">
							<li>
								<a
									href="#inicio"
									class="group flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
								>
									<span
										class="mr-0 h-px w-0 bg-blue-400 transition-all duration-300 group-hover:mr-2 group-hover:w-2"
									></span>
									Inicio
								</a>
							</li>
							<li>
								<a
									href="#services"
									class="group flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
								>
									<span
										class="mr-0 h-px w-0 bg-blue-400 transition-all duration-300 group-hover:mr-2 group-hover:w-2"
									></span>
									Servicios
								</a>
							</li>
							<li>
								<a
									href="#nosotros"
									class="group flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
								>
									<span
										class="mr-0 h-px w-0 bg-blue-400 transition-all duration-300 group-hover:mr-2 group-hover:w-2"
									></span>
									Nosotros
								</a>
							</li>
							<li>
								<a
									href="#experience"
									class="group flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
								>
									<span
										class="mr-0 h-px w-0 bg-blue-400 transition-all duration-300 group-hover:mr-2 group-hover:w-2"
									></span>
									Experiencia
								</a>
							</li>
						</ul>
					</div>

					<!-- Contact Column -->
					<div>
						<h4 class="mb-6 text-lg font-bold text-white">Contacto</h4>
						<ul class="space-y-3">
							<li>
								<a
									href="mailto:administracion@segispro.com"
									class="group flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
								>
									<svg
										class="mr-2 h-4 w-4 shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									administracion@segispro.com
								</a>
							</li>
							<li>
								<a
									href="tel:+573104853340"
									class="group flex items-center text-sm text-gray-400 transition-colors hover:text-blue-400"
								>
									<svg
										class="mr-2 h-4 w-4 shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
									+57 310 485 3340
								</a>
							</li>
							<li>
								<button
									type="button"
									class="group flex items-start text-sm text-gray-400 transition-colors hover:text-blue-400"
								>
									<svg
										class="mt-0.5 mr-2 h-4 w-4 shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Calle 27 # 27-75<br />Yopal, Casanare, Colombia
								</button>
							</li>
						</ul>
					</div>

					<!-- Newsletter Column -->
					<div>
						<h4 class="mb-6 text-lg font-bold text-white">Boletín</h4>
						<p class="mb-4 text-sm text-gray-400">
							Suscríbete para recibir novedades y actualizaciones.
						</p>
						<form class="space-y-3">
							<input
								type="email"
								placeholder="Tu email"
								class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
							/>
							<button
								type="submit"
								class="w-full transform rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-600 active:scale-95"
							>
								Suscribirse
							</button>
						</form>
					</div>
				</div>

				<!-- CTA: Agenda tu cita -->
				<div class="my-8 border-t border-white/10 py-8">
					<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
						<!-- Texto -->
						<div class="text-center md:text-left">
							<p class="mb-1 text-xl font-semibold text-blue-400">Agenda tu cita</p>
							<p class="text-lg text-gray-300">
								Únete a nosotros para explorar nuevas oportunidades<br class="hidden md:inline" />
								y alcanzar juntos grandes logros
							</p>
						</div>

						<!-- Botón -->
						<a
							href="https://wa.me/573104853340?text=Hola,%20me%20gustaría%20agendar%20una%20cita"
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex transform items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
								/>
							</svg>
							<span>Agendar cita</span>
							<svg
								class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
						</a>
					</div>
				</div>

				<!-- Sección inferior -->
				<div class="border-t border-white/10 pt-8">
					<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
						<p class="text-sm text-gray-400">
							© {new Date().getFullYear()}
							<a
								href="https://www.segispro.co"
								class="text-blue-400 transition-colors hover:text-blue-300">SEGISPRO</a
							>. Todos los derechos reservados.
						</p>
						<div class="flex items-center gap-6">
							<a
								href={resolveRoute('/politicas-de-privacidad')}
								class="text-sm text-gray-400 transition-colors hover:text-blue-400"
							>
								Política de Privacidad
							</a>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</footer>

<!-- Modal de Hoja de Vida - Glassmorphism Style -->
{#if cvModalOpen}
	<div
		class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-2xl"
		on:click={closeCvModal}
		on:keydown={(e) => e.key === 'Escape' && closeCvModal()}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 300 }}
	>
		<div
			class="modal-glass-container relative w-full max-w-md rounded-3xl border border-black/70 bg-white p-8 shadow-2xl backdrop-blur-xl"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<!-- Header Minimalista -->
			<div class="mb-8 flex items-center justify-between">
				<h3 id="modal-title" class="text-2xl font-bold text-black">Adjunta tu Hoja de Vida</h3>
				<button
					on:click={closeCvModal}
					class="rounded-full bg-white/10 p-2 text-black transition-all hover:rotate-90 hover:bg-white/20"
					aria-label="Cerrar modal"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			{#if !cvUploadSuccess}
				<!-- Zona de Upload -->
				<div class="mb-6">
					<label
						for="cv-upload"
						class={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition-all ${
							cvFile
								? 'border-blue-400 bg-blue-500/10'
								: 'border-black/30 bg-white/5 hover:border-black/50 hover:bg-white/10'
						}`}
					>
						<input
							id="cv-upload"
							type="file"
							accept=".pdf"
							on:change={handleFileSelect}
							class="hidden"
						/>

						{#if cvFile}
							<!-- Archivo Seleccionado -->
							<svg
								class="mb-4 h-16 w-16 text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<p class="text-lg font-semibold text-black" title={cvFileName}>
								{cvFileName.length > 30 ? `${cvFileName.substring(0, 30)}...` : cvFileName}
							</p>
							<p class="mt-2 text-sm text-black/70">Archivo listo para enviar</p>
						{:else}
							<!-- Estado Vacío -->
							<svg
								class="mb-4 h-16 w-16 text-black/50"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<p class="text-lg font-semibold text-black">Arrastra tu archivo aquí</p>
							<p class="mt-2 text-sm text-black/70">o haz clic para seleccionar</p>
							<p class="mt-4 text-xs text-black/50">Solo archivos PDF - Máx. 5MB</p>
						{/if}
					</label>

					{#if cvUploadError}
						<p class="mt-3 text-center text-sm text-red-400">{cvUploadError}</p>
					{/if}
				</div>

				<!-- Botón de Envío -->
				<button
					on:click={submitCV}
					disabled={!cvFile || cvUploading}
					class="w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if cvUploading}
						<span class="flex items-center justify-center gap-2">
							<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Enviando...
						</span>
					{:else}
						Enviar
					{/if}
				</button>
			{:else}
				<!-- Estado de Éxito -->
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<div class="mb-6 rounded-full bg-green-500/20 p-4">
						<svg
							class="h-16 w-16 text-green-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h4 class="mb-2 text-2xl font-bold text-white">¡CV Recibido!</h4>
					<p class="mb-6 text-white/70">Nos pondremos en contacto contigo pronto.</p>
					<button
						on:click={closeCvModal}
						class="rounded-xl bg-white/10 px-8 py-3 font-semibold text-white transition-all hover:bg-white/20"
					>
						Cerrar
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* ===== GLOBAL STYLES ===== */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* ===== MODAL GLASSMORPHISM ANIMATIONS ===== */
	.modal-glass-container {
		animation: modalGlassDance 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	@keyframes modalGlassDance {
		0% {
			opacity: 0;
			transform: perspective(1000px) rotateX(-15deg) rotateY(10deg) scale(0.8) translateZ(-50px);
		}
		25% {
			transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.05) translateZ(20px);
		}
		50% {
			transform: perspective(1000px) rotateX(-3deg) rotateY(3deg) scale(0.98) translateZ(0px);
		}
		75% {
			transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02) translateZ(10px);
		}
		100% {
			opacity: 1;
			transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px);
		}
	}

	/* GPU acceleration hints */
	.video-mask,
	.gallery-card {
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			0 0 80px rgba(59, 130, 246, 0.2);
		will-change: transform, filter, opacity;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		/* ESTA ES LA LÍNEA CLAVE */
		transition:
			transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			filter 0.7s ease-out,
			opacity 0.7s ease-out,
			box-shadow 0.3s ease;
	}

	/* Smooth font rendering */
	:global(body) {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* ===== VIDEO MASK (Hero Section) ===== */
	.video-mask {
		clip-path: polygon(10% 0%, 100% 5%, 95% 100%, 0% 90%);
		box-shadow:
			0 20px 60px rgba(59, 130, 246, 0.3),
			0 0 80px rgba(147, 51, 234, 0.2);
		transition: all 0.5s ease;
		will-change: transform, clip-path;
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

	/* ===== CAROUSEL 3D (Gallery Section) ===== */
	.carousel-track {
		cursor: grab;
		transition: transform 0.1s ease-out;
	}

	.carousel-track:active {
		cursor: grabbing;
	}

	.gallery-card:hover {
		box-shadow:
			0 35px 60px -12px rgba(0, 0, 0, 0.6),
			0 0 100px rgba(59, 130, 246, 0.4);
	}

	/* ===== RESPONSIVE ===== */
	@media (max-width: 1023px) {
		.video-mask {
			clip-path: polygon(5% 3%, 97% 0%, 100% 97%, 3% 100%);
			margin-top: 2rem;
		}

		.gallery-card {
			/* Reduce sombras en móvil para mejor performance */
			box-shadow:
				0 15px 30px -8px rgba(0, 0, 0, 0.5),
				0 0 50px rgba(59, 130, 246, 0.2);
		}
	}

	/* ===== PERFORMANCE OPTIMIZATIONS ===== */
	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}

		.video-mask,
		.gallery-card,
		.border-glow,
		.carousel-track {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
