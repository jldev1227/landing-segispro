<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	interface ServiceItem {
		title: string;
		items: string[];
		icon: string;
	}

	interface ServiceGroup {
		header: string;
		headerColor: string;
		sections: ServiceItem[];
		emoji: string;
		accentColor: string;
	}

	export let visible = false;

	// Datos de servicios - Tonalidades del mismo azul
	const serviceGroups: ServiceGroup[] = [
		{
			header: 'Consultoría & Asesoría',
			headerColor: 'from-blue-700 to-blue-800',
			emoji: '🎯',
			accentColor: 'blue',
			sections: [
				{
					title: 'NORMAS ISO',
					icon: '📋',
					items: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 39001']
				},
				{
					title: 'CERTIFICACIONES',
					icon: '✓',
					items: ['RUC', 'RUC Transporte', 'BASC']
				},
				{
					title: 'MARCO LEGAL',
					icon: '⚖️',
					items: ['SG-SST 1072', 'PESV 40595', 'SARLAFT 2328']
				}
			]
		},
		{
			header: 'Formación & Capacitación',
			headerColor: 'from-blue-600 to-blue-700',
			emoji: '🎓',
			accentColor: 'blue',
			sections: [
				{
					title: 'CURSOS',
					icon: '📚',
					items: ['Manejo Defensivo', 'Mercancías Peligrosas', 'Comando de Incidentes']
				},
				{
					title: 'CAMPAÑAS',
					icon: '📢',
					items: ['Seguridad Vial', 'Vida Saludable', 'Riesgos Ambientales']
				},
				{
					title: 'PRÁCTICA',
					icon: '🚨',
					items: ['Simulacros', 'Primeros Auxilios', 'Capacitaciones SST']
				}
			]
		},
		{
			header: 'Estudios & Análisis',
			headerColor: 'from-blue-500 to-blue-600',
			emoji: '🔬',
			accentColor: 'blue',
			sections: [
				{
					title: 'AMBIENTE',
					icon: '🌿',
					items: ['Luxometrías', 'Sonometrías']
				},
				{
					title: 'SALUD',
					icon: '💚',
					items: ['Riesgo Psicosocial', 'Tamizajes', 'Ergonomía']
				}
			]
		},
		{
			header: 'Innovación & Tecnología',
			headerColor: 'from-blue-400 to-blue-500',
			emoji: '🚀',
			accentColor: 'blue',
			sections: [
				{
					title: 'DIGITAL',
					icon: '💻',
					items: ['Plataformas E-Learning', 'Soluciones Web']
				},
				{
					title: 'A MEDIDA',
					icon: '⭐',
					items: ['Consultoría Personalizada', 'Proyectos Especiales']
				}
			]
		}
	];

	let carouselTrack: HTMLElement;
	let isDragging = false;
	let startX = 0;
	let currentTranslate = 0;
	let prevTranslate = 0;
	let animationID: number;
	let currentIndex = 0;
	let lastInteractionTime = Date.now();
	let isAutoScrolling = true;
	let autoScrollInterval: ReturnType<typeof setInterval>;

	const INTERACTION_TIMEOUT = 5000;
	const AUTO_SCROLL_INTERVAL = 4000;

	// Obtener ancho dinámico de la card
	function getCardWidth(): number {
		if (typeof window === 'undefined') return 800;
		if (window.innerWidth < 768) return window.innerWidth - 32;
		if (window.innerWidth < 1024) return window.innerWidth * 0.9;
		return Math.min(1000, window.innerWidth * 0.85);
	}

	let cardWidth = 800;

	// Crear array extendido para scroll infinito
	$: extendedGroups = [...serviceGroups, ...serviceGroups, ...serviceGroups];

	function getPositionX(event: MouseEvent | TouchEvent): number {
		return 'touches' in event ? event.touches[0].clientX : event.clientX;
	}

	function animation() {
		setSliderPosition();
		if (isDragging) requestAnimationFrame(animation);
	}

	function setSliderPosition() {
		if (!carouselTrack) return;
		carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
	}

	function handleDragStart(event: MouseEvent | TouchEvent) {
		isDragging = true;
		isAutoScrolling = false;
		lastInteractionTime = Date.now();

		startX = getPositionX(event);
		animationID = requestAnimationFrame(animation);

		if (carouselTrack) {
			carouselTrack.style.cursor = 'grabbing';
		}
	}

	function handleDragMove(event: MouseEvent | TouchEvent) {
		if (!isDragging) return;

		const currentPosition = getPositionX(event);
		currentTranslate = prevTranslate + currentPosition - startX;
	}

	function handleDragEnd() {
		if (!isDragging) return;

		isDragging = false;
		cancelAnimationFrame(animationID);

		const movedBy = currentTranslate - prevTranslate;

		if (movedBy < -100) {
			goToNext();
		} else if (movedBy > 100) {
			goToPrev();
		} else {
			currentTranslate = prevTranslate;
			setSliderPosition();
		}

		if (carouselTrack) {
			carouselTrack.style.cursor = 'grab';
		}

		setTimeout(() => {
			if (Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				isAutoScrolling = true;
			}
		}, INTERACTION_TIMEOUT);
	}

	function goToNext() {
		currentIndex++;

		if (currentIndex >= extendedGroups.length - serviceGroups.length) {
			currentIndex = serviceGroups.length;
			currentTranslate = -currentIndex * cardWidth;
			prevTranslate = currentTranslate;
			setSliderPosition();

			setTimeout(() => {
				currentIndex++;
				updatePosition();
			}, 50);
		} else {
			updatePosition();
		}

		resetAutoScroll();
	}

	function goToPrev() {
		currentIndex--;

		if (currentIndex < 0) {
			currentIndex = extendedGroups.length - serviceGroups.length - 1;
			currentTranslate = -currentIndex * cardWidth;
			prevTranslate = currentTranslate;
			setSliderPosition();

			setTimeout(() => {
				currentIndex--;
				updatePosition();
			}, 50);
		} else {
			updatePosition();
		}

		resetAutoScroll();
	}

	function goToIndex(index: number) {
		currentIndex = index;
		updatePosition();
		resetAutoScroll();
	}

	function updatePosition() {
		currentTranslate = -currentIndex * cardWidth;
		prevTranslate = currentTranslate;
		setSliderPosition();
	}

	function resetAutoScroll() {
		lastInteractionTime = Date.now();
		isAutoScrolling = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') goToPrev();
		if (e.key === 'ArrowRight') goToNext();
	}

	function startAutoScroll() {
		autoScrollInterval = setInterval(() => {
			if (isAutoScrolling && Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				goToNext();
			}

			if (!isAutoScrolling && Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				isAutoScrolling = true;
			}
		}, AUTO_SCROLL_INTERVAL);
	}

	function handleResize() {
		cardWidth = getCardWidth();
		updatePosition();
	}

	onMount(() => {
		cardWidth = getCardWidth();
		currentIndex = serviceGroups.length;
		updatePosition();

		startAutoScroll();

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('resize', handleResize);

		return () => {
			clearInterval(autoScrollInterval);
			cancelAnimationFrame(animationID);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

{#if visible}
	<div class="relative py-4" in:fly={{ y: 30, duration: 600 }}>
		<!-- Contenedor con mask CSS (igual que CarouselInfinito) -->
		<div
			class="carousel-container relative overflow-hidden py-4"
			style="
				-webkit-mask-image: linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent);
				mask-image: linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent);
			"
		>
			<!-- Track del carrusel -->
			<div
				bind:this={carouselTrack}
				class="carousel-track flex gap-8 cursor-grab"
				on:mousedown={handleDragStart}
				on:mousemove={handleDragMove}
				on:mouseup={handleDragEnd}
				on:mouseleave={handleDragEnd}
				on:touchstart={handleDragStart}
				on:touchmove={handleDragMove}
				on:touchend={handleDragEnd}
				on:mouseenter={resetAutoScroll}
				role="region"
				aria-label="Carrusel de servicios"
			>
				{#each extendedGroups as group, i}
					<div 
						class="card-wrapper shrink-0 px-4" 
						style="width: {cardWidth}px;"
						role="presentation"
					>
						<!-- Card con glassmorphism - Más compacto -->
						<div
							class="card-inner group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-{group.accentColor}-500"
						>
							<!-- Gradiente de profundidad (igual que CarouselInfinito) -->
							<div
								class="absolute inset-0 rounded-xl bg-linear-to-br from-{group.accentColor}-500/5 via-transparent to-{group.accentColor}-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							></div>

							<!-- Header con emoji e icono - Más compacto -->
							<div class="relative z-10 bg-linear-to-r px-4 py-4 {group.headerColor}">
								<!-- Emoji grande de fondo -->
								<div class="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20 transition-all duration-700 group-hover:scale-110 group-hover:opacity-30">
									{group.emoji}
								</div>
								
								<h3 class="relative text-lg font-bold text-white flex items-center gap-2">
									<span class="text-2xl">{group.emoji}</span>
									{group.header}
								</h3>
							</div>

							<!-- Contenido - Más compacto -->
							<div class="relative z-10 p-4">
								<div class="grid gap-4 {group.sections.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}">
									{#each group.sections as section, sIndex}
										<div
											class="group/box space-y-2"
											in:fly={{ y: 20, duration: 400, delay: sIndex * 80 }}
										>
											<!-- Icono y título -->
											<div class="mb-2 flex items-start space-x-2">
												<!-- Icono con efecto 3D - Más pequeño -->
												<div
													class="icon-3d flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-{group.accentColor}-500 to-{group.accentColor}-700 text-xl shadow-md"
												>
													<span
														class="icon-inner block transform transition-all duration-300 group-hover/box:scale-110 group-hover/box:rotate-12"
													>
														{section.icon}
													</span>
												</div>

												<!-- Título -->
												<div class="min-w-0 flex-1">
													<h4
														class="line-clamp-2 text-xs font-bold uppercase tracking-wide text-gray-700 transition-colors duration-300 group-hover/box:text-{group.accentColor}-600"
													>
														{section.title}
													</h4>
												</div>
											</div>

											<!-- Lista de items - Más compacto -->
											<ul class="space-y-1">
												{#each section.items as item}
													<li class="flex items-start gap-1.5 text-xs text-gray-600 transition-colors duration-200 group-hover/box:text-gray-900">
														<span class="mt-0.5 text-{group.accentColor}-500">•</span>
														<span class="flex-1">{item}</span>
													</li>
												{/each}
											</ul>

											{#if section.items.length === 0}
												<p class="text-xs italic text-gray-400">Próximamente</p>
											{/if}
										</div>
									{/each}
								</div>
							</div>

							<!-- Sombra 3D mejorada (igual que CarouselInfinito) -->
							<div
								class="card-shadow absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-{group.accentColor}-500/20 to-{group.accentColor}-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
							></div>

							<!-- Brillo que sigue al mouse -->
							<div
								class="card-shine pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<div
									class="shine-layer absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-transparent"
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Botones de navegación (igual estilo que CarouselInfinito) -->
			<button
				on:click={goToPrev}
				class="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95"
				aria-label="Anterior"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<button
				on:click={goToNext}
				class="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95"
				aria-label="Siguiente"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<!-- Indicadores -->
		<div class="mt-6 text-center">
			<!-- Dots -->
			<div class="flex items-center justify-center gap-2">
				{#each serviceGroups as group, i}
					<button
						on:click={() => goToIndex(i + serviceGroups.length)}
						class="group relative transition-all duration-300"
						aria-label={`Ir a ${group.header}`}
					>
						<div
							class="h-2 rounded-full transition-all duration-300 {currentIndex % serviceGroups.length === i
								? 'w-8 bg-blue-600'
								: 'w-2 bg-gray-300 hover:bg-gray-400'}"
						></div>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.carousel-track {
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
	}

	.carousel-track:active {
		cursor: grabbing !important;
	}

	/* Line clamp */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Mejora del scroll en móviles */
	@media (hover: none) {
		.carousel-track {
			cursor: default;
		}
	}
</style>
