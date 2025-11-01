<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Characteristic {
		icon: string;
		title: string;
		description: string;
	}

	export let visible = false;
	export let characteristics: Characteristic[] = [];

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

	const CARD_WIDTH = 320 + 32; // 320px (w-80) + 32px (gap-8)
	const INTERACTION_TIMEOUT = 3000; // 3 segundos
	const AUTO_SCROLL_INTERVAL = 3000; // Cambiar cada 3 segundos

	// Crear array extendido para scroll infinito
	$: extendedCharacteristics = [
		...characteristics,
		...characteristics,
		...characteristics,
		...characteristics
	];

	// Función para el efecto 3D
	function handleMouseMove(event: MouseEvent, element: HTMLElement) {
		if (isDragging) return;

		const card = element.querySelector('.card-inner') as HTMLElement;
		if (!card) return;

		const rect = card.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * 8;
		const rotateY = ((centerX - x) / centerX) * 8;

		card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
	}

	function handleMouseLeave(element: HTMLElement) {
		const card = element.querySelector('.card-inner') as HTMLElement;
		if (!card) return;

		card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
	}

	// Obtener posición
	function getPositionX(event: MouseEvent | TouchEvent): number {
		return 'touches' in event ? event.touches[0].clientX : event.clientX;
	}

	// Animación suave
	function animation() {
		setSliderPosition();
		if (isDragging) requestAnimationFrame(animation);
	}

	function setSliderPosition() {
		if (!carouselTrack) return;
		carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
	}

	// Drag handlers
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

		// Si se movió más de 100px, cambiar de slide
		if (movedBy < -100) {
			goToNext();
		} else if (movedBy > 100) {
			goToPrev();
		} else {
			// Volver a la posición actual
			currentTranslate = prevTranslate;
			setSliderPosition();
		}

		if (carouselTrack) {
			carouselTrack.style.cursor = 'grab';
		}

		// Reanudar auto-scroll después del timeout
		setTimeout(() => {
			if (Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				isAutoScrolling = true;
			}
		}, INTERACTION_TIMEOUT);
	}

	// Navegación
	function goToNext() {
		currentIndex++;

		// Loop infinito
		if (currentIndex >= extendedCharacteristics.length - characteristics.length) {
			// Saltar instantáneamente al inicio duplicado
			currentIndex = characteristics.length;
			currentTranslate = -currentIndex * CARD_WIDTH;
			prevTranslate = currentTranslate;
			setSliderPosition();

			// Pequeño delay para suavizar
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

		// Loop infinito
		if (currentIndex < 0) {
			// Saltar instantáneamente al final duplicado
			currentIndex = extendedCharacteristics.length - characteristics.length - 1;
			currentTranslate = -currentIndex * CARD_WIDTH;
			prevTranslate = currentTranslate;
			setSliderPosition();

			// Pequeño delay para suavizar
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
		currentTranslate = -currentIndex * CARD_WIDTH;
		prevTranslate = currentTranslate;
		setSliderPosition();
	}

	function resetAutoScroll() {
		lastInteractionTime = Date.now();
		isAutoScrolling = false;
	}

	// Keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') goToPrev();
		if (e.key === 'ArrowRight') goToNext();
	}

	// Auto-scroll
	function startAutoScroll() {
		autoScrollInterval = setInterval(() => {
			if (isAutoScrolling && Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				goToNext();
			}

			// Reanudar auto-scroll si no hay interacción
			if (!isAutoScrolling && Date.now() - lastInteractionTime >= INTERACTION_TIMEOUT) {
				isAutoScrolling = true;
			}
		}, AUTO_SCROLL_INTERVAL);
	}

	onMount(() => {
		// Posición inicial (comenzar desde el segundo grupo para permitir prev)
		currentIndex = characteristics.length;
		updatePosition();

		// Iniciar auto-scroll
		startAutoScroll();

		// Keyboard events
		window.addEventListener('keydown', handleKeydown);

		return () => {
			clearInterval(autoScrollInterval);
			cancelAnimationFrame(animationID);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if visible}
	<div class="relative mt-16" in:fly={{ y: 50, duration: 800, delay: 400 }}>
		<!-- Contenedor con mask CSS -->
		<div
			class="carousel-container relative overflow-hidden py-8"
			style="
				-webkit-mask-image: linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent);
				mask-image: linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent);
			"
		>
			<!-- Track del carrusel -->
			<div
				bind:this={carouselTrack}
				class="carousel-track flex gap-8 px-4"
				on:mousedown={handleDragStart}
				on:mousemove={handleDragMove}
				on:mouseup={handleDragEnd}
				on:mouseleave={handleDragEnd}
				on:touchstart={handleDragStart}
				on:touchmove={handleDragMove}
				on:touchend={handleDragEnd}
				on:mouseenter={resetAutoScroll}
				role="region"
				aria-label="Carrusel de características"
			>
				{#each extendedCharacteristics as char, i}
					<div
						class="card-3d-wrapper perspective-container h-64 w-80 shrink-0 cursor-pointer"
						on:mousemove={(e) => handleMouseMove(e, e.currentTarget)}
						on:mouseleave={(e) => handleMouseLeave(e.currentTarget)}
						on:click={() => goToIndex(i)}
						on:keydown={(e) => e.key === 'Enter' && goToIndex(i)}
						role="button"
						tabindex="0"
					>
						<div
							class="card-inner group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-blue-500"
						>
							<!-- Gradiente de profundidad -->
							<div
								class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							></div>

							<!-- Contenido -->
							<div class="relative z-10 flex flex-1 flex-col">
								<div class="mb-4 flex items-start space-x-4">
									<!-- Icono con efecto 3D -->
									<div
										class="icon-3d flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-3xl shadow-lg"
									>
										<span
											class="icon-inner block transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
										>
											{char.icon}
										</span>
									</div>

									<!-- Título -->
									<div class="min-w-0 flex-1">
										<h4
											class="line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600"
										>
											{char.title}
										</h4>
									</div>
								</div>

								<!-- Descripción con altura fija -->
								<div class="flex-1 overflow-hidden">
									<p class="line-clamp-4 text-sm leading-relaxed text-gray-600">
										{char.description}
									</p>
								</div>

								<!-- Indicador de número -->
								<div
									class="mt-4 border-t border-gray-200 pt-4 transition-colors duration-300 group-hover:border-blue-200"
								>
									<span class="text-xs font-semibold text-blue-500">
										{String((i % characteristics.length) + 1).padStart(2, '0')}
									</span>
								</div>
							</div>

							<!-- Sombra 3D mejorada -->
							<div
								class="card-shadow absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
							></div>

							<!-- Brillo que sigue al mouse -->
							<div
								class="card-shine pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<div
									class="shine-layer absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Navigation Arrows -->
			<button
				on:click={goToPrev}
				class="absolute top-1/2 left-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl"
				aria-label="Anterior"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<button
				on:click={goToNext}
				class="absolute top-1/2 right-4 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl"
				aria-label="Siguiente"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>

		<!-- Indicadores -->
		<div class="mt-8 space-y-2 text-center">
			<!-- Dots -->
			<div class="flex items-center justify-center gap-2">
				{#each characteristics as characteristic, i (characteristic.title + i)}
					<button
						on:click={() => goToIndex(i + characteristics.length)}
						class="h-2 rounded-full transition-all duration-300 {currentIndex %
							characteristics.length ===
						i
							? 'w-8 bg-blue-500'
							: 'w-2 bg-gray-300 hover:bg-gray-400'}"
						aria-label={`Ir a característica ${i + 1}`}
					></button>
				{/each}
			</div>

			<!-- Texto indicador -->
			<p class="flex items-center justify-center gap-2 text-sm text-gray-500 italic">
				<span class="text-lg">🎴</span>
				Mueve el cursor sobre las tarjetas para ver el efecto 3D
			</p>

			<!-- Estado de auto-scroll -->
			<div class="flex items-center justify-center gap-3 text-sm text-gray-400">
				<div
					class="h-2 w-2 rounded-full transition-colors duration-300"
					class:bg-green-500={isAutoScrolling}
					class:bg-gray-400={!isAutoScrolling}
					class:animate-pulse={isAutoScrolling}
				></div>
				<span>
					{isAutoScrolling
						? 'Desplazamiento automático'
						: 'Pausado - Arrastra o usa las flechas ← →'}
				</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.carousel-track {
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		cursor: grab;
		user-select: none;
	}

	.carousel-track:active {
		cursor: grabbing;
	}

	/* Contenedor con perspectiva */
	.perspective-container {
		perspective: 1000px;
	}

	/* Card 3D */
	.card-inner {
		transform-style: preserve-3d;
		backface-visibility: hidden;
		will-change: transform;
		transition:
			transform 0.1s ease-out,
			box-shadow 0.3s ease;
	}

	/* Icono con profundidad */
	.icon-3d {
		transform: translateZ(20px);
		transition: transform 0.3s ease;
	}

	.card-inner:hover .icon-3d {
		transform: translateZ(30px);
	}

	/* Sombra dinámica */
	.card-shadow {
		transform: translateZ(-20px);
	}

	/* Elementos con profundidad */
	.card-inner h4 {
		transform: translateZ(15px);
	}

	.card-inner p {
		transform: translateZ(10px);
	}

	/* Line clamp */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Animación de respiración */
	@keyframes breathe {
		0%,
		100% {
			box-shadow: 0 10px 40px rgba(59, 130, 246, 0.15);
		}
		50% {
			box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25);
		}
	}

	.card-inner:hover {
		animation: breathe 2s ease-in-out infinite;
	}

	/* Brillo suave */
	.shine-layer {
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.card-inner:hover .shine-layer {
		opacity: 1;
	}
</style>
